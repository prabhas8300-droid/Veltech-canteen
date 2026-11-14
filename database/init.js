const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'canteen.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function initializeDatabase() {
  const db = getDb();

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      mobile TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS food_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image_url TEXT,
      dietary_type TEXT NOT NULL DEFAULT 'veg',
      is_available INTEGER NOT NULL DEFAULT 1,
      is_special INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

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
      razorpay_order_id TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      food_item_id INTEGER,
      food_name TEXT NOT NULL,
      food_price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS item_ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      food_item_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
      review TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (food_item_id) REFERENCES food_items(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(food_item_id, user_id)
    );
  `);

  // Add columns if upgrading from older schema
  try { db.exec(`ALTER TABLE food_items ADD COLUMN dietary_type TEXT NOT NULL DEFAULT 'veg'`); } catch (_) {}
  try { db.exec(`ALTER TABLE orders ADD COLUMN razorpay_order_id TEXT`); } catch (_) {}
  try { db.exec(`ALTER TABLE food_items ADD COLUMN item_type TEXT NOT NULL DEFAULT 'food'`); } catch (_) {}
  try { db.exec(`ALTER TABLE food_items ADD COLUMN subcategory TEXT`); } catch (_) {}

  // ── Seed admin user ──
  const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@veltech.edu');
  if (!adminExists) {
    const adminHash = bcrypt.hashSync('Admin@123', 10);
    db.prepare(`INSERT INTO users (name, email, mobile, password_hash, role) VALUES (?, ?, ?, ?, ?)`)
      .run('Admin', 'admin@veltech.edu', '9000000000', adminHash, 'admin');
  }

  // ── Seed test student ──
  const studentExists = db.prepare('SELECT id FROM users WHERE email = ?').get('student@veltech.edu');
  if (!studentExists) {
    const studentHash = bcrypt.hashSync('Student@123', 10);
    db.prepare(`INSERT INTO users (name, email, mobile, password_hash, role) VALUES (?, ?, ?, ?, ?)`)
      .run('Test Student', 'student@veltech.edu', '9000000001', studentHash, 'student');
  }

  // ── Seed food items (only if DB is empty) ──
  const foodExists = db.prepare('SELECT id FROM food_items LIMIT 1').get();
  if (!foodExists) {
    const foodItems = [
    {
        "name": "Idli (2 pcs)",
        "category": "Tiffin",
        "subcategory": "Tiffin",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 30,
        "description": "Soft, fluffy steamed rice cakes served hot with aromatic vegetable sambar and fresh coconut chutney.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Idli%20Sambar.JPG?width=600",
        "is_special": 1
    },
    {
        "name": "Crispy Dosa",
        "category": "Tiffin",
        "subcategory": "Tiffin",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 40,
        "description": "Golden, thin and crispy crepe prepared from fermented lentil batter, served with spicy tomato & coconut chutney.",
        "image_url": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&q=80",
        "is_special": 1
    },
    {
        "name": "Poori Masala (2 pcs)",
        "category": "Tiffin",
        "subcategory": "Tiffin",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 40,
        "description": "Puffed golden deep-fried whole wheat pooris served with spiced mashed potato onion saagu.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Poori%20or%20Puri.JPG?width=600",
        "is_special": 0
    },
    {
        "name": "Rava Upma",
        "category": "Tiffin",
        "subcategory": "Tiffin",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 35,
        "description": "Savory semolina porridge roasted with mustard seeds, curry leaves, ginger, green chilies and roasted cashews.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Rava%20Upma%20(Suji%20or%20Semolina%20Upma).JPG?width=600",
        "is_special": 0
    },
    {
        "name": "Ghee Ven Pongal",
        "category": "Tiffin",
        "subcategory": "Tiffin",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 40,
        "description": "Creamy rice and moong dal porridge tempered with pure cow ghee, black peppercorns, cumin and golden cashews.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Delicious%20breakfast%20with%20Pongal.jpg?width=600",
        "is_special": 1
    },
    {
        "name": "Masala Dosa",
        "category": "Tiffin",
        "subcategory": "Tiffin",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 55,
        "description": "Crispy golden crepe smeared with mild red chutney, filled with spiced mashed potato bhaji and served with sambar.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Masala%20dosa%20sambar.jpg?width=600",
        "is_special": 1
    },
    {
        "name": "Medu Vada (2 pcs)",
        "category": "Tiffin",
        "subcategory": "Tiffin",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 30,
        "description": "Crispy golden lentil doughnuts flavored with ginger, crushed pepper and curry leaves, served with coconut chutney.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Medu%20Vada.JPG?width=600",
        "is_special": 0
    },
    {
        "name": "South Indian Veg Meals",
        "category": "Lunch",
        "subcategory": "Lunch",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 80,
        "description": "Traditional banana leaf lunch: steamed Ponni rice, drumstick sambar, rasam, kootu, vegetable poriyal, appalam & curd.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Meal%20BananaLeaf.JPG?width=600",
        "is_special": 1
    },
    {
        "name": "Special Chicken Meals",
        "category": "Lunch",
        "subcategory": "Lunch",
        "item_type": "food",
        "dietary_type": "non-veg",
        "price": 130,
        "description": "Wholesome non-veg feast with spicy chicken curry, steamed rice, chicken gravy, rasam, kootu, poriyal & crunchy appalam.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Non%20veg%20thali.jpg?width=600",
        "is_special": 1
    },
    {
        "name": "Veg Fried Rice",
        "category": "Lunch",
        "subcategory": "Lunch",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 75,
        "description": "Wok-tossed long grain basmati rice with finely diced carrots, french beans, cabbage, spring onion & mild soy sauce.",
        "image_url": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80",
        "is_special": 0
    },
    {
        "name": "Royal Veg Dum Biryani",
        "category": "Lunch",
        "subcategory": "Lunch",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 110,
        "description": "Fragrant basmati rice layered with garden fresh vegetables, saffron, mint and aromatic dum spices. Served with raita.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Veg%20Biryani.jpg?width=600",
        "is_special": 1
    },
    {
        "name": "Hyderabadi Chicken Biryani",
        "category": "Lunch",
        "subcategory": "Lunch",
        "item_type": "food",
        "dietary_type": "non-veg",
        "price": 140,
        "description": "Classic slow dum cooked chicken biryani infused with saffron, fried onions, whole spices. Served with salan and raita.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Hyderabadi%20Chicken%20Biryani.jpg?width=600",
        "is_special": 1
    },
    {
        "name": "Curd Rice",
        "category": "Lunch",
        "subcategory": "Lunch",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 40,
        "description": "Comforting creamy yogurt rice tempered with mustard, curry leaves, ginger, green chilies, finished with fresh pomegranate.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Curd%20Rice%20(Mosaranna).jpg?width=600",
        "is_special": 0
    },
    {
        "name": "Egg Fried Rice",
        "category": "Lunch",
        "subcategory": "Lunch",
        "item_type": "food",
        "dietary_type": "egg",
        "price": 85,
        "description": "Wok-tossed basmati rice scrambled with fresh farm eggs, finely chopped vegetables, white pepper and soy sauce.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Egg%20fried%20rice.jpg?width=600",
        "is_special": 0
    },
    {
        "name": "Wheat Chapati with Kurma (2 pcs)",
        "category": "Dinner",
        "subcategory": "Dinner",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 40,
        "description": "Soft handmade 100% whole wheat chapatis served with flavorful South Indian mixed vegetable coconut kurma.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Chapati.jpg?width=600",
        "is_special": 0
    },
    {
        "name": "Malabar Parotta with Salna (2 pcs)",
        "category": "Dinner",
        "subcategory": "Dinner",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 45,
        "description": "Flaky, layered and crispy Malabar parottas served with rich and spicy tomato vegetable salna gravy.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Malabar%20Porotta.jpg?width=600",
        "is_special": 1
    },
    {
        "name": "Dinner Roast Dosa",
        "category": "Dinner",
        "subcategory": "Dinner",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 40,
        "description": "Freshly roasted crisp dinner dosa served with spicy shallot sambar and freshly grated coconut chutney.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Plain%20dosa%20with%20sambar%20%26%20chutney.jpg?width=600",
        "is_special": 0
    },
    {
        "name": "Schezwan Fried Rice",
        "category": "Dinner",
        "subcategory": "Dinner",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 80,
        "description": "Fiery Indo-Chinese stir-fried rice tossed in zesty red Schezwan sauce, bell peppers, crunchy carrots and scallions.",
        "image_url": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80",
        "is_special": 1
    },
    {
        "name": "Paneer Butter Masala",
        "category": "Dinner",
        "subcategory": "Dinner",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 110,
        "description": "Tender paneer cottage cheese cubes simmered in a luscious butter tomato gravy infused with kasuri methi.",
        "image_url": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80",
        "is_special": 1
    },
    {
        "name": "Kadai Chicken Curry",
        "category": "Dinner",
        "subcategory": "Dinner",
        "item_type": "food",
        "dietary_type": "non-veg",
        "price": 130,
        "description": "Succulent chicken pieces cooked in an iron wok with bell peppers, fresh tomatoes and freshly pounded coriander seeds.",
        "image_url": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80",
        "is_special": 1
    },
    {
        "name": "Crispy Samosa (2 pcs)",
        "category": "Snacks",
        "subcategory": "Snacks",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 25,
        "description": "Golden triangular pastry pockets stuffed with spiced potatoes, green peas and roasted cashews. Served with mint chutney.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Samosa.JPG?width=600",
        "is_special": 1
    },
    {
        "name": "Veg Puff Pastry",
        "category": "Snacks",
        "subcategory": "Snacks",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 20,
        "description": "Flaky golden puff pastry filled with delicious spiced vegetable masala mix, freshly baked in-house.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Curry%20puffs%20(1862141216).jpg?width=600",
        "is_special": 0
    },
    {
        "name": "Egg Puff",
        "category": "Snacks",
        "subcategory": "Snacks",
        "item_type": "food",
        "dietary_type": "egg",
        "price": 25,
        "description": "Crispy laminated puff pastry stuffed with hard-boiled seasoned egg half and spicy caramelized onions.",
        "image_url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
        "is_special": 0
    },
    {
        "name": "Assorted Biscuits Pack",
        "category": "Snacks",
        "subcategory": "Snacks",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 25,
        "description": "Crisp and delicious branded biscuit packets (Oreo Vanilla Cream, Bourbon Choco, Britannia Good Day Cashew).",
        "image_url": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80",
        "is_special": 0
    },
    {
        "name": "Crispy Potato Chips",
        "category": "Snacks",
        "subcategory": "Snacks",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 20,
        "description": "Crunchy wafer-thin salted and masala potato chips pack (Lays Classic, Kurkure Masala Munch, Bingo Mad Angles).",
        "image_url": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&q=80",
        "is_special": 0
    },
    {
        "name": "Peri Peri French Fries",
        "category": "Snacks",
        "subcategory": "Snacks",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 50,
        "description": "Hot and crisp golden french fries dusted with spicy peri-peri seasoning, served with creamy mayonnaise dip.",
        "image_url": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80",
        "is_special": 1
    },
    {
        "name": "Mineral Water Bottle (1 Litre)",
        "category": "Drinks",
        "subcategory": "Drinks",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 20,
        "description": "Sealed 1 Litre packaged purified drinking water bottle with added minerals, served chilled.",
        "image_url": "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&q=80",
        "is_special": 0
    },
    {
        "name": "Fresh Cold Pressed Orange Juice",
        "category": "Drinks",
        "subcategory": "Drinks",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 40,
        "description": "100% natural freshly squeezed sweet Nagpur orange juice loaded with vitamin C, made fresh on order without ice dilution.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Glass%20of%20Fresh%20Orange%20Juice.jpg?width=600",
        "is_special": 1
    },
    {
        "name": "Fresh Watermelon Juice",
        "category": "Drinks",
        "subcategory": "Drinks",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 35,
        "description": "Pure hydrating fresh watermelon juice served with fresh mint leaves and a pinch of black salt.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Watermelon%20juice%20in%20a%20glass.jpg?width=600",
        "is_special": 0
    },
    {
        "name": "Belgian Chocolate Milkshake",
        "category": "Drinks",
        "subcategory": "Drinks",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 60,
        "description": "Thick creamy milkshake made with rich chocolate ice cream, full cream milk and decadent cocoa drizzle.",
        "image_url": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&q=80",
        "is_special": 1
    },
    {
        "name": "Oreo Cookie Milkshake",
        "category": "Drinks",
        "subcategory": "Drinks",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 70,
        "description": "Blended thick vanilla and crushed Oreo cookie milkshake topped with whipped cream and cookie chunks.",
        "image_url": "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600&q=80",
        "is_special": 1
    },
    {
        "name": "Chilled Cool Drinks (500ml)",
        "category": "Drinks",
        "subcategory": "Drinks",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 25,
        "description": "Chilled carbonated soft drinks bottle: choose from Thums Up, Sprite, Coca-Cola, 7UP or Mirinda.",
        "image_url": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&q=80",
        "is_special": 0
    },
    {
        "name": "Red Bull Energy Drink (250ml)",
        "category": "Drinks",
        "subcategory": "Drinks",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 115,
        "description": "Refreshing chilled energy drink can with taurine and B-vitamins to revitalize your body and study focus.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Red%20Bull.jpg?width=600",
        "is_special": 0
    },
    {
        "name": "South Indian Filter Coffee",
        "category": "Drinks",
        "subcategory": "Drinks",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 15,
        "description": "Authentic traditional Kumbakonam degree filter coffee prepared with fresh decoction and frothy milk.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/South%20Indian%20Filter%20Coffee.jpg?width=600",
        "is_special": 0
    },
    {
        "name": "Cadbury Dairy Milk",
        "category": "Chocolates",
        "subcategory": "Chocolates",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 20,
        "description": "Classic creamy Cadbury Dairy Milk chocolate bar made with the finest British milk chocolate recipe.",
        "image_url": "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&q=80",
        "is_special": 1
    },
    {
        "name": "Nestl\u00e9 KitKat 4 Finger",
        "category": "Chocolates",
        "subcategory": "Chocolates",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 25,
        "description": "Crispy wafer fingers covered with smooth milk chocolate. Have a break, have a KitKat!",
        "image_url": "https://images.unsplash.com/photo-1548741487-18d16a145e80?w=600&q=80",
        "is_special": 1
    },
    {
        "name": "Cadbury 5 Star",
        "category": "Chocolates",
        "subcategory": "Chocolates",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 20,
        "description": "Irresistible bar with a chewy caramel and soft nougat centre drenched in delicious milk chocolate.",
        "image_url": "https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=600&q=80",
        "is_special": 0
    },
    {
        "name": "Nestl\u00e9 Munch Crunch Bar",
        "category": "Chocolates",
        "subcategory": "Chocolates",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 10,
        "description": "Crunchy wafer bar coated with rich chocolate for a fun and light anytime campus treat.",
        "image_url": "https://images.unsplash.com/photo-1575224300306-1b8da36134ec?w=600&q=80",
        "is_special": 0
    },
    {
        "name": "Cadbury Perk Wafer Bar",
        "category": "Chocolates",
        "subcategory": "Chocolates",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 10,
        "description": "Delightful twin crispy wafer fingers layered with rich Cadbury chocolate coating.",
        "image_url": "https://images.unsplash.com/photo-1575224300306-1b8da36134ec?w=600&q=80",
        "is_special": 0
    },
    {
        "name": "Snickers Peanut Chocolate Bar",
        "category": "Chocolates",
        "subcategory": "Chocolates",
        "item_type": "food",
        "dietary_type": "veg",
        "price": 50,
        "description": "Packed with roasted peanuts, caramel and soft chewy nougat enveloped in delicious milk chocolate.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Snickers.jpg?width=600",
        "is_special": 1
    },
    {
        "name": "Engineering Mathematics Textbook",
        "category": "Books",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 320,
        "description": "Higher Engineering Mathematics standard textbook covering matrices, calculus, differential equations and Fourier series.",
        "image_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80",
        "is_special": 1
    },
    {
        "name": "Engineering Physics Reference Book",
        "category": "Books",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 280,
        "description": "Complete University syllabus reference book covering optics, quantum physics, thermodynamics and semiconductors.",
        "image_url": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80",
        "is_special": 0
    },
    {
        "name": "Chemistry Laboratory Manual",
        "category": "Books",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 150,
        "description": "Official university laboratory handbook with practical experiments, titration charts and safety guidelines.",
        "image_url": "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=600&q=80",
        "is_special": 0
    },
    {
        "name": "Programming in C & Algorithms",
        "category": "Books",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 260,
        "description": "Comprehensive textbook for learning C programming from basic syntax to pointers, file handling and dynamic memory.",
        "image_url": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&q=80",
        "is_special": 1
    },
    {
        "name": "Data Structures & Algorithms Handbook",
        "category": "Books",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 340,
        "description": "Complete guide covering arrays, linked lists, stacks, queues, trees, graphs and sorting techniques with code examples.",
        "image_url": "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&q=80",
        "is_special": 1
    },
    {
        "name": "A4 Spiral Notebook (160 Pages)",
        "category": "Notebooks",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 65,
        "description": "Premium 70 GSM smooth acid-free paper, spiral ring bound notebook with micro-perforated sheets for clean tearing.",
        "image_url": "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80",
        "is_special": 1
    },
    {
        "name": "200-Page Ruled Long Notebook",
        "category": "Notebooks",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 45,
        "description": "Single line ruled full-scape notebook with laminated water-resistant cover, ideal for college subject lectures.",
        "image_url": "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&q=80",
        "is_special": 0
    },
    {
        "name": "Engineering Graph Notebook",
        "category": "Notebooks",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 55,
        "description": "High precision millimeter grid graph sheets interleaved with ruled pages for calculus and laboratory plotting.",
        "image_url": "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&q=80",
        "is_special": 0
    },
    {
        "name": "Hardcover Lab Record Notebook",
        "category": "Notebooks",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 70,
        "description": "Official university hardcover bound lab record book with alternate blank and ruled pages for circuit diagrams.",
        "image_url": "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&q=80",
        "is_special": 1
    },
    {
        "name": "A3 Drawing & Sketch Book",
        "category": "Notebooks",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 80,
        "description": "140 GSM thick cartridge paper drawing book ideal for engineering graphics, technical sketches and artistic work.",
        "image_url": "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80",
        "is_special": 0
    },
    {
        "name": "Reynolds 045 Ball Pen (Blue)",
        "category": "Pens",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 10,
        "description": "Classic laser tip 0.7mm smooth writing blue ballpoint pen, trusted by generations of students for exam writing.",
        "image_url": "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&q=80",
        "is_special": 0
    },
    {
        "name": "Parker Vector Rollerball Pen",
        "category": "Pens",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 85,
        "description": "Elegantly styled Parker Vector rollerball pen with signature stainless steel arrow clip and ultra-smooth refill.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Ballpoint-pen-parts.jpg?width=600",
        "is_special": 1
    },
    {
        "name": "Gel Pen Set (Pack of 5)",
        "category": "Pens",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 35,
        "description": "Quick-drying waterproof Japanese gel ink pens set in 3 Blue, 1 Black and 1 Red with comfortable rubberized grip.",
        "image_url": "https://images.unsplash.com/photo-1569683795645-b62e50fbf103?w=600&q=80",
        "is_special": 1
    },
    {
        "name": "Pilot G2 0.5mm Gel Pen",
        "category": "Pens",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 25,
        "description": "Premium retractable fine 0.5mm tip gel pen with contoured ergonomic grip, designed for fatigue-free notes.",
        "image_url": "https://images.unsplash.com/photo-1569683795645-b62e50fbf103?w=600&q=80",
        "is_special": 0
    },
    {
        "name": "Permanent Marker Set (4 Colors)",
        "category": "Pens",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 120,
        "description": "Assorted chisel tip water-resistant alcohol based markers in Black, Blue, Red and Green for labeling charts & projects.",
        "image_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80",
        "is_special": 0
    },
    {
        "name": "Apsara Platinum HB Pencils (Box of 10)",
        "category": "Pencils",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 30,
        "description": "Dark writing break-resistant graphite pencils box with free eraser and sharpener included.",
        "image_url": "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&q=80",
        "is_special": 0
    },
    {
        "name": "Mechanical Drafting Pencil (0.5mm)",
        "category": "Pencils",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 55,
        "description": "High precision metal tip 0.5mm mechanical clutch pencil with spare polymer leads tube included.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Mechanical%20Pencils%202019.jpg?width=600",
        "is_special": 1
    },
    {
        "name": "Faber-Castell Color Pencils (12 Shades)",
        "category": "Pencils",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 85,
        "description": "Rich pigment soft lead triangular colored pencils with high break resistance for diagrams and projects.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Graphgear%20500%20(13653116004).jpg?width=600",
        "is_special": 0
    },
    {
        "name": "Drawing Sketching Pencil Set (6 Grades)",
        "category": "Pencils",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 120,
        "description": "Professional artists drawing kit with 2H, HB, 2B, 4B, 6B and 8B graphite pencils for engineering sketching.",
        "image_url": "https://images.unsplash.com/photo-1520004434532-668416a08753?w=600&q=80",
        "is_special": 1
    },
    {
        "name": "Staedtler Mars Lumograph Pencil",
        "category": "Pencils",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 25,
        "description": "German engineering premium quality drafting pencil with bonded super-strong break-resistant graphite core.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Colored-Pencils.jpg?width=600",
        "is_special": 0
    },
    {
        "name": "Faber-Castell Dust-Free Eraser",
        "category": "Erasers",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 15,
        "description": "Specially formulated dust-free non-abrasive white vinyl eraser that rolls graphite dust together without smudges.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Radiergummies.jpg?width=600",
        "is_special": 0
    },
    {
        "name": "Precision Drafting Vinyl Eraser",
        "category": "Erasers",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 20,
        "description": "Sharp edged block vinyl eraser designed for precision correction on technical engineering drawings.",
        "image_url": "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&q=80",
        "is_special": 0
    },
    {
        "name": "Artist Kneaded Putty Eraser",
        "category": "Erasers",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 35,
        "description": "Malleable and absorbent kneaded rubber eraser, perfectly shapeable for subtle graphite shading and highlights.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Kneaded%20eraser.jpg?width=600",
        "is_special": 1
    },
    {
        "name": "Multicolor Student Erasers (Pack of 5)",
        "category": "Erasers",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 25,
        "description": "Vibrant pastel colored soft student erasers set in plastic protective sleeve.",
        "image_url": "https://images.unsplash.com/photo-1569683795645-b62e50fbf103?w=600&q=80",
        "is_special": 0
    },
    {
        "name": "Jumbo Non-Dust Eraser",
        "category": "Erasers",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 12,
        "description": "Extra large soft polymer eraser ideal for quick broad clean-up on classroom work and homework sheets.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Pink_Pearl_eraser.jpg?width=600",
        "is_special": 0
    },
    {
        "name": "Double Hole Canister Sharpener",
        "category": "Sharpeners",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 18,
        "description": "Transparent plastic waste collection canister with dual precision steel blades for regular and thick pencils.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Plastic%20pencil%20sharpener.jpg?width=600",
        "is_special": 0
    },
    {
        "name": "Rotary Desktop Crank Sharpener",
        "category": "Sharpeners",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 45,
        "description": "Heavy-duty rotary hand-crank desktop pencil sharpener with auto-stop mechanism and large shavings tray.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Used%20pencil%20sharpeners%20available%20in%20India.jpg?width=600",
        "is_special": 1
    },
    {
        "name": "Staedtler Metal Wedge Sharpener",
        "category": "Sharpeners",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 30,
        "description": "Durable die-cast zinc metal wedge single-hole sharpener with contoured finger grip.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Pencil%20sharpener%20only%20the%20pencil.jpg?width=600",
        "is_special": 0
    },
    {
        "name": "Electric Battery Operated Sharpener",
        "category": "Sharpeners",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 150,
        "description": "Fast automatic battery powered pencil sharpener that creates a razor sharp point in 3 seconds.",
        "image_url": "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&q=80",
        "is_special": 1
    },
    {
        "name": "Compact Travel Pencil Sharpener",
        "category": "Sharpeners",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 22,
        "description": "Pocket-sized ergonomic sharpener with flip-open lid to prevent pencil shavings from spilling in your bag.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Red%20pencil%20sharpener.jpg?width=600",
        "is_special": 0
    },
    {
        "name": "30cm Transparent Acrylic Ruler",
        "category": "Rulers",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 20,
        "description": "Shatterproof transparent clear ruler with crisp millimeter, centimeter and inch graduations with beveled edges.",
        "image_url": "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&q=80",
        "is_special": 0
    },
    {
        "name": "Technical Set Squares (Pair)",
        "category": "Rulers",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 35,
        "description": "Drafting set with 45/90 degree and 30/60 degree crystal clear transparent acrylic set squares for engineering drawing.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Squadra%2030%2060.jpg?width=600",
        "is_special": 0
    },
    {
        "name": "180 Degree Precision Protractor",
        "category": "Rulers",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 25,
        "description": "Full half-circle transparent protractor with center guide mark for accurate geometric angle measurement.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Protractor%20katomierz.jpg?width=600",
        "is_special": 0
    },
    {
        "name": "Complete Mathematical Geometry Box",
        "category": "Rulers",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 85,
        "description": "Metal instrument box with compass, divider, 15cm scale, protractor, set squares, mini pencil, sharpener and eraser.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Keuffel%20and%20Esser%20drawing%20kit%20open.jpg?width=600",
        "is_special": 1
    },
    {
        "name": "Engineering Scale Triangular Ruler",
        "category": "Rulers",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 45,
        "description": "Architectural triangular reduction scale ruler with 6 different proportional ratios for civil & mechanical drafting.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/CombinationSquareSet.jpg?width=600",
        "is_special": 1
    },
    {
        "name": "A4 Ring Binder Document File",
        "category": "Files",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 35,
        "description": "High strength polypropylene plastic binder file with 2-D rings, spine pocket label and inner document pouch.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/3%20ring%20binder.jpg?width=600",
        "is_special": 1
    },
    {
        "name": "Clear L-Type Plastic Folder (Pack of 5)",
        "category": "Files",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 25,
        "description": "Transparent moisture-proof plastic sleeve folders for holding assignment sheets, resumes and official circulars.",
        "image_url": "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&q=80",
        "is_special": 0
    },
    {
        "name": "Zipper Mesh Bag File",
        "category": "Files",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 15,
        "description": "Waterproof zipper pouch file bag with reinforced fabric mesh, ideal for keeping stationary and certificates safe.",
        "image_url": "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80",
        "is_special": 0
    },
    {
        "name": "Butterfly Binder Clips (Box of 12)",
        "category": "Files",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 20,
        "description": "Heavy-duty tempered spring steel paper binder clips with fold-back metal arms for securely clamping thick notes.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Binder%20clips.JPG?width=600",
        "is_special": 0
    },
    {
        "name": "Hardboard Arch Lever Box File",
        "category": "Files",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 55,
        "description": "Heavy rigid cardboard box file with stainless steel lever arch mechanism and metal shoe edge protector.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Lever%20arch%20file.jpg?width=600",
        "is_special": 1
    },
    {
        "name": "Desktop Metal Stapler (No. 10)",
        "category": "Other Stationery",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 85,
        "description": "Compact and durable metal body desk stapler with built-in staple remover and 20 sheets stapling capacity.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/2017%20Zszywacz%20biurowy.jpg?width=600",
        "is_special": 0
    },
    {
        "name": "Steel Stapler Pins (Box of 1000)",
        "category": "Other Stationery",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 20,
        "description": "High grade rust-resistant steel No.10 staple pins engineered with sharp chisel points for smooth paper entry.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Swingline%20Staples.jpg?width=600",
        "is_special": 0
    },
    {
        "name": "Stainless Steel Paper Scissors",
        "category": "Other Stationery",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 45,
        "description": "Sharp stainless steel blades craft and paper scissors with comfortable soft-touch ergonomic plastic finger loops.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Scissors.jpg?width=600",
        "is_special": 0
    },
    {
        "name": "Whiteboard Marker Set (4 Pens)",
        "category": "Other Stationery",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 30,
        "description": "Low odor dry-erase bullet tip whiteboard markers in Black, Blue, Red and Green for seminar presentations.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Whiteboard%20markers.jpg?width=600",
        "is_special": 0
    },
    {
        "name": "Correction Pen Fluid (Whited Out)",
        "category": "Other Stationery",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 25,
        "description": "Fast drying opaque white correction fluid with fine metal needle ballpoint applicator tip for neat error correction.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Penna%20bianchetto.jpg?width=600",
        "is_special": 0
    },
    {
        "name": "Pastel Highlighter Set (Pack of 5)",
        "category": "Other Stationery",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 65,
        "description": "Chisel tip fluorescent water-based text markers in yellow, green, pink, orange and blue for exam revision highlighting.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Highlighting%20pens.jpg?width=600",
        "is_special": 1
    },
    {
        "name": "Self-Adhesive Sticky Notes (100 Sheets)",
        "category": "Other Stationery",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 40,
        "description": "3x3 inch bright canary yellow memo sticky pads with clean repositionable adhesive backing for study bookmarks.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Sticky%20Notes%202.jpg?width=600",
        "is_special": 0
    },
    {
        "name": "Vinyl Coated Paper Clips (Box of 100)",
        "category": "Other Stationery",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 15,
        "description": "Colorful plastic vinyl coated rust-free steel wire paper clips to keep documents orderly without page tearing.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Paperclips.jpg?width=600",
        "is_special": 0
    },
    {
        "name": "Elastic Rubber Bands Pack",
        "category": "Other Stationery",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 10,
        "description": "High elasticity multi-color durable natural rubber bands for bundling assignments, rolls and blueprints.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Rubber%20bands.jpg?width=600",
        "is_special": 0
    },
    {
        "name": "Study Revision Index Flash Cards",
        "category": "Other Stationery",
        "subcategory": "Stationery",
        "item_type": "stationery",
        "dietary_type": "stationery",
        "price": 35,
        "description": "Pack of 50 ruled heavyweight cardstock study flash cards for quick formula memorization and exam review.",
        "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Flashcards.jpg?width=600",
        "is_special": 0
    }
];

    const insertFood = db.prepare(`
      INSERT INTO food_items (name, category, description, price, image_url, dietary_type, is_available, is_special, item_type, subcategory)
      VALUES (@name, @category, @description, @price, @image_url, @dietary_type, 1, @is_special, @item_type, @subcategory)
    `);

    const insertMany = db.transaction((items) => {
      for (const item of items) insertFood.run(item);
    });
    insertMany(foodItems);
    console.log(`✅ Seeded ${foodItems.length} items (food + stationery + drinks + chocolates)`);
  }

  // ── Seed settings ──
  const settingsData = [
    { key: 'canteen_name', value: 'Annapurna' },
    { key: 'college_name', value: 'Vel Tech' },
    { key: 'background_image', value: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1600&q=80' },
    { key: 'contact_phone', value: '⚙️ Configure in Admin Settings' },
    { key: 'contact_email', value: '⚙️ Configure in Admin Settings' },
    { key: 'opening_hours', value: '7:00 AM - 8:00 PM' },
    { key: 'address', value: 'Vel Tech University Campus, Avadi, Chennai – 600 062' },
  ];

  const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (@key, @value)');
  const insertSettings = db.transaction((items) => {
    for (const item of items) insertSetting.run(item);
  });
  insertSettings(settingsData);

  console.log('✅ Database initialized successfully');
  return db;
}

module.exports = { initializeDatabase, getDb };
