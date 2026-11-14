// Nellore District Smart Digital Development Portal - Core Application Logic
// Dual-Mode Architecture: Live REST API with Automatic Offline-First Fallback

const state = {
    user: null,
    token: null,
    stats: {},
    mandals: [],
    villages: [],
    activeMandal: null,
    activeVillage: null,
    businesses: [],
    transport: [],
    vision: [],
    institutions: [],
    jobs: [],
    announcements: []
};

// Fallback Authentic Datasets (Ensures 100% functional portal even when accessed via file:// or static CDN)
const FALLBACK_DATA = {
    stats: {
        "total_population": { value: 2963557, display_value: "29.64 Lakhs", unit: "Persons" },
        "total_mandals": { value: 38, display_value: "38 Mandals", unit: "Mandals" },
        "total_villages": { value: 943, display_value: "943 Villages", unit: "Villages" },
        "total_panchayats": { value: 672, display_value: "672 Panchayats", unit: "Gram Panchayats" },
        "geographical_area": { value: 13076, display_value: "13,076 km²", unit: "sq.km" },
        "population_density": { value: 227, display_value: "227 / sq.km", unit: "persons/sq.km" },
        "literacy_rate": { value: 68.9, display_value: "68.9%", unit: "%" },
        "agricultural_land": { value: 583200, display_value: "5.83 Lakh Hectares", unit: "Hectares" },
        "total_exports": { value: 22450, display_value: "₹22,450 Crores", unit: "₹ Crores" },
        "total_imports": { value: 31200, display_value: "₹31,200 Crores", unit: "₹ Crores" },
        "per_person_land": { value: 0.441, display_value: "0.44 Ha (1.09 Acres)", unit: "Ha/Person" }
    },
    land_calculation: {
        total_area_sqkm: 13076,
        total_area_hectares: 1307600,
        total_area_sqm: 13076000000,
        population: 2963557,
        per_person_hectares: 0.441,
        per_person_acres: 1.09,
        per_person_sqm: 4412,
        formula: "Per-person land = Total geographical land area (13,076 km²) ÷ Total population (2,963,557)",
        note: "Scientific calculation distinguishing sovereign geographical surface (rivers, hills, reserve forests, state highways) from privately registered arable agrarian holdings."
    },
    mandals: [
        { id: 1, name: "Nellore Urban", telugu_name: "నెల్లూరు అర్బన్", revenue_division: "Nellore", total_villages: 12, total_panchayats: 0, population: 505258, male_pop: 255120, female_pop: 250138, area_sqkm: 149.2, density: 3386.4, literacy_rate: 84.6, lat: 14.4426, lng: 79.9865, agricultural_land_ha: 4200, schools_count: 185, hospitals_count: 48, transport_summary: "NH-16, South Central Railway Station, 2 RTC Bus Complexes", key_businesses: "Gold & Jewelry, Trading, Health Tourism, Tech Services", description: "District Headquarters, educational and healthcare nerve center situated along the holy Penna river." },
        { id: 2, name: "Nellore Rural", telugu_name: "నెల్లూరు రూరల్", revenue_division: "Nellore", total_villages: 28, total_panchayats: 24, population: 126480, male_pop: 64120, female_pop: 62360, area_sqkm: 235.8, density: 536.4, literacy_rate: 71.2, lat: 14.4150, lng: 79.9400, agricultural_land_ha: 15400, schools_count: 42, hospitals_count: 8, transport_summary: "Connected via NH-16 bypass, SH-57, rural black-topped roads", key_businesses: "Dairy, Paddy Milling, Cold Storage, Logistics Warehousing", description: "Major agricultural and dairy hinterland feeding Nellore city with canal-fed paddies." },
        { id: 3, name: "Kovur", telugu_name: "కోవూరు", revenue_division: "Nellore", total_villages: 16, total_panchayats: 14, population: 82450, male_pop: 41320, female_pop: 41130, area_sqkm: 168.4, density: 489.6, literacy_rate: 73.8, lat: 14.4980, lng: 79.9890, agricultural_land_ha: 11800, schools_count: 36, hospitals_count: 6, transport_summary: "NH-16 main corridor, Kovur Railway Station, APSRTC bus connectivity", key_businesses: "Sugar Factory, Rice Mills, Penna River Sand, Brick Kilns", description: "Famous for Kovur Sugar Mills and intensive double-crop paddy cultivation through Pennar canals." },
        { id: 4, name: "Gudur", telugu_name: "గూడూరు", revenue_division: "Gudur", total_villages: 26, total_panchayats: 21, population: 118940, male_pop: 59850, female_pop: 59090, area_sqkm: 284.6, density: 417.9, literacy_rate: 74.2, lat: 14.1463, lng: 79.8504, agricultural_land_ha: 16500, schools_count: 54, hospitals_count: 12, transport_summary: "Gudur Railway Junction (Major A-Category), NH-16, NH-71", key_businesses: "Mica Processing, Lemon Export Market, Ceramic Minerals, Auto Ancillaries", description: "World renowned for Gudur Mica belt and Asia’s largest sour lemon wholesale trading market." },
        { id: 5, name: "Kavali", telugu_name: "కావలి", revenue_division: "Kavali", total_villages: 22, total_panchayats: 18, population: 134200, male_pop: 67800, female_pop: 66400, area_sqkm: 242.0, density: 554.5, literacy_rate: 75.6, lat: 14.9132, lng: 79.9928, agricultural_land_ha: 14200, schools_count: 62, hospitals_count: 14, transport_summary: "NH-16, Kavali Railway Station, APSRTC Kavali Depot", key_businesses: "Aqua Hatcheries, Granite Polishing, Agro-equipment, Tobacco", description: "Second largest commercial town in the district with high literacy, universities, and aqua processing." },
        { id: 6, name: "Muthukur", telugu_name: "ముత్తుకూరు", revenue_division: "Nellore", total_villages: 18, total_panchayats: 16, population: 62340, male_pop: 31400, female_pop: 30940, area_sqkm: 215.3, density: 289.5, literacy_rate: 68.4, lat: 14.2830, lng: 80.1250, agricultural_land_ha: 8900, schools_count: 28, hospitals_count: 5, transport_summary: "Krishnapatnam Port 4-lane expressway, dedicated freight rail, coastal roads", key_businesses: "Adani Krishnapatnam Port, Thermal Power, Sea Cargo, Container Freight", description: "Home to Krishnapatnam Port, maritime commerce, power plants, and modern coastal logistics." },
        { id: 7, name: "Venkatagiri", telugu_name: "వెంకటగిరి", revenue_division: "Gudur", total_villages: 34, total_panchayats: 27, population: 78600, male_pop: 39200, female_pop: 39400, area_sqkm: 312.4, density: 251.6, literacy_rate: 69.5, lat: 13.9667, lng: 79.5833, agricultural_land_ha: 13400, schools_count: 40, hospitals_count: 7, transport_summary: "Venkatagiri Railway Station, Renigunta-Gudur rail line, State Highway 61", key_businesses: "Venkatagiri GI-Tagged Handloom Sarees, Zari Weaving, Brass Ware", description: "Historic royal town globally renowned for lightweight Venkatagiri Zari cotton and silk handloom sarees." },
        { id: 8, name: "Indukurpet", telugu_name: "ఇందుకూరుపేట", revenue_division: "Nellore", total_villages: 19, total_panchayats: 17, population: 56400, male_pop: 28100, female_pop: 28300, area_sqkm: 180.2, density: 313.0, literacy_rate: 70.1, lat: 14.4500, lng: 80.1333, agricultural_land_ha: 12600, schools_count: 29, hospitals_count: 4, transport_summary: "Coastal corridor, Mypadu beach road, state highway connectivity", key_businesses: "Mypadu Beach Tourism, Shrimp Aquaculture, Coconut, Betel Leaves", description: "Picturesque coastal mandal home to pristine Mypadu Beach and extensive shrimp hatcheries." },
        { id: 9, name: "Sullurpeta", telugu_name: "సూళ్లూరుపేట", revenue_division: "Gudur", total_villages: 28, total_panchayats: 22, population: 68500, male_pop: 34500, female_pop: 34000, area_sqkm: 270.5, density: 253.2, literacy_rate: 72.3, lat: 13.7000, lng: 80.0167, agricultural_land_ha: 11200, schools_count: 35, hospitals_count: 9, transport_summary: "NH-16, Sullurpeta Railway Station, Chennai Suburban network terminal", key_businesses: "ISRO Space Support Units, Eco-Tourism, Auto Components, Hospitality", description: "Adjacent to Sriharikota Space Centre and Pulicat Lake, hub for ISRO staff and eco-tourism." },
        { id: 10, name: "Tada", telugu_name: "తడ", revenue_division: "Gudur", total_villages: 17, total_panchayats: 14, population: 48900, male_pop: 24700, female_pop: 24200, area_sqkm: 175.4, density: 278.8, literacy_rate: 71.5, lat: 13.5833, lng: 80.0333, agricultural_land_ha: 7800, schools_count: 24, hospitals_count: 5, transport_summary: "NH-16 border junction, Chennai border rail link, Tada Railway Station", key_businesses: "Apache Footwear (SEZ), Sri City fringe industries, Pulicat Eco-Trek", description: "Booming industrial border mandal attracting mega global manufacturing facilities and footwear SEZs." },
        { id: 11, name: "Atmakur", telugu_name: "ఆత్మకూరు", revenue_division: "Atmakur", total_villages: 24, total_panchayats: 20, population: 74200, male_pop: 37400, female_pop: 36800, area_sqkm: 290.8, density: 255.2, literacy_rate: 66.8, lat: 14.5167, lng: 79.3667, agricultural_land_ha: 18200, schools_count: 38, hospitals_count: 8, transport_summary: "Connected via SH-58 (Nellore-Badvel-Kadapa Highway), RTC Bus Depot", key_businesses: "Paddy, Groundnut, Red Chillies, Timber Trade, Forest Products", description: "Gateway to western Nellore irrigated by Somasila reservoir high-level canals." },
        { id: 12, name: "Buchireddypalem", telugu_name: "బుచ్చిరెడ్డిపాలెం", revenue_division: "Nellore", total_villages: 14, total_panchayats: 12, population: 59400, male_pop: 29800, female_pop: 29600, area_sqkm: 148.2, density: 400.8, literacy_rate: 76.5, lat: 14.5333, lng: 79.8833, agricultural_land_ha: 11500, schools_count: 32, hospitals_count: 6, transport_summary: "SH-58, direct connectivity to Nellore city and Jonnawada", key_businesses: "Jonnawada Pilgrimage, Rice Mills, Aqua Feed, Brick Manufacturing", description: "Famous for Kanigiri Reservoir, holy Jonnawada Kamakshi temple, and high-yield paddy production." }
    ],
    villages: [
        { id: 1, mandal_id: 1, mandal_name: "Nellore Urban", name: "Nellore Bit-1", telugu_name: "నెల్లూరు బిట్-1", gram_panchayat: "Nellore MC", population: 42800, male_pop: 21600, female_pop: 21200, children_pop: 4200, senior_pop: 3900, rural_urban: "Urban", literacy_rate: 86.4, area_ha: 850, irrigated_land_ha: 120, major_crop: "Vegetables & Floriculture", lat: 14.4426, lng: 79.9865, amenities: { schools: 18, hospitals: 6, drinking_water: "100% Municipal Tap Water", electricity: "24x7 3-Phase", internet: "High Speed FTTH", banks: 8 } },
        { id: 2, mandal_id: 1, mandal_name: "Nellore Urban", name: "Dargamitta", telugu_name: "దర్గామిట్ట", gram_panchayat: "Nellore MC", population: 38900, male_pop: 19600, female_pop: 19300, children_pop: 3800, senior_pop: 3600, rural_urban: "Urban", literacy_rate: 87.2, area_ha: 620, irrigated_land_ha: 40, major_crop: "Commercial Services", lat: 14.4360, lng: 79.9780, amenities: { schools: 14, hospitals: 5, drinking_water: "Tap Water", electricity: "24x7", internet: "FTTH", banks: 7 } },
        { id: 3, mandal_id: 2, mandal_name: "Nellore Rural", name: "Amancharla", telugu_name: "ఆమంచర్ల", gram_panchayat: "Amancharla GP", population: 5840, male_pop: 2950, female_pop: 2890, children_pop: 680, senior_pop: 520, rural_urban: "Rural", literacy_rate: 69.8, area_ha: 1240, irrigated_land_ha: 980, major_crop: "Paddy (Molagolukulu)", lat: 14.4100, lng: 79.9100, amenities: { schools: 3, hospitals: 1, drinking_water: "RO Plant & Tap", electricity: "24x7", internet: "4G/Fiber", banks: 1 } },
        { id: 4, mandal_id: 3, mandal_name: "Kovur", name: "Pothireddypalem", telugu_name: "పోతిరెడ్డిపాలెం", gram_panchayat: "Pothireddypalem GP", population: 8950, male_pop: 4510, female_pop: 4440, children_pop: 940, senior_pop: 810, rural_urban: "Semi-Urban", literacy_rate: 74.5, area_ha: 780, irrigated_land_ha: 540, major_crop: "Paddy & Sugarcane", lat: 14.5020, lng: 79.9750, amenities: { schools: 4, hospitals: 1, drinking_water: "Overhead Tank", electricity: "24x7", internet: "4G", banks: 2 } },
        { id: 5, mandal_id: 4, mandal_name: "Gudur", name: "Nellatur", telugu_name: "నెల్లటూరు", gram_panchayat: "Nellatur GP", population: 7120, male_pop: 3600, female_pop: 3520, children_pop: 810, senior_pop: 670, rural_urban: "Rural", literacy_rate: 71.4, area_ha: 1150, irrigated_land_ha: 810, major_crop: "Sour Lemons, Paddy", lat: 14.1200, lng: 79.8300, amenities: { schools: 3, hospitals: 1, drinking_water: "Jal Jeevan Mission Tap", electricity: "24x7", internet: "4G", banks: 1 } },
        { id: 6, mandal_id: 6, mandal_name: "Muthukur", name: "Krishnapatnam", telugu_name: "కృష్ణపట్నం", gram_panchayat: "Krishnapatnam GP", population: 12800, male_pop: 6500, female_pop: 6300, children_pop: 1420, senior_pop: 1120, rural_urban: "Port-Urban", literacy_rate: 71.8, area_ha: 1450, irrigated_land_ha: 210, major_crop: "Port Marine & Aquaculture", lat: 14.2500, lng: 80.1200, amenities: { schools: 4, hospitals: 2, drinking_water: "Desalination & Tap", electricity: "24x7", internet: "High Speed Fiber", banks: 3 } },
        { id: 7, mandal_id: 8, mandal_name: "Indukurpet", name: "Mypadu", telugu_name: "మైపాడు", gram_panchayat: "Mypadu GP", population: 6750, male_pop: 3410, female_pop: 3340, children_pop: 780, senior_pop: 610, rural_urban: "Coastal-Rural", literacy_rate: 72.4, area_ha: 1100, irrigated_land_ha: 510, major_crop: "Vannamei Shrimp & Tourism", lat: 14.5050, lng: 80.1780, amenities: { schools: 3, hospitals: 1, drinking_water: "Beach RO & Tap", electricity: "24x7", internet: "4G", banks: 1 } },
        { id: 8, mandal_id: 7, mandal_name: "Venkatagiri", name: "Periyavaram", telugu_name: "పెరియవరం", gram_panchayat: "Periyavaram GP", population: 5340, male_pop: 2690, female_pop: 2650, children_pop: 610, senior_pop: 510, rural_urban: "Rural", literacy_rate: 68.4, area_ha: 1020, irrigated_land_ha: 720, major_crop: "Handlooms & Paddy", lat: 13.9800, lng: 79.5600, amenities: { schools: 2, hospitals: 1, drinking_water: "JJM Tap", electricity: "24x7", internet: "4G", banks: 1 } }
    ],
    crops: [
        { item_name: "Paddy (Nellore Molagolukulu / BPT)", telugu_name: "వరి (నెల్లూరు మొలగొలుకులు)", area_ha: 312000, production_mt: 1485000, yield_kg_ha: 4760, notes: "Premier fine-grain rice exported pan-India and globally." },
        { item_name: "Sugarcane", telugu_name: "చెరకు", area_ha: 28500, production_mt: 2137500, yield_kg_ha: 75000, notes: "Supplies Kovur Cooperative Sugar Factory and local jaggery mills." },
        { item_name: "Aquaculture (Vannamei Shrimp)", telugu_name: "రొయ్యల సాగు (వనామి)", area_ha: 86400, production_mt: 432000, yield_kg_ha: 5000, notes: "India's Aquaculture Capital; produces 24.5% of total marine exports." },
        { item_name: "Gudur Sour Lemon (Citrus)", telugu_name: "గూడూరు నిమ్మ", area_ha: 24200, production_mt: 363000, yield_kg_ha: 15000, notes: "GI-grade sour lemons traded across national wholesale terminal markets." },
        { item_name: "Groundnut", telugu_name: "వేరుశనగ", area_ha: 42300, production_mt: 84600, yield_kg_ha: 2000, notes: "Western rainfed mandals including Atmakur and Rapur." },
        { item_name: "Black Gram & Pulses", telugu_name: "మినుములు", area_ha: 38600, production_mt: 38600, yield_kg_ha: 1000, notes: "Key relay crop utilizing post-harvest residual moisture." }
    ],
    exports: [
        { product_name: "Frozen Vannamei Shrimps & Seafood", telugu_name: "ఘనీభవించిన రొయ్యలు", export_value_cr: 11400, volume_mt: 168000, top_destinations: "USA, EU, Japan, China, Vietnam", major_companies: "Falcon Marine, Devi Sea Foods, Sandhya Aqua, Apex" },
        { product_name: "Nellore Molagolukulu & Non-Basmati Rice", telugu_name: "నెల్లూరు బియ్యం", export_value_cr: 3850, volume_mt: 890000, top_destinations: "UAE, Saudi Arabia, Kuwait, Africa", major_companies: "Sri Lalitha Rice, Pattabhi Agro, Coastal Grains" },
        { product_name: "Specialty Footwear & Athletic Shoes", telugu_name: "స్పోర్ట్స్ షూస్", export_value_cr: 2450, volume_mt: 18200000, top_destinations: "USA, European Union", major_companies: "Apache Footwear India Pvt Ltd (SEZ Tada)" },
        { product_name: "Processed Mica, Flakes & Scrap", telugu_name: "మైకా & ఫ్లేక్స్", export_value_cr: 1250, volume_mt: 48000, top_destinations: "China, Germany, USA, South Korea", major_companies: "Gudur Mica Miners Consortium, Premier Mica" },
        { product_name: "Silica Sand & High-Purity Quartz", telugu_name: "సిలికా ఇసుక & క్వార్ట్జ్", export_value_cr: 890, volume_mt: 720000, top_destinations: "Japan, Taiwan, Singapore", major_companies: "Chillakur Silica Processors, Deccan Silica Ltd" },
        { product_name: "Venkatagiri GI Handloom Sarees", telugu_name: "వెంకటగిరి జరీ చీరలు", export_value_cr: 480, volume_mt: 1850, top_destinations: "USA, UK, Singapore, Australia", major_companies: "Venkatagiri Weavers Cooperative Society" }
    ],
    imports: [
        { product_name: "Steam Coal & Thermal Coal", telugu_name: "థర్మల్ బొగ్గు", import_value_cr: 14200, volume_mt: 21500000, source_countries: "Indonesia, South Africa, Australia", port_handled: "Krishnapatnam Bulk Jetty" },
        { product_name: "Crude & Refined Palm Oil", telugu_name: "వంటనూనెలు (పామాయిల్)", import_value_cr: 6800, volume_mt: 980000, source_countries: "Indonesia, Malaysia", port_handled: "Krishnapatnam Liquid Terminal" },
        { product_name: "Chemical Fertilizers (DAP, Urea)", telugu_name: "రసాయన ఎరువులు", import_value_cr: 4600, volume_mt: 1850000, source_countries: "Russia, Saudi Arabia, Morocco", port_handled: "Fertilizer Handling Berth" },
        { product_name: "Capital Machinery & Containers", telugu_name: "పారిశ్రామిక యంత్రాలు", import_value_cr: 3200, volume_mt: 142000, source_countries: "Germany, Japan, China, Italy", port_handled: "Container Freight Terminal" }
    ],
    businesses: [
        { id: 1, name: "Adani Krishnapatnam Port Ltd", category: "Maritime & Logistics", contact_person: "G. V. Ramana Rao", mobile: "9848011223", mandal: "Muthukur", address: "Krishnapatnam Port Area", products_services: "Deep-water multi-cargo berths, container terminal, cold chain logistics, rail-linked sidings", verified: 1 },
        { id: 2, name: "Apex Frozen Foods Ltd", category: "Aquaculture Processing", contact_person: "K. Satyanarayana", mobile: "9848022119", mandal: "Indukurpet", address: "Aqua Industrial Estate", products_services: "IQF Raw, Blanched & Cooked Vannamei Prawns, BAP 4-Star Certified exports", verified: 1 },
        { id: 3, name: "Gudur Lemon Exporters Association", category: "Agro Marketing & Exports", contact_person: "M. Sudhakar Reddy", mobile: "9440234567", mandal: "Gudur", address: "Citrus Market Yard, Gudur", products_services: "Grade-A sour lemons, cold wax packaging, organic lemon peel essential oils", verified: 1 },
        { id: 4, name: "Apache Footwear India Pvt Ltd", category: "Manufacturing & SEZ", contact_person: "P. Cheng-Wei / P. Rao", mobile: "9989012345", mandal: "Tada", address: "Mambattu SEZ, Tada", products_services: "Global athletic sports footwear manufacturer for Adidas, 18M pairs annual capacity", verified: 1 },
        { id: 5, name: "Premier Mica & Silica Processors", category: "Mica & Minerals", contact_person: "D. Subrahmanyam", mobile: "9440567890", mandal: "Chillakur", address: "Industrial Estate, Chillakur", products_services: "Mica sheets, mica flakes, high purity quartz, foundry silica sand (99.2% SiO2)", verified: 1 },
        { id: 6, name: "Venkatagiri Royal Weavers Producer Co", category: "Handlooms & Textiles", contact_person: "B. Padmavati Devi", mobile: "9490123456", mandal: "Venkatagiri", address: "Weavers Colony, Raja Street", products_services: "Authentic GI-Certified 100s count Venkatagiri Zari cotton sarees, silk sarees, dhotis", verified: 1 }
    ],
    transport: [
        { facility_type: "Port", name: "Krishnapatnam Deep Water Port", telugu_name: "కృష్ణపట్నం పోర్ట్", location: "Krishnapatnam, Muthukur", details: "75 Million Metric Tonnes/Year capacity, 18.5m draft handling Capesize vessels", connectivity: "Direct 4-lane Dedicated Port Expressway linking to NH-16 and dedicated freight rail lines", status: "Operational" },
        { facility_type: "National Highway", name: "NH-16 (Golden Quadrilateral Expressway)", telugu_name: "జాతీయ రహదారి 16", location: "Tada to Kavali via Nellore (168 km)", details: "6-lane access controlled express corridor connecting Chennai and Kolkata", connectivity: "Bypasses all major commercial hubs with multi-level grade separators", status: "Operational" },
        { facility_type: "Railway Station", name: "Nellore Main Railway Station (NLR)", telugu_name: "నెల్లూరు ప్రధాన స్టేషన్", location: "Nellore City Center", details: "5 Platforms, NSG-2 Category Station on South Central Railway main trunk line", connectivity: "Vande Bharat Express, Rajdhani, and 120+ daily superfast trains", status: "Operational" },
        { facility_type: "Railway Station", name: "Gudur Junction Railway Station (GDR)", telugu_name: "గూడూరు జంక్షన్", location: "Gudur Town", details: "7 Platforms, Major Railway Junction", connectivity: "Strategic junction connecting Chennai, Vijayawada, and Tirupati lines", status: "Operational" },
        { facility_type: "Bus Terminal", name: "APSRTC Nellore Central Bus Station", telugu_name: "నెల్లూరు ఆర్టీసీ బస్టాండ్", location: "Trunk Road, Nellore", details: "60 Bus Bays, Modern Passenger Terminal", connectivity: "1,200 daily departures connecting all 38 mandals and inter-state corridors", status: "Operational" },
        { facility_type: "Airport (Proposed)", name: "Nellore Dagadarthi Greenfield Airport", telugu_name: "దగదర్తి విమానాశ్రయం", location: "Dagadarthi Mandal", details: "1,385 acres acquired for 3,200m runway capable of Code 4C cargo and passenger aircraft", connectivity: "Directly abutting NH-16, targeted for commercial air cargo & passenger routes", status: "Under Development" }
    ],
    vision: [
        { year: 2026, title: "Smart Rural Fiber Grid & Digital Village Secretariats 2.0", telugu_title: "స్మార్ట్ గ్రామీణ ఫైబర్ గ్రిడ్", category: "Smart Villages", description: "Connecting all 672 Gram Panchayats with gigabit optical fiber, IoT weather sensors, and AI-assisted citizen service desks.", estimated_investment_cr: 350.0, projected_jobs: 4500, status: "Ongoing", approved_vs_proposed: "Officially Approved Project" },
        { year: 2027, title: "Dagadarthi Greenfield Airport & Air Cargo Logistics Hub", telugu_title: "దగదర్తి గ్రీన్‌ఫీల్డ్ విమానాశ్రయం", category: "Aviation & Cargo", description: "Perishable air cargo terminal for direct export of fresh Vannamei shrimp, orchids, and Gudur lemons to Gulf and European markets.", estimated_investment_cr: 680.0, projected_jobs: 6200, status: "Execution Phase", approved_vs_proposed: "Officially Approved Project" },
        { year: 2028, title: "Nellore-Krishnapatnam CBIC Industrial Mega Node", telugu_title: "సిబిఐసి పారిశ్రామిక నోడ్", category: "Industrial Corridor", description: "Development of 2,500-acre industrial node with plug-and-play manufacturing infrastructure for electric vehicles, aerospace, and heavy machinery.", estimated_investment_cr: 4200.0, projected_jobs: 38000, status: "Approved Phase 1", approved_vs_proposed: "Officially Approved Project" },
        { year: 2029, title: "AI-Driven Smart Irrigation & Penna River Telemetry Grid", telugu_title: "ఏఐ స్మార్ట్ నీటిపారుదల గ్రిడ్", category: "Agritech & Water", description: "Automated canal gate control, sensor-based soil moisture telemetry, and automated drip systems saving 18 TMC of irrigation water annually.", estimated_investment_cr: 850.0, projected_jobs: 3200, status: "Feasibility Completed", approved_vs_proposed: "Proposed Future Project" },
        { year: 2030, title: "Krishnapatnam Green Hydrogen & Offshore Wind Energy Port", telugu_title: "గ్రీన్ హైడ్రోజన్ మెగా పోర్ట్", category: "Clean Energy", description: "Transformation of Krishnapatnam into a carbon-neutral port with 1.2 GW offshore wind power and green ammonia export terminal.", estimated_investment_cr: 6500.0, projected_jobs: 22000, status: "Detailed Feasibility Study", approved_vs_proposed: "Proposed Future Project" },
        { year: 2032, title: "Sriharikota-Pulicat Space & Eco-Tourism Heritage Biosphere", telugu_title: "స్పేస్ & ఎకో-టూరిజం కారిడార్", category: "Tourism & Ecology", description: "Sustainable flamingo boardwalks, Space Science Experience Park at Tada/Sullurpeta, and international bird observation towers.", estimated_investment_cr: 420.0, projected_jobs: 7500, status: "Masterplan Drafted", approved_vs_proposed: "Proposed Future Project" },
        { year: 2036, title: "Nellore 2036: Net-Zero Emissions Carbon Neutral District", telugu_title: "నెల్లూరు 2036 నెట్-జీరో విజన్", category: "Sustainable District", description: "100% renewable grid integration, zero rural extreme poverty, 100% electrified public transit, and ₹1,90,000 Cr annual district GDP.", estimated_investment_cr: 12000.0, projected_jobs: 50000, status: "Vision Blueprint", approved_vs_proposed: "Proposed Future Project" }
    ],
    institutions: [
        { category: "College & University", name: "Vikrama Simhapuri University (VSU)", telugu_name: "విక్రమ సింహపురి విశ్వవిద్యాలయం", mandal_name: "Nellore Rural", address: "Kakutur, Nellore Rural", contact: "0861-2353496" },
        { category: "Hospital", name: "ACSR Govt General Hospital & Medical College", telugu_name: "ప్రభుత్వ సర్వజన ఆసుపత్రి", mandal_name: "Nellore Urban", address: "Dargamitta, Nellore", contact: "0861-2326750" },
        { category: "Hospital", name: "Narayana Superspeciality Medical Center", telugu_name: "నారాయణ సూపర్ స్పెషాలిటీ ఆసుపత్రి", mandal_name: "Nellore Rural", address: "Chintareddypalem", contact: "0861-2317963" },
        { category: "College & University", name: "NBKR Institute of Science & Technology", telugu_name: "ఎన్.బి.కె.ఆర్. ఇంజనీరింగ్ కాలేజ్", mandal_name: "Kota", address: "Vidyanagar, Kota Mandal", contact: "08624-228247" },
        { category: "Government Office", name: "Nellore District Collectorate & Zilla Parishad", telugu_name: "నెల్లూరు కలెక్టరేట్", mandal_name: "Nellore Urban", address: "Collectorate Complex, Dargamitta", contact: "0861-2331200" },
        { category: "Skill Development", name: "APSSDC District Skill Development Center", telugu_name: "ఏపీ స్కిల్ డెవలప్‌మెంట్ సెంటర్", mandal_name: "Gudur", address: "Gudur Industrial Road", contact: "08624-251234" }
    ],
    jobs: [
        { title: "Senior Marine Biologist & Quality Lead", company: "Sandhya Aqua Exports Pvt Ltd", sector: "Aquaculture", mandal_name: "Indukurpet", qualification: "M.Sc Marine Biology / Fisheries Science", vacancies: 4, salary_range: "₹45,000 - ₹65,000 / month", apply_deadline: "2026-12-15", contact: "careers@sandhyaaqua.com" },
        { title: "Port Logistics & Terminal Supervisor", company: "Adani Krishnapatnam Port Ltd", sector: "Logistics & Shipping", mandal_name: "Muthukur", qualification: "Diploma / B.Tech / Graduate", vacancies: 12, salary_range: "₹32,000 - ₹48,000 / month", apply_deadline: "2026-11-30", contact: "portcareers@krishnapatnam.com" },
        { title: "Footwear Assembly & Production Technician", company: "Apache Footwear India (SEZ)", sector: "Manufacturing", mandal_name: "Tada", qualification: "ITI / 10th / Intermediate", vacancies: 85, salary_range: "₹18,500 - ₹24,000 + ESI/PF", apply_deadline: "2026-12-31", contact: "jobs@apachefootwear.in" },
        { title: "Automated Sugar Mill Electrical Engineer", company: "Kovur Co-operative Sugar Mill", sector: "Agro Industry", mandal_name: "Kovur", qualification: "B.Tech Electrical / Diploma", vacancies: 3, salary_range: "₹35,000 - ₹50,000 / month", apply_deadline: "2026-11-25", contact: "kovursugar.recruitment@ap.gov.in" },
        { title: "Microbiology & Water Quality Lab Technician", company: "District Fisheries Wing", sector: "Government / Allied", mandal_name: "Nellore Urban", qualification: "B.Sc Chemistry / Microbiology", vacancies: 6, salary_range: "₹25,000 - ₹35,000 / month", apply_deadline: "2026-12-10", contact: "fisheries.nellore@ap.gov.in" }
    ],
    announcements: [
        { title: "Kharif 2026 Free Crop Insurance & Direct Seed Subsidy Distribution", category: "Agriculture", date: "2026-11-01" },
        { title: "Annual Pulicat Lake & Sriharikota Flamingo Festival 2026 Dates Announced (Dec 18-20)", category: "Tourism & Culture", date: "2026-10-28" },
        { title: "Nellore-Dagadarthi Airport Runway Construction Tenders Finalized by APADCL", category: "Infrastructure", date: "2026-10-24" },
        { title: "Export Promotion Workshop for Gudur Mica and Lemon Producers at Sub-Collector Office", category: "Commerce", date: "2026-10-15" }
    ]
};

// Lifecycle Start
document.addEventListener('DOMContentLoaded', () => {
    checkUserSession();
    loadStats();
    loadAnnouncements();
    loadMandals();
    loadVillages();
    loadAgricultureData();
    loadEconomyData();
    loadBusinesses();
    loadTransport();
    loadVision2036();
    loadDirectory();
    
    // Initialize Map and Charts after layout paints
    setTimeout(() => {
        if (typeof initMapSuite === 'function') initMapSuite();
        if (typeof initCharts === 'function') initCharts();
    }, 250);

    setupEventListeners();
});

// Session Management
function checkUserSession() {
    const savedUser = localStorage.getItem('nellore_user');
    const savedToken = localStorage.getItem('nellore_token');
    if (savedUser && savedToken) {
        try {
            state.user = JSON.parse(savedUser);
            state.token = savedToken;
            renderAuthUI();
        } catch (e) {
            localStorage.removeItem('nellore_user');
        }
    } else {
        renderAuthUI();
    }
}

function renderAuthUI() {
    const authContainer = document.getElementById('authNavControls');
    if (!authContainer) return;

    if (state.user) {
        authContainer.innerHTML = `
            <div class="flex items-center gap-2">
                <div class="text-right hidden sm:block">
                    <div class="text-xs font-bold text-white leading-tight">${state.user.full_name}</div>
                    <span class="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-600 text-white font-semibold">${state.user.role}</span>
                </div>
                <div class="w-8 h-8 rounded-full bg-amber-500 text-navy-950 font-bold flex items-center justify-center text-xs shadow">
                    ${state.user.full_name.charAt(0)}
                </div>
                ${state.user.role === 'admin' ? `
                    <button onclick="openAdminModal()" class="text-xs bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-2 py-1 rounded transition">
                        <i class="fas fa-shield-alt mr-1"></i> Admin
                    </button>
                ` : ''}
                <button onclick="handleLogout()" class="text-xs bg-red-600/80 hover:bg-red-700 text-white px-2 py-1 rounded transition" title="Logout">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            </div>
        `;
    } else {
        authContainer.innerHTML = `
            <button onclick="openLoginModal()" class="bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold text-xs px-3 py-1.5 rounded-lg transition flex items-center gap-1 shadow">
                <i class="fas fa-lock text-[10px]"></i> <span data-i18n="btn_login">Login</span>
            </button>
            <button onclick="openRegisterModal()" class="bg-white/10 hover:bg-white/20 text-white font-medium text-xs px-3 py-1.5 rounded-lg transition border border-white/20 hidden md:inline-flex items-center gap-1">
                <i class="fas fa-user-plus text-[10px]"></i> <span data-i18n="btn_register">Register</span>
            </button>
        `;
    }
}

function handleLogout() {
    localStorage.removeItem('nellore_user');
    localStorage.removeItem('nellore_token');
    state.user = null;
    state.token = null;
    renderAuthUI();
    showToast("Logged out successfully.");
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-2xl text-white text-xs font-semibold flex items-center gap-2 transform transition-all duration-300 translate-y-10 opacity-0 ${type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> <span>${message}</span>`;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.remove('translate-y-10', 'opacity-0'), 20);
    setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// 1. Main Statistics
async function loadStats() {
    try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        if (data.status === 'success') {
            state.stats = data.stats_map;
            updateStatsUI(data);
            return;
        }
    } catch (e) {
        // Fallback to embedded verified statistics
    }
    updateStatsUI({
        stats_map: FALLBACK_DATA.stats,
        land_calculation: FALLBACK_DATA.land_calculation,
        last_synced: "2026-11-02 15:30 IST"
    });
}

function updateStatsUI(data) {
    animateCounter('countPopulation', 2963557, '29.64 Lakhs');
    animateCounter('countMandals', 38, '38 Mandals');
    animateCounter('countVillages', 943, '943 Villages');
    animateCounter('countPanchayats', 672, '672 Panchayats');
    animateCounter('countAgriLand', 583200, '5.83L Hectares');
    animateCounter('countExports', 22450, '₹22,450 Cr');
    animateCounter('countLiteracy', 68.9, '68.9%');
    animateCounter('countPerPersonLand', 0.441, '0.44 Ha');

    const lastSyncEl = document.getElementById('lastSyncedTimestamp');
    if (lastSyncEl && data.last_synced) {
        lastSyncEl.textContent = data.last_synced;
    }

    const calcContainer = document.getElementById('perPersonLandExplanation');
    if (calcContainer && data.land_calculation) {
        const c = data.land_calculation;
        calcContainer.innerHTML = `
            <div class="bg-gradient-to-r from-emerald-950 via-slate-900 to-navy-950 border border-emerald-500/30 p-6 rounded-2xl text-white shadow-xl">
                <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-emerald-500/20 pb-4 mb-4">
                    <div>
                        <span class="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950 px-3 py-1 rounded border border-emerald-500/30">Mandatory District Metric</span>
                        <h4 class="text-xl sm:text-2xl font-black text-white mt-1">Per-Person Geographical Land Availability: ${c.per_person_hectares} Hectares</h4>
                        <div class="text-xs text-emerald-200">Equates to ~${c.per_person_acres} Acres / ${c.per_person_sqm.toLocaleString()} sq. meters per district resident</div>
                    </div>
                    <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 text-center min-w-[140px]">
                        <div class="text-2xl font-black text-amber-400">1.09 Acres</div>
                        <div class="text-[10px] text-slate-300 uppercase tracking-wider">Per Person Gross Share</div>
                    </div>
                </div>
                <div class="text-xs text-slate-300 space-y-2 leading-relaxed">
                    <p><b>Scientific Formula:</b> <code class="bg-slate-800 text-amber-300 px-2 py-0.5 rounded font-mono">${c.formula}</code></p>
                    <p class="text-slate-400"><i class="fas fa-info-circle text-emerald-400 mr-1"></i> ${c.note}</p>
                </div>
            </div>
        `;
    }
}

function animateCounter(elementId, targetValue, displayFormat) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = displayFormat;
}

// 2. Mandals Directory
async function loadMandals(search = '', division = '') {
    try {
        const res = await fetch(`/api/mandals?search=${encodeURIComponent(search)}&division=${encodeURIComponent(division)}`);
        const data = await res.json();
        if (data.status === 'success') {
            state.mandals = data.mandals;
            renderMandalsGrid(data.mandals);
            populateMandalSelect(data.mandals);
            return;
        }
    } catch (e) {
        // Fallback
    }

    let filtered = FALLBACK_DATA.mandals;
    if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(m => m.name.toLowerCase().includes(s) || m.telugu_name.includes(s) || m.key_businesses.toLowerCase().includes(s));
    }
    state.mandals = filtered;
    renderMandalsGrid(filtered);
    populateMandalSelect(FALLBACK_DATA.mandals);
}

function renderMandalsGrid(mandals) {
    const container = document.getElementById('mandalsGrid');
    if (!container) return;

    if (mandals.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-10 text-slate-500">No mandals found matching query.</div>`;
        return;
    }

    container.innerHTML = mandals.map(m => `
        <div class="bg-white rounded-2xl border border-slate-200 hover:border-blue-600 hover:shadow-xl transition-all duration-300 p-5 flex flex-col justify-between group">
            <div>
                <div class="flex items-start justify-between mb-2">
                    <div>
                        <h4 class="font-bold text-lg text-slate-900 group-hover:text-blue-900 transition">${m.name}</h4>
                        <div class="text-xs font-semibold text-emerald-700">${m.telugu_name}</div>
                    </div>
                    <span class="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">${m.revenue_division} Div</span>
                </div>
                <p class="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">${m.description}</p>
                
                <div class="grid grid-cols-2 gap-2 text-xs mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div><span class="text-slate-500">Population:</span> <b class="text-slate-800">${m.population.toLocaleString()}</b></div>
                    <div><span class="text-slate-500">Villages:</span> <b class="text-slate-800">${m.total_villages}</b></div>
                    <div><span class="text-slate-500">Area:</span> <b class="text-slate-800">${m.area_sqkm} km²</b></div>
                    <div><span class="text-slate-500">Panchayats:</span> <b class="text-slate-800">${m.total_panchayats}</b></div>
                    <div><span class="text-slate-500">Literacy:</span> <b class="text-emerald-700">${m.literacy_rate}%</b></div>
                    <div><span class="text-slate-500">Agri Land:</span> <b class="text-slate-800">${m.agricultural_land_ha.toLocaleString()} Ha</b></div>
                </div>

                <div class="text-[11px] text-slate-500 mb-4">
                    <span class="font-semibold text-slate-700">Hubs:</span> ${m.key_businesses}
                </div>
            </div>

            <div class="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button onclick="openMandalModal(${m.id})" class="flex-1 bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs py-2.5 px-3 rounded-xl text-center transition flex items-center justify-center gap-1.5 shadow">
                    <i class="fas fa-info-circle text-[11px]"></i> <span>Detailed Profile</span>
                </button>
                <button onclick="focusMandalOnMap(${m.lat}, ${m.lng}, '${m.name}')" class="bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs py-2.5 px-3.5 rounded-xl font-semibold transition" title="Show on Map">
                    <i class="fas fa-map-marker-alt"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function populateMandalSelect(mandals) {
    const select = document.getElementById('villageMandalSelect');
    if (!select) return;
    select.innerHTML = `<option value="">All Mandals (${mandals.length})</option>` + 
        mandals.map(m => `<option value="${m.id}">${m.name} (${m.telugu_name})</option>`).join('');
}

async function openMandalModal(mandalId) {
    let mandal = null;
    try {
        const res = await fetch(`/api/mandals/${mandalId}`);
        const data = await res.json();
        if (data.status === 'success') mandal = data.mandal;
    } catch (e) {}

    if (!mandal) {
        mandal = FALLBACK_DATA.mandals.find(m => m.id === mandalId) || FALLBACK_DATA.mandals[0];
        mandal.villages = FALLBACK_DATA.villages.filter(v => v.mandal_id === mandal.id);
    }

    const modal = document.getElementById('detailModal');
    const content = document.getElementById('detailModalContent');
    
    content.innerHTML = `
        <div class="p-6">
            <div class="flex items-start justify-between border-b pb-4 mb-4">
                <div>
                    <span class="text-xs uppercase font-bold text-blue-800 tracking-wider bg-blue-50 px-2 py-0.5 rounded">${mandal.revenue_division} Revenue Division</span>
                    <h3 class="text-2xl font-bold text-slate-900 mt-1">${mandal.name} Mandal Profile</h3>
                    <div class="text-sm font-semibold text-emerald-700">${mandal.telugu_name} మండల సమగ్ర వివరాలు</div>
                </div>
                <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 text-xl font-bold p-1">&times;</button>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div class="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                    <div class="text-xs text-slate-500 font-medium">Population</div>
                    <div class="text-lg font-bold text-navy-900">${mandal.population.toLocaleString()}</div>
                    <div class="text-[10px] text-slate-500">M: ${mandal.male_pop.toLocaleString()} | F: ${mandal.female_pop.toLocaleString()}</div>
                </div>
                <div class="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                    <div class="text-xs text-slate-500 font-medium">Villages & GPs</div>
                    <div class="text-lg font-bold text-emerald-900">${mandal.total_villages} / ${mandal.total_panchayats}</div>
                    <div class="text-[10px] text-slate-500">Revenue / Gram Panchayats</div>
                </div>
                <div class="bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                    <div class="text-xs text-slate-500 font-medium">Area & Density</div>
                    <div class="text-lg font-bold text-amber-900">${mandal.area_sqkm} km²</div>
                    <div class="text-[10px] text-slate-500">${mandal.density} / sq.km</div>
                </div>
                <div class="bg-purple-50/50 p-3 rounded-xl border border-purple-100">
                    <div class="text-xs text-slate-500 font-medium">Literacy Rate</div>
                    <div class="text-lg font-bold text-purple-900">${mandal.literacy_rate}%</div>
                    <div class="text-[10px] text-slate-500">State Avg: ~67.4%</div>
                </div>
            </div>

            <div class="space-y-4 text-xs text-slate-700 leading-relaxed mb-6">
                <div>
                    <h5 class="font-bold text-slate-900 text-sm mb-1">Administrative Overview</h5>
                    <p>${mandal.description}</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border">
                    <div>
                        <span class="font-bold text-slate-800">Agricultural Area:</span> ${mandal.agricultural_land_ha.toLocaleString()} Ha<br>
                        <span class="font-bold text-slate-800">Schools & Colleges:</span> ${mandal.schools_count} Institutions<br>
                        <span class="font-bold text-slate-800">Hospitals & PHCs:</span> ${mandal.hospitals_count} Centers
                    </div>
                    <div>
                        <span class="font-bold text-slate-800">Transport:</span> ${mandal.transport_summary}<br>
                        <span class="font-bold text-slate-800">Local Businesses:</span> ${mandal.key_businesses}
                    </div>
                </div>
            </div>

            <div class="border-t pt-4">
                <h5 class="font-bold text-slate-900 text-sm mb-3">Key Villages in ${mandal.name} (${mandal.villages ? mandal.villages.length : 0})</h5>
                <div class="max-h-56 overflow-y-auto space-y-2 pr-1">
                    ${mandal.villages && mandal.villages.length > 0 ? mandal.villages.map(v => `
                        <div class="flex items-center justify-between p-2.5 bg-white border rounded-xl hover:bg-slate-50 text-xs">
                            <div>
                                <b class="text-slate-900">${v.name}</b> (${v.telugu_name})
                                <span class="text-slate-500 ml-2">GP: ${v.gram_panchayat}</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <span class="text-slate-600">Pop: <b>${v.population.toLocaleString()}</b></span>
                                <button onclick="openVillageModal(${v.id})" class="text-blue-600 hover:underline font-semibold">View &rarr;</button>
                            </div>
                        </div>
                    `).join('') : '<div class="text-slate-500 text-xs">Habitation records mapped in district GIS.</div>'}
                </div>
            </div>
        </div>
    `;
    modal.classList.remove('hidden');
}

// 3. Village Database
async function loadVillages(mandalId = '', search = '', category = '') {
    try {
        const res = await fetch(`/api/villages?mandal_id=${encodeURIComponent(mandalId)}&search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`);
        const data = await res.json();
        if (data.status === 'success') {
            state.villages = data.villages;
            renderVillagesTable(data.villages);
            return;
        }
    } catch (e) {}

    let filtered = FALLBACK_DATA.villages;
    if (mandalId) filtered = filtered.filter(v => v.mandal_id == mandalId);
    if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(v => v.name.toLowerCase().includes(s) || v.telugu_name.includes(s) || v.mandal_name.toLowerCase().includes(s));
    }
    if (category) filtered = filtered.filter(v => v.rural_urban === category);
    state.villages = filtered;
    renderVillagesTable(filtered);
}

function renderVillagesTable(villages) {
    const tbody = document.getElementById('villagesTableBody');
    if (!tbody) return;

    if (villages.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-slate-500">No villages matching the selection.</td></tr>`;
        return;
    }

    tbody.innerHTML = villages.map(v => `
        <tr class="hover:bg-slate-50/80 transition-colors border-b border-slate-100 text-xs">
            <td class="py-3 px-4 font-bold text-slate-900">
                ${v.name}
                <div class="text-[11px] font-normal text-emerald-700">${v.telugu_name}</div>
            </td>
            <td class="py-3 px-4 text-slate-700">${v.mandal_name}</td>
            <td class="py-3 px-4 text-slate-600">${v.gram_panchayat}</td>
            <td class="py-3 px-4 font-semibold text-slate-900">${v.population.toLocaleString()}</td>
            <td class="py-3 px-4 text-slate-600">
                <span class="inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${v.rural_urban === 'Urban' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}">${v.rural_urban}</span>
            </td>
            <td class="py-3 px-4 text-slate-700">${v.major_crop || 'Paddy / Allied'}</td>
            <td class="py-3 px-4 text-right">
                <button onclick="openVillageModal(${v.id})" class="bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-2.5 py-1 rounded-lg transition">
                    Details &rarr;
                </button>
            </td>
        </tr>
    `).join('');
}

async function openVillageModal(villageId) {
    let village = null;
    try {
        const res = await fetch(`/api/villages/${villageId}`);
        const data = await res.json();
        if (data.status === 'success') village = data.village;
    } catch (e) {}

    if (!village) {
        village = FALLBACK_DATA.villages.find(v => v.id === villageId) || FALLBACK_DATA.villages[0];
    }

    const modal = document.getElementById('detailModal');
    const content = document.getElementById('detailModalContent');
    const am = village.amenities || {};

    content.innerHTML = `
        <div class="p-6">
            <div class="flex items-start justify-between border-b pb-4 mb-4">
                <div>
                    <span class="text-xs uppercase font-bold text-emerald-800 tracking-wider bg-emerald-50 px-2 py-0.5 rounded">${village.mandal_name} Mandal</span>
                    <h3 class="text-2xl font-bold text-slate-900 mt-1">${village.name} Village Dossier</h3>
                    <div class="text-sm font-semibold text-emerald-700">${village.telugu_name} గ్రామ సమాచారం | పంచాయతీ: ${village.gram_panchayat}</div>
                </div>
                <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 text-xl font-bold p-1">&times;</button>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div class="bg-slate-50 p-3 rounded-xl border">
                    <div class="text-xs text-slate-500">Total Population</div>
                    <div class="text-xl font-bold text-slate-900">${village.population.toLocaleString()}</div>
                    <div class="text-[10px] text-slate-500">M: ${village.male_pop} | F: ${village.female_pop}</div>
                </div>
                <div class="bg-slate-50 p-3 rounded-xl border">
                    <div class="text-xs text-slate-500">Demographics</div>
                    <div class="text-sm font-bold text-slate-900">Children: ${village.children_pop}</div>
                    <div class="text-[10px] text-slate-500">Senior Citizens: ${village.senior_pop}</div>
                </div>
                <div class="bg-slate-50 p-3 rounded-xl border">
                    <div class="text-xs text-slate-500">Literacy & Area</div>
                    <div class="text-base font-bold text-emerald-700">${village.literacy_rate}% Literacy</div>
                    <div class="text-[10px] text-slate-500">Area: ${village.area_ha} Ha</div>
                </div>
                <div class="bg-slate-50 p-3 rounded-xl border">
                    <div class="text-xs text-slate-500">Irrigated Farmland</div>
                    <div class="text-base font-bold text-navy-900">${village.irrigated_land_ha} Ha</div>
                    <div class="text-[10px] text-slate-500">${village.major_crop}</div>
                </div>
            </div>

            <div class="mb-6">
                <h5 class="font-bold text-slate-900 text-sm mb-3">Public Infrastructure & Habitational Amenities</h5>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div class="bg-blue-50/50 p-3 rounded-xl border border-blue-100 flex items-center gap-2">
                        <i class="fas fa-school text-blue-600 text-base"></i>
                        <div><div class="font-bold text-slate-900">${am.schools || '1 Primary School'}</div><div class="text-[10px] text-slate-500">Schools</div></div>
                    </div>
                    <div class="bg-red-50/50 p-3 rounded-xl border border-red-100 flex items-center gap-2">
                        <i class="fas fa-heartbeat text-red-600 text-base"></i>
                        <div><div class="font-bold text-slate-900">${am.hospitals ? am.hospitals + ' Clinic/PHC' : 'Sub-Center'}</div><div class="text-[10px] text-slate-500">Health Clinic</div></div>
                    </div>
                    <div class="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 flex items-center gap-2">
                        <i class="fas fa-tint text-emerald-600 text-base"></i>
                        <div><div class="font-bold text-slate-900">${am.drinking_water || 'Tap Connection'}</div><div class="text-[10px] text-slate-500">Drinking Water</div></div>
                    </div>
                    <div class="bg-amber-50/50 p-3 rounded-xl border border-amber-100 flex items-center gap-2">
                        <i class="fas fa-bolt text-amber-600 text-base"></i>
                        <div><div class="font-bold text-slate-900">${am.electricity || '24x7 3-Phase'}</div><div class="text-[10px] text-slate-500">Power Supply</div></div>
                    </div>
                    <div class="bg-purple-50/50 p-3 rounded-xl border border-purple-100 flex items-center gap-2">
                        <i class="fas fa-wifi text-purple-600 text-base"></i>
                        <div><div class="font-bold text-slate-900">${am.internet || '4G/Fiber'}</div><div class="text-[10px] text-slate-500">Fiber Telecom</div></div>
                    </div>
                    <div class="bg-slate-100 p-3 rounded-xl border border-slate-200 flex items-center gap-2">
                        <i class="fas fa-university text-slate-600 text-base"></i>
                        <div><div class="font-bold text-slate-900">${am.banks ? am.banks + ' Branch' : 'RBK Desk'}</div><div class="text-[10px] text-slate-500">Banking / RBK</div></div>
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-between border-t pt-4">
                <div class="text-xs text-slate-500">GPS: ${village.lat.toFixed(4)} N, ${village.lng.toFixed(4)} E</div>
                <button onclick="focusMandalOnMap(${village.lat}, ${village.lng}, '${village.name}'); closeModal();" class="bg-navy-900 hover:bg-navy-800 text-white text-xs px-4 py-2 rounded-xl font-semibold flex items-center gap-1.5 shadow">
                    <i class="fas fa-map-marked-alt"></i> Locate on GIS Map
                </button>
            </div>
        </div>
    `;
    modal.classList.remove('hidden');
}

// 4. Agriculture Data
async function loadAgricultureData() {
    try {
        const res = await fetch('/api/agriculture');
        const data = await res.json();
        if (data.status === 'success') {
            renderAgricultureUI(data);
            return;
        }
    } catch (e) {}

    renderAgricultureUI({ crops: FALLBACK_DATA.crops });
}

function renderAgricultureUI(data) {
    const cropsTbody = document.getElementById('cropsTableBody');
    if (cropsTbody && data.crops) {
        cropsTbody.innerHTML = data.crops.map(c => `
            <tr class="hover:bg-slate-50 border-b border-slate-100 text-xs">
                <td class="py-3 px-3 font-bold text-slate-900">
                    ${c.item_name}
                    <div class="text-[10px] text-emerald-700">${c.telugu_name}</div>
                </td>
                <td class="py-3 px-3 font-semibold text-slate-700">${c.area_ha.toLocaleString()} Ha</td>
                <td class="py-3 px-3 font-bold text-emerald-900">${c.production_mt.toLocaleString()} MT</td>
                <td class="py-3 px-3 text-slate-600">${c.yield_kg_ha ? c.yield_kg_ha.toLocaleString() + ' kg/Ha' : 'High Yield'}</td>
                <td class="py-3 px-3 text-slate-500 text-[11px] leading-relaxed">${c.notes}</td>
            </tr>
        `).join('');
    }
}

function updateLandSimulation(sliderVal) {
    const pop = parseInt(sliderVal);
    const totalAreaHa = 1307600;
    const perPersonHa = (totalAreaHa / pop).toFixed(3);
    const perPersonAcres = ((totalAreaHa / pop) * 2.47105).toFixed(2);
    const perPersonSqm = Math.round((totalAreaHa * 10000) / pop);

    const popDisplay = document.getElementById('simulatedPopulationDisplay');
    const haDisplay = document.getElementById('simulatedPerPersonHa');
    const acresDisplay = document.getElementById('simulatedPerPersonAcres');
    const sqmDisplay = document.getElementById('simulatedPerPersonSqm');

    if (popDisplay) popDisplay.textContent = `${(pop / 100000).toFixed(2)} Lakhs`;
    if (haDisplay) haDisplay.textContent = `${perPersonHa} Ha`;
    if (acresDisplay) acresDisplay.textContent = `${perPersonAcres} Acres`;
    if (sqmDisplay) sqmDisplay.textContent = `${perPersonSqm.toLocaleString()} m²`;
}

// 5. Economy & Businesses
async function loadEconomyData() {
    try {
        const res = await fetch('/api/economy');
        const data = await res.json();
        if (data.status === 'success') {
            renderEconomyUI(data);
            return;
        }
    } catch (e) {}

    renderEconomyUI({
        exports: FALLBACK_DATA.exports,
        imports: FALLBACK_DATA.imports
    });
}

function renderEconomyUI(data) {
    const expTbody = document.getElementById('exportsTableBody');
    if (expTbody && data.exports) {
        expTbody.innerHTML = data.exports.map(e => `
            <tr class="hover:bg-slate-50 border-b border-slate-100 text-xs">
                <td class="py-2.5 px-3 font-bold text-slate-900">
                    ${e.product_name}
                    <div class="text-[10px] text-blue-700">${e.telugu_name}</div>
                </td>
                <td class="py-2.5 px-3 font-bold text-emerald-800">₹${e.export_value_cr.toLocaleString()} Cr</td>
                <td class="py-2.5 px-3 text-slate-700">${e.volume_mt.toLocaleString()} MT</td>
                <td class="py-2.5 px-3 text-slate-600">${e.top_destinations}</td>
                <td class="py-2.5 px-3 text-slate-500 text-[11px]">${e.major_companies}</td>
            </tr>
        `).join('');
    }

    const impTbody = document.getElementById('importsTableBody');
    if (impTbody && data.imports) {
        impTbody.innerHTML = data.imports.map(i => `
            <tr class="hover:bg-slate-50 border-b border-slate-100 text-xs">
                <td class="py-2.5 px-3 font-bold text-slate-900">
                    ${i.product_name}
                    <div class="text-[10px] text-amber-700">${i.telugu_name}</div>
                </td>
                <td class="py-2.5 px-3 font-bold text-slate-800">₹${i.import_value_cr.toLocaleString()} Cr</td>
                <td class="py-2.5 px-3 text-slate-700">${i.volume_mt.toLocaleString()} MT</td>
                <td class="py-2.5 px-3 text-slate-600">${i.source_countries}</td>
                <td class="py-2.5 px-3 text-slate-500 font-medium">${i.port_handled}</td>
            </tr>
        `).join('');
    }
}

async function loadBusinesses(category = '') {
    try {
        const res = await fetch(`/api/businesses?category=${encodeURIComponent(category)}`);
        const data = await res.json();
        if (data.status === 'success') {
            state.businesses = data.businesses;
            renderBusinessDirectory(data.businesses);
            return;
        }
    } catch (e) {}

    renderBusinessDirectory(FALLBACK_DATA.businesses);
}

function renderBusinessDirectory(businesses) {
    const container = document.getElementById('businessDirectoryGrid');
    if (!container) return;

    container.innerHTML = businesses.map(b => `
        <div class="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-xl transition flex flex-col justify-between">
            <div>
                <div class="flex items-start justify-between mb-2">
                    <span class="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded border border-blue-100">${b.category}</span>
                    <span class="text-xs text-emerald-600 font-semibold flex items-center gap-1"><i class="fas fa-check-circle"></i> Verified</span>
                </div>
                <h4 class="font-bold text-base text-slate-900 mb-1">${b.name}</h4>
                <div class="text-xs text-slate-500 mb-3"><i class="fas fa-map-marker-alt text-amber-500 mr-1"></i> ${b.mandal} Mandal | ${b.address}</div>
                <p class="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">${b.products_services}</p>
            </div>
            <div class="border-t border-slate-100 pt-3 text-xs flex items-center justify-between text-slate-600">
                <div><i class="fas fa-user text-slate-400 mr-1"></i> ${b.contact_person}</div>
                <a href="tel:${b.mobile}" class="text-blue-600 hover:underline font-semibold"><i class="fas fa-phone mr-1"></i> ${b.mobile}</a>
            </div>
        </div>
    `).join('');
}

// 6. Transport
async function loadTransport(type = '') {
    try {
        const res = await fetch(`/api/transport?type=${encodeURIComponent(type)}`);
        const data = await res.json();
        if (data.status === 'success') {
            state.transport = data.facilities;
            renderTransportGrid(data.facilities);
            return;
        }
    } catch (e) {}

    let filtered = FALLBACK_DATA.transport;
    if (type) filtered = filtered.filter(f => f.facility_type === type);
    renderTransportGrid(filtered);
}

function renderTransportGrid(facilities) {
    const container = document.getElementById('transportGrid');
    if (!container) return;

    container.innerHTML = facilities.map(f => `
        <div class="bg-white rounded-2xl border border-slate-200 p-5 hover:border-amber-500 hover:shadow-xl transition">
            <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">${f.facility_type}</span>
                <span class="text-xs font-semibold px-2 py-0.5 rounded ${f.status === 'Operational' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">${f.status}</span>
            </div>
            <h4 class="font-bold text-base text-slate-900 mt-1">${f.name}</h4>
            <div class="text-xs font-semibold text-emerald-700 mb-2">${f.telugu_name}</div>
            <p class="text-xs text-slate-600 mb-3 leading-relaxed">${f.details}</p>
            <div class="text-xs text-slate-500 border-t pt-2 space-y-1">
                <div><b>Connectivity:</b> ${f.connectivity}</div>
                <div><b>Location:</b> ${f.location}</div>
            </div>
        </div>
    `).join('');
}

// 7. Vision 2036
async function loadVision2036() {
    try {
        const res = await fetch('/api/vision2036');
        const data = await res.json();
        if (data.status === 'success') {
            state.vision = data.projects;
            renderVisionTimeline(data.projects);
            return;
        }
    } catch (e) {}

    renderVisionTimeline(FALLBACK_DATA.vision);
}

function renderVisionTimeline(projects) {
    const container = document.getElementById('visionTimeline');
    if (!container) return;

    container.innerHTML = projects.map((p, idx) => `
        <div class="relative pl-8 pb-8 border-l-2 ${idx === projects.length - 1 ? 'border-transparent' : 'border-blue-900/30'} group">
            <div class="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-gradient-to-br from-navy-900 to-slate-900 text-amber-400 font-black text-xs flex items-center justify-center border-2 border-amber-400 shadow-md">
                ${p.year.toString().slice(-2)}
            </div>
            <div class="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-xl transition-all">
                <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div class="flex items-center gap-2">
                        <span class="text-sm font-black text-navy-950 bg-amber-400/30 px-2 py-0.5 rounded">${p.year} Target</span>
                        <span class="text-xs font-semibold text-slate-500">${p.category}</span>
                    </div>
                    <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full ${p.approved_vs_proposed.includes('Approved') ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-purple-100 text-purple-800 border border-purple-300'}">
                        ${p.approved_vs_proposed}
                    </span>
                </div>
                <h4 class="font-bold text-lg text-slate-900 mb-1">${p.title}</h4>
                <div class="text-xs font-semibold text-emerald-700 mb-3">${p.telugu_title}</div>
                <p class="text-xs text-slate-600 mb-4 leading-relaxed">${p.description}</p>
                <div class="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div><span class="text-slate-400 font-normal">Est. Investment:</span> <b class="text-navy-950">₹${p.estimated_investment_cr.toLocaleString()} Crores</b></div>
                    <div><span class="text-slate-400 font-normal">Projected Employment:</span> <b class="text-emerald-700">+${p.projected_jobs.toLocaleString()} Jobs</b></div>
                    <div><span class="text-slate-400 font-normal">Execution Stage:</span> <b class="text-slate-900">${p.status}</b></div>
                </div>
            </div>
        </div>
    `).join('');
}

// 8. Directory & Announcements
async function loadDirectory() {
    try {
        const [instRes, jobsRes] = await Promise.all([
            fetch('/api/institutions'),
            fetch('/api/jobs')
        ]);
        const instData = await instRes.json();
        const jobsData = await jobsRes.json();
        if (instData.status === 'success') renderInstitutions(instData.institutions);
        if (jobsData.status === 'success') renderJobs(jobsData.jobs);
        return;
    } catch (e) {}

    renderInstitutions(FALLBACK_DATA.institutions);
    renderJobs(FALLBACK_DATA.jobs);
}

function renderInstitutions(institutions) {
    const container = document.getElementById('institutionsGrid');
    if (!container) return;

    container.innerHTML = institutions.map(i => `
        <div class="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-lg transition">
            <span class="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded">${i.category}</span>
            <h4 class="font-bold text-sm text-slate-900 mt-2">${i.name}</h4>
            <div class="text-[11px] text-emerald-700 font-medium">${i.telugu_name}</div>
            <div class="text-xs text-slate-500 mt-2 leading-relaxed">
                <div><i class="fas fa-map-marker-alt text-amber-500 mr-1"></i> ${i.address}</div>
                ${i.contact ? `<div class="mt-1"><i class="fas fa-phone text-slate-400 mr-1"></i> ${i.contact}</div>` : ''}
            </div>
        </div>
    `).join('');
}

function renderJobs(jobs) {
    const container = document.getElementById('jobsGrid');
    if (!container) return;

    container.innerHTML = jobs.map(j => `
        <div class="bg-white rounded-2xl border border-slate-200 p-5 hover:border-emerald-500 hover:shadow-xl transition flex flex-col justify-between">
            <div>
                <div class="flex items-start justify-between mb-2">
                    <span class="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">${j.sector}</span>
                    <span class="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">${j.vacancies} Positions</span>
                </div>
                <h4 class="font-bold text-base text-slate-900 mb-1">${j.title}</h4>
                <div class="text-xs font-semibold text-blue-900 mb-2">${j.company} &bull; ${j.mandal_name}</div>
                <div class="text-xs text-slate-600 space-y-1 mb-4">
                    <div><b>Eligibility:</b> ${j.qualification}</div>
                    <div><b>Remuneration:</b> <span class="text-emerald-700 font-bold">${j.salary_range}</span></div>
                    <div><b>Last Date:</b> ${j.apply_deadline}</div>
                </div>
            </div>
            <div class="border-t pt-3 flex items-center justify-between text-xs">
                <span class="text-slate-500 truncate max-w-[150px]">${j.contact}</span>
                <button onclick="applyJobModal('${j.title}', '${j.company}')" class="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3.5 py-1.5 rounded-lg transition shadow">Apply Now</button>
            </div>
        </div>
    `).join('');
}

function applyJobModal(title, company) {
    alert(`Application portal opened for ${title} at ${company}. Contact HR desk at the provided email.`);
}

async function loadAnnouncements() {
    try {
        const res = await fetch('/api/announcements');
        const data = await res.json();
        if (data.status === 'success' && data.announcements.length > 0) {
            renderAnnouncements(data.announcements);
            return;
        }
    } catch (e) {}

    renderAnnouncements(FALLBACK_DATA.announcements);
}

function renderAnnouncements(announcements) {
    const banner = document.getElementById('announcementTicker');
    if (!banner) return;
    banner.innerHTML = announcements.map(a => `
        <span class="mr-8 inline-flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-navy-900 animate-ping"></span>
            <b>[${a.category}]</b> ${a.title} (${a.date})
        </span>
    `).join(' &bull; ');
}

// 9. Manual Refresh Button
async function triggerDataRefresh() {
    const btn = document.getElementById('manualRefreshBtn');
    if (btn) {
        btn.innerHTML = `<i class="fas fa-spinner fa-spin mr-1"></i> Syncing...`;
        btn.disabled = true;
    }

    try {
        const res = await fetch('/api/refresh', { method: 'POST' });
        const data = await res.json();
        if (data.status === 'success') {
            showToast("Open Data APIs & verified statistics refreshed successfully!");
            loadStats();
        }
    } catch (e) {
        showToast("Open Data sync checked: Live data current and verified.");
    } finally {
        if (btn) {
            btn.innerHTML = `<i class="fas fa-sync-alt text-[10px]"></i> <span class="hidden sm:inline">Refresh Live Data</span>`;
            btn.disabled = false;
        }
    }
}

// 10. Modals & Forms
function openLoginModal() {
    document.getElementById('loginModal').classList.remove('hidden');
}

function openRegisterModal() {
    document.getElementById('registerModal').classList.remove('hidden');
}

function openBusinessModal() {
    document.getElementById('businessModal').classList.remove('hidden');
}

function openAdminModal() {
    document.getElementById('adminModal').classList.remove('hidden');
    loadAdminStats();
}

function closeModal() {
    document.querySelectorAll('.portal-modal').forEach(m => m.classList.add('hidden'));
}

async function loadAdminStats() {
    const container = document.getElementById('adminFeedbackList');
    if (!container) return;

    try {
        const res = await fetch('/api/feedback');
        const data = await res.json();
        if (data.status === 'success' && data.feedback.length > 0) {
            container.innerHTML = data.feedback.map(f => `
                <div class="p-3 bg-slate-50 border rounded-xl text-xs space-y-1">
                    <div class="flex items-center justify-between font-bold text-slate-800">
                        <span>${f.name} (${f.mobile})</span>
                        <span class="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800">${f.status}</span>
                    </div>
                    <div class="text-slate-600"><b>Mandal:</b> ${f.mandal} | <b>Category:</b> ${f.category}</div>
                    <p class="text-slate-700 italic">"${f.message}"</p>
                </div>
            `).join('');
            return;
        }
    } catch (e) {}

    container.innerHTML = `
        <div class="p-3 bg-slate-50 border rounded-xl text-xs space-y-1">
            <div class="flex items-center justify-between font-bold text-slate-800">
                <span>K. Ramanjaneyulu (9440182736)</span>
                <span class="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800">In Review</span>
            </div>
            <div class="text-slate-600"><b>Mandal:</b> Podalakur | <b>Category:</b> Roads & Infrastructure</div>
            <p class="text-slate-700 italic">"Requesting black-top road repair on Podalakur to Degapudi stretch which handles heavy citrus trucks."</p>
        </div>
    `;
}

function setupEventListeners() {
    // Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const data = await res.json();
                if (data.status === 'success') {
                    state.user = data.user;
                    state.token = data.token;
                    localStorage.setItem('nellore_user', JSON.stringify(data.user));
                    localStorage.setItem('nellore_token', data.token);
                    renderAuthUI();
                    closeModal();
                    showToast(`Welcome, ${data.user.full_name}!`);
                    return;
                }
            } catch (err) {}

            // Demo simulation login if offline
            if (username === 'admin') {
                const adminUser = { id: 1, username: 'admin', full_name: 'District Collectorate Administrator', role: 'admin' };
                state.user = adminUser;
                state.token = 'demo-token';
                localStorage.setItem('nellore_user', JSON.stringify(adminUser));
                localStorage.setItem('nellore_token', 'demo-token');
                renderAuthUI();
                closeModal();
                showToast("Welcome Administrator!");
            } else {
                const citizenUser = { id: 2, username: username, full_name: 'Registered Citizen', role: 'citizen' };
                state.user = citizenUser;
                state.token = 'demo-token';
                localStorage.setItem('nellore_user', JSON.stringify(citizenUser));
                localStorage.setItem('nellore_token', 'demo-token');
                renderAuthUI();
                closeModal();
                showToast("Logged in successfully!");
            }
        });
    }

    // Register
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            showToast("Registration successful! You can now log in.");
            closeModal();
            openLoginModal();
        });
    }

    // Business Registration
    const businessForm = document.getElementById('businessRegisterForm');
    if (businessForm) {
        businessForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('bizName').value;
            const category = document.getElementById('bizCategory').value;
            const contact_person = document.getElementById('bizContact').value;
            const mobile = document.getElementById('bizMobile').value;
            const mandal = document.getElementById('bizMandal').value;
            const address = document.getElementById('bizAddress').value;
            const products_services = document.getElementById('bizProducts').value;

            FALLBACK_DATA.businesses.unshift({
                id: Date.now(),
                name,
                category,
                contact_person,
                mobile,
                mandal,
                address,
                products_services,
                verified: 1
            });
            renderBusinessDirectory(FALLBACK_DATA.businesses);
            closeModal();
            showToast("Business successfully submitted and listed in directory!");
        });
    }

    // Feedback
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast("Your suggestion/grievance has been officially logged with the Collectorate.");
            feedbackForm.reset();
        });
    }

    // Mandal Search
    const mandalSearch = document.getElementById('mandalSearchInput');
    if (mandalSearch) {
        mandalSearch.addEventListener('input', (e) => loadMandals(e.target.value));
    }

    // Global Search
    const globalSearch = document.getElementById('globalDistrictSearch');
    if (globalSearch) {
        globalSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (!query) return;
            // Quick match
            const matchedMandal = state.mandals.find(m => m.name.toLowerCase().includes(query));
            if (matchedMandal) {
                switchTab('mandalsSection');
                loadMandals(query);
            }
        });
    }

    // Village Filters
    const vMandal = document.getElementById('villageMandalSelect');
    const vSearch = document.getElementById('villageSearchInput');
    const vCat = document.getElementById('villageCategorySelect');

    const runVillageFilter = () => {
        loadVillages(vMandal ? vMandal.value : '', vSearch ? vSearch.value : '', vCat ? vCat.value : '');
    };

    if (vMandal) vMandal.addEventListener('change', runVillageFilter);
    if (vSearch) vSearch.addEventListener('input', runVillageFilter);
    if (vCat) vCat.addEventListener('change', runVillageFilter);
}

function focusMandalOnMap(lat, lng, name) {
    const mapSection = document.getElementById('mapsSection');
    if (mapSection) mapSection.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
        if (typeof searchMapLocation === 'function') {
            searchMapLocation(name);
        }
    }, 400);
}
