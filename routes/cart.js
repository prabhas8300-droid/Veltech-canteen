const express = require('express');
const router = express.Router();
const { getDb } = require('../database/init');
const { authenticate } = require('../middleware/auth');

// All cart routes require auth
router.use(authenticate);

// GET /api/cart - get user's cart with food details
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const items = db.prepare(`
      SELECT ci.id, ci.quantity, ci.food_item_id,
             fi.name, fi.category, fi.price, fi.image_url, fi.is_available
      FROM cart_items ci
      JOIN food_items fi ON ci.food_item_id = fi.id
      WHERE ci.user_id = ?
      ORDER BY ci.created_at DESC
    `).all(req.user.id);

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json({ success: true, items, total });
  } catch (err) {
    console.error('Cart fetch error:', err);
    res.status(500).json({ success: false, message: 'Could not fetch cart.' });
  }
});

// POST /api/cart/add
router.post('/add', (req, res) => {
  try {
    const { food_item_id, quantity = 1 } = req.body;
    if (!food_item_id) {
      return res.status(400).json({ success: false, message: 'food_item_id is required.' });
    }

    const db = getDb();
    const food = db.prepare('SELECT id, is_available FROM food_items WHERE id = ?').get(food_item_id);
    if (!food || !food.is_available) {
      return res.status(404).json({ success: false, message: 'Food item not available.' });
    }

    const existing = db.prepare('SELECT id, quantity FROM cart_items WHERE user_id = ? AND food_item_id = ?')
      .get(req.user.id, food_item_id);

    if (existing) {
      db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?')
        .run(existing.quantity + Number(quantity), existing.id);
    } else {
      db.prepare('INSERT INTO cart_items (user_id, food_item_id, quantity) VALUES (?, ?, ?)')
        .run(req.user.id, food_item_id, Number(quantity));
    }

    const cartCount = db.prepare('SELECT SUM(quantity) as count FROM cart_items WHERE user_id = ?').get(req.user.id);
    res.json({ success: true, message: 'Added to cart!', cartCount: cartCount.count || 0 });
  } catch (err) {
    console.error('Cart add error:', err);
    res.status(500).json({ success: false, message: 'Could not add to cart.' });
  }
});

// PUT /api/cart/update
router.put('/update', (req, res) => {
  try {
    const { food_item_id, quantity } = req.body;
    if (!food_item_id || quantity === undefined) {
      return res.status(400).json({ success: false, message: 'food_item_id and quantity are required.' });
    }

    const db = getDb();
    if (Number(quantity) <= 0) {
      db.prepare('DELETE FROM cart_items WHERE user_id = ? AND food_item_id = ?')
        .run(req.user.id, food_item_id);
      return res.json({ success: true, message: 'Item removed from cart.' });
    }

    db.prepare('UPDATE cart_items SET quantity = ? WHERE user_id = ? AND food_item_id = ?')
      .run(Number(quantity), req.user.id, food_item_id);

    res.json({ success: true, message: 'Cart updated.' });
  } catch (err) {
    console.error('Cart update error:', err);
    res.status(500).json({ success: false, message: 'Could not update cart.' });
  }
});

// DELETE /api/cart/remove/:food_item_id
router.delete('/remove/:food_item_id', (req, res) => {
  try {
    const db = getDb();
    db.prepare('DELETE FROM cart_items WHERE user_id = ? AND food_item_id = ?')
      .run(req.user.id, req.params.food_item_id);
    res.json({ success: true, message: 'Item removed from cart.' });
  } catch (err) {
    console.error('Cart remove error:', err);
    res.status(500).json({ success: false, message: 'Could not remove item.' });
  }
});

// DELETE /api/cart/clear
router.delete('/clear', (req, res) => {
  try {
    const db = getDb();
    db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.user.id);
    res.json({ success: true, message: 'Cart cleared.' });
  } catch (err) {
    console.error('Cart clear error:', err);
    res.status(500).json({ success: false, message: 'Could not clear cart.' });
  }
});

module.exports = router;
