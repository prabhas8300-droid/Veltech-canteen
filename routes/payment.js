require('dotenv').config();
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { getDb } = require('../database/init');
const { authenticate } = require('../middleware/auth');

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const DEV_MODE = !RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET;

let Razorpay = null;
let razorpay = null;
if (!DEV_MODE) {
  try {
    Razorpay = require('razorpay');
    razorpay = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
  } catch (e) {
    console.warn('⚠️  Razorpay module not loaded — running in DEV mode');
  }
}

if (DEV_MODE) {
  console.warn('⚠️  RAZORPAY_KEY_ID not set — payment gateway running in DEVELOPMENT MODE (simulated).');
}

// GET /api/payment/config — returns public key + dev mode flag (no auth required)
router.get('/config', (req, res) => {
  res.json({ dev_mode: DEV_MODE, key_id: DEV_MODE ? '' : RAZORPAY_KEY_ID });
});

// POST /api/payment/create-order — creates a Razorpay order (or simulates in dev mode)
router.post('/create-order', authenticate, async (req, res) => {
  try {
    const db = getDb();
    // Pull cart from DB and calculate total SERVER-SIDE — never trust client amounts
    const cartItems = db.prepare(`
      SELECT ci.quantity, ci.food_item_id,
             fi.name as food_name, fi.price as food_price, fi.is_available
      FROM cart_items ci
      JOIN food_items fi ON ci.food_item_id = fi.id
      WHERE ci.user_id = ?
    `).all(req.user.id);

    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty.' });
    }

    const unavailable = cartItems.filter(i => !i.is_available);
    if (unavailable.length > 0) {
      return res.status(400).json({
        success: false,
        message: `These items are currently unavailable: ${unavailable.map(i => i.food_name).join(', ')}`
      });
    }

    const { payment_method = 'UPI', notes = '' } = req.body;

    const subtotal = cartItems.reduce((sum, item) => sum + item.food_price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.05 * 100) / 100;
    const totalRs = Math.round((subtotal + tax) * 100) / 100;
    const totalPaise = Math.round(totalRs * 100); // Razorpay uses smallest currency unit

    // ── Create order record (payment pending) ──
    const orderResult = db.prepare(`
      INSERT INTO orders (user_id, total_amount, payment_method, payment_status, order_status, notes)
      VALUES (?, ?, ?, 'pending', 'pending', ?)
    `).run(req.user.id, totalRs, payment_method, notes || null);

    const orderId = orderResult.lastInsertRowid;

    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, food_item_id, food_name, food_price, quantity)
      VALUES (?, ?, ?, ?, ?)
    `);
    for (const item of cartItems) {
      insertItem.run(orderId, item.food_item_id, item.food_name, item.food_price, item.quantity);
    }

    // Clear cart after order is created
    db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.user.id);

    if (DEV_MODE) {
      // ── DEV MODE: simulate payment ──
      const fakeTxnId = 'DEV_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6).toUpperCase();
      db.prepare(`
        UPDATE orders SET payment_status = 'dev_simulated', order_status = 'preparing',
        transaction_id = ?, razorpay_order_id = 'DEV_ORDER'
        WHERE id = ?
      `).run(fakeTxnId, orderId);

      return res.json({
        success: true,
        dev_mode: true,
        order_id: orderId,
        transaction_id: fakeTxnId,
        total: totalRs,
        message: '⚠️ DEV MODE: Payment simulated. Configure RAZORPAY_KEY_ID in .env to enable real payments.',
      });
    }

    // ── LIVE MODE: create Razorpay order ──
    const rzpOrder = await razorpay.orders.create({
      amount: totalPaise,
      currency: 'INR',
      receipt: `annapurna_order_${orderId}`,
      notes: { canteen_order_id: String(orderId), user_id: String(req.user.id) },
    });

    db.prepare('UPDATE orders SET razorpay_order_id = ? WHERE id = ?').run(rzpOrder.id, orderId);

    res.json({
      success: true,
      dev_mode: false,
      order_id: orderId,
      razorpay_order_id: rzpOrder.id,
      amount: totalPaise,
      currency: 'INR',
      key_id: RAZORPAY_KEY_ID,
      prefill: { name: req.user.name, email: req.user.email, contact: req.user.mobile },
    });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ success: false, message: 'Could not create order. Please try again.' });
  }
});

// POST /api/payment/verify — verifies Razorpay signature and marks order paid
router.post('/verify', authenticate, (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, canteen_order_id } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !canteen_order_id) {
      return res.status(400).json({ success: false, message: 'Missing payment verification fields.' });
    }

    // Verify HMAC signature
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment signature verification failed.' });
    }

    const db = getDb();
    const order = db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?')
      .get(canteen_order_id, req.user.id);

    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (order.payment_status === 'paid') {
      return res.json({ success: true, message: 'Already paid.', order_id: order.id });
    }

    db.prepare(`
      UPDATE orders SET payment_status = 'paid', order_status = 'preparing',
      transaction_id = ?, razorpay_order_id = ? WHERE id = ?
    `).run(razorpay_payment_id, razorpay_order_id, canteen_order_id);

    res.json({
      success: true,
      message: 'Payment verified and order confirmed!',
      order_id: canteen_order_id,
      transaction_id: razorpay_payment_id,
    });
  } catch (err) {
    console.error('Payment verify error:', err);
    res.status(500).json({ success: false, message: 'Payment verification failed.' });
  }
});

// POST /api/payment/process — legacy / cash-on-pickup flow (kept for backward compat)
router.post('/process', authenticate, (req, res) => {
  try {
    const { order_id, payment_method } = req.body;
    if (!order_id) return res.status(400).json({ success: false, message: 'order_id is required.' });

    const db = getDb();
    const order = db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?')
      .get(order_id, req.user.id);

    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (order.payment_status === 'paid') {
      return res.json({ success: true, message: 'Already processed.', transaction_id: order.transaction_id });
    }

    const transaction_id = 'CASH_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6).toUpperCase();
    db.prepare(`
      UPDATE orders SET payment_status = 'paid', order_status = 'preparing', transaction_id = ? WHERE id = ?
    `).run(transaction_id, order_id);

    res.json({
      success: true,
      message: 'Order confirmed for Cash on Pickup!',
      transaction_id,
      order_id,
      estimated_time: '10–15 minutes',
    });
  } catch (err) {
    console.error('Payment process error:', err);
    res.status(500).json({ success: false, message: 'Payment processing failed.' });
  }
});

module.exports = router;
