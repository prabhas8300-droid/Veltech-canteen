/* ==========================================================
   home.js — Homepage JavaScript
   Veltech Annapurna Canteen & Mini Store
   ========================================================== */

// ── Hero Slider ─────────────────────────────────────────────
let currentSlide = 0;

function initHeroSlider() {
  const slidesContainer = document.getElementById('heroSlides');
  const dotsContainer   = document.getElementById('slideDots');
  if (!slidesContainer) return;

  const slides = slidesContainer.querySelectorAll('.hero-slide');
  if (slides.length === 0) return;

  // Build dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
      dot.onclick = () => goToSlide(i);
      dotsContainer.appendChild(dot);
    });
  }

  function goToSlide(idx) {
    slides[currentSlide]?.classList.remove('active');
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.slide-dot') : [];
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
    currentSlide = (idx + slides.length) % slides.length;
    slides[currentSlide]?.classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  }

  setInterval(() => goToSlide(currentSlide + 1), 4500);
}

// ── Category Showcase ───────────────────────────────────────
const CATEGORY_CONFIG = [
  { name: 'Tiffin',      emoji: '🌅', color: '#FF6B35', bg: '#FFF3EC', url: '/menu.html?category=Tiffin' },
  { name: 'Lunch',       emoji: '🍽️', color: '#10b981', bg: '#ECFDF5', url: '/menu.html?category=Lunch' },
  { name: 'Dinner',      emoji: '🌙', color: '#6366f1', bg: '#EEF2FF', url: '/menu.html?category=Dinner' },
  { name: 'Snacks',      emoji: '🍟', color: '#f59e0b', bg: '#FFFBEB', url: '/menu.html?category=Snacks' },
  { name: 'Drinks',      emoji: '🥤', color: '#0ea5e9', bg: '#F0F9FF', url: '/menu.html?category=Drinks' },
  { name: 'Chocolates',  emoji: '🍫', color: '#78350f', bg: '#FEF3C7', url: '/menu.html?category=Chocolates' },
  { name: 'Books',       emoji: '📚', color: '#8b5cf6', bg: '#F5F3FF', url: '/menu.html?category=Books' },
  { name: 'Notebooks',   emoji: '📓', color: '#ec4899', bg: '#FDF2F8', url: '/menu.html?category=Notebooks' },
  { name: 'Pens',        emoji: '🖊️', color: '#3b82f6', bg: '#EFF6FF', url: '/menu.html?category=Pens' },
  { name: 'Pencils',     emoji: '✏️', color: '#6366f1', bg: '#EEF2FF', url: '/menu.html?category=Pencils' },
  { name: 'Stationery',  emoji: '📐', color: '#14b8a6', bg: '#F0FDFA', url: '/menu.html?type=stationery' },
];

function renderCategoryCards(counts) {
  const grid = document.getElementById('categoriesGrid');
  if (!grid) return;
  grid.innerHTML = CATEGORY_CONFIG.map((cat, i) => `
    <a href="${cat.url}" class="cat-card reveal" style="--color:${cat.color};animation-delay:${i * 0.05}s">
      <div class="cat-icon" style="background:${cat.bg};color:${cat.color};">
        <span style="font-size:1.8rem;">${cat.emoji}</span>
      </div>
      <div class="cat-name">${cat.name}</div>
      <div class="cat-count">${counts[cat.name] ? counts[cat.name] + ' items' : 'Browse →'}</div>
    </a>
  `).join('');
  setTimeout(reInitScrollReveal, 100);
}

async function loadCategoryGrid() {
  try {
    const res  = await fetchWithAuth('/api/menu?t=' + Date.now());
    const data = await res.json();
    if (data.success) {
      const counts = {};
      (data.items || []).forEach(item => {
        counts[item.category] = (counts[item.category] || 0) + 1;
      });
      renderCategoryCards(counts);
    } else {
      renderCategoryCards({});
    }
  } catch {
    renderCategoryCards({});
  }
}

// ── Load Specials ───────────────────────────────────────────
async function loadSpecials() {
  const grid = document.getElementById('specialsGrid');
  if (!grid) return;
  try {
    const res  = await fetchWithAuth('/api/menu?special=true&t=' + Date.now());
    const data = await res.json();
    if (data.success && data.items.length > 0) {
      grid.innerHTML = data.items.slice(0, 8).map(buildFoodCard).join('');
      setTimeout(reInitScrollReveal, 100);
    } else {
      grid.innerHTML = `<div class="empty-state"><div class="empty-icon">🍽️</div><p>Chef is preparing today's specials — check back soon!</p></div>`;
    }
  } catch {
    grid.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>Could not load specials right now.</p></div>`;
  }
}

// ── Load Popular ────────────────────────────────────────────
async function loadPopular() {
  const grid = document.getElementById('popularGrid');
  if (!grid) return;
  try {
    const res  = await fetchWithAuth('/api/menu?t=' + Date.now());
    const data = await res.json();
    if (data.success && data.items.length > 0) {
      // Pick popular items from Tiffin, Lunch and Snacks
      const popular = data.items.filter(i => ['Tiffin', 'Lunch', 'Snacks', 'Drinks'].includes(i.category)).slice(0, 8);
      grid.innerHTML = popular.map(buildFoodCard).join('');
      setTimeout(reInitScrollReveal, 100);
    } else {
      grid.innerHTML = `<div class="empty-state"><div class="empty-icon">🍜</div><p>No items found right now.</p></div>`;
    }
  } catch {
    grid.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>Could not load items right now.</p></div>`;
  }
}

// ── Load Stationery ─────────────────────────────────────────
async function loadStationery() {
  const grid = document.getElementById('stationeryGrid');
  if (!grid) return;
  try {
    const res  = await fetchWithAuth('/api/menu?t=' + Date.now());
    const data = await res.json();
    if (data.success) {
      const statCats = ['Books', 'Notebooks', 'Pens', 'Pencils', 'Erasers', 'Sharpeners', 'Rulers', 'Files', 'Other Stationery'];
      const stationery = (data.items || []).filter(item =>
        item.dietary_type === 'stationery' ||
        item.item_type === 'stationery' ||
        statCats.includes(item.category)
      ).slice(0, 8);

      if (stationery.length > 0) {
        grid.innerHTML = stationery.map(buildFoodCard).join('');
        setTimeout(reInitScrollReveal, 100);
      } else {
        grid.innerHTML = `<div class="empty-state"><div class="empty-icon">✏️</div><p>Stationery items coming soon!</p></div>`;
      }
    }
  } catch {
    grid.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>Could not load stationery.</p></div>`;
  }
}

// ── Hero search ─────────────────────────────────────────────
function doSearch() {
  const q = document.getElementById('heroSearch')?.value.trim();
  if (q) window.location.href = `/menu.html?search=${encodeURIComponent(q)}`;
  else   window.location.href = '/menu.html';
}

// ── DOMContentLoaded ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Personalize if logged in, but allow guests to freely browse
  if (getToken()) {
    populateUserName();
    updateCartBadge();
  } else {
    const userEl = document.getElementById('navUserName');
    if (userEl) {
      userEl.innerHTML = `<a href="/index.html" style="color:#FF6B35;font-weight:600;"><i class="fas fa-sign-in-alt"></i> Login</a>`;
    }
  }

  initHeroSlider();
  loadCategoryGrid();
  loadSpecials();
  loadPopular();
  loadStationery();

  const heroSearch = document.getElementById('heroSearch');
  if (heroSearch) {
    heroSearch.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
  }
});
