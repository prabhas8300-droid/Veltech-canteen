/**
 * ANNA PURANA - VEL TECH CANTEEN WEB APPLICATION
 * Core Javascript: State Management, Menu Filters, Cart Engine, Token Dashboard, Pre-order Wizard
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. DATA: CANTEEN MENU ITEMS
  // ==========================================
  const MENU_ITEMS = [
    {
      id: 'item-1',
      name: "Vel Tech Dum Biryani (Chicken)",
      category: 'meals',
      diet: 'non-veg',
      price: 130,
      prepTime: '6 mins',
      rating: 4.9,
      reviews: 420,
      isSpecial: true,
      desc: "Fragrant seeraga samba rice cooked with tender farm chicken, served with onion raitha and spicy salna.",
      img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'item-2',
      name: "Crispy Ghee Roast Dosa",
      category: 'tiffin',
      diet: 'veg',
      price: 55,
      prepTime: '5 mins',
      rating: 4.8,
      reviews: 350,
      isSpecial: true,
      desc: "Golden paper-thin crispy dosa roasted in pure country ghee, served with 3 chutneys & steaming hot drumstick sambar.",
      img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'item-3',
      name: "South Indian Mini Thali",
      category: 'meals',
      diet: 'veg',
      price: 85,
      prepTime: '4 mins',
      rating: 4.7,
      reviews: 280,
      isSpecial: true,
      desc: "Piping hot rice, aromatic sambar, rasam, kootu, poriyal, appalam, curd, and sweet payasam.",
      img: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'item-4',
      name: "Degree Filter Kaapi",
      category: 'beverages',
      diet: 'veg',
      price: 20,
      prepTime: '2 mins',
      rating: 4.9,
      reviews: 580,
      isSpecial: true,
      desc: "Authentic Kumbakonam style freshly brewed chicory decoction with frothy hot cow milk in traditional brass davarah.",
      img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'item-5',
      name: "Hot Samosa Chaat (2 Pcs)",
      category: 'snacks',
      diet: 'veg',
      price: 40,
      prepTime: '3 mins',
      rating: 4.6,
      reviews: 195,
      isSpecial: false,
      desc: "Crushed flaky potato samosas drenched in tangy tamarind chuntney, mint dip, spiced chole, and sev.",
      img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'item-6',
      name: "Paneer Butter Masala + 2 Parottas",
      category: 'meals',
      diet: 'veg',
      price: 110,
      prepTime: '8 mins',
      rating: 4.8,
      reviews: 210,
      isSpecial: true,
      desc: "Flaky Malabar parottas served with rich creamy cottage cheese gravy cooked in butter and aromatic spices.",
      img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'item-7',
      name: "Medu Vada Combo (2 Pcs)",
      category: 'tiffin',
      diet: 'vegan',
      price: 35,
      prepTime: '3 mins',
      rating: 4.5,
      reviews: 140,
      isSpecial: false,
      desc: "Deep-fried crispy lentil doughnuts spiced with black pepper, curry leaves, ginger with coconut chutney.",
      img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'item-8',
      name: "Egg Kothu Parotta",
      category: 'meals',
      diet: 'non-veg',
      price: 80,
      prepTime: '7 mins',
      rating: 4.8,
      reviews: 310,
      isSpecial: false,
      desc: "Shredded parotta tossed on hot iron tawa with scrambled eggs, onions, green chillies, and aromatic salna.",
      img: 'https://images.unsplash.com/photo-1604908177453-7462950a6a3b?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'item-9',
      name: "Campus Double Cheese Maggi",
      category: 'snacks',
      diet: 'veg',
      price: 50,
      prepTime: '5 mins',
      rating: 4.7,
      reviews: 460,
      isSpecial: false,
      desc: "The ultimate college comfort snack! Classic masala noodles loaded with molten cheese, butter, and herbs.",
      img: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'item-10',
      name: "Thick Cold Coffee with Chocolate",
      category: 'beverages',
      diet: 'veg',
      price: 50,
      prepTime: '3 mins',
      rating: 4.8,
      reviews: 290,
      isSpecial: false,
      desc: "Thick creamy chilled coffee blended with Hershey's chocolate drizzle and crowned with vanilla ice cream.",
      img: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'item-11',
      name: "Crispy Veg Puff & Tea Combo",
      category: 'snacks',
      diet: 'vegan',
      price: 30,
      prepTime: '2 mins',
      rating: 4.4,
      reviews: 175,
      isSpecial: false,
      desc: "Flaky golden bakery puff stuffed with spiced potato and carrots, served with hot ginger cardamom chai.",
      img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'item-12',
      name: "Fresh Lime Mint Soda",
      category: 'beverages',
      diet: 'vegan',
      price: 25,
      prepTime: '2 mins',
      rating: 4.6,
      reviews: 130,
      isSpecial: false,
      desc: "Chilled sparkling soda with fresh squeezed lemon juice, crushed mint leaves, and choice of sweet/salt.",
      img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80'
    }
  ];

  // ==========================================
  // 2. APPLICATION STATE
  // ==========================================
  let cart = []; // Array of { id, quantity }
  let activeCategory = 'all';
  let activeDiet = 'all';
  let searchQuery = '';
  let currentStep = 1;
  let userSession = {
    isLoggedIn: false,
    studentId: 'VTU23BCS108',
    fullName: 'Karthik Ramanathan',
    dept: 'B.Tech - Computer Science / IT',
    phone: '98401 23456',
    walletBalance: 350.00
  };

  // Known active tokens for demo
  let activeTokens = [
    { code: 'A-142', counter: 'Counter 1', status: 'Ready for Pickup', time: '1:10 PM' },
    { code: 'B-089', counter: 'Counter 2', status: 'Ready for Pickup', time: '1:12 PM' },
    { code: 'C-045', counter: 'Counter 3', status: 'Ready for Pickup', time: '1:14 PM' },
    { code: 'A-150', counter: 'Counter 1', status: 'Cooking / In Preparation', time: '1:20 PM' }
  ];

  // ==========================================
  // 3. DOM ELEMENTS
  // ==========================================
  const foodGrid = document.getElementById('foodGrid');
  const emptyMenuState = document.getElementById('emptyMenuState');
  const menuSearchInput = document.getElementById('menuSearchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const categoryTabs = document.querySelectorAll('.cat-tab');
  const dietFilterPills = document.querySelectorAll('.diet-filter-pill');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');

  // Category counters
  const countAll = document.getElementById('countAll');
  const countSpecials = document.getElementById('countSpecials');
  const countMeals = document.getElementById('countMeals');
  const countTiffin = document.getElementById('countTiffin');
  const countSnacks = document.getElementById('countSnacks');
  const countBeverages = document.getElementById('countBeverages');

  // Cart DOM elements
  const openCartBtn = document.getElementById('openCartBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartBackdrop = document.getElementById('cartBackdrop');
  const cartSlideover = document.getElementById('cartSlideover');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartCount = document.getElementById('cartCount');
  const mobileCartCount = document.getElementById('mobileCartCount');
  const cartHeaderCount = document.getElementById('cartHeaderCount');
  const cartSubtotalVal = document.getElementById('cartSubtotalVal');
  const cartDiscountVal = document.getElementById('cartDiscountVal');
  const cartTotalVal = document.getElementById('cartTotalVal');
  const clearCartBtn = document.getElementById('clearCartBtn');
  const cartCheckoutBtn = document.getElementById('cartCheckoutBtn');
  const mobileCartTrigger = document.getElementById('mobileCartTrigger');

  // Pre-order Stepper DOM elements
  const preOrderForm = document.getElementById('preOrderForm');
  const stepNodes = [
    document.getElementById('stepNode1'),
    document.getElementById('stepNode2'),
    document.getElementById('stepNode3'),
    document.getElementById('stepNode4')
  ];
  const stepLines = [
    document.getElementById('stepLine1'),
    document.getElementById('stepLine2'),
    document.getElementById('stepLine3')
  ];
  const stepPanels = [
    document.getElementById('panelStep1'),
    document.getElementById('panelStep2'),
    document.getElementById('panelStep3'),
    document.getElementById('panelStep4')
  ];
  const trayEmptyState = document.getElementById('trayEmptyState');
  const trayItemsList = document.getElementById('trayItemsList');
  const summarySubtotal = document.getElementById('summarySubtotal');
  const summaryDiscount = document.getElementById('summaryDiscount');
  const summaryTotal = document.getElementById('summaryTotal');
  const canteenCardBadge = document.getElementById('canteenCardBadge');

  // Navigation & Drawer
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');

  // Login Modal
  const loginModal = document.getElementById('loginModal');
  const loginModalBtn = document.getElementById('loginModalBtn');
  const closeLoginModal = document.getElementById('closeLoginModal');
  const studentLoginForm = document.getElementById('studentLoginForm');
  const loginFormContainer = document.getElementById('loginFormContainer');
  const loggedInContainer = document.getElementById('loggedInContainer');
  const loginBtnText = document.getElementById('loginBtnText');
  const profileName = document.getElementById('profileName');
  const profileReg = document.getElementById('profileReg');
  const profileWalletAmt = document.getElementById('profileWalletAmt');
  const topupWalletBtn = document.getElementById('topupWalletBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const mobileDrawerLoginBtn = document.getElementById('mobileDrawerLoginBtn');
  const footerLoginShortcut = document.getElementById('footerLoginShortcut');

  // Token Tracker & Live Status
  const studentTokenInput = document.getElementById('studentTokenInput');
  const trackTokenBtn = document.getElementById('trackTokenBtn');
  const tokenResult = document.getElementById('tokenResult');
  const headerServingToken = document.getElementById('headerServingToken');
  const quickTokenBtn = document.getElementById('quickTokenBtn');

  // Token Receipt Modal
  const tokenReceiptModal = document.getElementById('tokenReceiptModal');
  const closeReceiptBtn = document.getElementById('closeReceiptBtn');
  const printReceiptBtn = document.getElementById('printReceiptBtn');

  // Feedback Modal
  const feedbackModal = document.getElementById('feedbackModal');
  const openFeedbackBtn = document.getElementById('openFeedbackBtn');
  const closeFeedbackModal = document.getElementById('closeFeedbackModal');
  const feedbackForm = document.getElementById('feedbackForm');
  const starButtons = document.querySelectorAll('.star-btn');

  // Toast Container
  const toastContainer = document.getElementById('toastContainer');

  // ==========================================
  // 4. RENDER MENU ITEMS
  // ==========================================
  function updateCategoryCounts() {
    countAll.textContent = MENU_ITEMS.length;
    countSpecials.textContent = MENU_ITEMS.filter(i => i.isSpecial).length;
    countMeals.textContent = MENU_ITEMS.filter(i => i.category === 'meals').length;
    countTiffin.textContent = MENU_ITEMS.filter(i => i.category === 'tiffin').length;
    countSnacks.textContent = MENU_ITEMS.filter(i => i.category === 'snacks').length;
    countBeverages.textContent = MENU_ITEMS.filter(i => i.category === 'beverages').length;
  }

  function getCartItemQuantity(itemId) {
    const found = cart.find(i => i.id === itemId);
    return found ? found.quantity : 0;
  }

  function renderMenu() {
    const q = searchQuery.trim().toLowerCase();

    const filtered = MENU_ITEMS.filter(item => {
      // Category match
      let matchCat = false;
      if (activeCategory === 'all') matchCat = true;
      else if (activeCategory === 'specials') matchCat = item.isSpecial;
      else matchCat = item.category === activeCategory;

      // Diet match
      let matchDiet = false;
      if (activeDiet === 'all') matchDiet = true;
      else if (activeDiet === 'veg') matchDiet = (item.diet === 'veg' || item.diet === 'vegan');
      else matchDiet = item.diet === activeDiet;

      // Search match
      let matchSearch = true;
      if (q) {
        matchSearch = item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
      }

      return matchCat && matchDiet && matchSearch;
    });

    if (filtered.length === 0) {
      foodGrid.innerHTML = '';
      emptyMenuState.style.display = 'block';
      return;
    }

    emptyMenuState.style.display = 'none';

    foodGrid.innerHTML = filtered.map(item => {
      const qtyInCart = getCartItemQuantity(item.id);
      const dietClass = item.diet === 'veg' ? 'diet-veg' : (item.diet === 'vegan' ? 'diet-vegan' : 'diet-non-veg');
      const dietTooltip = item.diet.toUpperCase();

      let actionButtonHtml = '';
      if (qtyInCart === 0) {
        actionButtonHtml = `
          <button class="btn-add-food" data-item-id="${item.id}" aria-label="Add ${item.name} to tray">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add</span>
          </button>
        `;
      } else {
        actionButtonHtml = `
          <div class="qty-counter-control" role="group" aria-label="Quantity for ${item.name}">
            <button class="qty-btn btn-minus" data-item-id="${item.id}" aria-label="Decrease quantity">−</button>
            <span class="qty-display">${qtyInCart}</span>
            <button class="qty-btn btn-plus" data-item-id="${item.id}" aria-label="Increase quantity">+</button>
          </div>
        `;
      }

      return `
        <article class="food-card" data-id="${item.id}">
          <div class="card-media">
            <img src="${item.img}" alt="${item.name}" class="food-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'">
            ${item.isSpecial ? '<span class="badge-tag-special">⭐ Daily Special</span>' : ''}
            <span class="badge-prep-time">⏱️ ${item.prepTime}</span>
            <div class="diet-badge-wrapper" title="${dietTooltip}">
              <div class="diet-icon-box ${dietClass}">
                <div class="inner-dot"></div>
              </div>
            </div>
          </div>
          <div class="card-content">
            <div class="card-title-row">
              <h3 class="item-name">${item.name}</h3>
              <div class="item-rating" title="${item.reviews} student reviews">
                <span>★</span>
                <span>${item.rating}</span>
              </div>
            </div>
            <p class="item-desc">${item.desc}</p>
            <div class="card-action-row">
              <div class="price-wrap">
                <span class="price-currency">₹${item.price}</span>
                <span class="price-sub">incl. taxes</span>
              </div>
              ${actionButtonHtml}
            </div>
          </div>
        </article>
      `;
    }).join('');

    attachFoodCardListeners();
  }

  function attachFoodCardListeners() {
    // Add button
    document.querySelectorAll('.btn-add-food').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-item-id');
        addToCart(id);
      });
    });

    // Plus button
    document.querySelectorAll('.qty-btn.btn-plus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-item-id');
        addToCart(id);
      });
    });

    // Minus button
    document.querySelectorAll('.qty-btn.btn-minus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-item-id');
        removeFromCart(id);
      });
    });
  }

  // ==========================================
  // 5. CART ENGINE & DRAWER
  // ==========================================
  function addToCart(itemId, qty = 1) {
    const item = MENU_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    const existing = cart.find(i => i.id === itemId);
    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({ id: itemId, quantity: qty });
    }

    showToast(`Added ${item.name} to tray!`, 'success');
    updateCartUI();
    renderMenu();
    updatePreOrderTray();
  }

  function removeFromCart(itemId) {
    const existingIndex = cart.findIndex(i => i.id === itemId);
    if (existingIndex > -1) {
      cart[existingIndex].quantity -= 1;
      if (cart[existingIndex].quantity <= 0) {
        cart.splice(existingIndex, 1);
      }
    }

    updateCartUI();
    renderMenu();
    updatePreOrderTray();
  }

  function clearCart() {
    cart = [];
    updateCartUI();
    renderMenu();
    updatePreOrderTray();
    showToast('Your tray has been cleared.');
  }

  function getCartTotals() {
    let subtotal = 0;
    let totalItems = 0;

    cart.forEach(cartItem => {
      const item = MENU_ITEMS.find(i => i.id === cartItem.id);
      if (item) {
        subtotal += item.price * cartItem.quantity;
        totalItems += cartItem.quantity;
      }
    });

    // 5% student discount if subtotal >= 100
    const discount = subtotal >= 100 ? Math.round(subtotal * 0.05) : 0;
    const grandTotal = Math.max(0, subtotal - discount);

    return { subtotal, discount, grandTotal, totalItems };
  }

  function updateCartUI() {
    const { subtotal, discount, grandTotal, totalItems } = getCartTotals();

    // Badges
    cartCount.textContent = totalItems;
    mobileCartCount.textContent = totalItems;
    cartHeaderCount.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`;

    // Pop animation on badges
    [cartCount, mobileCartCount].forEach(el => {
      el.style.transform = 'scale(1.25)';
      setTimeout(() => el.style.transform = 'scale(1)', 200);
    });

    // Totals in Cart Drawer
    cartSubtotalVal.textContent = `₹${subtotal}`;
    cartDiscountVal.textContent = `- ₹${discount}`;
    cartTotalVal.textContent = `₹${grandTotal}`;

    // Summary in Pre-order Step 4
    if (summarySubtotal) summarySubtotal.textContent = `₹${subtotal}`;
    if (summaryDiscount) summaryDiscount.textContent = `- ₹${discount}`;
    if (summaryTotal) summaryTotal.textContent = `₹${grandTotal}`;

    // Render cart items inside slideover
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <span>🛒</span>
          <h4>Your tray is hungry</h4>
          <p class="text-muted">Explore our delicious meals and snacks to add items.</p>
        </div>
      `;
      cartCheckoutBtn.disabled = true;
      cartCheckoutBtn.style.opacity = '0.6';
    } else {
      cartCheckoutBtn.disabled = false;
      cartCheckoutBtn.style.opacity = '1';

      cartItemsContainer.innerHTML = cart.map(cartItem => {
        const item = MENU_ITEMS.find(i => i.id === cartItem.id);
        if (!item) return '';

        return `
          <div class="cart-item">
            <div class="cart-item-info">
              <h4 class="cart-item-name">${item.name}</h4>
              <span class="cart-item-price">₹${item.price} × ${cartItem.quantity} = <strong>₹${item.price * cartItem.quantity}</strong></span>
            </div>
            <div class="qty-counter-control">
              <button class="qty-btn" onclick="window.dispatchCartAction('${item.id}', -1)">−</button>
              <span class="qty-display">${cartItem.quantity}</span>
              <button class="qty-btn" onclick="window.dispatchCartAction('${item.id}', 1)">+</button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Global helper for inline cart button clicks
  window.dispatchCartAction = (itemId, change) => {
    if (change > 0) addToCart(itemId, 1);
    else removeFromCart(itemId);
  };

  // Open & Close Cart
  function openCart() {
    cartSlideover.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartSlideover.classList.remove('open');
    document.body.style.overflow = '';
  }

  openCartBtn.addEventListener('click', openCart);
  mobileCartTrigger.addEventListener('click', openCart);
  closeCartBtn.addEventListener('click', closeCart);
  cartBackdrop.addEventListener('click', closeCart);
  clearCartBtn.addEventListener('click', clearCart);

  cartCheckoutBtn.addEventListener('click', () => {
    closeCart();
    // Scroll smoothly to preorder section
    const preorderSection = document.getElementById('preorder');
    preorderSection.scrollIntoView({ behavior: 'smooth' });
    setPreOrderStep(1);
  });

  // ==========================================
  // 6. PRE-ORDER WIZARD & TRAY PREVIEW
  // ==========================================
  function updatePreOrderTray() {
    if (cart.length === 0) {
      trayEmptyState.style.display = 'block';
      trayItemsList.style.display = 'none';
      trayItemsList.innerHTML = '';
    } else {
      trayEmptyState.style.display = 'none';
      trayItemsList.style.display = 'flex';

      trayItemsList.innerHTML = cart.map(cartItem => {
        const item = MENU_ITEMS.find(i => i.id === cartItem.id);
        if (!item) return '';
        return `
          <div class="tray-item-row">
            <div>
              <span class="tray-item-title">${item.name}</span>
              <span class="tray-item-calc"> (${cartItem.quantity} × ₹${item.price})</span>
            </div>
            <span class="tray-item-price">₹${item.price * cartItem.quantity}</span>
          </div>
        `;
      }).join('');
    }
  }

  function setPreOrderStep(step) {
    currentStep = step;

    stepPanels.forEach((panel, idx) => {
      panel.classList.toggle('active', idx + 1 === step);
    });

    stepNodes.forEach((node, idx) => {
      const stepIndex = idx + 1;
      node.classList.remove('active', 'completed');
      if (stepIndex === step) {
        node.classList.add('active');
      } else if (stepIndex < step) {
        node.classList.add('completed');
      }
    });

    stepLines.forEach((line, idx) => {
      line.classList.toggle('active', idx + 1 < step);
    });
  }

  // Pre-order Navigation Buttons
  document.getElementById('gotoStep2Btn').addEventListener('click', () => {
    if (cart.length === 0) {
      showToast('Please add at least one meal or snack to continue!', 'error');
      return;
    }
    setPreOrderStep(2);
  });

  document.getElementById('backToStep1Btn').addEventListener('click', () => setPreOrderStep(1));

  document.getElementById('gotoStep3Btn').addEventListener('click', () => {
    // If student is logged in, prefill fields
    if (userSession.isLoggedIn) {
      document.getElementById('studentRegNumber').value = userSession.studentId;
      document.getElementById('studentFullName').value = userSession.fullName;
      document.getElementById('studentPhone').value = userSession.phone;
    }
    setPreOrderStep(3);
  });

  document.getElementById('backToStep2Btn').addEventListener('click', () => setPreOrderStep(2));

  document.getElementById('gotoStep4Btn').addEventListener('click', () => {
    const reg = document.getElementById('studentRegNumber').value.trim();
    const name = document.getElementById('studentFullName').value.trim();
    const phone = document.getElementById('studentPhone').value.trim();

    if (!reg || !name || !phone) {
      showToast('Please enter your Student ID, Name, and Mobile Number.', 'error');
      return;
    }
    setPreOrderStep(4);
  });

  document.getElementById('backToStep3Btn').addEventListener('click', () => setPreOrderStep(3));

  // Quick Combo Pickers in Pre-order Step 1
  document.querySelectorAll('.combo-card-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const comboId = e.currentTarget.getAttribute('data-combo-id');
      if (comboId === 'combo-1') {
        // South Indian Thali + Lime Soda
        addToCart('item-3', 1);
        addToCart('item-12', 1);
        showToast('Added Lunch Rush Saver Combo!');
      } else if (comboId === 'combo-2') {
        // Samosa Chaat + Filter Kaapi
        addToCart('item-5', 1);
        addToCart('item-4', 1);
        showToast('Added Evening Energy Boost Combo!');
      } else if (comboId === 'combo-3') {
        // Chicken Biryani
        addToCart('item-1', 1);
        showToast('Added Hostel Dinner Special Combo!');
      }
    });
  });

  // Pre-order Form Submission
  preOrderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const { grandTotal } = getCartTotals();

    if (cart.length === 0) {
      showToast('Please select items before placing an order!', 'error');
      setPreOrderStep(1);
      return;
    }

    const reg = document.getElementById('studentRegNumber').value.trim();
    const name = document.getElementById('studentFullName').value.trim();
    const pickupSlot = document.querySelector('input[name="pickupTime"]:checked').value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    // Check wallet balance if CanteenCard is chosen
    if (paymentMethod === 'CanteenCard') {
      if (userSession.walletBalance < grandTotal) {
        showToast(`Insufficient balance on Vel Tech Canteen Card (Available: ₹${userSession.walletBalance.toFixed(2)}). Please recharge or choose UPI!`, 'error');
        return;
      } else {
        userSession.walletBalance -= grandTotal;
        updateUserSessionUI();
      }
    }

    // Generate Token
    const prefix = paymentMethod === 'UPI' ? 'A' : (paymentMethod === 'CanteenCard' ? 'B' : 'C');
    const tokenNumber = Math.floor(150 + Math.random() * 40);
    const generatedToken = `#${prefix}-${tokenNumber}`;

    // Add to active tokens
    activeTokens.unshift({
      code: `${prefix}-${tokenNumber}`,
      counter: prefix === 'A' ? 'Counter 1' : 'Counter 2',
      status: 'Cooking / In Preparation',
      time: pickupSlot
    });

    // Populate Receipt Modal
    document.getElementById('receiptTokenCode').textContent = generatedToken;
    document.getElementById('receiptSlotTime').textContent = `Slot: ${pickupSlot}`;
    document.getElementById('receiptStudentId').textContent = reg;
    document.getElementById('receiptStudentName').textContent = name;
    document.getElementById('receiptPayMethod').textContent = paymentMethod === 'UPI' ? 'UPI Paid' : (paymentMethod === 'CanteenCard' ? 'Canteen Card' : 'Pay at Counter');
    document.getElementById('receiptTotalPaid').textContent = `₹${grandTotal}.00`;
    document.getElementById('receiptCounter').textContent = prefix === 'A' ? 'Counter 1 & 3' : 'Counter 2';

    // Summary Items in Receipt
    const summaryHtml = cart.map(ci => {
      const itm = MENU_ITEMS.find(m => m.id === ci.id);
      return itm ? `
        <div class="rec-row">
          <span>${itm.name} × ${ci.quantity}</span>
          <strong>₹${itm.price * ci.quantity}</strong>
        </div>
      ` : '';
    }).join('');
    document.getElementById('receiptItemsSummary').innerHTML = summaryHtml;

    // Show Receipt Modal
    tokenReceiptModal.style.display = 'flex';

    // Reset Cart & Stepper
    cart = [];
    updateCartUI();
    renderMenu();
    updatePreOrderTray();
    setPreOrderStep(1);

    showToast(`Order Confirmed! Your Token is ${generatedToken}`, 'success');
  });

  // Close Receipt Modal
  closeReceiptBtn.addEventListener('click', () => {
    tokenReceiptModal.style.display = 'none';
    const queueSection = document.getElementById('live-queue');
    queueSection.scrollIntoView({ behavior: 'smooth' });
  });

  printReceiptBtn.addEventListener('click', () => {
    showToast('Saving e-token slip to downloads...', 'success');
    setTimeout(() => {
      window.print();
    }, 600);
  });

  // ==========================================
  // 7. LIVE TOKEN TRACKER & BUSY STATUS
  // ==========================================
  trackTokenBtn.addEventListener('click', () => {
    const query = studentTokenInput.value.trim().toUpperCase().replace('#', '');
    if (!query) {
      showToast('Please enter your token code (e.g. A-142)', 'error');
      return;
    }

    const found = activeTokens.find(t => t.code.toUpperCase() === query);
    tokenResult.style.display = 'block';

    if (found) {
      if (found.status.includes('Ready')) {
        tokenResult.className = 'token-track-result token-result-ready';
        tokenResult.innerHTML = `✅ <strong>Token #${found.code} is READY!</strong> Please collect from ${found.counter}.`;
      } else {
        tokenResult.className = 'token-track-result token-result-prep';
        tokenResult.innerHTML = `🍳 <strong>Token #${found.code} is currently cooking.</strong> Estimated ready in 4-6 minutes at ${found.counter}.`;
      }
    } else {
      // Simulate plausible status for any well-formatted token
      if (query.length >= 3) {
        tokenResult.className = 'token-track-result token-result-prep';
        tokenResult.innerHTML = `🍳 <strong>Token #${query} is verified in kitchen.</strong> Prep in progress at Express Counter.`;
      } else {
        tokenResult.className = 'token-track-result token-result-notfound';
        tokenResult.innerHTML = `⚠️ Token #${query} not found. Please double check with Canteen billing desk.`;
      }
    }
  });

  studentTokenInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      trackTokenBtn.click();
    }
  });

  // Quick Token click in Navbar
  quickTokenBtn.addEventListener('click', () => {
    const queueSection = document.getElementById('live-queue');
    queueSection.scrollIntoView({ behavior: 'smooth' });
    studentTokenInput.value = 'A-142';
    trackTokenBtn.click();
  });

  // Simulated live token rotation every 45 seconds
  let tokenCounter = 142;
  setInterval(() => {
    tokenCounter += 1;
    const newToken = `#A-${tokenCounter}`;
    if (headerServingToken) headerServingToken.textContent = newToken;
    const tokenC1 = document.getElementById('tokenC1');
    if (tokenC1) {
      tokenC1.textContent = `A-${tokenCounter}`;
      tokenC1.parentElement.classList.add('primary-token');
    }
  }, 45000);

  // ==========================================
  // 8. STUDENT LOGIN & WALLET MODAL
  // ==========================================
  function updateUserSessionUI() {
    if (userSession.isLoggedIn) {
      loginBtnText.textContent = `🎓 ${userSession.fullName.split(' ')[0]} (₹${Math.round(userSession.walletBalance)})`;
      loginFormContainer.style.display = 'none';
      loggedInContainer.style.display = 'block';
      profileName.textContent = userSession.fullName;
      profileReg.textContent = `${userSession.studentId} • ${userSession.dept}`;
      profileWalletAmt.textContent = `₹${userSession.walletBalance.toFixed(2)}`;
      if (canteenCardBadge) canteenCardBadge.textContent = `Active: ₹${Math.round(userSession.walletBalance)}`;

      // Update mobile drawer
      document.querySelector('.drawer-user-name').textContent = userSession.fullName;
      document.querySelector('.drawer-user-sub').textContent = userSession.studentId;
    } else {
      loginBtnText.textContent = 'Student Login';
      loginFormContainer.style.display = 'block';
      loggedInContainer.style.display = 'none';
      if (canteenCardBadge) canteenCardBadge.textContent = 'Demo: ₹350';
      document.querySelector('.drawer-user-name').textContent = 'Guest Student';
      document.querySelector('.drawer-user-sub').textContent = 'Vel Tech Avadi Campus';
    }
  }

  function openLogin() {
    loginModal.style.display = 'flex';
  }

  function closeLogin() {
    loginModal.style.display = 'none';
  }

  loginModalBtn.addEventListener('click', openLogin);
  closeLoginModal.addEventListener('click', closeLogin);
  mobileDrawerLoginBtn.addEventListener('click', () => {
    closeMobileDrawer();
    openLogin();
  });
  footerLoginShortcut.addEventListener('click', openLogin);

  studentLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('loginStudentId').value.trim();
    if (id) userSession.studentId = id;
    userSession.isLoggedIn = true;
    updateUserSessionUI();
    showToast(`Welcome back, ${userSession.fullName}! Wallet: ₹${userSession.walletBalance}`, 'success');
    closeLogin();
  });

  logoutBtn.addEventListener('click', () => {
    userSession.isLoggedIn = false;
    updateUserSessionUI();
    showToast('Logged out of Vel Tech Canteen Portal.');
    closeLogin();
  });

  topupWalletBtn.addEventListener('click', () => {
    userSession.walletBalance += 200;
    updateUserSessionUI();
    showToast('Recharged ₹200 to Vel Tech Canteen Card via UPI!', 'success');
  });

  // ==========================================
  // 9. FEEDBACK & SUGGESTIONS MODAL
  // ==========================================
  openFeedbackBtn.addEventListener('click', () => {
    feedbackModal.style.display = 'flex';
  });

  closeFeedbackModal.addEventListener('click', () => {
    feedbackModal.style.display = 'none';
  });

  starButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.getAttribute('data-val'), 10);
      starButtons.forEach((s, idx) => {
        s.classList.toggle('active', idx < val);
      });
    });
  });

  feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    feedbackModal.style.display = 'none';
    feedbackForm.reset();
    showToast('Thank you! Your feedback has been sent to the Student Council.', 'success');
  });

  // ==========================================
  // 10. SEARCH & CATEGORY FILTERING EVENTS
  // ==========================================
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      activeCategory = tab.getAttribute('data-category');
      renderMenu();
    });
  });

  dietFilterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      dietFilterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeDiet = pill.getAttribute('data-diet');
      renderMenu();
    });
  });

  menuSearchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    searchClearBtn.style.display = searchQuery.length > 0 ? 'block' : 'none';
    renderMenu();
  });

  searchClearBtn.addEventListener('click', () => {
    menuSearchInput.value = '';
    searchQuery = '';
    searchClearBtn.style.display = 'none';
    renderMenu();
  });

  resetFiltersBtn.addEventListener('click', () => {
    menuSearchInput.value = '';
    searchQuery = '';
    searchClearBtn.style.display = 'none';
    activeCategory = 'all';
    activeDiet = 'all';

    categoryTabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-category') === 'all'));
    dietFilterPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-diet') === 'all'));

    renderMenu();
  });

  // ==========================================
  // 11. MOBILE DRAWER NAVIGATION
  // ==========================================
  function openMobileDrawer() {
    mobileDrawer.classList.add('open');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMobileDrawer() {
    mobileDrawer.classList.remove('open');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
  }

  mobileMenuBtn.addEventListener('click', openMobileDrawer);
  closeDrawerBtn.addEventListener('click', closeMobileDrawer);

  document.querySelectorAll('.mobile-nav-item').forEach(link => {
    link.addEventListener('click', closeMobileDrawer);
  });

  // Close modals on outside click
  window.addEventListener('click', (e) => {
    if (e.target === loginModal) closeLogin();
    if (e.target === feedbackModal) feedbackModal.style.display = 'none';
  });

  // ==========================================
  // 12. TOAST NOTIFICATION UTILITY
  // ==========================================
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : ''}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✨' : 'ℹ️'}</span>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // ==========================================
  // 13. INITIALIZE APPLICATION
  // ==========================================
  updateCategoryCounts();
  renderMenu();
  updateCartUI();
  updatePreOrderTray();
  updateUserSessionUI();

  // Highlight active mobile bottom navigation buttons on scroll
  const sections = document.querySelectorAll('section, footer');
  const navBottomLinks = document.querySelectorAll('.mobile-bottom-bar a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navBottomLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
});
