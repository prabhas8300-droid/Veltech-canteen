require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeDatabase } = require('./database/init');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
initializeDatabase();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/admin', require('./routes/admin'));

// Public Settings route
app.get('/api/settings', (req, res) => {
  try {
    const { getDb } = require('./database/init');
    const db = getDb();
    const rows = db.prepare('SELECT key, value FROM settings').all();
    const settings = {};
    rows.forEach(r => { settings[r.key] = r.value; });
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch settings.' });
  }
});

// Feedback route
app.post('/api/feedback', (req, res) => {
  try {
    const { name, email, rating, comment } = req.body;
    if (!name || !email || !comment) {
      return res.status(400).json({ success: false, message: 'All feedback fields are required.' });
    }
    const { getDb } = require('./database/init');
    const db = getDb();
    db.prepare('CREATE TABLE IF NOT EXISTS feedback (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, name TEXT, email TEXT, rating INTEGER, comment TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)').run();
    db.prepare('INSERT INTO feedback (name, email, rating, comment) VALUES (?, ?, ?, ?)').run(name, email, rating || 5, comment);
    res.json({ success: true, message: 'Feedback submitted successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not submit feedback.' });
  }
});

app.get('/api/feedback', (req, res) => {
  try {
    const { getDb } = require('./database/init');
    const db = getDb();
    db.prepare('CREATE TABLE IF NOT EXISTS feedback (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, name TEXT, email TEXT, rating INTEGER, comment TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)').run();
    const feedback = db.prepare('SELECT * FROM feedback ORDER BY created_at DESC LIMIT 50').all();
    res.json({ success: true, feedback });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch feedback.' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Annapurna Canteen API is running!', timestamp: new Date().toISOString() });
});

// Catch-all for HTML pages — serve index.html for unknown routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, message: 'API endpoint not found.' });
  }
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🍽️  Annapurna Canteen Server running on http://localhost:${PORT}`);
  console.log(`📁  Serving static files from: ${path.join(__dirname, 'public')}`);
});

module.exports = app;
