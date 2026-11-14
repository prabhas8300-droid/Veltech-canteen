/* ==========================================================
   menu.js — Menu Page JavaScript
   Veltech Annapurna Canteen & Mini Store
   ========================================================== */

let allItems       = [];
let activeCategory = 'All';
let activeDietary  = 'all';
let onlySpecial    = false;
let viewMode       = 'grid';
let searchTimeout;

// ── Category sidebar init ───────────────────────────────────
const FOOD_CATEGORIES = [
  { name: 'All',                 emoji: '🍴' },
  { name: 'South Indian Tiffin', emoji: '🌅' },
  { name: 'Lunch',               emoji: '☀️' },
  { name: 'Dinner',              emoji: '🌙' },
  { name: 'Evening Snacks',      emoji: '🍟' },
  { name: 'Special Beverages',   emoji: '☕' },
];

async function loadCategories() {
  try {
    const res  = await fetchWithAuth('/api/menu/categories');
    const data = await res.json();
    if (data.success) {
      const categories = data.categories || [];
      const foodList  = document.getElementById('foodCatList');
      if (foodList) {
        const foodCats = categories.filter(c =>
          !['Books','Notebooks','Pens','Pencils','Erasers','Sharpeners','Rulers','Files','Stationery','Drinks','Chocolates','Other Stationery'].some(s => c.includes(s))
        );
        foodList.innerHTML = `
          <button class="sidebar-cat-btn ${activeCategory === 'All' ? 'active' : ''}" onclick="setCategory('All')">
            <span class="cat-icon">🍴</span> All Items
          </button>
          ${foodCats.map(cat => `
            <button class="sidebar-cat-btn ${activeCategory === cat ? 'active' : ''}" onclick="setCategory('${cat.replace(/'/g,"\\'")}')">
              <span class="cat-icon">🍽️</span> ${cat}
            </button>
          `).join('')}
        `;
      }
    }
  } catch {}
}

// ── Load all menu items ─────────────────────────────────────
async function loadMenuItems() {
  const grid = document.getElementById('menuGrid');
  if (!grid) return;

  grid.innerHTML = `<div class="loading-container"><div class="spinner"></div><p>Loading menu & store items...</p></div>`;

  try {
    const res  = await fetchWithAuth('/api/menu?t=' + Date.now());
    const data = await res.json();
    allItems = data.items || [];
    filterAndRender();
  } catch {
    grid.innerHTML = `<div class="empty-state"><span class="empty-icon">⚠️</span><p>Could not load items. Please refresh the page.</p></div>`;
  }
}

// ── Filter & render ─────────────────────────────────────────
function filterAndRender() {
  const search  = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
  const sortVal = document.getElementById('sortSelect')?.value || 'default';

  let items = [...allItems];

  // Category filter
  if (activeCategory !== 'All') {
    items = items.filter(i => i.category === activeCategory);
  }

  // Dietary filter
  if (activeDietary !== 'all') {
    if (activeDietary === 'stationery') {
      const statCats = ['Books', 'Notebooks', 'Pens', 'Pencils', 'Erasers', 'Sharpeners', 'Rulers', 'Files', 'Other Stationery'];
      items = items.filter(i => i.dietary_type === 'stationery' || i.item_type === 'stationery' || statCats.includes(i.category));
    } else {
      items = items.filter(i => i.dietary_type === activeDietary);
    }
  }

  // Special filter
  if (onlySpecial) {
    items = items.filter(i => i.is_special);
  }

  // Search filter
  if (search) {
    items = items.filter(i =>
      (i.name        || '').toLowerCase().includes(search) ||
      (i.category    || '').toLowerCase().includes(search) ||
      (i.description || '').toLowerCase().includes(search)
    );
  }

  // Sort
  if (sortVal === 'price_asc')  items.sort((a, b) => a.price - b.price);
  if (sortVal === 'price_desc') items.sort((a, b) => b.price - a.price);
  if (sortVal === 'name_asc')   items.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  renderGrid(items);
}

function renderGrid(items) {
  const grid = document.getElementById('menuGrid');
  const count = document.getElementById('itemsCount');
  if (!grid) return;

  if (count) count.textContent = `Showing ${items.length} item${items.length !== 1 ? 's' : ''}`;

  if (items.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <span class="empty-icon">🔍</span>
        <p style="font-size:1rem;font-weight:600;color:#374151;">No items found</p>
        <p>Try a different search term or category.</p>
        <button class="btn btn-secondary" style="margin-top:1rem;" onclick="clearFilters()">Clear Filters</button>
      </div>
    `;
    return;
  }

  grid.className = `food-grid${viewMode === 'list' ? ' list-view' : ''}`;
  grid.innerHTML = items.map(buildFoodCard).join('');
  setTimeout(reInitScrollReveal, 80);
}

function clearFilters() {
  activeCategory = 'All';
  activeDietary  = 'all';
  onlySpecial    = false;
  document.getElementById('searchInput').value = '';
  updateSidebarActive();
  updateChips();
  filterAndRender();
}

// ── Category selection ──────────────────────────────────────
function setCategory(cat) {
  activeCategory = cat;
  updateSidebarActive();
  filterAndRender();
}

function updateSidebarActive() {
  document.querySelectorAll('.sidebar-cat-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.trim().includes(activeCategory === 'All' ? 'All' : activeCategory));
  });
}

// ── Dietary filter ──────────────────────────────────────────
function setDietary(type) {
  activeDietary = type;
  onlySpecial   = false;
  updateChips();
  filterAndRender();
}

function filterStationery() {
  activeDietary  = 'stationery';
  activeCategory = 'All';
  updateSidebarActive();
  updateChips();
  filterAndRender();
}

function toggleSpecial() {
  onlySpecial = !onlySpecial;
  updateChips();
  filterAndRender();
}

function updateChips() {
  document.getElementById('chipAll')?.classList.toggle('active', activeDietary === 'all' && !onlySpecial);
  document.getElementById('chipVeg')?.classList.toggle('active', activeDietary === 'veg');
  document.getElementById('chipNonveg')?.classList.toggle('active', activeDietary === 'non-veg');
  document.getElementById('chipStat')?.classList.toggle('active', activeDietary === 'stationery');
  document.getElementById('chipSpecial')?.classList.toggle('active', onlySpecial);
}

// ── View mode ───────────────────────────────────────────────
function setViewMode(mode) {
  viewMode = mode;
  document.getElementById('gridViewBtn')?.classList.toggle('active', mode === 'grid');
  document.getElementById('listViewBtn')?.classList.toggle('active', mode === 'list');
  filterAndRender();
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

  // URL params
  const params   = new URLSearchParams(window.location.search);
  const search   = params.get('search');
  const category = params.get('category');
  const type     = params.get('type');
  const special  = params.get('special');

  if (search)   document.getElementById('searchInput').value = search;
  if (category) activeCategory = category;
  if (type === 'stationery') activeDietary = 'stationery';
  if (special)  onlySpecial = true;

  updateChips();
  loadCategories();
  loadMenuItems();

  // Search input debounce
  const searchEl = document.getElementById('searchInput');
  if (searchEl) {
    searchEl.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(filterAndRender, 300);
    });
  }
});
