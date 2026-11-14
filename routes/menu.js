const express = require('express');
const router = express.Router();
const { getDb } = require('../database/init');
const { authenticate } = require('../middleware/auth');

// GET /api/menu  — public, supports ?category=&search=&special=&dietary=
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const { category, search, special, dietary } = req.query;

    let query = 'SELECT * FROM food_items WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ? OR category LIKE ?)';
      const t = `%${search}%`;
      params.push(t, t, t);
    }

    if (special === 'true') {
      query += ' AND is_special = 1';
    }

    if (dietary && dietary !== 'all') {
      if (dietary === 'veg') {
        query += ' AND dietary_type = \'veg\'';
      } else if (dietary === 'non-veg') {
        query += ' AND dietary_type = \'non-veg\'';
      } else if (dietary === 'egg') {
        query += ' AND dietary_type = \'egg\'';
      }
    }

    query += ' ORDER BY is_special DESC, category, name';

    const items = db.prepare(query).all(...params);

    // Attach average rating to each item
    const ratingsStmt = db.prepare(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as review_count FROM item_ratings WHERE food_item_id = ?'
    );
    const enriched = items.map(item => {
      const r = ratingsStmt.get(item.id);
      return {
        ...item,
        avg_rating: r && r.avg_rating ? Math.round(r.avg_rating * 10) / 10 : null,
        review_count: r ? r.review_count : 0,
      };
    });

    res.json({ success: true, items: enriched });
  } catch (err) {
    console.error('Menu fetch error:', err);
    res.status(500).json({ success: false, message: 'Could not fetch menu items.' });
  }
});

// GET /api/menu/categories — public
router.get('/categories', (req, res) => {
  try {
    const db = getDb();
    const rows = db.prepare(
      'SELECT DISTINCT category FROM food_items WHERE is_available = 1 ORDER BY category'
    ).all();
    res.json({ success: true, categories: rows.map(r => r.category) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch categories.' });
  }
});

// GET /api/menu/:id — public, with ratings
router.get('/:id', (req, res) => {
  try {
    const db = getDb();
    const item = db.prepare('SELECT * FROM food_items WHERE id = ?').get(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });

    const r = db.prepare(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as review_count FROM item_ratings WHERE food_item_id = ?'
    ).get(item.id);

    const reviews = db.prepare(`
      SELECT ir.rating, ir.review, ir.created_at, u.name as reviewer_name
      FROM item_ratings ir JOIN users u ON ir.user_id = u.id
      WHERE ir.food_item_id = ?
      ORDER BY ir.created_at DESC LIMIT 20
    `).all(item.id);

    res.json({
      success: true,
      item: {
        ...item,
        avg_rating: r && r.avg_rating ? Math.round(r.avg_rating * 10) / 10 : null,
        review_count: r ? r.review_count : 0,
        reviews,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch item.' });
  }
});

// POST /api/menu/:id/rate — authenticated
router.post('/:id/rate', authenticate, (req, res) => {
  try {
    const { rating, review } = req.body;
    const foodId = parseInt(req.params.id);

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be 1–5.' });
    }

    const db = getDb();
    const item = db.prepare('SELECT id FROM food_items WHERE id = ?').get(foodId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });

    db.prepare(`
      INSERT INTO item_ratings (food_item_id, user_id, rating, review)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(food_item_id, user_id) DO UPDATE SET rating = excluded.rating, review = excluded.review, created_at = CURRENT_TIMESTAMP
    `).run(foodId, req.user.id, rating, review || null);

    const r = db.prepare(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as review_count FROM item_ratings WHERE food_item_id = ?'
    ).get(foodId);

    res.json({
      success: true,
      message: 'Rating saved!',
      avg_rating: Math.round(r.avg_rating * 10) / 10,
      review_count: r.review_count,
    });
  } catch (err) {
    console.error('Rating error:', err);
    res.status(500).json({ success: false, message: 'Could not save rating.' });
  }
});

module.exports = router;
