// ===========================
// Annapurna Canteen - auth.js
// Shared auth utilities
// ===========================

const TOKEN_KEY = 'annapurna_token';
const USER_KEY = 'annapurna_user';

// Get token from localStorage
function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// Get user from localStorage
function getUser() {
  try {
    const u = localStorage.getItem(USER_KEY);
    return u ? JSON.parse(u) : null;
  } catch { return null; }
}

// Save auth data
function saveAuth(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// Clear auth data
function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// Check if logged in (redirect to login if not)
function requireAuth() {
  const token = getToken();
  if (!token) {
    window.location.href = '/index.html';
    return false;
  }
  return true;
}

// Check if admin (redirect if not)
function requireAdmin() {
  const user = getUser();
  if (!user || user.role !== 'admin') {
    window.location.href = '/admin/login.html';
    return false;
  }
  return true;
}

// Redirect if already logged in
function redirectIfLoggedIn(dest = '/home.html') {
  if (getToken() && getUser()) {
    const user = getUser();
    if (user.role === 'admin') {
      window.location.href = '/admin/dashboard.html';
    } else {
      window.location.href = dest;
    }
  }
}

// Logout
function logout() {
  clearAuth();
  window.location.href = '/index.html';
}

// Fetch wrapper with auth header
async function fetchWithAuth(url, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) headers['Authorization'] = 'Bearer ' + token;

  const res = await fetch(url, { ...options, headers });
  if (res.status === 401) {
    clearAuth();
    window.location.href = '/index.html';
    return;
  }
  return res;
}

// ============================================================
// ENHANCED TOAST NOTIFICATION SYSTEM
// ============================================================
function showToast(message, type = 'success') {
  // Remove old toast container approach, use new styled toasts
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const colors = { success: '#10b981', error: '#ef4444', info: '#3b82f6', warning: '#f59e0b' };
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };

  const toast = document.createElement('div');
  toast.style.cssText = `
    background: ${colors[type] || colors.success}; color: white;
    padding: 12px 20px; border-radius: 12px; font-size: 0.88rem; font-weight: 600;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2); max-width: 320px;
    display: flex; align-items: center; gap: 8px;
    font-family: 'Poppins', sans-serif; min-width: 220px;
  `;
  toast.innerHTML = `${icons[type] || '✅'} ${message}`;
  toast.classList.add('toast-notification');
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('leaving');
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 350);
  }, 3200);
}

// Format price in Indian Rupees
function formatPrice(amount) {
  return '₹' + Number(amount).toFixed(2);
}

// Format date/time
function formatDateTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

// Format date only
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Update cart badge in navbar
async function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  try {
    const res = await fetchWithAuth('/api/cart');
    if (res && res.ok) {
      const data = await res.json();
      const count = data.items ? data.items.reduce((s, i) => s + i.quantity, 0) : 0;
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
      if (count > 0) {
        badge.classList.add('cart-badge-new');
        setTimeout(() => badge.classList.remove('cart-badge-new'), 400);
      }
    }
  } catch (e) {
    if (badge) badge.style.display = 'none';
  }
}

// Set active navbar link
function setActiveNavLink() {
  const path = window.location.pathname;
  document.querySelectorAll('.navbar-links a').forEach(a => {
    if (a.getAttribute('href') && path.endsWith(a.getAttribute('href').replace('/', ''))) {
      a.classList.add('active');
    }
  });
}

// Navbar hamburger toggle
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });
  }
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    if (window.scrollY > 10) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
});

// Populate user name in welcome message
function populateUserName() {
  const user = getUser();
  if (!user) return;
  document.querySelectorAll('.user-name').forEach(el => { el.textContent = user.name; });
}

// ============================================================
// SCROLL REVEAL ANIMATION (IntersectionObserver)
// ============================================================
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal, .food-card, .category-card, .slide-up').forEach(el => observer.observe(el));
}
document.addEventListener('DOMContentLoaded', initScrollReveal);

// Legacy scroll animations
function initScrollAnimations() {
  initScrollReveal();
}

// ============================================================
// GOLD FLASH EFFECT SYSTEM
// ============================================================
function triggerGoldFlash(btnElement) {
  if (!btnElement) return;

  // 1. Button Gold Flash & Aura
  btnElement.classList.remove('btn-gold-flash');
  void btnElement.offsetWidth; // trigger reflow
  btnElement.classList.add('btn-gold-flash');
  setTimeout(() => {
    btnElement.classList.remove('btn-gold-flash');
  }, 850);

  // 2. Gold Expanding Shockwave Ring
  const rect = btnElement.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const ring = document.createElement('div');
  ring.className = 'gold-flash-ring';
  ring.style.left = `${centerX}px`;
  ring.style.top = `${centerY}px`;
  const ringSize = Math.max(rect.width, rect.height, 40);
  ring.style.width = `${ringSize}px`;
  ring.style.height = `${ringSize}px`;
  document.body.appendChild(ring);
  setTimeout(() => ring.remove(), 700);

  // 3. Floating Gold Sparkles
  const sparkleSymbols = ['✨', '⭐', '✦', '⚡', '🌟'];
  for (let i = 0; i < 8; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'gold-sparkle';
    sparkle.textContent = sparkleSymbols[Math.floor(Math.random() * sparkleSymbols.length)];
    sparkle.style.fontSize = `${Math.floor(Math.random() * 12 + 14)}px`;
    sparkle.style.left = `${centerX}px`;
    sparkle.style.top = `${centerY}px`;

    const angle = (i / 8) * (2 * Math.PI) + (Math.random() * 0.4 - 0.2);
    const dist = Math.random() * 60 + 40;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    const rot = (Math.random() * 180 - 90) + 'deg';

    sparkle.style.setProperty('--tx', `${tx}px`);
    sparkle.style.setProperty('--ty', `${ty}px`);
    sparkle.style.setProperty('--rot', rot);

    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
  }
}

// ============================================================
// CART FLY ANIMATION
// ============================================================
function animateCartFly(btnElement, imgSrc, itemId) {
  const cartIcon = document.getElementById('cartBadge') || document.querySelector('.cart-link') || document.querySelector('.cart-toggle-btn');
  if (!cartIcon || !btnElement) return;

  const btnRect = btnElement.getBoundingClientRect();
  const cartRect = cartIcon.getBoundingClientRect();

  const flyImg = document.createElement('img');
  flyImg.className = 'fly-bubble';
  flyImg.src = imgSrc || 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100&q=80';
  flyImg.style.cssText = `
    position: fixed;
    left: ${btnRect.left + btnRect.width / 2 - 30}px;
    top: ${btnRect.top + btnRect.height / 2 - 30}px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    pointer-events: none;
    z-index: 99999;
    border: 3.5px solid #FFD700;
    box-shadow: 0 0 25px rgba(255, 215, 0, 0.95), 0 0 50px rgba(255, 180, 0, 0.65);
    transition: none;
  `;
  document.body.appendChild(flyImg);

  const dx = cartRect.left - btnRect.left - btnRect.width / 2 + 30;
  const dy = cartRect.top - btnRect.top - btnRect.height / 2 + 30;

  flyImg.animate([
    { transform: 'scale(1) translate(0, 0)', opacity: 1 },
    { transform: `scale(0.55) translate(${dx * 0.5}px, ${dy * 0.5}px)`, opacity: 0.95, offset: 0.4 },
    { transform: `scale(0.1) translate(${dx}px, ${dy}px)`, opacity: 0 }
  ], {
    duration: 700,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    fill: 'forwards'
  }).onfinish = () => {
    flyImg.remove();
    // Bounce cart icon with Gold Halo Flash
    const cartEl = document.querySelector('.cart-link') || document.querySelector('.cart-toggle-btn') || document.getElementById('cartBadge');
    if (cartEl) {
      cartEl.classList.add('cart-bounce');
      cartEl.classList.add('cart-gold-flash');
      setTimeout(() => {
        cartEl.classList.remove('cart-bounce');
        cartEl.classList.remove('cart-gold-flash');
      }, 700);
    }
    updateCartBadge();
  };
}

// Global in-memory dictionary for clean item modal access
window.canteenItems = window.canteenItems || {};

function openProductModalById(id) {
  const item = (window.canteenItems && window.canteenItems[id]) || (typeof allItems !== 'undefined' && allItems.find(i => i.id === id));
  if (item) openProductModal(item);
}

function reInitScrollReveal() {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

// ============================================================
// ADD TO CART (Enhanced with gold flash animation)
// ============================================================
async function addToCartAnimated(foodItemId, imgSrc, btnEl) {
  if (!getToken()) {
    showToast('Please log in to add items to your cart! 🔑', 'info');
    setTimeout(() => { window.location.href = '/index.html'; }, 1000);
    return;
  }

  // Trigger instant Gold Flash effect on button
  if (btnEl) {
    triggerGoldFlash(btnEl);
  }

  try {
    if (btnEl) {
      btnEl.disabled = true;
      btnEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    }

    // Fly animation with Gold Aura
    if (btnEl) animateCartFly(btnEl, imgSrc, foodItemId);

    // Get qty from selector
    const qtyEl = document.getElementById('qty-' + foodItemId);
    const quantity = qtyEl ? parseInt(qtyEl.textContent) || 1 : 1;

    const res = await fetchWithAuth('/api/cart/add', {
      method: 'POST',
      body: JSON.stringify({ food_item_id: foodItemId, quantity })
    });
    const data = await res.json();
    if (data.success) {
      showToast('Added to cart! 🛒', 'success');
      if (btnEl) {
        btnEl.classList.add('btn-added');
        btnEl.innerHTML = '<i class="fas fa-check"></i> Added!';
        setTimeout(() => {
          btnEl.classList.remove('btn-added');
          btnEl.innerHTML = '<i class="fas fa-cart-plus"></i> Add';
          btnEl.disabled = false;
          btnEl.style.background = '';
        }, 1500);
      }
    } else {
      showToast(data.message || 'Could not add to cart.', 'error');
      if (btnEl) { btnEl.disabled = false; btnEl.innerHTML = '<i class="fas fa-cart-plus"></i> Add'; }
    }
  } catch (e) {
    showToast('Network error. Please try again.', 'error');
    if (btnEl) { btnEl.disabled = false; btnEl.innerHTML = '<i class="fas fa-cart-plus"></i> Add'; }
  }
}

// Legacy addToCart
async function addToCart(foodItemId, quantity = 1, btnEl = null) {
  return addToCartAnimated(foodItemId, null, btnEl);
}

// ============================================================
// PRODUCT MODAL
// ============================================================
let currentModalItem = null;
let currentModalQty = 1;

function openProductModal(item) {
  if (typeof item === 'string') {
    try { item = JSON.parse(item); } catch(e) { return; }
  }
  currentModalItem = item;
  currentModalQty = 1;

  const modal = document.getElementById('productModal');
  if (!modal) return;

  const imgEl = document.getElementById('modalImg');
  const catEl = document.getElementById('modalCategory');
  const nameEl = document.getElementById('modalName');
  const descEl = document.getElementById('modalDesc');
  const priceEl = document.getElementById('modalPrice');
  const qtyEl = document.getElementById('modalQty');

  if (imgEl) { imgEl.src = item.image_url || '/img/items/default_item.svg'; imgEl.alt = item.name; }
  if (catEl) catEl.textContent = item.category;
  if (nameEl) nameEl.textContent = item.name;
  if (descEl) descEl.textContent = item.description || '';
  if (priceEl) priceEl.textContent = '₹' + item.price;
  if (qtyEl) qtyEl.textContent = '1';

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

function modalQtyChange(delta) {
  currentModalQty = Math.max(1, currentModalQty + delta);
  const qtyEl = document.getElementById('modalQty');
  if (qtyEl) qtyEl.textContent = currentModalQty;
}

async function addFromModal() {
  if (!currentModalItem) return;
  if (!getToken()) {
    showToast('Please log in to add items to your cart! 🔑', 'info');
    setTimeout(() => { window.location.href = '/index.html'; }, 1000);
    return;
  }
  const btn = document.querySelector('#productModal .btn-primary');
  if (btn) {
    triggerGoldFlash(btn);
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
  }

  try {
    const res = await fetchWithAuth('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ food_item_id: currentModalItem.id, quantity: currentModalQty })
    });
    const data = await res.json();
    if (data.success) {
      showToast(`✅ ${currentModalItem.name} added to cart!`, 'success');
      updateCartBadge();
      closeProductModal();
      const cartEl = document.querySelector('.cart-link') || document.querySelector('.cart-toggle-btn') || document.getElementById('cartBadge');
      if (cartEl) {
        cartEl.classList.add('cart-bounce');
        cartEl.classList.add('cart-gold-flash');
        setTimeout(() => {
          cartEl.classList.remove('cart-bounce');
          cartEl.classList.remove('cart-gold-flash');
        }, 700);
      }
    } else {
      showToast(data.message || 'Could not add to cart', 'error');
    }
  } catch(e) {
    showToast('Network error', 'error');
  }

  if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart'; }
}

// ============================================================
// QUANTITY SELECTOR (for cards)
// ============================================================
const _itemQtys = {};
function changeQty(itemId, delta) {
  if (!_itemQtys[itemId]) _itemQtys[itemId] = 1;
  _itemQtys[itemId] = Math.max(1, _itemQtys[itemId] + delta);
  const el = document.getElementById('qty-' + itemId);
  if (el) el.textContent = _itemQtys[itemId];
}

// ============================================================
// BUILD FOOD CARD (Enhanced)
// ============================================================
function buildFoodCard(item) {
  if (!item) return '';
  window.canteenItems[item.id] = item;

  const isStationery = item.dietary_type === 'stationery' || item.item_type === 'stationery' ||
    ['Books','Notebooks','Pens','Pencils','Erasers','Sharpeners','Rulers','Files','Other Stationery'].includes(item.category);

  const dietBadge = isStationery
    ? '<span class="diet-badge stationary" style="background:#8b5cf6;color:white;">✏️ Stationery</span>'
    : item.dietary_type === 'veg'
      ? '<span class="diet-badge veg">🟢 Veg</span>'
      : item.dietary_type === 'non-veg'
        ? '<span class="diet-badge nonveg">🔴 Non-Veg</span>'
        : item.dietary_type === 'egg'
          ? '<span class="diet-badge" style="background:#fef3c7;color:#92400e;">🥚 Egg</span>'
          : '';

  const stars = item.avg_rating
    ? '⭐'.repeat(Math.round(item.avg_rating)) + ` (${item.review_count || 1})`
    : '';

  return `
    <div class="food-card reveal visible" onclick="openProductModalById(${item.id})" style="cursor:pointer;">
      <div class="food-card-img-wrap" style="position:relative;overflow:hidden;height:180px;">
        <img class="food-card-img"
             src="${item.image_url || '/img/items/default_item.svg'}"
             alt="${item.name}"
             loading="lazy"
             onerror="this.src='/img/items/default_item.svg'" />
        ${item.is_special ? '<div class="special-ribbon">⭐ Special</div>' : ''}
        ${dietBadge}
      </div>
      <div class="food-card-body">
        <span class="food-card-category">${item.category}</span>
        <div class="food-card-name">${item.name}</div>
        <div class="food-card-desc">${((item.description || '').substring(0, 65))}${(item.description || '').length > 65 ? '...' : ''}</div>
        ${stars ? `<div style="font-size:0.75rem;color:#f59e0b;margin:4px 0;">${stars}</div>` : ''}
        <div class="food-card-footer">
          <span class="food-price">₹${item.price}</span>
          <div class="qty-controls" onclick="event.stopPropagation()">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
            <span class="qty-display" id="qty-${item.id}">1</span>
            <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
          </div>
          <button class="btn btn-primary btn-sm btn-ripple"
                  id="add-btn-${item.id}"
                  onclick="event.stopPropagation(); addToCartAnimated(${item.id}, '${(item.image_url || '').replace(/'/g, "\\'")}', this)"
                  ${!item.is_available ? 'disabled style="opacity:0.5;"' : ''}>
            ${item.is_available ? '<i class="fas fa-cart-plus"></i> Add' : '⛔ N/A'}
          </button>
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// INTERACTIVE MOUSE MOVE & TOUCH ANIMATION ENGINE
// ============================================================
(function initInteractiveEffects() {
  let lastSparkleTime = 0;
  let lastX = 0;
  let lastY = 0;

  function spawnSparkleAt(x, y, isTouch = false) {
    const now = performance.now();
    const dist = Math.hypot(x - lastX, y - lastY);
    // Throttle: max 1 sparkle every 40ms, and only if moved at least 8px
    if (now - lastSparkleTime < (isTouch ? 50 : 38) || dist < 8) return;
    lastSparkleTime = now;
    lastX = x;
    lastY = y;

    const sparkle = document.createElement('span');
    sparkle.className = 'cursor-gold-sparkle';
    const symbols = ['✨', '✦', '⭐', '💫', '🌟'];
    sparkle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    sparkle.style.fontSize = `${Math.floor(Math.random() * 8 + 11)}px`;
    sparkle.style.setProperty('--dx', `${(Math.random() * 28 - 14).toFixed(1)}px`);
    sparkle.style.setProperty('--dy', `${(Math.random() * 22 + 8).toFixed(1)}px`);
    sparkle.style.setProperty('--rot', `${(Math.random() * 180 - 90).toFixed(0)}deg`);

    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 650);
  }

  // 1. Mouse Move: Sparkle Trail & 3D Perspective Card Tilt
  let currentHoveredCard = null;

  document.addEventListener('mousemove', (e) => {
    // Golden cursor trail
    spawnSparkleAt(e.clientX, e.clientY, false);

    // Dynamic 3D Card Tilt & Radial Spotlight
    const card = e.target.closest('.food-card, .cat-card');
    if (card) {
      if (currentHoveredCard && currentHoveredCard !== card) {
        resetCardTilt(currentHoveredCard);
      }
      currentHoveredCard = card;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Realistic 3D tilt: -7deg to +7deg
      const tiltX = -((y - centerY) / centerY) * 7;
      const tiltY = ((x - centerX) / centerX) * 7;

      card.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
      card.style.setProperty('--spot-x', `${x.toFixed(1)}px`);
      card.style.setProperty('--spot-y', `${y.toFixed(1)}px`);
    } else if (currentHoveredCard) {
      resetCardTilt(currentHoveredCard);
      currentHoveredCard = null;
    }
  }, { passive: true });

  function resetCardTilt(card) {
    if (!card) return;
    card.style.removeProperty('--tilt-x');
    card.style.removeProperty('--tilt-y');
    card.style.removeProperty('--spot-x');
    card.style.removeProperty('--spot-y');
  }

  // 2. Touch Interaction (Mobile / Tablet / Touchscreen)
  document.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    if (!touch) return;

    const card = e.target.closest('.food-card, .cat-card');
    if (card) {
      card.classList.add('touch-active');

      // Golden touch ripple inside card
      const rect = card.getBoundingClientRect();
      const rx = touch.clientX - rect.left;
      const ry = touch.clientY - rect.top;

      const ripple = document.createElement('div');
      ripple.className = 'gold-touch-ripple';
      ripple.style.left = `${rx}px`;
      ripple.style.top = `${ry}px`;
      const size = Math.max(rect.width, rect.height) * 1.5;
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      card.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);

      // Radiate 4 golden sparkles around the touch point
      for (let i = 0; i < 4; i++) {
        const sparkle = document.createElement('span');
        sparkle.className = 'cursor-gold-sparkle';
        sparkle.textContent = ['✨', '⭐', '✦', '🌟'][i % 4];
        sparkle.style.left = `${touch.clientX}px`;
        sparkle.style.top = `${touch.clientY}px`;
        const angle = (i / 4) * Math.PI * 2;
        sparkle.style.setProperty('--dx', `${(Math.cos(angle) * 36).toFixed(1)}px`);
        sparkle.style.setProperty('--dy', `${(Math.sin(angle) * 36).toFixed(1)}px`);
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 650);
      }
    }
  }, { passive: true });

  // Touch Drag: Golden Sparkle Trail
  document.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    if (touch) spawnSparkleAt(touch.clientX, touch.clientY, true);
  }, { passive: true });

  // Touch Release: Settle card back smoothly
  document.addEventListener('touchend', () => {
    document.querySelectorAll('.food-card.touch-active, .cat-card.touch-active').forEach(card => {
      setTimeout(() => card.classList.remove('touch-active'), 280);
    });
  }, { passive: true });

  document.addEventListener('touchcancel', () => {
    document.querySelectorAll('.food-card.touch-active, .cat-card.touch-active').forEach(card => {
      card.classList.remove('touch-active');
    });
  }, { passive: true });
})();
