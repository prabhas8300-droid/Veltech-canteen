/* ==========================================================
   cart.js — Cart Page JavaScript
   Veltech Annapurna Canteen & Mini Store
   ========================================================== */

let cartData = [];

async function loadCart() {
  if (!requireAuth()) return;
  const listEl = document.getElementById('cartItemsList');
  if (!listEl) return;

  try {
    const res  = await fetchWithAuth('/api/cart');
    const data = await res.json();

    if (!data.success) {
      listEl.innerHTML = `<p style="color:#ef4444;text-align:center;padding:2rem;">Could not load cart. Please refresh.</p>`;
      return;
    }

    cartData = data.items || [];
    renderCart();
  } catch {
    listEl.innerHTML = `<p style="color:#ef4444;text-align:center;padding:2rem;">Network error. Please refresh.</p>`;
  }
}

function renderCart() {
  const listEl  = document.getElementById('cartItemsList');
  const countEl = document.getElementById('cartItemCountLabel');
  const totalEl = document.getElementById('totalVal');
  const subtotalEl = document.getElementById('subtotalVal');
  const taxEl   = document.getElementById('taxVal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const clearBtn    = document.getElementById('clearCartBtn');

  if (!listEl) return;

  if (cartData.length === 0) {
    if (checkoutBtn) checkoutBtn.disabled = true;
    if (clearBtn)    clearBtn.style.display = 'none';
    listEl.innerHTML = `
      <div class="empty-cart">
        <span class="empty-icon">🛒</span>
        <h3 style="font-size:1.2rem;font-weight:700;color:#1A1A2E;margin-bottom:0.5rem;">Your cart is empty</h3>
        <p style="color:#6B7280;margin-bottom:1.5rem;">Add some delicious food or stationery to get started!</p>
        <a href="/menu.html" class="btn btn-primary"><i class="fas fa-utensils"></i> Browse Menu & Store</a>
      </div>
    `;
    updateTotals(0);
    if (countEl) countEl.textContent = '';
    return;
  }

  if (checkoutBtn) checkoutBtn.disabled = false;
  if (clearBtn)    clearBtn.style.display = '';
  if (countEl)     countEl.textContent = `(${cartData.length} item${cartData.length > 1 ? 's' : ''})`;

  listEl.innerHTML = cartData.map((item, i) => `
    <div class="cart-item-row reveal" id="cart-row-${item.food_item_id}" style="animation-delay:${i*0.06}s">
      <img class="cart-item-img" 
           src="${item.image_url || 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&q=80'}"
           alt="${item.name}"
           onerror="this.src='https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&q=80'" />
      <div class="cart-item-info">
        <div class="cart-item-cat">${item.category || ''}</div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price} each</div>
      </div>
      <div class="cart-item-actions">
        <button class="qty-btn" onclick="updateQty(${item.food_item_id}, ${item.quantity - 1})">−</button>
        <span style="font-weight:700;min-width:24px;text-align:center;" id="qty-label-${item.food_item_id}">${item.quantity}</span>
        <button class="qty-btn" onclick="updateQty(${item.food_item_id}, ${item.quantity + 1})">+</button>
      </div>
      <div class="cart-item-total" id="item-total-${item.food_item_id}">₹${(item.price * item.quantity).toFixed(2)}</div>
      <button class="remove-btn" onclick="removeItem(${item.food_item_id})" title="Remove item">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>
  `).join('');

  const subtotal = cartData.reduce((s, i) => s + i.price * i.quantity, 0);
  updateTotals(subtotal);
  setTimeout(reInitScrollReveal, 80);
}

function updateTotals(subtotal) {
  const tax   = subtotal * 0.05;
  const total = subtotal + tax;
  const sub   = document.getElementById('subtotalVal');
  const taxEl = document.getElementById('taxVal');
  const totEl = document.getElementById('totalVal');
  if (sub)   { sub.textContent   = `₹${subtotal.toFixed(2)}`; sub.classList.add('total-updated'); setTimeout(()=>sub.classList.remove('total-updated'),500); }
  if (taxEl) { taxEl.textContent = `₹${tax.toFixed(2)}`; }
  if (totEl) { totEl.textContent = `₹${total.toFixed(2)}`; totEl.classList.add('total-updated'); setTimeout(()=>totEl.classList.remove('total-updated'),500); }
}

async function updateQty(foodItemId, newQty) {
  if (newQty <= 0) { removeItem(foodItemId); return; }
  try {
    const res  = await fetchWithAuth('/api/cart/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ food_item_id: foodItemId, quantity: newQty })
    });
    const data = await res.json();
    if (data.success) {
      const item = cartData.find(i => i.food_item_id === foodItemId);
      if (item) {
        item.quantity = newQty;
        const ql = document.getElementById('qty-label-' + foodItemId);
        const tl = document.getElementById('item-total-' + foodItemId);
        if (ql) { ql.style.transform='scale(1.5)'; ql.textContent=newQty; setTimeout(()=>ql.style.transform='',200); }
        if (tl) tl.textContent = `₹${(item.price * newQty).toFixed(2)}`;
        const subtotal = cartData.reduce((s, i) => s + i.price * i.quantity, 0);
        updateTotals(subtotal);
        updateCartBadge();
      }
    }
  } catch { showToast('Could not update quantity', 'error'); }
}

async function removeItem(foodItemId) {
  const row = document.getElementById('cart-row-' + foodItemId);
  if (row) {
    row.classList.add('cart-item-removing');
    await new Promise(r => setTimeout(r, 350));
  }
  try {
    const res  = await fetchWithAuth(`/api/cart/remove/${foodItemId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      cartData = cartData.filter(i => i.food_item_id !== foodItemId);
      renderCart();
      updateCartBadge();
      showToast('Item removed from cart', 'info');
    }
  } catch { showToast('Could not remove item', 'error'); }
}

async function clearCart() {
  if (!confirm('Remove all items from your cart?')) return;
  try {
    const res  = await fetchWithAuth('/api/cart/clear', { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      cartData = [];
      renderCart();
      updateCartBadge();
      showToast('Cart cleared', 'info');
    }
  } catch { showToast('Could not clear cart', 'error'); }
}

function goToCheckout() {
  if (cartData.length === 0) { showToast('Your cart is empty!', 'warning'); return; }
  window.location.href = '/checkout.html';
}

document.addEventListener('DOMContentLoaded', loadCart);
