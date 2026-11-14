/* ==========================================================
   checkout.js — Checkout Page Logic & Payment Verification
   Veltech Annapurna Canteen & Mini Store
   ========================================================== */

let checkoutCart = [];
let selectedFulfillment = 'pickup';
let selectedPaymentMethod = 'UPI';

const PAYMENT_METHODS = [
  { id: 'UPI',       name: 'UPI (GPay / PhonePe)', icon: '📱', detailId: 'payDetailUPI' },
  { id: 'Razorpay',  name: 'Cards & NetBanking',   icon: '💳', detailId: 'payDetailRazorpay' },
  { id: 'Cash',      name: 'Cash on Pickup',       icon: '💵', detailId: 'payDetailCash' },
];

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  populateUserInfo();
  renderPaymentMethods();
  loadCheckoutCart();
});

// ── Pre-fill user contact info ──────────────────────────────
function populateUserInfo() {
  const user = getUser();
  if (!user) return;
  const nameEl   = document.getElementById('custName');
  const mobileEl = document.getElementById('custMobile');
  const emailEl  = document.getElementById('custEmail');

  if (nameEl && !nameEl.value)     nameEl.value   = user.name || '';
  if (mobileEl && !mobileEl.value) mobileEl.value = user.mobile || '';
  if (emailEl && !emailEl.value)   emailEl.value  = user.email || '';
}

// ── Select Pickup vs Campus Delivery ────────────────────────
function selectFulfillment(mode) {
  selectedFulfillment = mode;
  document.getElementById('optPickup')?.classList.toggle('selected', mode === 'pickup');
  document.getElementById('optDelivery')?.classList.toggle('selected', mode === 'delivery');

  const addrGroup = document.getElementById('deliveryAddressGroup');
  if (addrGroup) {
    addrGroup.style.display = mode === 'delivery' ? 'block' : 'none';
  }
}

// ── Load cart items for checkout preview ────────────────────
async function loadCheckoutCart() {
  const container = document.getElementById('orderItemsList');
  const btn = document.getElementById('confirmOrderBtn');

  try {
    const res  = await fetchWithAuth('/api/cart');
    const data = await res.json();
    checkoutCart = data.items || [];

    if (checkoutCart.length === 0) {
      if (container) {
        container.innerHTML = `
          <div style="text-align:center;padding:2rem 1rem;color:#6B7280;">
            <p style="font-size:1.1rem;font-weight:600;margin-bottom:0.5rem;">Your shopping cart is empty</p>
            <a href="/menu.html" class="btn btn-primary" style="margin-top:0.5rem;">Browse Menu & Store</a>
          </div>
        `;
      }
      if (btn) btn.disabled = true;
      updateTotalsDisplay(0);
      return;
    }

    if (btn) btn.disabled = false;
    renderCheckoutItems();
  } catch {
    if (container) container.innerHTML = `<p style="color:#EF4444;text-align:center;padding:1.5rem;">Could not load cart items.</p>`;
  }
}

function renderCheckoutItems() {
  const container = document.getElementById('orderItemsList');
  if (!container) return;

  container.innerHTML = checkoutCart.map(item => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem 0;border-bottom:1px solid #F3F4F6;">
      <div style="display:flex;align-items:center;gap:0.8rem;">
        <img src="${item.image_url || 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&q=80'}"
             alt="${item.name}"
             style="width:48px;height:48px;border-radius:10px;object-fit:cover;"
             onerror="this.src='https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&q=80'" />
        <div>
          <div style="font-size:0.88rem;font-weight:700;color:#1A1A2E;">${item.name}</div>
          <div style="font-size:0.75rem;color:#6B7280;">₹${item.price} × ${item.quantity}</div>
        </div>
      </div>
      <div style="font-size:0.95rem;font-weight:800;color:#FF6B35;">₹${(item.price * item.quantity).toFixed(2)}</div>
    </div>
  `).join('');

  const subtotal = checkoutCart.reduce((s, i) => s + i.price * i.quantity, 0);
  updateTotalsDisplay(subtotal);
}

function updateTotalsDisplay(subtotal) {
  const tax   = subtotal * 0.05;
  const total = subtotal + tax;

  const subEl = document.getElementById('subtotalLabel');
  const taxEl = document.getElementById('taxLabel');
  const totEl = document.getElementById('totalPayableLabel');

  if (subEl) subEl.textContent = `₹${subtotal.toFixed(2)}`;
  if (taxEl) taxEl.textContent = `₹${tax.toFixed(2)}`;
  if (totEl) totEl.textContent = `₹${total.toFixed(2)}`;
}

// ── Payment methods rendering ───────────────────────────────
function renderPaymentMethods() {
  const grid = document.getElementById('paymentMethodsGrid');
  if (!grid) return;

  grid.innerHTML = PAYMENT_METHODS.map(m => `
    <div class="payment-method-card ${m.id === selectedPaymentMethod ? 'selected' : ''}"
         onclick="switchPaymentMethod('${m.id}', '${m.detailId}', this)">
      <input type="radio" name="payMethodRadio" value="${m.id}" ${m.id === selectedPaymentMethod ? 'checked' : ''} />
      <span style="font-size:1.3rem;">${m.icon}</span>
      <span style="font-size:0.82rem;font-weight:700;color:#1A1A2E;">${m.name}</span>
    </div>
  `).join('');

  showPaymentDetail('payDetailUPI');
}

function switchPaymentMethod(methodId, detailId, cardEl) {
  selectedPaymentMethod = methodId;
  document.querySelectorAll('.payment-method-card').forEach(c => c.classList.remove('selected'));
  if (cardEl) {
    cardEl.classList.add('selected');
    const radio = cardEl.querySelector('input[type=radio]');
    if (radio) radio.checked = true;
  }

  document.querySelectorAll('.payment-detail').forEach(d => d.classList.remove('show'));
  showPaymentDetail(detailId);
}

function showPaymentDetail(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('show');
}

// ── Input formating helpers ─────────────────────────────────
function formatCardInput(input) {
  let val = input.value.replace(/\D/g, '').substr(0, 16);
  input.value = val.replace(/(\d{4})/g, '$1 ').trim();
}

function formatExpiryInput(input) {
  let val = input.value.replace(/\D/g, '').substr(0, 4);
  if (val.length > 2) val = val.substr(0, 2) + '/' + val.substr(2);
  input.value = val;
}

// ── Validation ──────────────────────────────────────────────
function validateCheckoutInputs() {
  const name   = document.getElementById('custName')?.value.trim();
  const mobile = document.getElementById('custMobile')?.value.trim();
  const email  = document.getElementById('custEmail')?.value.trim();

  if (!name || name.length < 2) {
    showToast('Please enter your full name.', 'error');
    return false;
  }
  if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
    showToast('Please enter a valid 10-digit mobile number.', 'error');
    return false;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('Please enter a valid email address.', 'error');
    return false;
  }

  if (selectedFulfillment === 'delivery') {
    const loc = document.getElementById('deliveryLocation')?.value.trim();
    if (!loc) {
      showToast('Please enter your campus block / room delivery address.', 'error');
      return false;
    }
  }

  if (selectedPaymentMethod === 'UPI') {
    const upi = document.getElementById('upiVpaInput')?.value.trim();
    if (upi && !upi.includes('@')) {
      showToast('Please enter a valid UPI ID (e.g. name@okhdfcbank).', 'error');
      return false;
    }
  }

  return true;
}

// ── Place Order & Execute Payment ───────────────────────────
async function processCheckout() {
  if (checkoutCart.length === 0) {
    showToast('Your cart is empty!', 'warning');
    return;
  }

  if (!validateCheckoutInputs()) return;

  const btn = document.getElementById('confirmOrderBtn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Payment...';
  }

  const notes = document.getElementById('specialNotes')?.value.trim() || '';
  const deliveryLocation = selectedFulfillment === 'delivery'
    ? document.getElementById('deliveryLocation')?.value.trim()
    : 'Annapurna Canteen Counter Pickup';

  try {
    // 1. Place Order in Backend Database
    const orderRes = await fetchWithAuth('/api/orders/place', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payment_method: selectedPaymentMethod,
        notes,
        delivery_type: selectedFulfillment,
        delivery_location: deliveryLocation
      })
    });
    const orderData = await orderRes.json();

    if (!orderData.success) {
      triggerPaymentFailure(orderData.message || 'Could not place order.');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-lock"></i> Place Order & Pay';
      }
      return;
    }

    const orderId = orderData.orderId;

    // 2. Process Secure Payment Verification
    const payRes = await fetchWithAuth('/api/payment/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: orderId,
        payment_method: selectedPaymentMethod
      })
    });
    const payData = await payRes.json();

    if (!payData.success) {
      triggerPaymentFailure(payData.message || 'Payment verification failed.');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-lock"></i> Place Order & Pay';
      }
      return;
    }

    // 3. Payment Success!
    triggerPaymentSuccess(payData, orderId);
    updateCartBadge();

  } catch (err) {
    triggerPaymentFailure('Network connection error. Please try again.');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-lock"></i> Place Order & Pay';
    }
  }
}

function triggerPaymentSuccess(payData, orderId) {
  const subtotal = checkoutCart.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = (subtotal * 1.05).toFixed(2);
  const custName = document.getElementById('custName')?.value.trim() || 'Student';

  const detailsEl = document.getElementById('successDetails');
  if (detailsEl) {
    detailsEl.innerHTML = `
      <p>📋 <strong>Order ID:</strong> #VT-${orderId}</p>
      <p>💳 <strong>Transaction ID:</strong> ${payData.transaction_id || ('TXN_' + Date.now())}</p>
      <p>👤 <strong>Customer:</strong> ${custName}</p>
      <p>💰 <strong>Total Amount Paid:</strong> ₹${total}</p>
      <p>⚡ <strong>Payment Method:</strong> ${selectedPaymentMethod}</p>
      <p>📍 <strong>Fulfillment:</strong> ${selectedFulfillment === 'delivery' ? 'Campus Delivery' : 'Counter Pickup'}</p>
      <p>⏱️ <strong>Estimated Time:</strong> ${payData.estimated_time || '10–15 Minutes'}</p>
    `;
  }

  document.getElementById('successModal')?.classList.add('show');
}

function triggerPaymentFailure(reason) {
  const reasonEl = document.getElementById('failureReason');
  if (reasonEl) reasonEl.textContent = reason;
  document.getElementById('failureModal')?.classList.add('show');
}

function closeFailureModal() {
  document.getElementById('failureModal')?.classList.remove('show');
}
