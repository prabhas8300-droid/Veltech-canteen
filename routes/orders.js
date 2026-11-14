const express = require('express');
const router = express.Router();
const { getDb } = require('../database/init');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// POST /api/orders/place
router.post('/place', (req, res) => {
  try {
    const { payment_method, notes } = req.body;
    if (!payment_method) {
      return res.status(400).json({ success: false, message: 'Payment method is required.' });
    }

    const db = getDb();
    const cartItems = db.prepare(`
      SELECT ci.quantity, ci.food_item_id,
             fi.name as food_name, fi.price as food_price
      FROM cart_items ci
      JOIN food_items fi ON ci.food_item_id = fi.id
      WHERE ci.user_id = ?
    `).all(req.user.id);

    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty.' });
    }

    const subtotal = cartItems.reduce((sum, item) => sum + item.food_price * item.quantity, 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    const placeOrder = db.transaction(() => {
      const orderResult = db.prepare(`
        INSERT INTO orders (user_id, total_amount, payment_method, payment_status, order_status, notes)
        VALUES (?, ?, ?, 'pending', 'pending', ?)
      `).run(req.user.id, total, payment_method, notes || null);

      const orderId = orderResult.lastInsertRowid;

      const insertItem = db.prepare(`
        INSERT INTO order_items (order_id, food_item_id, food_name, food_price, quantity)
        VALUES (?, ?, ?, ?, ?)
      `);

      for (const item of cartItems) {
        insertItem.run(orderId, item.food_item_id, item.food_name, item.food_price, item.quantity);
      }

      db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.user.id);

      return orderId;
    });

    const orderId = placeOrder();
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order,
      orderId
    });
  } catch (err) {
    console.error('Place order error:', err);
    res.status(500).json({ success: false, message: 'Could not place order. Please try again.' });
  }
});

// GET /api/orders/my - get user's orders
router.get('/my', (req, res) => {
  try {
    const db = getDb();
    const orders = db.prepare(`
      SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC
    `).all(req.user.id);

    const ordersWithItems = orders.map(order => {
      const items = db.prepare(`
        SELECT * FROM order_items WHERE order_id = ?
      `).all(order.id);
      return { ...order, items };
    });

    res.json({ success: true, orders: ordersWithItems });
  } catch (err) {
    console.error('Fetch orders error:', err);
    res.status(500).json({ success: false, message: 'Could not fetch orders.' });
  }
});

// GET /api/orders/:id
router.get('/:id', (req, res) => {
  try {
    const db = getDb();
    const order = db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?')
      .get(req.params.id, req.user.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
    res.json({ success: true, order: { ...order, items } });
  } catch (err) {
    console.error('Fetch order error:', err);
    res.status(500).json({ success: false, message: 'Could not fetch order.' });
  }
});

module.exports = router;
