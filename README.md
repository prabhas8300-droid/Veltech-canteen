# 🍲 Smart Canteen & Mini Store — Vel Tech Annapurna

> **College Name:** Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology  
> **Canteen Name:** Annapurna Canteen & Mini Store  
> **Tagline:** *"Fresh Food, Happy Moments!"*

A fully functional, modern, responsive, full-stack Canteen & Mini Store web application with complete frontend, backend REST API, SQLite database, interactive animation system, and Admin Dashboard.

---

## 🌟 Complete Feature Breakdown

### 1. 🎨 Modern Website Design & UI
- **Responsive Layout**: Pixel-perfect on Mobile, Tablet, Laptop, and 4K Desktop screens.
- **Visuals**: High-resolution, realistic product photography for all food and stationery items.
- **Theme**: Warm culinary and academic palette with orange accents (`#FF6B35`), emerald greens (`#2D6A4F`), deep navy (`#1A1A2E`), and soft cream cards (`#FFF8F0`).
- **Interactive Homepage (`/home.html`)**:
  - Auto-cycling background slider banner with 5 high-resolution food & stationery photography slides.
  - Floating ambient animated emojis (`🍕`, `🍲`, `✏️`, `📚`, `🥤`).
  - Search bar with instant real-time redirect to menu.
  - Campus statistics strip (100+ Menu Items, 50+ Stationery Products, 7AM–8PM Daily, 10 min average pickup, 100% Hygienic).
  - Category showcase cards with hover zoom and real-time item counts.
  - Promo showcase banners for specials, favorites, and the mini store.
  - Today's Specials, Popular Dishes, and Mini Store Stationery sections.

### 2. 🗂️ Product Categories (90 Items Across 15 Categories)

#### Food Items
- **Tiffin**: Idli (₹30), Crispy Dosa (₹40), Poori Masala (₹40), Rava Upma (₹35), Ghee Ven Pongal (₹40), Masala Dosa (₹55), Medu Vada (₹30).
- **Lunch**: South Indian Veg Meals (₹80), Special Chicken Meals (₹130), Veg Fried Rice (₹75), Royal Veg Dum Biryani (₹110), Hyderabadi Chicken Biryani (₹140), Curd Rice (₹40), Egg Fried Rice (₹85).
- **Dinner**: Wheat Chapati with Kurma (₹40), Malabar Parotta with Salna (₹45), Dinner Roast Dosa (₹40), Schezwan Fried Rice (₹80), Paneer Butter Masala (₹110), Kadai Chicken Curry (₹130).
- **Snacks**: Crispy Samosa (₹25), Veg Puff Pastry (₹20), Egg Puff (₹25), Assorted Biscuits Pack (₹25), Crispy Potato Chips (₹20), Peri Peri French Fries (₹50).
- **Drinks**: Mineral Water Bottle 1L (₹20), Fresh Cold Pressed Orange Juice (₹40), Fresh Watermelon Juice (₹35), Belgian Chocolate Milkshake (₹60), Oreo Cookie Milkshake (₹70), Chilled Cool Drinks 500ml (₹25), Red Bull Energy Drink (₹115), South Indian Filter Coffee (₹15).
- **Chocolates**: Cadbury Dairy Milk (₹20), Nestlé KitKat (₹25), Cadbury 5 Star (₹20), Nestlé Munch (₹10), Cadbury Perk (₹10), Snickers Peanut Bar (₹50).

#### Stationery Items (Mini Store)
- **Books**: Higher Engineering Mathematics (₹320), Engineering Physics Textbook (₹280), Chemistry Laboratory Manual (₹150), Programming in C & Algorithms (₹260), Data Structures & Algorithms Handbook (₹340).
- **Notebooks**: A4 Spiral Notebook 160 Pages (₹65), 200-Page Ruled Long Notebook (₹45), Engineering Graph Notebook (₹55), Hardcover Lab Record Notebook (₹70), A3 Drawing & Sketch Book (₹80).
- **Pens**: Reynolds 045 Ball Pen (₹10), Parker Vector Rollerball Pen (₹85), Gel Pen Set 5-Pack (₹35), Pilot G2 0.5mm Pen (₹25), Permanent Marker Set 4-Colors (₹120).
- **Pencils**: Apsara Platinum HB Pencils Box of 10 (₹30), Mechanical Drafting Pencil 0.5mm (₹55), Faber-Castell 12 Colored Pencils (₹85), Drawing Sketching Pencil Set (₹120), Staedtler Mars Lumograph Pencil (₹25).
- **Erasers**: Faber-Castell Dust-Free Eraser (₹15), Precision Drafting Vinyl Eraser (₹20), Artist Kneaded Putty Eraser (₹35), Multicolor Student Erasers 5-Pack (₹25), Jumbo Non-Dust Eraser (₹12).
- **Sharpeners**: Double Hole Canister Sharpener (₹18), Rotary Desktop Crank Sharpener (₹45), Staedtler Metal Wedge Sharpener (₹30), Electric Battery Sharpener (₹150), Compact Travel Sharpener (₹22).
- **Rulers**: 30cm Transparent Acrylic Ruler (₹20), Technical Set Squares Pair (₹35), 180° Precision Protractor (₹25), Complete Mathematical Geometry Box (₹85), Engineering Scale Triangular Ruler (₹45).
- **Files**: A4 Ring Binder Document File (₹35), Clear L-Type Plastic Folder 5-Pack (₹25), Zipper Mesh Bag File (₹15), Butterfly Binder Clips Box of 12 (₹20), Hardboard Arch Lever Box File (₹55).
- **Other Stationery**: Desktop Metal Stapler No.10 (₹85), Steel Stapler Pins Box of 1000 (₹20), Stainless Steel Paper Scissors (₹45), Whiteboard Marker Set 4-Pens (₹30), Correction Pen Fluid (₹25), Pastel Highlighter Set 5-Pack (₹65), Self-Adhesive Sticky Notes 100 Sheets (₹40), Vinyl Coated Paper Clips Box of 100 (₹15), Elastic Rubber Bands Pack (₹10), Study Revision Index Flash Cards (₹35).

---

### 3. ✨ Animation and Interactive Effects System
- **Product Card Hover Zoom**: Smooth 3D scale-up and lift with drop-shadow glow.
- **Product Image Zoom**: Image gently scales 10% inside the card container on hover.
- **Product Detail Pop-up Modal**: Clicking any product card triggers a smooth slide-up backdrop-blurred modal with high-res photo, descriptions, stock availability, and quantity controls.
- **Fly-to-Cart Animation (`animateCartFly`)**: Clicking "Add to Cart" spawns a flying circular thumbnail that follows a curved quadratic Bézier arc trajectory directly into the cart icon in the navigation bar.
- **Cart Badge Bounce**: Navbar shopping cart badge triggers an elastic bounce upon receiving items.
- **Smooth Page Transitions & Scroll Reveal**: Content dynamically fades in and glides upward as user scrolls.
- **Animated Ripple Buttons**: Tactile button reactions with feedback state changes.
- **Animated Homepage Banner**: Auto-slides every 4.5 seconds with crossfade transitions and interactive slide dots.

---

### 4. 🛒 Shopping Cart (`/cart.html`)
- Displays product image, title, category, individual item price, and quantity.
- Live Quantity Controls (`+` and `-`) with real-time subtotal updates.
- Remove item with slide-out animation.
- Clear All Cart option.
- Automatic 5% GST calculation.
- Animated checkout trigger with pulsing CTA.
- Persistent session storage in SQLite database.

---

### 5. 💳 Checkout & Payment System (`/checkout.html`)
- **Fulfillment Selection**:
  - **Canteen Counter Pickup**: 10–15 min quick preparation for campus collection.
  - **Campus Delivery**: Delivery to campus block, department, or hostel room.
- **Customer Information**: Full name, 10-digit mobile number, and student email (pre-filled from account).
- **Payment Methods Supported**:
  - **UPI**: Google Pay, PhonePe, Paytm, BHIM (QR scan or VPA ID).
  - **Razorpay Test Mode**: Credit Cards, Debit Cards, Net Banking, and Wallets with SSL encryption.
  - **Cash on Pickup / Delivery**: Pay upon collection.
- **Server Verification**: Secure backend payment verification via `/api/payment/process`.
- **Payment Success & Failure Screens**:
  - Animated Success Overlay with Order ID, Transaction ID, Estimated Preparation Time, and live tracking button.
  - Failure modal with clear error reason and instant retry option.

---

### 6. 📦 Order Management & Live Tracking (`/orders.html`)
- Displays all customer orders with unique token `#TK-100X` and Order ID `#VT-X`.
- **4-Step Live Animated Stepper**:
  - **Step 1: Placed** (Received in system)
  - **Step 2: Preparing** (Cooking in kitchen / packaging in store)
  - **Step 3: Ready!** (Ready at counter / out for campus delivery)
  - **Step 4: Completed** (Collected by student)
- Itemized bill breakdown with individual item pricing and total amount.
- **Digital Tax Invoice / Bill Modal**: View and print official receipt.
- **Reorder in 1-Click**: Adds identical items back into active shopping cart.
- Auto-polling: Automatically refreshes order status every 15 seconds.

---

### 7. 🛠️ Admin Dashboard (`/admin/dashboard.html`)
- Accessible by logging in with admin credentials.
- **Dashboard Metrics**: Total Revenue, Total Orders, Today's Sales, Pending Orders, Items Sold.
- **Live Order Management**: Change status between `Pending`, `Preparing`, `Ready`, `Completed`, or reject.
- **Product Management**:
  - Add new Food or Stationery item with custom price, category, Unsplash photo URL, description, and special flag.
  - Live edit price, description, and details.
  - 1-Click Toggle Availability (`In Stock` ↔ `Out of Stock`).
  - Delete product.
- **Sales Analytics**: 30-day revenue and order volume tracking.
- **Student User Management**: View registered students and accounts.
- **Canteen Settings**: Update canteen name, background hero photo, hours, and contact details.

---

## 🚀 How to Run the Application

### Option A: Python 3 (Zero Dependencies Required)
No external npm or pip packages needed. Python 3's built-in standard library runs the entire REST API, database, and static file server:

```bash
# Start the server on port 3000
python3 server.py 3000
```
Open your browser to: **`http://localhost:3000`**

---

### Option B: Node.js & Express
If you have Node.js installed:

```bash
# Install dependencies
npm install

# Start Node server
npm start
```
Open your browser to: **`http://localhost:3000`**

---

## 🔑 Demo Login Accounts

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Student** | `student@veltech.edu` | `Student@123` | Canteen ordering, cart, checkout, tracking |
| **Admin** | `admin@veltech.edu` | `Admin@123` | Full Admin Dashboard, order status, product management |

*(New student accounts can also be created anytime from the `/index.html` registration tab).*
