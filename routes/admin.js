const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getDb } = require('../database/init');
const { authenticate, adminOnly } = require('../middleware/auth');

router.use(authenticate, adminOnly);

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, 'food_' + Date.now() + ext);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed.'));
  }
});

// GET /api/admin/orders
router.get('/orders', (req, res) => {
  try {
    const db = getDb();
    const { status } = req.query;
    let query = `
      SELECT o.*, u.name as student_name, u.email as student_email, u.mobile as student_mobile
      FROM orders o JOIN users u ON o.user_id = u.id
    `;
    const params = [];
    if (status && status !== 'all') {
      query += ' WHERE o.order_status = ?';
      params.push(status);
    }
    query += ' ORDER BY o.order_date DESC';
    const orders = db.prepare(query).all(...params);

    const ordersWithItems = orders.map(order => {
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
      return { ...order, items };
    });

    res.json({ success: true, orders: ordersWithItems });
  } catch (err) {
    console.error('Admin orders fetch error:', err);
    res.status(500).json({ success: false, message: 'Could not fetch orders.' });
  }
});

// PUT /api/admin/orders/:id/status
router.put('/orders/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'preparing', 'ready', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const db = getDb();
    const result = db.prepare('UPDATE orders SET order_status = ? WHERE id = ?')
      .run(status, req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.json({ success: true, message: 'Order status updated.' });
  } catch (err) {
    console.error('Admin order status update error:', err);
    res.status(500).json({ success: false, message: 'Could not update order status.' });
  }
});

// GET /api/admin/users
router.get('/users', (req, res) => {
  try {
    const db = getDb();
    const users = db.prepare("SELECT id, name, email, mobile, role, created_at FROM users WHERE role = 'student' ORDER BY created_at DESC").all();
    res.json({ success: true, users });
  } catch (err) {
    console.error('Admin users fetch error:', err);
    res.status(500).json({ success: false, message: 'Could not fetch users.' });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', (req, res) => {
  try {
    const db = getDb();
    const user = db.prepare('SELECT role FROM users WHERE id = ?').get(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot delete admin accounts.' });

    db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'User deleted.' });
  } catch (err) {
    console.error('Admin delete user error:', err);
    res.status(500).json({ success: false, message: 'Could not delete user.' });
  }
});

// GET /api/admin/sales/daily
router.get('/sales/daily', (req, res) => {
  try {
    const db = getDb();
    const sales = db.prepare(`
      SELECT DATE(order_date) as date, COUNT(*) as orders, SUM(total_amount) as revenue
      FROM orders WHERE payment_status = 'paid'
      GROUP BY DATE(order_date)
      ORDER BY date DESC
      LIMIT 30
    `).all();
    res.json({ success: true, sales });
  } catch (err) {
    console.error('Admin daily sales error:', err);
    res.status(500).json({ success: false, message: 'Could not fetch sales data.' });
  }
});

// GET /api/admin/sales/summary
router.get('/sales/summary', (req, res) => {
  try {
    const db = getDb();
    const today = new Date().toISOString().split('T')[0];

    const totalRevenue = db.prepare("SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE payment_status = 'paid'").get();
    const totalOrders = db.prepare("SELECT COUNT(*) as count FROM orders").get();
    const todayRevenue = db.prepare("SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE payment_status = 'paid' AND DATE(order_date) = ?").get(today);
    const todayOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE DATE(order_date) = ?").get(today);
    const pendingOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE order_status IN ('pending', 'preparing')").get();
    const totalItemsSold = db.prepare("SELECT COALESCE(SUM(oi.quantity), 0) as count FROM order_items oi JOIN orders o ON oi.order_id = o.id WHERE o.payment_status = 'paid'").get();

    res.json({
      success: true,
      summary: {
        total_revenue: totalRevenue.total,
        total_orders: totalOrders.count,
        today_revenue: todayRevenue.total,
        today_orders: todayOrders.count,
        pending_orders: pendingOrders.count,
        total_items_sold: totalItemsSold.count
      }
    });
  } catch (err) {
    console.error('Admin sales summary error:', err);
    res.status(500).json({ success: false, message: 'Could not fetch summary.' });
  }
});

// POST /api/admin/food
router.post('/food', (req, res) => {
  try {
    const { name, category, description, price, image_url, is_available = 1, is_special = 0 } = req.body;
    if (!name || !category || !price) {
      return res.status(400).json({ success: false, message: 'Name, category and price are required.' });
    }

    const db = getDb();
    const result = db.prepare(`
      INSERT INTO food_items (name, category, description, price, image_url, is_available, is_special)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(name, category, description || '', price, image_url || '', is_available, is_special);

    const item = db.prepare('SELECT * FROM food_items WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, message: 'Food item added!', item });
  } catch (err) {
    console.error('Admin add food error:', err);
    res.status(500).json({ success: false, message: 'Could not add food item.' });
  }
});

// PUT /api/admin/food/:id
router.put('/food/:id', (req, res) => {
  try {
    const { name, category, description, price, image_url, is_available, is_special } = req.body;
    const db = getDb();

    const existing = db.prepare('SELECT id FROM food_items WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Food item not found.' });

    db.prepare(`
      UPDATE food_items SET name = ?, category = ?, description = ?, price = ?,
      image_url = ?, is_available = ?, is_special = ? WHERE id = ?
    `).run(name, category, description, price, image_url, is_available, is_special, req.params.id);

    const item = db.prepare('SELECT * FROM food_items WHERE id = ?').get(req.params.id);
    res.json({ success: true, message: 'Food item updated!', item });
  } catch (err) {
    console.error('Admin update food error:', err);
    res.status(500).json({ success: false, message: 'Could not update food item.' });
  }
});

// DELETE /api/admin/food/:id
router.delete('/food/:id', (req, res) => {
  try {
    const db = getDb();
    const result = db.prepare('DELETE FROM food_items WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ success: false, message: 'Food item not found.' });
    res.json({ success: true, message: 'Food item deleted.' });
  } catch (err) {
    console.error('Admin delete food error:', err);
    res.status(500).json({ success: false, message: 'Could not delete food item.' });
  }
});

// POST /api/admin/food/:id/upload-image
router.post('/food/:id/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided.' });
    }

    const imageUrl = '/uploads/' + req.file.filename;
    const db = getDb();
    db.prepare('UPDATE food_items SET image_url = ? WHERE id = ?').run(imageUrl, req.params.id);

    res.json({ success: true, message: 'Image uploaded!', image_url: imageUrl });
  } catch (err) {
    console.error('Admin upload image error:', err);
    res.status(500).json({ success: false, message: 'Could not upload image.' });
  }
});

// GET /api/admin/settings
router.get('/settings', (req, res) => {
  try {
    const db = getDb();
    const settings = db.prepare('SELECT key, value FROM settings').all();
    const settingsObj = {};
    settings.forEach(s => { settingsObj[s.key] = s.value; });
    res.json({ success: true, settings: settingsObj });
  } catch (err) {
    console.error('Admin settings fetch error:', err);
    res.status(500).json({ success: false, message: 'Could not fetch settings.' });
  }
});

// PUT /api/admin/settings
router.put('/settings', (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key) return res.status(400).json({ success: false, message: 'Key is required.' });

    const db = getDb();
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, value);
    res.json({ success: true, message: 'Setting updated.' });
  } catch (err) {
    console.error('Admin settings update error:', err);
    res.status(500).json({ success: false, message: 'Could not update setting.' });
  }
});

module.exports = router;
