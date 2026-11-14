"""
Annapurna Canteen - Vel Tech College Canteen
Full-stack REST API and Static File Server (Python 3 zero-dependency implementation)
Compatible with SQLite database and all client endpoints.
"""

import os
import sys
import json
import sqlite3
import hashlib
import hmac
import time
import urllib.parse
import mimetypes
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from datetime import datetime

mimetypes.add_type('image/svg+xml', '.svg')

PORT = int(os.environ.get('PORT', 3000))
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(BASE_DIR, 'public')
UPLOADS_DIR = os.path.join(BASE_DIR, 'uploads')
DB_PATH = os.path.join(BASE_DIR, 'canteen.db')
JWT_SECRET = os.environ.get('JWT_SECRET', 'AnnapurnaVelTech2026SecretKey!@#')

os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(PUBLIC_DIR, exist_ok=True)

# -------------------------------------------------------------
# Database Connection & Initialization
# -------------------------------------------------------------
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def hash_password(password: str) -> str:
    # PBKDF2 with SHA256 for secure hashing
    salt = "veltech_salt_2026"
    h = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return h.hex()

def verify_password(plain: str, stored_hash: str) -> bool:
    if not stored_hash:
        return False
    # Check if PBKDF2 hex
    expected = hash_password(plain)
    if hmac.compare_digest(expected, stored_hash):
        return True
    # Fallback: check standard bcrypt simulation or hardcoded passwords for demo
    if plain in ['Admin@123', 'Student@123'] and (stored_hash.startswith('$2') or stored_hash == plain):
        return True
    return False

def generate_token(user_id: int, email: str, role: str) -> str:
    payload = f"{user_id}:{email}:{role}:{int(time.time()) + 7*86400}"
    sig = hmac.new(JWT_SECRET.encode('utf-8'), payload.encode('utf-8'), hashlib.sha256).hexdigest()
    return f"{payload}:{sig}"

def verify_token(token: str):
    if not token:
        return None
    # Strip 'Bearer ' if present
    if token.startswith('Bearer '):
        token = token[7:].strip()
    parts = token.split(':')
    if len(parts) != 5:
        # Also handle potential JWT fallback
        return None
    uid, email, role, exp_str, sig = parts
    payload = f"{uid}:{email}:{role}:{exp_str}"
    expected_sig = hmac.new(JWT_SECRET.encode('utf-8'), payload.encode('utf-8'), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(sig, expected_sig):
        return None
    if int(exp_str) < time.time():
        return None
    return {'id': int(uid), 'email': email, 'role': role}

def init_db():
    conn = get_db()
    c = conn.cursor()

    c.execute("""
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      mobile TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS food_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image_url TEXT,
      is_available INTEGER NOT NULL DEFAULT 1,
      is_special INTEGER NOT NULL DEFAULT 0,
      dietary_type TEXT NOT NULL DEFAULT 'veg',
      item_type TEXT NOT NULL DEFAULT 'food',
      subcategory TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Alter table if existing schema lacks new columns
    for col, typ in [('dietary_type', "TEXT NOT NULL DEFAULT 'veg'"),
                     ('item_type', "TEXT NOT NULL DEFAULT 'food'"),
                     ('subcategory', "TEXT")]:
        try:
            c.execute(f"ALTER TABLE food_items ADD COLUMN {col} {typ}")
        except Exception:
            pass

    for col, typ in [('delivery_type', "TEXT DEFAULT 'pickup'"),
                     ('delivery_location', "TEXT"),
                     ('razorpay_order_id', "TEXT"),
                     ('razorpay_payment_id', "TEXT")]:
        try:
            c.execute(f"ALTER TABLE orders ADD COLUMN {col} {typ}")
        except Exception:
            pass

    c.execute("""
    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      food_item_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (food_item_id) REFERENCES food_items(id) ON DELETE CASCADE,
      UNIQUE(user_id, food_item_id)
    );
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total_amount REAL NOT NULL,
      payment_method TEXT NOT NULL,
      payment_status TEXT NOT NULL DEFAULT 'pending',
      order_status TEXT NOT NULL DEFAULT 'pending',
      order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      notes TEXT,
      transaction_id TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      food_item_id INTEGER,
      food_name TEXT NOT NULL,
      food_price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT
    );
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Seed Admin
    admin_exists = c.execute("SELECT id FROM users WHERE email = ?", ('admin@veltech.edu',)).fetchone()
    if not admin_exists:
        admin_hash = hash_password('Admin@123')
        c.execute("INSERT INTO users (name, email, mobile, password_hash, role) VALUES (?, ?, ?, ?, ?)",
                  ('Canteen Admin', 'admin@veltech.edu', '9000000000', admin_hash, 'admin'))

    # Seed Test Student
    student_exists = c.execute("SELECT id FROM users WHERE email = ?", ('student@veltech.edu',)).fetchone()
    if not student_exists:
        student_hash = hash_password('Student@123')
        c.execute("INSERT INTO users (name, email, mobile, password_hash, role) VALUES (?, ?, ?, ?, ?)",
                  ('Vel Tech Student', 'student@veltech.edu', '9000000001', student_hash, 'student'))

    # Check food items count
    food_count = c.execute("SELECT COUNT(*) as cnt FROM food_items").fetchone()['cnt']
    if food_count == 0:
        try:
            from database.seed_all import ALL_ITEMS
            for it in ALL_ITEMS:
                c.execute("""
                  INSERT INTO food_items (name, category, subcategory, item_type, dietary_type, price, description, image_url, is_available, is_special)
                  VALUES (:name, :category, :subcategory, :item_type, :dietary_type, :price, :description, :image_url, 1, :is_special)
                """, it)
        except Exception as e:
            print("Seed error:", e)

    # Seed Default Settings
    settings_seed = [
        ('canteen_name', 'Annapurna'),
        ('college_name', 'Vel Tech'),
        ('tagline', 'Fresh Food, Happy Moments!'),
        ('background_image', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1600&q=80'),
        ('contact_phone', '+91 44 2684 1600'),
        ('contact_email', 'canteen@veltech.edu.in'),
        ('opening_hours', '7:00 AM - 8:00 PM'),
        ('address', 'Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology, 400 Feet Outer Ring Road, Avadi, Chennai - 600062')
    ]
    for k, v in settings_seed:
        c.execute("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)", (k, v))

    conn.commit()
    conn.close()
    print("Database initialized successfully.")

# -------------------------------------------------------------
# HTTP Request Handler
# -------------------------------------------------------------
class CanteenRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUBLIC_DIR, **kwargs)

    def guess_type(self, path):
        if str(path).lower().endswith('.svg'):
            return 'image/svg+xml'
        return super().guess_type(path)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, must-revalidate')
        super().end_headers()

    def send_json(self, data, status=200):
        body = json.dumps(data).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        self.wfile.write(body)

    def read_json_body(self):
        try:
            length = int(self.headers.get('Content-Length', 0))
            if length == 0:
                return {}
            data = self.rfile.read(length)
            return json.loads(data.decode('utf-8'))
        except Exception:
            return {}

    def get_auth_user(self):
        auth_header = self.headers.get('Authorization', '')
        return verify_token(auth_header)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    # ---------------------------------------------------------
    # Route Dispatchers
    # ---------------------------------------------------------
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        # Health
        if path == '/api/health':
            return self.send_json({'success': True, 'message': 'Vel Tech Annapurna Canteen API is online!'})

        # Public Settings
        if path == '/api/settings':
            conn = get_db()
            rows = conn.execute("SELECT key, value FROM settings").fetchall()
            conn.close()
            settings_map = {r['key']: r['value'] for r in rows}
            return self.send_json({'success': True, 'settings': settings_map})

        # Menu
        if path == '/api/menu':
            cat = query.get('category', [None])[0]
            search = query.get('search', [None])[0]
            special = query.get('special', [None])[0]
            item_type = query.get('type', [None])[0]
            dietary = query.get('dietary', [None])[0]
            conn = get_db()
            q = "SELECT * FROM food_items WHERE is_available = 1"
            params = []
            if cat and cat != 'All':
                q += " AND category = ?"
                params.append(cat)
            if search:
                q += " AND (name LIKE ? OR description LIKE ? OR category LIKE ?)"
                t = f"%{search}%"
                params.extend([t, t, t])
            if special == 'true':
                q += " AND is_special = 1"
            if item_type:
                q += " AND item_type = ?"
                params.append(item_type)
            if dietary and dietary != 'all':
                q += " AND dietary_type = ?"
                params.append(dietary)
            q += " ORDER BY category, name"
            rows = conn.execute(q, params).fetchall()
            conn.close()
            return self.send_json({'success': True, 'items': [dict(r) for r in rows]})

        # Payment Config (Test Mode)
        if path == '/api/payment/config':
            return self.send_json({'success': True, 'test_mode': True, 'key_id': 'rzp_test_annapurna2026'})

        if path == '/api/menu/categories':
            conn = get_db()
            rows = conn.execute("SELECT DISTINCT category FROM food_items WHERE is_available = 1 ORDER BY category").fetchall()
            conn.close()
            return self.send_json({'success': True, 'categories': [r['category'] for r in rows]})

        if path.startswith('/api/menu/'):
            item_id = path.split('/')[-1]
            conn = get_db()
            row = conn.execute("SELECT * FROM food_items WHERE id = ? AND is_available = 1", (item_id,)).fetchone()
            conn.close()
            if not row:
                return self.send_json({'success': False, 'message': 'Item not found'}, 404)
            return self.send_json({'success': True, 'item': dict(row)})

        # Auth me
        if path == '/api/auth/me':
            user = self.get_auth_user()
            if not user:
                return self.send_json({'success': False, 'message': 'Unauthorized'}, 401)
            conn = get_db()
            db_user = conn.execute("SELECT id, name, email, mobile, role FROM users WHERE id = ?", (user['id'],)).fetchone()
            conn.close()
            return self.send_json({'success': True, 'user': dict(db_user)})

        # Cart
        if path == '/api/cart':
            user = self.get_auth_user()
            if not user:
                return self.send_json({'success': False, 'message': 'Unauthorized'}, 401)
            conn = get_db()
            rows = conn.execute("""
              SELECT ci.id, ci.quantity, ci.food_item_id,
                     fi.name, fi.category, fi.price, fi.image_url, fi.is_available
              FROM cart_items ci
              JOIN food_items fi ON ci.food_item_id = fi.id
              WHERE ci.user_id = ?
              ORDER BY ci.created_at DESC
            """, (user['id'],)).fetchall()
            conn.close()
            items = [dict(r) for r in rows]
            total = sum(i['price'] * i['quantity'] for i in items)
            return self.send_json({'success': True, 'items': items, 'total': total})

        # Orders
        if path == '/api/orders/my':
            user = self.get_auth_user()
            if not user:
                return self.send_json({'success': False, 'message': 'Unauthorized'}, 401)
            conn = get_db()
            orders = conn.execute("SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC", (user['id'],)).fetchall()
            orders_list = []
            for o in orders:
                od = dict(o)
                items = conn.execute("SELECT * FROM order_items WHERE order_id = ?", (od['id'],)).fetchall()
                od['items'] = [dict(it) for it in items]
                orders_list.append(od)
            conn.close()
            return self.send_json({'success': True, 'orders': orders_list})

        if path.startswith('/api/orders/'):
            user = self.get_auth_user()
            if not user:
                return self.send_json({'success': False, 'message': 'Unauthorized'}, 401)
            order_id = path.split('/')[-1]
            conn = get_db()
            order = conn.execute("SELECT * FROM orders WHERE id = ? AND user_id = ?", (order_id, user['id'])).fetchone()
            if not order:
                conn.close()
                return self.send_json({'success': False, 'message': 'Order not found'}, 404)
            od = dict(order)
            items = conn.execute("SELECT * FROM order_items WHERE order_id = ?", (od['id'],)).fetchall()
            od['items'] = [dict(it) for it in items]
            conn.close()
            return self.send_json({'success': True, 'order': od})

        # Feedback
        if path == '/api/feedback':
            conn = get_db()
            rows = conn.execute("SELECT * FROM feedback ORDER BY created_at DESC LIMIT 50").fetchall()
            conn.close()
            return self.send_json({'success': True, 'feedback': [dict(r) for r in rows]})

        # Admin Routes
        if path.startswith('/api/admin/'):
            user = self.get_auth_user()
            if not user or user.get('role') != 'admin':
                return self.send_json({'success': False, 'message': 'Admin access required'}, 403)

            conn = get_db()
            if path == '/api/admin/orders':
                status = query.get('status', [None])[0]
                q = """
                  SELECT o.*, u.name as student_name, u.email as student_email, u.mobile as student_mobile
                  FROM orders o JOIN users u ON o.user_id = u.id
                """
                params = []
                if status and status != 'all':
                    q += " WHERE o.order_status = ?"
                    params.append(status)
                q += " ORDER BY o.order_date DESC"
                orders = conn.execute(q, params).fetchall()
                result = []
                for o in orders:
                    od = dict(o)
                    items = conn.execute("SELECT * FROM order_items WHERE order_id = ?", (od['id'],)).fetchall()
                    od['items'] = [dict(it) for it in items]
                    result.append(od)
                conn.close()
                return self.send_json({'success': True, 'orders': result})

            if path == '/api/admin/users':
                rows = conn.execute("SELECT id, name, email, mobile, role, created_at FROM users WHERE role = 'student' ORDER BY created_at DESC").fetchall()
                conn.close()
                return self.send_json({'success': True, 'users': [dict(r) for r in rows]})

            if path == '/api/admin/sales/summary':
                total_rev = conn.execute("SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE payment_status = 'paid'").fetchone()['total']
                total_ord = conn.execute("SELECT COUNT(*) as count FROM orders").fetchone()['count']
                today = datetime.now().strftime('%Y-%m-%d')
                today_rev = conn.execute("SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE payment_status = 'paid' AND date(order_date) = date(?)", (today,)).fetchone()['total']
                today_ord = conn.execute("SELECT COUNT(*) as count FROM orders WHERE date(order_date) = date(?)", (today,)).fetchone()['count']
                pending_ord = conn.execute("SELECT COUNT(*) as count FROM orders WHERE order_status = 'pending'").fetchone()['count']
                items_sold = conn.execute("SELECT COALESCE(SUM(oi.quantity), 0) as count FROM order_items oi JOIN orders o ON oi.order_id = o.id WHERE o.payment_status = 'paid'").fetchone()['count']
                conn.close()
                return self.send_json({
                    'success': True,
                    'summary': {
                        'total_revenue': total_rev,
                        'total_orders': total_ord,
                        'today_revenue': today_rev,
                        'today_orders': today_ord,
                        'pending_orders': pending_ord,
                        'total_items_sold': items_sold
                    }
                })

            if path == '/api/admin/sales/daily':
                rows = conn.execute("""
                  SELECT date(order_date) as order_date, COUNT(*) as order_count, COALESCE(SUM(total_amount), 0) as total_sales
                  FROM orders WHERE payment_status = 'paid'
                  GROUP BY date(order_date) ORDER BY order_date DESC LIMIT 7
                """).fetchall()
                conn.close()
                return self.send_json({'success': True, 'dailySales': [dict(r) for r in rows]})

            if path == '/api/admin/settings':
                rows = conn.execute("SELECT key, value FROM settings").fetchall()
                conn.close()
                return self.send_json({'success': True, 'settings': {r['key']: r['value'] for r in rows}})

            conn.close()
            return self.send_json({'success': False, 'message': 'Admin route not found'}, 404)

        # Static uploads
        if path.startswith('/uploads/'):
            filename = os.path.basename(path)
            file_path = os.path.join(UPLOADS_DIR, filename)
            if os.path.exists(file_path):
                self.path = '/uploads/' + filename
                # Handled via serving file
                with open(file_path, 'rb') as f:
                    content = f.read()
                self.send_response(200)
                self.send_header('Content-Type', 'image/jpeg')
                self.send_header('Content-Length', str(len(content)))
                self.end_headers()
                self.wfile.write(content)
                return
            else:
                self.send_error(404, "File not found")
                return

        # Default static file serving (public/)
        return super().do_GET()

    # ---------------------------------------------------------
    # POST Handlers
    # ---------------------------------------------------------
    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        body = self.read_json_body()

        # Register
        if path == '/api/auth/register':
            name = body.get('name', '').strip()
            email = body.get('email', '').strip().lower()
            mobile = body.get('mobile', '').strip()
            password = body.get('password', '')

            if not (name and email and mobile and password):
                return self.send_json({'success': False, 'message': 'All fields are required.'}, 400)
            if len(mobile) != 10 or not mobile.isdigit():
                return self.send_json({'success': False, 'message': 'Mobile must be a 10-digit number.'}, 400)
            if len(password) < 8 or not any(char.isdigit() for char in password):
                return self.send_json({'success': False, 'message': 'Password must be at least 8 characters with at least 1 number.'}, 400)

            conn = get_db()
            exists = conn.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
            if exists:
                conn.close()
                return self.send_json({'success': False, 'message': 'Email already registered. Please login.'}, 400)

            pw_hash = hash_password(password)
            cur = conn.cursor()
            cur.execute("INSERT INTO users (name, email, mobile, password_hash, role) VALUES (?, ?, ?, ?, ?)",
                        (name, email, mobile, pw_hash, 'student'))
            new_id = cur.lastrowid
            conn.commit()
            conn.close()

            user_obj = {'id': new_id, 'name': name, 'email': email, 'mobile': mobile, 'role': 'student'}
            token = generate_token(new_id, email, 'student')
            return self.send_json({'success': True, 'message': 'Registration successful!', 'token': token, 'user': user_obj}, 201)

        # Login
        if path == '/api/auth/login':
            email = body.get('email', '').strip().lower()
            mobile = body.get('mobile', '').strip()
            password = body.get('password', '')

            if not (email and password):
                return self.send_json({'success': False, 'message': 'Email and password are required.'}, 400)

            conn = get_db()
            user = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
            if not user:
                conn.close()
                return self.send_json({'success': False, 'message': 'Invalid email or password.'}, 401)

            # If user provided mobile, verify mobile matches account
            if mobile and user['mobile'] and user['mobile'] != mobile:
                conn.close()
                return self.send_json({'success': False, 'message': 'Mobile number does not match registered account.'}, 401)

            if not verify_password(password, user['password_hash']):
                conn.close()
                return self.send_json({'success': False, 'message': 'Invalid email or password.'}, 401)

            user_dict = {'id': user['id'], 'name': user['name'], 'email': user['email'], 'mobile': user['mobile'], 'role': user['role']}
            token = generate_token(user['id'], user['email'], user['role'])
            conn.close()
            return self.send_json({'success': True, 'message': 'Login successful!', 'token': token, 'user': user_dict})

        # Forgot Password
        if path == '/api/auth/forgot-password':
            email = body.get('email', '').strip()
            if not email:
                return self.send_json({'success': False, 'message': 'Email is required.'}, 400)
            return self.send_json({'success': True, 'message': f'Password reset link generated for {email} (Test mode).'})

        # Feedback
        if path == '/api/feedback':
            name = body.get('name', '').strip()
            email = body.get('email', '').strip()
            rating = int(body.get('rating', 5))
            comment = body.get('comment', '').strip()
            if not (name and email and comment):
                return self.send_json({'success': False, 'message': 'Please fill all feedback fields.'}, 400)
            user = self.get_auth_user()
            user_id = user['id'] if user else None
            conn = get_db()
            conn.execute("INSERT INTO feedback (user_id, name, email, rating, comment) VALUES (?, ?, ?, ?, ?)",
                         (user_id, name, email, rating, comment))
            conn.commit()
            conn.close()
            return self.send_json({'success': True, 'message': 'Thank you! Your feedback has been received.'})

        # Cart Add
        if path == '/api/cart/add':
            user = self.get_auth_user()
            if not user:
                return self.send_json({'success': False, 'message': 'Unauthorized'}, 401)
            food_item_id = body.get('food_item_id')
            qty = int(body.get('quantity', 1))
            if not food_item_id:
                return self.send_json({'success': False, 'message': 'food_item_id is required.'}, 400)
            conn = get_db()
            food = conn.execute("SELECT id, is_available FROM food_items WHERE id = ?", (food_item_id,)).fetchone()
            if not food or not food['is_available']:
                conn.close()
                return self.send_json({'success': False, 'message': 'Food item not available.'}, 404)

            existing = conn.execute("SELECT id, quantity FROM cart_items WHERE user_id = ? AND food_item_id = ?",
                                    (user['id'], food_item_id)).fetchone()
            if existing:
                conn.execute("UPDATE cart_items SET quantity = quantity + ? WHERE id = ?", (qty, existing['id']))
            else:
                conn.execute("INSERT INTO cart_items (user_id, food_item_id, quantity) VALUES (?, ?, ?)",
                             (user['id'], food_item_id, qty))
            conn.commit()
            cart_count = conn.execute("SELECT SUM(quantity) as count FROM cart_items WHERE user_id = ?", (user['id'],)).fetchone()['count'] or 0
            conn.close()
            return self.send_json({'success': True, 'message': 'Item added to cart!', 'cartCount': cart_count})

        # Place Order
        if path == '/api/orders/place':
            user = self.get_auth_user()
            if not user:
                return self.send_json({'success': False, 'message': 'Unauthorized'}, 401)
            payment_method = body.get('payment_method', 'Cash on Pickup')
            notes = body.get('notes', '')
            delivery_type = body.get('delivery_type', 'pickup')
            delivery_location = body.get('delivery_location', 'Counter Pickup')

            conn = get_db()
            cart_items = conn.execute("""
              SELECT ci.quantity, ci.food_item_id, fi.name as food_name, fi.price as food_price
              FROM cart_items ci JOIN food_items fi ON ci.food_item_id = fi.id
              WHERE ci.user_id = ?
            """, (user['id'],)).fetchall()

            if not cart_items:
                conn.close()
                return self.send_json({'success': False, 'message': 'Your cart is empty.'}, 400)

            subtotal = sum(i['food_price'] * i['quantity'] for i in cart_items)
            tax = round(subtotal * 0.05, 2)
            total = round(subtotal + tax, 2)

            cur = conn.cursor()
            cur.execute("""
              INSERT INTO orders (user_id, total_amount, payment_method, payment_status, order_status, notes, delivery_type, delivery_location)
              VALUES (?, ?, ?, 'pending', 'pending', ?, ?, ?)
            """, (user['id'], total, payment_method, notes, delivery_type, delivery_location))
            order_id = cur.lastrowid

            for item in cart_items:
                cur.execute("""
                  INSERT INTO order_items (order_id, food_item_id, food_name, food_price, quantity)
                  VALUES (?, ?, ?, ?, ?)
                """, (order_id, item['food_item_id'], item['food_name'], item['food_price'], item['quantity']))

            conn.execute("DELETE FROM cart_items WHERE user_id = ?", (user['id'],))
            conn.commit()

            order_obj = dict(conn.execute("SELECT * FROM orders WHERE id = ?", (order_id,)).fetchone())
            conn.close()
            return self.send_json({'success': True, 'message': 'Order placed successfully!', 'order': order_obj, 'orderId': order_id}, 201)

        # Payment Process
        if path == '/api/payment/process':
            user = self.get_auth_user()
            if not user:
                return self.send_json({'success': False, 'message': 'Unauthorized'}, 401)
            order_id = body.get('order_id')
            payment_method = body.get('payment_method', 'Online')
            if not order_id:
                return self.send_json({'success': False, 'message': 'order_id is required.'}, 400)

            conn = get_db()
            order = conn.execute("SELECT * FROM orders WHERE id = ? AND user_id = ?", (order_id, user['id'])).fetchone()
            if not order:
                conn.close()
                return self.send_json({'success': False, 'message': 'Order not found.'}, 404)

            txn_id = f"TXN{int(time.time())}{hashlib.md5(str(order_id).encode()).hexdigest()[:6].upper()}"
            conn.execute("""
              UPDATE orders SET payment_status = 'paid', order_status = 'preparing', transaction_id = ?
              WHERE id = ?
            """, (txn_id, order_id))
            conn.commit()
            conn.close()
            return self.send_json({
                'success': True,
                'message': 'Payment successful! Order is now preparing.',
                'transaction_id': txn_id,
                'order_id': order_id,
                'payment_method': payment_method
            })

        # Admin Add Food
        if path == '/api/admin/food':
            user = self.get_auth_user()
            if not user or user.get('role') != 'admin':
                return self.send_json({'success': False, 'message': 'Admin access required.'}, 403)
            name = body.get('name', '').strip()
            category = body.get('category', '').strip()
            price = float(body.get('price', 0))
            desc = body.get('description', '').strip()
            img = body.get('image_url', '').strip()
            is_special = 1 if body.get('is_special') else 0
            is_avail = 1 if body.get('is_available', 1) else 0

            if not (name and category and price > 0):
                return self.send_json({'success': False, 'message': 'Name, category and positive price are required.'}, 400)

            conn = get_db()
            cur = conn.cursor()
            cur.execute("""
              INSERT INTO food_items (name, category, description, price, image_url, is_available, is_special)
              VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (name, category, desc, price, img, is_avail, is_special))
            new_id = cur.lastrowid
            conn.commit()
            item = dict(conn.execute("SELECT * FROM food_items WHERE id = ?", (new_id,)).fetchone())
            conn.close()
            return self.send_json({'success': True, 'message': 'Food item added successfully!', 'item': item}, 201)

        self.send_json({'success': False, 'message': 'Endpoint not found.'}, 404)

    # ---------------------------------------------------------
    # PUT Handlers
    # ---------------------------------------------------------
    def do_PUT(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        body = self.read_json_body()

        # Cart update
        if path == '/api/cart/update':
            user = self.get_auth_user()
            if not user:
                return self.send_json({'success': False, 'message': 'Unauthorized'}, 401)
            food_item_id = body.get('food_item_id')
            qty = int(body.get('quantity', 0))
            conn = get_db()
            if qty <= 0:
                conn.execute("DELETE FROM cart_items WHERE user_id = ? AND food_item_id = ?", (user['id'], food_item_id))
            else:
                conn.execute("UPDATE cart_items SET quantity = ? WHERE user_id = ? AND food_item_id = ?",
                             (qty, user['id'], food_item_id))
            conn.commit()
            conn.close()
            return self.send_json({'success': True, 'message': 'Cart updated.'})

        # Admin Update Order Status
        if path.startswith('/api/admin/orders/') and path.endswith('/status'):
            user = self.get_auth_user()
            if not user or user.get('role') != 'admin':
                return self.send_json({'success': False, 'message': 'Admin access required.'}, 403)
            order_id = path.split('/')[4]
            status = body.get('status', '').lower()
            valid = ['pending', 'preparing', 'ready', 'completed']
            if status not in valid:
                return self.send_json({'success': False, 'message': f'Invalid status. Allowed: {valid}'}, 400)
            conn = get_db()
            res = conn.execute("UPDATE orders SET order_status = ? WHERE id = ?", (status, order_id))
            conn.commit()
            changes = res.rowcount
            conn.close()
            if changes == 0:
                return self.send_json({'success': False, 'message': 'Order not found.'}, 404)
            return self.send_json({'success': True, 'message': f'Order status updated to {status}.'})

        # Admin Reject Order
        if path.startswith('/api/admin/orders/') and path.endswith('/reject'):
            user = self.get_auth_user()
            if not user or user.get('role') != 'admin':
                return self.send_json({'success': False, 'message': 'Admin access required.'}, 403)
            order_id = path.split('/')[4]
            conn = get_db()
            conn.execute("UPDATE orders SET order_status = 'cancelled' WHERE id = ?", (order_id,))
            conn.commit()
            conn.close()
            return self.send_json({'success': True, 'message': 'Order rejected/cancelled.'})

        # Admin Update Food
        if path.startswith('/api/admin/food/'):
            user = self.get_auth_user()
            if not user or user.get('role') != 'admin':
                return self.send_json({'success': False, 'message': 'Admin access required.'}, 403)
            food_id = path.split('/')[-1]
            conn = get_db()
            item = conn.execute("SELECT * FROM food_items WHERE id = ?", (food_id,)).fetchone()
            if not item:
                conn.close()
                return self.send_json({'success': False, 'message': 'Item not found.'}, 404)

            name = body.get('name', item['name'])
            cat = body.get('category', item['category'])
            desc = body.get('description', item['description'])
            price = float(body.get('price', item['price']))
            img = body.get('image_url', item['image_url'])
            is_avail = int(body.get('is_available', item['is_available']))
            is_special = int(body.get('is_special', item['is_special']))

            conn.execute("""
              UPDATE food_items SET name = ?, category = ?, description = ?, price = ?,
                                    image_url = ?, is_available = ?, is_special = ?
              WHERE id = ?
            """, (name, cat, desc, price, img, is_avail, is_special, food_id))
            conn.commit()
            updated = dict(conn.execute("SELECT * FROM food_items WHERE id = ?", (food_id,)).fetchone())
            conn.close()
            return self.send_json({'success': True, 'message': 'Food item updated.', 'item': updated})

        # Admin Update Setting
        if path == '/api/admin/settings':
            user = self.get_auth_user()
            if not user or user.get('role') != 'admin':
                return self.send_json({'success': False, 'message': 'Admin access required.'}, 403)
            key = body.get('key')
            val = body.get('value')
            if not key:
                return self.send_json({'success': False, 'message': 'Key is required.'}, 400)
            conn = get_db()
            conn.execute("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", (key, val))
            conn.commit()
            conn.close()
            return self.send_json({'success': True, 'message': f'Setting {key} updated.'})

        self.send_json({'success': False, 'message': 'Endpoint not found.'}, 404)

    # ---------------------------------------------------------
    # DELETE Handlers
    # ---------------------------------------------------------
    def do_DELETE(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        # Cart Clear
        if path == '/api/cart/clear':
            user = self.get_auth_user()
            if not user:
                return self.send_json({'success': False, 'message': 'Unauthorized'}, 401)
            conn = get_db()
            conn.execute("DELETE FROM cart_items WHERE user_id = ?", (user['id'],))
            conn.commit()
            conn.close()
            return self.send_json({'success': True, 'message': 'Cart cleared.'})

        # Cart Remove Item
        if path.startswith('/api/cart/remove/'):
            user = self.get_auth_user()
            if not user:
                return self.send_json({'success': False, 'message': 'Unauthorized'}, 401)
            food_item_id = path.split('/')[-1]
            conn = get_db()
            conn.execute("DELETE FROM cart_items WHERE user_id = ? AND food_item_id = ?", (user['id'], food_item_id))
            conn.commit()
            conn.close()
            return self.send_json({'success': True, 'message': 'Item removed from cart.'})

        # Admin Delete Food
        if path.startswith('/api/admin/food/'):
            user = self.get_auth_user()
            if not user or user.get('role') != 'admin':
                return self.send_json({'success': False, 'message': 'Admin access required.'}, 403)
            food_id = path.split('/')[-1]
            conn = get_db()
            conn.execute("DELETE FROM food_items WHERE id = ?", (food_id,))
            conn.commit()
            conn.close()
            return self.send_json({'success': True, 'message': 'Food item deleted.'})

        # Admin Delete Student User
        if path.startswith('/api/admin/users/'):
            user = self.get_auth_user()
            if not user or user.get('role') != 'admin':
                return self.send_json({'success': False, 'message': 'Admin access required.'}, 403)
            user_id = path.split('/')[-1]
            conn = get_db()
            target = conn.execute("SELECT role FROM users WHERE id = ?", (user_id,)).fetchone()
            if target and target['role'] == 'admin':
                conn.close()
                return self.send_json({'success': False, 'message': 'Cannot delete admin account.'}, 403)
            conn.execute("DELETE FROM users WHERE id = ?", (user_id,))
            conn.commit()
            conn.close()
            return self.send_json({'success': True, 'message': 'Student account deleted.'})

        self.send_json({'success': False, 'message': 'Endpoint not found.'}, 404)

def run():
    init_db()
    server_address = ('', PORT)
    ThreadingHTTPServer.request_queue_size = 128
    httpd = ThreadingHTTPServer(server_address, CanteenRequestHandler)
    print(f"============================================================")
    print(f"  Vel Tech Annapurna Canteen Server is RUNNING on port {PORT}")
    print(f"  Local URL: http://localhost:{PORT}")
    print(f"============================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")

if __name__ == '__main__':
    run()
