// Nellore District Interactive GIS Map Suite
// Supports Leaflet & Google Maps API with Colored Facility Markers & Boundary polygon

let leafletMap = null;
let googleMap = null;
let activeMarkers = [];
let googleMarkers = [];
let currentMapMode = 'leaflet'; // 'leaflet' or 'google'

// Facility Marker Color Schemes
const facilityStyles = {
    'Hospital': { color: '#ef4444', icon: 'fa-hospital', label: 'Healthcare' },
    'School': { color: '#3b82f6', icon: 'fa-graduation-cap', label: 'Education' },
    'Industry': { color: '#a855f7', icon: 'fa-industry', label: 'Industrial & SEZ' },
    'Port': { color: '#06b6d4', icon: 'fa-ship', label: 'Maritime Port' },
    'Railway': { color: '#f59e0b', icon: 'fa-train', label: 'Railway Hub' },
    'Bus': { color: '#f97316', icon: 'fa-bus', label: 'Bus Terminal' },
    'Airport': { color: '#6366f1', icon: 'fa-plane', label: 'Airport' },
    'Agriculture': { color: '#10b981', icon: 'fa-seedling', label: 'Agri & Irrigation' },
    'Mandal': { color: '#1e3a8a', icon: 'fa-landmark', label: 'Mandal HQ' }
};

// Key District Points of Interest
const districtLocations = [
    // Mandals
    { name: 'Nellore City HQ', type: 'Mandal', lat: 14.4426, lng: 79.9865, info: 'District Collectorate, ZP, Municipal Corp, Penna River' },
    { name: 'Gudur Mandal HQ', type: 'Mandal', lat: 14.1463, lng: 79.8504, info: 'Major Railway Jn, Lemon Trading Hub & Mica Belt' },
    { name: 'Kavali Mandal HQ', type: 'Mandal', lat: 14.9132, lng: 79.9928, info: 'Northern Commercial Hub, Universities & Aqua Hub' },
    { name: 'Venkatagiri Mandal HQ', type: 'Mandal', lat: 13.9667, lng: 79.5833, info: 'Historic Palace, Royal Handlooms & Weavers Colony' },
    { name: 'Atmakur Mandal HQ', type: 'Mandal', lat: 14.5167, lng: 79.3667, info: 'Gateway to Somasila, Western Agricultural Zone' },
    { name: 'Sullurpeta Mandal HQ', type: 'Mandal', lat: 13.7000, lng: 80.0167, info: 'Space City fringe, Nelapattu Bird Sanctuary' },
    { name: 'Tada Border Mandal', type: 'Mandal', lat: 13.5833, lng: 80.0333, info: 'Apache SEZ, Sri City border, Chennai expressway' },
    { name: 'Naidupeta Mandal HQ', type: 'Mandal', lat: 13.9167, lng: 79.9000, info: 'APIIC Multi-Product Industrial Park' },
    { name: 'Buchireddypalem Mandal HQ', type: 'Mandal', lat: 14.5333, lng: 79.8833, info: 'Kanigiri Reservoir, Jonnawada Kamakshi Temple' },
    { name: 'Indukurpet Coastal HQ', type: 'Mandal', lat: 14.4500, lng: 80.1333, info: 'Mypadu Beach & Commercial Vannamei Shrimp farms' },

    // Ports & Maritime
    { name: 'Adani Krishnapatnam Deep Water Port', type: 'Port', lat: 14.2530, lng: 80.1280, info: 'Deep draft (18.5m) port handling 50+ MMT coal, fertilizers, containers, and agro exports.' },
    
    // Transport Hubs
    { name: 'Nellore Main Railway Station (NLR)', type: 'Railway', lat: 14.4402, lng: 79.9839, info: 'NSG-2 South Central Railway Hub with Vande Bharat connectivity.' },
    { name: 'Gudur Junction (GDR)', type: 'Railway', lat: 14.1480, lng: 79.8490, info: 'Strategic 7-platform junction linking Chennai, Vijayawada, and Tirupati.' },
    { name: 'Kavali Railway Station (KVZ)', type: 'Railway', lat: 14.9120, lng: 79.9910, info: 'Key passenger and goods train halt in North Nellore.' },
    { name: 'Nellore Central RTC Bus Complex', type: 'Bus', lat: 14.4370, lng: 79.9760, info: '60-bay terminal operating 1,200 daily state express buses.' },
    { name: 'Proposed Dagadarthi Greenfield Airport', type: 'Airport', lat: 14.7120, lng: 79.9140, info: '1,385-acre site for international cargo and domestic passenger flights.' },
    
    // Hospitals
    { name: 'ACSR Govt General Hospital & Medical College', type: 'Hospital', lat: 14.4390, lng: 79.9770, info: '1,050-bed tertiary public referral hospital with 24x7 trauma care.' },
    { name: 'Narayana Superspeciality Medical Center', type: 'Hospital', lat: 14.4050, lng: 79.9620, info: '1,200-bed university hospital, oncology, cardiology and organ transplant.' },
    { name: 'Gudur Area Hospital', type: 'Hospital', lat: 14.1450, lng: 79.8480, info: '100-bed secondary healthcare center for Gudur division.' },
    { name: 'Kavali Community Health Centre', type: 'Hospital', lat: 14.9140, lng: 79.9940, info: 'Mother and child healthcare and emergency services.' },

    // Education
    { name: 'Vikrama Simhapuri University', type: 'School', lat: 14.4120, lng: 79.9350, info: 'Premier state university campus offering PG, research, and science faculties.' },
    { name: 'NBKR Institute of Science & Technology', type: 'School', lat: 14.0150, lng: 80.0210, info: 'Autonomous premier engineering institute founded in 1979 in Vidyanagar.' },

    // Industry & SEZ
    { name: 'Apache Footwear India (SEZ Tada)', type: 'Industry', lat: 13.6120, lng: 80.0150, info: 'Major manufacturer exporting 18M pairs of athletic shoes annually.' },
    { name: 'Chillakur Silica & Quartz Industrial Belt', type: 'Industry', lat: 14.1333, lng: 79.9833, info: 'Asia’s premier high-grade silica sand wash plants and mineral mills.' },
    { name: 'Nellaturu APGENCO Mega Thermal Power', type: 'Industry', lat: 14.3120, lng: 80.1420, info: 'Sri Damodaram Sanjeevaiah Thermal Power Station (2x800 MW).' },

    // Agriculture & Water Bodies
    { name: 'Somasila Dam Reservoir', type: 'Agriculture', lat: 14.5020, lng: 79.3080, info: 'Storage capacity 78 TMC ft, irrigating 4.2 lakh acres via Pennar canal system.' },
    { name: 'Kanigiri Reservoir & Jonnawada Anicut', type: 'Agriculture', lat: 14.5380, lng: 79.8890, info: 'Ancient historic reservoir irrigating 35,000 acres of paddy.' },
    { name: 'Mypadu Beach & Aqua Hatcheries', type: 'Agriculture', lat: 14.5050, lng: 80.1780, info: 'Golden sand beach and cluster of certified SPF Vannamei shrimp hatcheries.' },
    { name: 'Nelapattu Bird Sanctuary (Pulicat)', type: 'Agriculture', lat: 13.8340, lng: 79.9670, info: 'Famous breeding sanctuary for grey pelicans, flamingos, and migratory waders.' }
];

// District boundary approximate polygon coordinates
const nelloreBoundaryCoords = [
    [14.98, 79.85], [15.05, 80.02], [14.85, 80.15],
    [14.55, 80.20], [14.25, 80.18], [13.95, 80.18],
    [13.55, 80.10], [13.50, 79.95], [13.75, 79.70],
    [13.95, 79.50], [14.20, 79.40], [14.55, 79.25],
    [14.85, 79.20], [14.95, 79.55], [14.98, 79.85]
];

function initMapSuite() {
    initLeafletMap();
}

function initLeafletMap() {
    const mapContainer = document.getElementById('districtMap');
    if (!mapContainer) return;

    if (leafletMap) {
        leafletMap.remove();
        leafletMap = null;
    }

    leafletMap = L.map('districtMap', {
        center: [14.4426, 79.9865],
        zoom: 9,
        minZoom: 8,
        maxZoom: 18
    });

    // Base Tile Layer (CartoDB Positron / OSM)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(leafletMap);

    // Draw District Boundary Polygon
    const boundaryPolygon = L.polygon(nelloreBoundaryCoords, {
        color: '#1e3a8a',
        weight: 3,
        opacity: 0.8,
        fillColor: '#3b82f6',
        fillOpacity: 0.08,
        dashArray: '6, 6'
    }).addTo(leafletMap);

    boundaryPolygon.bindTooltip("<b>Nellore District Boundary</b><br>Area: 13,076 km² | 38 Mandals", { sticky: true });

    // Render Markers
    renderFacilityMarkers();

    // Map Legend Control
    addMapLegend();
}

function renderFacilityMarkers(filterType = 'all') {
    // Clear old markers
    activeMarkers.forEach(m => leafletMap.removeLayer(m));
    activeMarkers = [];

    districtLocations.forEach(loc => {
        if (filterType !== 'all' && loc.type !== filterType) return;

        const style = facilityStyles[loc.type] || { color: '#334155', icon: 'fa-map-pin', label: 'Point' };

        // Custom HTML Marker Pin
        const customIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `
                <div style="background-color: ${style.color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); border: 2px solid white; cursor: pointer; transition: transform 0.2s;">
                    <i class="fas ${style.icon}" style="font-size: 14px;"></i>
                </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -16]
        });

        const marker = L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(leafletMap);

        const popupContent = `
            <div class="p-2 text-slate-800" style="min-width: 220px;">
                <div class="flex items-center gap-2 mb-1">
                    <span style="background-color: ${style.color}" class="text-white text-xs px-2 py-0.5 rounded font-semibold">${style.label}</span>
                </div>
                <h4 class="font-bold text-base text-slate-900 mb-1">${loc.name}</h4>
                <p class="text-xs text-slate-600 mb-2 leading-relaxed">${loc.info}</p>
                <div class="flex items-center justify-between text-xs text-slate-500 border-t pt-1">
                    <span>GPS: ${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}</span>
                    <a href="https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}" target="_blank" class="text-blue-600 hover:underline font-medium">Google Maps &rarr;</a>
                </div>
            </div>
        `;

        marker.bindPopup(popupContent);
        activeMarkers.push(marker);
    });
}

function filterMapCategory(type) {
    document.querySelectorAll('.map-filter-btn').forEach(btn => {
        if (btn.getAttribute('data-type') === type) {
            btn.classList.add('bg-blue-900', 'text-white', 'shadow');
            btn.classList.remove('bg-white', 'text-slate-700');
        } else {
            btn.classList.remove('bg-blue-900', 'text-white', 'shadow');
            btn.classList.add('bg-white', 'text-slate-700');
        }
    });

    renderFacilityMarkers(type);
}

function searchMapLocation(query) {
    if (!query) return;
    const q = query.toLowerCase();
    const found = districtLocations.find(l => l.name.toLowerCase().includes(q) || l.info.toLowerCase().includes(q) || l.type.toLowerCase().includes(q));
    if (found && leafletMap) {
        leafletMap.flyTo([found.lat, found.lng], 13, { duration: 1.5 });
        const targetMarker = activeMarkers.find(m => {
            const pos = m.getLatLng();
            return Math.abs(pos.lat - found.lat) < 0.001 && Math.abs(pos.lng - found.lng) < 0.001;
        });
        if (targetMarker) targetMarker.openPopup();
    }
}

function addMapLegend() {
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function() {
        const div = L.DomUtil.create('div', 'bg-white/95 backdrop-blur-md p-3 rounded-lg shadow-lg border border-slate-200 text-xs font-medium space-y-1 text-slate-700');
        div.innerHTML = `<div class="font-bold text-slate-900 mb-1 border-b pb-1">Facility Legend</div>`;
        Object.keys(facilityStyles).forEach(key => {
            const item = facilityStyles[key];
            div.innerHTML += `
                <div class="flex items-center gap-2">
                    <span style="background-color: ${item.color}; width: 12px; height: 12px; border-radius: 50%; display: inline-block;"></span>
                    <span>${item.label}</span>
                </div>
            `;
        });
        return div;
    };
    legend.addTo(leafletMap);
}

// Google Maps Switcher & Custom API Key loader
function loadGoogleMaps(apiKey) {
    if (!apiKey) {
        alert("Please enter a valid Google Maps API Key to switch to Google Maps Native Engine.");
        return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initGoogleMapInstance`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

window.initGoogleMapInstance = function() {
    const mapDiv = document.getElementById('districtMap');
    if (!mapDiv) return;

    // Destroy Leaflet
    if (leafletMap) {
        leafletMap.remove();
        leafletMap = null;
    }

    googleMap = new google.maps.Map(mapDiv, {
        center: { lat: 14.4426, lng: 79.9865 },
        zoom: 10,
        mapTypeId: 'terrain'
    });

    // Add Boundary
    const boundaryPath = nelloreBoundaryCoords.map(c => ({ lat: c[0], lng: c[1] }));
    const boundaryPoly = new google.maps.Polygon({
        paths: boundaryPath,
        strokeColor: '#1e3a8a',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#3b82f6',
        fillOpacity: 0.1
    });
    boundaryPoly.setMap(googleMap);

    // Add Google Markers
    districtLocations.forEach(loc => {
        const marker = new google.maps.Marker({
            position: { lat: loc.lat, lng: loc.lng },
            map: googleMap,
            title: loc.name
        });

        const info = new google.maps.InfoWindow({
            content: `<b>${loc.name}</b><br>${loc.info}`
        });

        marker.addListener('click', () => {
            info.open(googleMap, marker);
        });
    });

    alert("Google Maps API successfully initialized with Nellore district layers!");
};
