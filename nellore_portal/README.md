# NELLORE DISTRICT – SMART DIGITAL DEVELOPMENT PORTAL
**Tagline: Discover Nellore – People, Places, Progress & Opportunities**
*Sri Potti Sriramulu Nellore District, Andhra Pradesh, India*

---

## 🏛️ Project Overview
The **Nellore District Smart Digital Development Portal** is a modern, responsive, and data-backed digital ecosystem built for district administration, citizen services, trade promotion, and long-term strategic economic planning.

It unites demographic information, all 38 mandals, 943 revenue villages, agricultural land balances, export marketing (seafood, mica, lemons, paddy, footwear), interactive GIS maps with Google Maps integration, transport infrastructure, and an AI-driven 10-year development vision (**NELLORE 2036**).

---

## 🚀 Key Modules & Capabilities

### 1. Landing & Authentication
- **Full-Screen Visual Showcase:** Dynamic backgrounds featuring Nellore's agricultural emerald fields, Mypadu beach, Krishnapatnam port, and rural heritage.
- **Secure Authentication:** Username or Mobile Number login, Forgot Password reset simulation, and Role-Based User Registration (Citizen, Farmer, Business Owner, Student, Admin).
- **Multi-Lingual Localization:** Instant zero-reload switching between **English**, **తెలుగు (Telugu)**, and **हिन्दी (Hindi)**.

### 2. Main Executive Dashboard
- **12 Key District Indicators:**
  - Total Population: **29.64 Lakhs** (14.93L Male / 14.70L Female)
  - Revenue Mandals: **38 Mandals** across 4 Divisions
  - Revenue Villages: **943 Villages** (1,180 Habitations)
  - Gram Panchayats: **672 Panchayats** with Sachivalayam connectivity
  - Total Area: **13,076 km²** (13,07,600 Hectares)
  - Population Density: **227 persons/km²**
  - Literacy Rate: **68.9%** (Male: 75.7%, Female: 62.0%)
  - Agricultural Farmland: **5.83 Lakh Hectares**
  - Merchandise Exports: **₹22,450 Crores** (24.5% India Seafood Export Share)
  - Port Imports: **₹31,200 Crores** (Krishnapatnam Port bulk cargo)
  - Per-Person Land: **0.44 Hectares (1.09 Acres / 4,412 m²)**
  - Registered Industrial Units: **1,480 Units**
- Animated counter statistics, Chart.js demographic charts, and gender ratio breakdown.

### 3 & 4. Mandals & Gram Panchayats Explorer
- Comprehensive directory of all 38 mandals with interactive search, revenue division filtering, and detailed profile modal views.
- Deep-dive Village database featuring population breakdowns, sex ratios, children/senior citizens counts, and public amenities (schools, PHCs, drinking water, 3-phase electricity, 4G/fiber internet).

### 5. Google Maps & Interactive GIS Map
- High-precision district boundary polygons with facility layer toggles:
  - 🏥 Hospitals & Health Centers (Red)
  - 🎓 Schools, Colleges & Universities (Blue)
  - 🏭 Industries & SEZs (Purple)
  - 🚢 Maritime Ports (Cyan)
  - 🚆 Railway Junctions & Stations (Amber)
  - 🚌 Bus Complexes & Depots (Orange)
  - 🌾 Agricultural Areas & Reservoirs (Green)
- Dual-engine capability: Runs out-of-the-box via Leaflet/CartoDB Vector layers with an integrated option to activate native **Google Maps JavaScript API**.

### 6. Agriculture & Land Information
- Complete land balance: Farmland (5.83L Ha), Reserve Forests (2.64L Ha), Water bodies & Wetlands (1.24L Ha), Residential settlements (48,900 Ha), Industrial zones (34,200 Ha).
- **Per-Person Land Availability Formula:**
  $$\text{Per-Person Land} = \frac{\text{Total Geographical Area (13,076 km²)}}{\text{Total Population (2,963,557)}} = 0.441\text{ Hectares (1.09 Acres)}$$
- Interactive Population Sensitivity Slider to model the impact of future population changes on per-person land share.
- Major crops tracker: Nellore Molagolukulu paddy, Vannamei shrimp aquaculture, Gudur sour lemons, sugarcane, groundnut, and pulses.

### 7. Exports & Imports (District Marketing & Business Directory)
- **Export Powerhouse:** Asia's shrimp capital (₹11,400 Cr), non-basmati rice exports (₹3,850 Cr), Apache athletic footwear SEZ (₹2,450 Cr), Gudur mica & silica sand (₹2,140 Cr), and Venkatagiri GI-tagged handlooms (₹480 Cr).
- **Port Operations:** Adani Krishnapatnam Deep-Water Port (18.5m draft, 75 MMT capacity, coal, edible oil, and fertilizer terminals).
- **Verified Business Directory & Registration:** Local businesses can register their enterprises, submit product specifications, and receive verified badges.

### 8. Transport & Infrastructure
- National Highway 16 (168 km in district), Gudur Junction & Nellore South Central Railway stations, APSRTC 60-bay terminal, Somasila Reservoir, and the proposed **Nellore Dagadarthi Greenfield Airport** (1,385 acres).

### 9. Nellore 2036 – Future Development Vision
- AI-modeled 10-year development trajectories (2026 to 2036).
- Milestones covering Smart Village Fiber grids, CBIC industrial nodes, green hydrogen maritime ports, 3,000 MW renewable energy belts, and net-zero emissions targets.
- Transparent distinction between **Officially Approved Projects** and **Visionary Estimates**.

### 10. Education, Healthcare, Jobs & Citizen Grievance
- Public directory of major universities, medical colleges, and government offices.
- Live job board with active vacancies, remuneration, and direct recruiter links.
- Collectorate feedback and grievance submission form with real-time tracking in the Administrator Console.

### 11. Reports & Data Exports
- One-click downloads for:
  - 38 Mandals Census & Facility Dataset (`.csv`)
  - Agriculture Acreage & Crop Production (`.csv`)
  - Merchandise Trade & Seaport Cargo (`.csv`)
  - Formatted Official District Dossier (`.pdf` / Print Ready)

---

## 🛠️ Technology Stack
- **Frontend:** HTML5, Tailwind CSS, FontAwesome 6, Chart.js 4.4, Leaflet GIS, Google Maps JavaScript API, Client-side Blob & PDF Exporters.
- **Backend:** Python 3 standard library `http.server` & `urllib` with RESTful JSON endpoints.
- **Database:** SQLite 3 (`nellore_portal.db`) with relational tables and comprehensive seed datasets.
- **Architecture:** Dual-Mode Offline-First + Live REST API sync.

---

## 🏃 How to Run

### Step 1: Initialize Database (If needed)
```bash
python3 nellore_portal/backend/database.py
```

### Step 2: Start the Web & REST API Server
```bash
python3 nellore_portal/backend/server.py
```

### Step 3: Access the Portal
Open your web browser and navigate to:
```
http://localhost:8080
```
*(Or simply open `nellore_portal/frontend/index.html` directly in any web browser for offline standalone mode).*

### Demo Credentials:
- **District Administrator:** `admin` / `admin123`
- **Citizen User:** `citizen` / `citizen123`
- **Farmer / Agro User:** `farmer` / `farmer123`
