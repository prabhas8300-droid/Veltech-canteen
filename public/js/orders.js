// ==========================================
// Annapurna Canteen - orders.js
// My Orders & Live Order Tracking
// ==========================================

let myOrders = [];
let activeFilter = 'all';
let autoRefreshTimer = null;

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  initHamburger();
  setActiveNavLink();
  updateCartBadge();
  loadMyOrders();

  // Poll for live status update every 15s if user stays on page
  autoRefreshTimer = setInterval(() => {
    const hasActive = myOrders.some(o => ['pending', 'preparing', 'ready'].includes(o.order_status));
    if (hasActive) {
      loadMyOrders(false);
    }
  }, 15000);
});

async function loadMyOrders(showNotification = false) {
  const refreshIcon = document.getElementById('refreshIcon');
  if (refreshIcon) refreshIcon.classList.add('fa-spin');

  try {
    const res = await fetchWithAuth('/api/orders/my');
    if (!res) return;
    const data = await res.json();

    if (data.success) {
      myOrders = data.orders || [];
      renderOrders();
      if (showNotification) {
        showToast('Orders refreshed with latest status!', 'info');
      }
    } else {
      document.getElementById('ordersContainer').innerHTML = `
        <div class="empty-state">
          <i class="fas fa-exclamation-triangle" style="color:#EF4444;"></i>
          <h3>Failed to load orders</h3>
          <p>${data.message || 'Please try again later'}</p>
        </div>
      `;
    }
  } catch (err) {
    document.getElementById('ordersContainer').innerHTML = `
      <div class="empty-state">
        <i class="fas fa-wifi" style="color:#EF4444;"></i>
        <h3>Connection Error</h3>
        <p>Could not connect to Annapurna Canteen server.</p>
      </div>
    `;
  } finally {
    if (refreshIcon) refreshIcon.classList.remove('fa-spin');
  }
}

function setOrdersFilter(filter, btn) {
  activeFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderOrders();
}

function renderOrders() {
  const container = document.getElementById('ordersContainer');
  let list = myOrders;

  if (activeFilter === 'active') {
    list = myOrders.filter(o => ['pending', 'preparing', 'ready'].includes(o.order_status));
  } else if (activeFilter === 'completed') {
    list = myOrders.filter(o => ['completed', 'cancelled'].includes(o.order_status));
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="background:white;padding:3rem 1.5rem;border-radius:16px;box-shadow:var(--shadow);">
        <div style="font-size:3.5rem;margin-bottom:1rem;">🍽️</div>
        <h3>${activeFilter === 'all' ? 'No orders placed yet' : 'No ' + activeFilter + ' orders'}</h3>
        <p style="color:var(--text-gray);margin-bottom:1.5rem;">Explore our fresh South Indian meals, snacks, and juices!</p>
        <a href="/menu.html" class="btn btn-primary">
          <i class="fas fa-utensils"></i> Browse Food Menu
        </a>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(order => buildOrderCard(order)).join('');
}

function buildOrderCard(order) {
  const token = `#TK-${1000 + order.id}`;
  const statusClass = `status-${order.order_status.toLowerCase()}`;
  const formattedDate = formatDateTime(order.order_date);

  // Stepper Calculation
  // 1: Pending (Placed)
  // 2: Preparing
  // 3: Ready
  // 4: Completed
  let stepIndex = 1;
  let progressWidth = '0%';
  if (order.order_status === 'preparing') {
    stepIndex = 2;
    progressWidth = '33%';
  } else if (order.order_status === 'ready') {
    stepIndex = 3;
    progressWidth = '66%';
  } else if (order.order_status === 'completed') {
    stepIndex = 4;
    progressWidth = '100%';
  }

  const items = order.items || [];
  const subtotal = items.reduce((sum, it) => sum + it.food_price * it.quantity, 0);

  return `
    <div class="order-card fade-in">
      <div class="order-card-header">
        <div class="order-id-group">
          <span class="token-badge">${token}</span>
          <div class="order-meta">
            <div>Order ID: <strong>#VT-${order.id}</strong></div>
            <div>${formattedDate}</div>
          </div>
        </div>
        <div class="status-pill ${statusClass}">
          ${getStatusIcon(order.order_status)} ${order.order_status}
        </div>
      </div>

      <!-- Stepper only for active / normal flows -->
      ${order.order_status !== 'cancelled' ? `
      <div class="stepper-container">
        <div class="stepper">
          <div class="stepper-progress" style="width: ${progressWidth};"></div>
          
          <div class="step-node ${stepIndex >= 1 ? (stepIndex > 1 ? 'done' : 'active') : ''}">
            <div class="step-circle">${stepIndex > 1 ? '<i class="fas fa-check"></i>' : '1'}</div>
            <div class="step-label">Placed</div>
          </div>

          <div class="step-node ${stepIndex >= 2 ? (stepIndex > 2 ? 'done' : 'active') : ''}">
            <div class="step-circle">${stepIndex > 2 ? '<i class="fas fa-check"></i>' : '2'}</div>
            <div class="step-label">Preparing</div>
          </div>

          <div class="step-node ${stepIndex >= 3 ? (stepIndex > 3 ? 'done' : 'active') : ''}">
            <div class="step-circle">${stepIndex > 3 ? '<i class="fas fa-check"></i>' : '3'}</div>
            <div class="step-label">Ready!</div>
          </div>

          <div class="step-node ${stepIndex >= 4 ? 'done' : ''}">
            <div class="step-circle">${stepIndex >= 4 ? '<i class="fas fa-check"></i>' : '4'}</div>
            <div class="step-label">Completed</div>
          </div>
        </div>
      </div>
      ` : ''}

      <div class="order-items-list">
        ${items.map((it, idx) => `
          <div class="order-item-row">
            <div class="order-item-left">
              <span class="item-bullet">${idx + 1}</span>
              <div>
                <div class="item-title">${it.food_name}</div>
                <div class="item-calc">₹${it.food_price} &times; ${it.quantity}</div>
              </div>
            </div>
            <div class="item-total">₹${(it.food_price * it.quantity).toFixed(2)}</div>
          </div>
        `).join('')}
      </div>

      <div class="order-card-footer">
        <div class="order-summary-tags">
          <div><i class="fas fa-money-check-alt" style="color:var(--primary);margin-right:4px;"></i> ${order.payment_method}</div>
          <div><i class="fas fa-receipt" style="color:var(--green-light);margin-right:4px;"></i> Total: <strong style="color:var(--text-dark);font-size:0.95rem;">₹${Number(order.total_amount).toFixed(2)}</strong></div>
        </div>

        <div class="order-actions">
          <button class="btn-receipt" onclick="viewReceipt(${order.id})">
            <i class="fas fa-file-invoice"></i> View Bill
          </button>
          <button class="btn btn-primary btn-sm" onclick="reorderItems(${order.id})">
            <i class="fas fa-redo"></i> Order Again
          </button>
        </div>
      </div>
    </div>
  `;
}

function getStatusIcon(status) {
  switch (status.toLowerCase()) {
    case 'pending': return '<i class="fas fa-clock"></i>';
    case 'preparing': return '<i class="fas fa-fire"></i>';
    case 'ready': return '<i class="fas fa-bell"></i>';
    case 'completed': return '<i class="fas fa-check-circle"></i>';
    case 'cancelled': return '<i class="fas fa-times-circle"></i>';
    default: return '<i class="fas fa-info-circle"></i>';
  }
}

// Receipt Modal View
function viewReceipt(orderId) {
  const order = myOrders.find(o => o.id === orderId);
  if (!order) return;
  const user = getUser();

  document.getElementById('receiptTokenVal').textContent = `#TK-${1000 + order.id}`;
  document.getElementById('receiptStudent').textContent = user ? user.name : 'Student';
  document.getElementById('receiptMobile').textContent = user ? user.mobile : 'N/A';
  document.getElementById('receiptDate').textContent = formatDateTime(order.order_date);
  document.getElementById('receiptPay').textContent = `${order.payment_method} (${order.payment_status.toUpperCase()})`;

  const items = order.items || [];
  const subtotal = items.reduce((s, it) => s + it.food_price * it.quantity, 0);
  const tax = subtotal * 0.05;

  document.getElementById('receiptTableBody').innerHTML = items.map(it => `
    <tr>
      <td>${it.food_name}</td>
      <td style="text-align:center;">${it.quantity}</td>
      <td>₹${(it.food_price * it.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  document.getElementById('receiptSubtotal').textContent = `₹${subtotal.toFixed(2)}`;
  document.getElementById('receiptTax').textContent = `₹${tax.toFixed(2)}`;
  document.getElementById('receiptTotal').textContent = `₹${Number(order.total_amount).toFixed(2)}`;

  document.getElementById('receiptModal').classList.add('open');
}

function closeReceiptModal() {
  document.getElementById('receiptModal').classList.remove('open');
}

document.getElementById('receiptModal').addEventListener('click', function(e) {
  if (e.target === this) closeReceiptModal();
});

// Re-order items
async function reorderItems(orderId) {
  const order = myOrders.find(o => o.id === orderId);
  if (!order || !order.items) return;

  showToast('Adding items to your cart...', 'info');

  try {
    for (const item of order.items) {
      await fetchWithAuth('/api/cart/add', {
        method: 'POST',
        body: JSON.stringify({ food_item_id: item.food_item_id, quantity: item.quantity })
      });
    }
    updateCartBadge();
    showToast('Items added to cart! Redirecting...', 'success');
    setTimeout(() => {
      window.location.href = '/cart.html';
    }, 700);
  } catch (err) {
    showToast('Failed to add some items.', 'error');
  }
}
