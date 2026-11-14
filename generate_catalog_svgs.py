"""
generate_catalog_svgs.py
Generates 90 high-definition, realistic, dedicated SVG illustrations for every product
in the Vel Tech Annapurna Canteen &amp; Mini Store catalog.
"""

import os
import sqlite3

ITEMS_DIR = os.path.join(os.path.dirname(__file__), 'public', 'img', 'items')
os.makedirs(ITEMS_DIR, exist_ok=True)

# Helper function to generate standardized, beautiful SVG wraps
def wrap_svg(slug, title, badge_text, badge_color, content, bg_color="#18181b"):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260">
  <defs>
    <linearGradient id="bg_{slug}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{bg_color}"/>
      <stop offset="100%" stop-color="#09090b"/>
    </linearGradient>
    <filter id="shadow_{slug}" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#000" flood-opacity="0.45"/>
    </filter>
  </defs>
  <rect width="400" height="260" fill="url(#bg_{slug})"/>
  {content}
  <rect x="16" y="16" width="{len(badge_text)*8 + 22}" height="24" rx="12" fill="rgba(0,0,0,0.65)" stroke="{badge_color}" stroke-width="1.2"/>
  <text x="{16 + (len(badge_text)*8 + 22)/2}" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10.5" font-weight="700" fill="{badge_color}" text-anchor="middle" letter-spacing="0.8">{badge_text.replace("&amp;", "&amp;")}</text>
  <text x="200" y="246" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="#a1a1aa" text-anchor="middle" letter-spacing="0.5">{title.replace("&amp;", "&amp;")}</text>
</svg>'''

def build_all_svgs():
    svgs = {}

    # =========================================================================
    # 1. TIFFIN
    # =========================================================================
    svgs['idli'] = wrap_svg('idli', 'Idli (2 pcs) with Sambar &amp; Chutney', 'TIFFIN • VEG', '#22c55e', '''
      <path d="M 45,130 C 55,60 120,40 220,45 C 330,50 365,100 355,170 C 345,225 280,235 180,230 C 90,225 40,190 45,130 Z" fill="#2e7d32" filter="url(#shadow_idli)"/>
      <path d="M 55,135 Q 200,138 345,140" stroke="#4caf50" stroke-width="2.5" fill="none" opacity="0.5"/>
      <circle cx="110" cy="95" r="32" fill="#374151" filter="url(#shadow_idli)"/>
      <circle cx="110" cy="95" r="28" fill="#d97706"/>
      <circle cx="114" cy="92" r="5" fill="#ef4444" opacity="0.9"/>
      <circle cx="290" cy="95" r="30" fill="#374151" filter="url(#shadow_idli)"/>
      <circle cx="290" cy="95" r="26" fill="#f8fafc"/>
      <circle cx="288" cy="93" r="2.5" fill="#1e293b"/>
      <ellipse cx="160" cy="155" rx="50" ry="38" fill="#ffffff" filter="url(#shadow_idli)"/>
      <ellipse cx="152" cy="148" rx="38" ry="26" fill="#f4f4f5" opacity="0.8"/>
      <ellipse cx="235" cy="160" rx="52" ry="39" fill="#ffffff" filter="url(#shadow_idli)"/>
      <ellipse cx="227" cy="152" rx="40" ry="27" fill="#f4f4f5" opacity="0.8"/>
      <path d="M 195,145 Q 200,135 208,138 Q 202,148 195,145 Z" fill="#15803d"/>
    ''', '#1a2e1d')

    svgs['crispy_dosa'] = wrap_svg('crispy_dosa', 'Golden Crispy Dosa Roast', 'TIFFIN • VEG', '#22c55e', '''
      <rect x="40" y="55" width="320" height="150" rx="20" fill="#27272a" filter="url(#shadow_crispy_dosa)"/>
      <path d="M 70,125 C 100,80 300,75 330,125 C 320,165 100,170 70,125 Z" fill="#d97706" filter="url(#shadow_crispy_dosa)"/>
      <path d="M 75,125 C 100,90 295,85 325,125 C 315,155 105,160 75,125 Z" fill="#f59e0b"/>
      <path d="M 85,123 Q 200,105 315,123" stroke="#b45309" stroke-width="6" fill="none" opacity="0.7"/>
      <path d="M 90,127 Q 200,140 310,127" stroke="#92400e" stroke-width="4" fill="none" opacity="0.5"/>
      <circle cx="120" cy="175" r="24" fill="#374151" filter="url(#shadow_crispy_dosa)"/>
      <circle cx="120" cy="175" r="21" fill="#f8fafc"/>
      <circle cx="200" cy="175" r="24" fill="#374151" filter="url(#shadow_crispy_dosa)"/>
      <circle cx="200" cy="175" r="21" fill="#dc2626"/>
      <circle cx="280" cy="175" r="24" fill="#374151" filter="url(#shadow_crispy_dosa)"/>
      <circle cx="280" cy="175" r="21" fill="#d97706"/>
    ''', '#271c12')

    svgs['poori_masala'] = wrap_svg('poori_masala', 'Poori Masala (2 pcs)', 'TIFFIN • VEG', '#22c55e', '''
      <ellipse cx="200" cy="140" rx="160" ry="85" fill="#3f3f46" filter="url(#shadow_poori_masala)"/>
      <circle cx="200" cy="140" r="82" fill="#52525b"/>
      <circle cx="200" cy="100" r="38" fill="#374151" filter="url(#shadow_poori_masala)"/>
      <circle cx="200" cy="100" r="34" fill="#eab308"/>
      <circle cx="195" cy="96" r="6" fill="#ca8a04"/>
      <circle cx="206" cy="104" r="5" fill="#16a34a"/>
      <circle cx="140" cy="155" r="54" fill="#d97706" filter="url(#shadow_poori_masala)"/>
      <circle cx="136" cy="150" r="48" fill="#f59e0b"/>
      <circle cx="130" cy="142" r="34" fill="#fbbf24" opacity="0.7"/>
      <circle cx="260" cy="155" r="54" fill="#d97706" filter="url(#shadow_poori_masala)"/>
      <circle cx="256" cy="150" r="48" fill="#f59e0b"/>
      <circle cx="250" cy="142" r="34" fill="#fbbf24" opacity="0.7"/>
    ''', '#241a10')

    svgs['rava_upma'] = wrap_svg('rava_upma', 'Rava Upma with Cashews', 'TIFFIN • VEG', '#22c55e', '''
      <ellipse cx="200" cy="140" rx="120" ry="75" fill="#374151" filter="url(#shadow_rava_upma)"/>
      <ellipse cx="200" cy="135" rx="108" ry="65" fill="#fef08a"/>
      <ellipse cx="200" cy="130" rx="90" ry="50" fill="#fef9c3"/>
      <ellipse cx="170" cy="125" rx="10" ry="6" fill="#d97706" transform="rotate(-15 170 125)"/>
      <ellipse cx="225" cy="135" rx="10" ry="6" fill="#d97706" transform="rotate(20 225 135)"/>
      <ellipse cx="195" cy="145" rx="9" ry="5" fill="#ca8a04"/>
      <circle cx="155" cy="140" r="2" fill="#1e293b"/>
      <circle cx="185" cy="120" r="2.5" fill="#1e293b"/>
      <circle cx="215" cy="145" r="2" fill="#1e293b"/>
      <path d="M 180,115 Q 185,110 192,112" stroke="#16a34a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <circle cx="310" cy="110" r="26" fill="#374151" filter="url(#shadow_rava_upma)"/>
      <circle cx="310" cy="110" r="23" fill="#f8fafc"/>
    ''', '#1f241a')

    svgs['ghee_pongal'] = wrap_svg('ghee_pongal', 'Ghee Ven Pongal with Cashews', 'TIFFIN • VEG', '#22c55e', '''
      <ellipse cx="200" cy="140" rx="120" ry="75" fill="#374151" filter="url(#shadow_ghee_pongal)"/>
      <ellipse cx="200" cy="135" rx="108" ry="65" fill="#fef9c3"/>
      <ellipse cx="200" cy="130" rx="92" ry="52" fill="#fef08a"/>
      <circle cx="180" cy="125" r="3.5" fill="#1c1917"/>
      <circle cx="220" cy="138" r="3.5" fill="#1c1917"/>
      <circle cx="165" cy="142" r="3" fill="#1c1917"/>
      <ellipse cx="195" cy="120" rx="12" ry="7" fill="#d97706" transform="rotate(-10 195 120)"/>
      <ellipse cx="215" cy="145" rx="11" ry="6.5" fill="#d97706" transform="rotate(25 215 145)"/>
      <ellipse cx="160" cy="130" rx="10" ry="6" fill="#ca8a04" transform="rotate(-30 160 130)"/>
      <path d="M 185,140 Q 190,132 200,136" stroke="#15803d" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="90" cy="115" r="26" fill="#374151" filter="url(#shadow_ghee_pongal)"/>
      <circle cx="90" cy="115" r="23" fill="#d97706"/>
      <circle cx="310" cy="115" r="26" fill="#374151" filter="url(#shadow_ghee_pongal)"/>
      <circle cx="310" cy="115" r="23" fill="#f8fafc"/>
    ''', '#26241a')

    svgs['masala_dosa'] = wrap_svg('masala_dosa', 'Special Masala Dosa', 'TIFFIN • VEG', '#22c55e', '''
      <path d="M 60,140 L 200,75 L 340,140 L 200,175 Z" fill="#b45309" filter="url(#shadow_masala_dosa)"/>
      <path d="M 70,138 L 200,85 L 330,138 L 200,168 Z" fill="#d97706"/>
      <path d="M 85,136 L 200,95 L 315,136 L 200,160 Z" fill="#f59e0b"/>
      <ellipse cx="200" cy="135" rx="35" ry="16" fill="#eab308" opacity="0.95"/>
      <circle cx="190" cy="133" r="3" fill="#15803d"/>
      <circle cx="208" cy="137" r="2.5" fill="#b45309"/>
      <circle cx="100" cy="190" r="22" fill="#374151" filter="url(#shadow_masala_dosa)"/>
      <circle cx="100" cy="190" r="19" fill="#f8fafc"/>
      <circle cx="200" cy="198" r="22" fill="#374151" filter="url(#shadow_masala_dosa)"/>
      <circle cx="200" cy="198" r="19" fill="#dc2626"/>
      <circle cx="300" cy="190" r="22" fill="#374151" filter="url(#shadow_masala_dosa)"/>
      <circle cx="300" cy="190" r="19" fill="#d97706"/>
    ''', '#251b14')

    svgs['medu_vada'] = wrap_svg('medu_vada', 'Crispy Medu Vada (2 pcs)', 'TIFFIN • VEG', '#22c55e', '''
      <path d="M 50,130 C 50,70 120,50 200,52 C 280,50 350,70 350,130 C 350,190 280,210 200,208 C 120,210 50,190 50,130 Z" fill="#15803d" opacity="0.4"/>
      <!-- Vada 1 -->
      <circle cx="145" cy="140" r="52" fill="#92400e" filter="url(#shadow_medu_vada)"/>
      <circle cx="145" cy="138" r="48" fill="#d97706"/>
      <circle cx="142" cy="134" r="38" fill="#f59e0b" opacity="0.7"/>
      <circle cx="145" cy="138" r="16" fill="#18181b"/>
      <circle cx="130" cy="125" r="2" fill="#1c1917"/>
      <circle cx="160" cy="150" r="2.5" fill="#1c1917"/>
      <!-- Vada 2 -->
      <circle cx="250" cy="140" r="52" fill="#92400e" filter="url(#shadow_medu_vada)"/>
      <circle cx="250" cy="138" r="48" fill="#d97706"/>
      <circle cx="247" cy="134" r="38" fill="#f59e0b" opacity="0.7"/>
      <circle cx="250" cy="138" r="16" fill="#18181b"/>
      <circle cx="235" cy="125" r="2" fill="#1c1917"/>
      <circle cx="265" cy="150" r="2.5" fill="#1c1917"/>
      <!-- Coconut chutney in center -->
      <circle cx="200" cy="85" r="26" fill="#374151" filter="url(#shadow_medu_vada)"/>
      <circle cx="200" cy="85" r="23" fill="#f8fafc"/>
      <circle cx="198" cy="83" r="2.5" fill="#1e293b"/>
    ''', '#1e1c14')

    # =========================================================================
    # 2. LUNCH
    # =========================================================================
    svgs['veg_meals'] = wrap_svg('veg_meals', 'South Indian Veg Banana Leaf Meals', 'LUNCH • VEG', '#22c55e', '''
      <rect x="35" y="45" width="330" height="175" rx="20" fill="#2e7d32" filter="url(#shadow_veg_meals)"/>
      <path d="M 40,132 L 360,132" stroke="#4caf50" stroke-width="2.5" opacity="0.6"/>
      <!-- Steamed Rice Mount -->
      <ellipse cx="200" cy="145" rx="55" ry="32" fill="#ffffff" filter="url(#shadow_veg_meals)"/>
      <ellipse cx="200" cy="140" rx="35" ry="18" fill="#fef08a" opacity="0.9"/>
      <!-- Sambar on top of rice -->
      <circle cx="200" cy="138" r="12" fill="#d97706"/>
      <!-- Top Row Bowls -->
      <circle cx="80" cy="85" r="18" fill="#f59e0b"/>
      <circle cx="130" cy="80" r="18" fill="#ef4444"/>
      <circle cx="180" cy="78" r="18" fill="#84cc16"/>
      <circle cx="230" cy="78" r="18" fill="#d97706"/>
      <circle cx="280" cy="80" r="18" fill="#f8fafc"/>
      <circle cx="325" cy="85" r="16" fill="#fbbf24"/>
      <!-- Appalam Crispy Papad -->
      <circle cx="100" cy="155" r="28" fill="#fef08a" filter="url(#shadow_veg_meals)"/>
      <circle cx="98" cy="153" r="25" fill="#fef9c3"/>
      <!-- Payasam / Sweet bowl -->
      <circle cx="310" cy="155" r="22" fill="#fbbf24" filter="url(#shadow_veg_meals)"/>
    ''', '#152416')

    svgs['chicken_meals'] = wrap_svg('chicken_meals', 'Special Chicken Non-Veg Meals', 'LUNCH • NON-VEG', '#ef4444', '''
      <rect x="35" y="45" width="330" height="175" rx="20" fill="#2e7d32" filter="url(#shadow_chicken_meals)"/>
      <path d="M 40,132 L 360,132" stroke="#4caf50" stroke-width="2.5" opacity="0.6"/>
      <!-- Rice Mount -->
      <ellipse cx="190" cy="145" rx="55" ry="32" fill="#ffffff" filter="url(#shadow_chicken_meals)"/>
      <!-- Rich Chicken Curry Bowl -->
      <circle cx="285" cy="140" r="32" fill="#374151" filter="url(#shadow_chicken_meals)"/>
      <circle cx="285" cy="140" r="29" fill="#991b1b"/>
      <ellipse cx="282" cy="136" rx="14" ry="9" fill="#7f1d1d"/>
      <ellipse cx="292" cy="144" rx="12" ry="8" fill="#b91c1c"/>
      <!-- Top Gravy Bowls -->
      <circle cx="80" cy="85" r="18" fill="#b91c1c"/>
      <circle cx="130" cy="80" r="18" fill="#b45309"/>
      <circle cx="180" cy="78" r="18" fill="#dc2626"/>
      <circle cx="230" cy="78" r="18" fill="#f8fafc"/>
      <circle cx="280" cy="80" r="18" fill="#fef08a"/>
      <!-- Appalam -->
      <circle cx="95" cy="155" r="26" fill="#fef08a" filter="url(#shadow_chicken_meals)"/>
    ''', '#261717')

    svgs['veg_fried_rice'] = wrap_svg('veg_fried_rice', 'Wok Veg Fried Rice', 'LUNCH • VEG', '#22c55e', '''
      <ellipse cx="200" cy="140" rx="130" ry="75" fill="#18181b" filter="url(#shadow_veg_fried_rice)"/>
      <ellipse cx="200" cy="135" rx="118" ry="65" fill="#27272a"/>
      <!-- Fried Rice Bed -->
      <ellipse cx="200" cy="130" rx="105" ry="55" fill="#fef9c3"/>
      <!-- Veggie bits -->
      <circle cx="160" cy="120" r="3.5" fill="#ea580c"/>
      <circle cx="180" cy="140" r="3" fill="#16a34a"/>
      <circle cx="210" cy="115" r="3.5" fill="#16a34a"/>
      <circle cx="235" cy="135" r="3.5" fill="#ea580c"/>
      <circle cx="195" cy="125" r="3" fill="#ea580c"/>
      <circle cx="150" cy="138" r="3" fill="#16a34a"/>
      <circle cx="220" cy="142" r="3" fill="#16a34a"/>
      <!-- Chopsticks -->
      <line x1="120" y1="65" x2="280" y2="175" stroke="#a16207" stroke-width="4" stroke-linecap="round"/>
      <line x1="140" y1="60" x2="295" y2="170" stroke="#ca8a04" stroke-width="3" stroke-linecap="round"/>
    ''', '#1f2019')

    svgs['veg_biryani'] = wrap_svg('veg_biryani', 'Royal Veg Dum Biryani', 'LUNCH • VEG', '#22c55e', '''
      <!-- Clay Handi Pot -->
      <path d="M 120,120 C 110,180 140,210 200,210 C 260,210 290,180 280,120 Z" fill="#b45309" filter="url(#shadow_veg_biryani)"/>
      <ellipse cx="200" cy="120" rx="80" ry="24" fill="#d97706"/>
      <ellipse cx="200" cy="118" rx="72" ry="20" fill="#f59e0b"/>
      <!-- Biryani grains -->
      <ellipse cx="200" cy="116" rx="65" ry="18" fill="#fbbf24"/>
      <!-- Saffron / Spices / Fried onions -->
      <circle cx="180" cy="112" r="3" fill="#15803d"/>
      <circle cx="210" cy="118" r="3" fill="#15803d"/>
      <ellipse cx="195" cy="115" rx="8" ry="3" fill="#78350f"/>
      <ellipse cx="220" cy="112" rx="7" ry="2.5" fill="#78350f"/>
      <ellipse cx="170" cy="118" rx="7" ry="3" fill="#78350f"/>
      <!-- Handi Rim -->
      <ellipse cx="200" cy="108" rx="82" ry="12" fill="none" stroke="#78350f" stroke-width="4"/>
      <!-- Raita bowl -->
      <circle cx="320" cy="165" r="24" fill="#374151" filter="url(#shadow_veg_biryani)"/>
      <circle cx="320" cy="165" r="21" fill="#f8fafc"/>
      <circle cx="320" cy="165" r="3" fill="#dc2626"/>
    ''', '#261b12')

    svgs['chicken_biryani'] = wrap_svg('chicken_biryani', 'Hyderabadi Chicken Dum Biryani', 'LUNCH • NON-VEG', '#ef4444', '''
      <!-- Clay Handi Pot -->
      <path d="M 120,120 C 110,180 140,210 200,210 C 260,210 290,180 280,120 Z" fill="#9a3412" filter="url(#shadow_chicken_biryani)"/>
      <ellipse cx="200" cy="120" rx="80" ry="24" fill="#ea580c"/>
      <!-- Saffron Rice -->
      <ellipse cx="200" cy="118" rx="74" ry="20" fill="#f59e0b"/>
      <!-- Chicken Leg Piece -->
      <path d="M 160,115 C 170,95 210,100 220,115 C 215,125 175,125 160,115 Z" fill="#991b1b" filter="url(#shadow_chicken_biryani)"/>
      <rect x="215" y="105" width="25" height="8" rx="4" fill="#fef3c7" transform="rotate(20 215 105)"/>
      <!-- Boiled egg half -->
      <ellipse cx="180" cy="130" rx="16" ry="12" fill="#ffffff" filter="url(#shadow_chicken_biryani)"/>
      <circle cx="180" cy="130" r="7" fill="#f59e0b"/>
      <!-- Fried Onions -->
      <ellipse cx="205" cy="122" rx="9" ry="3" fill="#451a03"/>
      <ellipse cx="150" cy="120" rx="8" ry="2.5" fill="#451a03"/>
      <!-- Salan Bowl -->
      <circle cx="320" cy="165" r="24" fill="#374151" filter="url(#shadow_chicken_biryani)"/>
      <circle cx="320" cy="165" r="21" fill="#b91c1c"/>
    ''', '#271714')

    svgs['curd_rice'] = wrap_svg('curd_rice', 'Tempered South Indian Curd Rice', 'LUNCH • VEG', '#22c55e', '''
      <circle cx="200" cy="135" r="85" fill="#3f3f46" filter="url(#shadow_curd_rice)"/>
      <circle cx="200" cy="135" r="78" fill="#52525b"/>
      <!-- Creamy White Curd Rice -->
      <circle cx="200" cy="135" r="72" fill="#f8fafc"/>
      <!-- Mustard seeds -->
      <circle cx="180" cy="115" r="2.5" fill="#0f172a"/>
      <circle cx="220" cy="125" r="2" fill="#0f172a"/>
      <circle cx="170" cy="140" r="2.5" fill="#0f172a"/>
      <circle cx="205" cy="155" r="2" fill="#0f172a"/>
      <!-- Ruby Pomegranate Pearls -->
      <circle cx="195" cy="128" r="4.5" fill="#be123c"/>
      <circle cx="175" cy="122" r="4" fill="#e11d48"/>
      <circle cx="215" cy="140" r="4.5" fill="#be123c"/>
      <circle cx="190" cy="148" r="4" fill="#e11d48"/>
      <circle cx="225" cy="128" r="4" fill="#be123c"/>
      <!-- Curry leaves &amp; Green chili -->
      <path d="M 175,135 Q 182,130 190,135" stroke="#15803d" stroke-width="2.5" fill="none"/>
      <path d="M 205,142 Q 212,136 218,142" stroke="#15803d" stroke-width="2.5" fill="none"/>
      <!-- Pickle side dip -->
      <circle cx="310" cy="115" r="22" fill="#374151" filter="url(#shadow_curd_rice)"/>
      <circle cx="310" cy="115" r="19" fill="#dc2626"/>
    ''', '#182024')

    svgs['egg_fried_rice'] = wrap_svg('egg_fried_rice', 'Wok Egg Fried Rice', 'LUNCH • EGG', '#f59e0b', '''
      <ellipse cx="200" cy="140" rx="130" ry="75" fill="#18181b" filter="url(#shadow_egg_fried_rice)"/>
      <ellipse cx="200" cy="135" rx="118" ry="65" fill="#27272a"/>
      <ellipse cx="200" cy="130" rx="105" ry="55" fill="#fef08a"/>
      <!-- Scrambled egg golden ribbons -->
      <ellipse cx="175" cy="120" rx="15" ry="7" fill="#eab308"/>
      <ellipse cx="220" cy="130" rx="18" ry="8" fill="#eab308"/>
      <ellipse cx="190" cy="142" rx="14" ry="7" fill="#f59e0b"/>
      <!-- Scallions &amp; Veggies -->
      <circle cx="155" cy="132" r="3" fill="#15803d"/>
      <circle cx="205" cy="118" r="3" fill="#15803d"/>
      <circle cx="235" cy="140" r="3" fill="#15803d"/>
      <circle cx="170" cy="140" r="2.5" fill="#ea580c"/>
    ''', '#222016')

    # =========================================================================
    # 3. DINNER
    # =========================================================================
    svgs['chapati_kurma'] = wrap_svg('chapati_kurma', 'Whole Wheat Chapati with Veg Kurma', 'DINNER • VEG', '#22c55e', '''
      <!-- Plate -->
      <ellipse cx="200" cy="145" rx="150" ry="80" fill="#3f3f46" filter="url(#shadow_chapati_kurma)"/>
      <!-- Kurma Bowl -->
      <circle cx="295" cy="135" r="38" fill="#374151" filter="url(#shadow_chapati_kurma)"/>
      <circle cx="295" cy="135" r="34" fill="#d97706"/>
      <circle cx="290" cy="130" r="6" fill="#15803d"/>
      <circle cx="302" cy="140" r="5" fill="#ea580c"/>
      <!-- Chapati 1 (Under) -->
      <circle cx="140" cy="155" r="62" fill="#d97706" filter="url(#shadow_chapati_kurma)"/>
      <circle cx="140" cy="153" r="58" fill="#f59e0b"/>
      <!-- Brown roasted spots -->
      <circle cx="120" cy="140" r="3" fill="#78350f" opacity="0.6"/>
      <circle cx="155" cy="160" r="4" fill="#78350f" opacity="0.6"/>
      <!-- Chapati 2 (Puffed Over) -->
      <circle cx="175" cy="135" r="64" fill="#b45309" filter="url(#shadow_chapati_kurma)"/>
      <circle cx="175" cy="132" r="60" fill="#fde047"/>
      <circle cx="170" cy="128" r="48" fill="#fef08a" opacity="0.9"/>
      <!-- Brown blister marks -->
      <ellipse cx="160" cy="120" rx="6" ry="4" fill="#92400e" opacity="0.7"/>
      <ellipse cx="190" cy="140" rx="8" ry="4" fill="#92400e" opacity="0.7"/>
      <ellipse cx="155" cy="145" rx="7" ry="5" fill="#78350f" opacity="0.6"/>
      <ellipse cx="200" cy="125" rx="5" ry="3" fill="#78350f" opacity="0.6"/>
    ''', '#261e16')

    svgs['parotta_salna'] = wrap_svg('parotta_salna', 'Malabar Parotta with Salna (2 pcs)', 'DINNER • VEG', '#22c55e', '''
      <ellipse cx="200" cy="145" rx="150" ry="80" fill="#27272a" filter="url(#shadow_parotta_salna)"/>
      <!-- Spicy Salna Bowl -->
      <circle cx="295" cy="130" r="38" fill="#374151" filter="url(#shadow_parotta_salna)"/>
      <circle cx="295" cy="130" r="34" fill="#b91c1c"/>
      <circle cx="290" cy="126" r="6" fill="#ea580c"/>
      <!-- Parotta 1 -->
      <circle cx="130" cy="150" r="56" fill="#ca8a04" filter="url(#shadow_parotta_salna)"/>
      <circle cx="130" cy="147" r="52" fill="#fef08a"/>
      <!-- Flaky spiral rings -->
      <circle cx="130" cy="147" r="38" fill="none" stroke="#ca8a04" stroke-width="3" stroke-dasharray="14 8"/>
      <circle cx="130" cy="147" r="22" fill="none" stroke="#a16207" stroke-width="3" stroke-dasharray="10 6"/>
      <!-- Parotta 2 (Overlapping) -->
      <circle cx="185" cy="130" r="58" fill="#ca8a04" filter="url(#shadow_parotta_salna)"/>
      <circle cx="185" cy="127" r="54" fill="#fef08a"/>
      <circle cx="185" cy="127" r="40" fill="none" stroke="#ca8a04" stroke-width="3.5" stroke-dasharray="16 8"/>
      <circle cx="185" cy="127" r="24" fill="none" stroke="#a16207" stroke-width="3" stroke-dasharray="12 6"/>
      <circle cx="185" cy="127" r="8" fill="#eab308"/>
    ''', '#241f17')

    svgs['dinner_dosa'] = wrap_svg('dinner_dosa', 'Dinner Paper Roast Dosa', 'DINNER • VEG', '#22c55e', '''
      <ellipse cx="200" cy="140" rx="150" ry="75" fill="#27272a" filter="url(#shadow_dinner_dosa)"/>
      <!-- Long Rolled Golden Dosa -->
      <path d="M 60,135 Q 200,95 340,135 Q 200,165 60,135 Z" fill="#b45309" filter="url(#shadow_dinner_dosa)"/>
      <path d="M 70,133 Q 200,102 330,133 Q 200,158 70,133 Z" fill="#d97706"/>
      <path d="M 85,130 Q 200,110 315,130 Q 200,150 85,130 Z" fill="#f59e0b"/>
      <!-- Chutneys -->
      <circle cx="130" cy="180" r="20" fill="#374151" filter="url(#shadow_dinner_dosa)"/>
      <circle cx="130" cy="180" r="17" fill="#f8fafc"/>
      <circle cx="200" cy="185" r="20" fill="#374151" filter="url(#shadow_dinner_dosa)"/>
      <circle cx="200" cy="185" r="17" fill="#dc2626"/>
      <circle cx="270" cy="180" r="20" fill="#374151" filter="url(#shadow_dinner_dosa)"/>
      <circle cx="270" cy="180" r="17" fill="#d97706"/>
    ''', '#261d15')

    svgs['schezwan_rice'] = wrap_svg('schezwan_rice', 'Zesty Schezwan Fried Rice', 'DINNER • VEG', '#22c55e', '''
      <ellipse cx="200" cy="140" rx="130" ry="75" fill="#18181b" filter="url(#shadow_schezwan_rice)"/>
      <ellipse cx="200" cy="135" rx="118" ry="65" fill="#27272a"/>
      <!-- Fiery Red Rice Bed -->
      <ellipse cx="200" cy="130" rx="105" ry="55" fill="#ea580c"/>
      <ellipse cx="200" cy="128" rx="90" ry="46" fill="#f97316"/>
      <!-- Chili flakes &amp; Spring Onions -->
      <circle cx="160" cy="120" r="3.5" fill="#991b1b"/>
      <circle cx="185" cy="135" r="3" fill="#15803d"/>
      <circle cx="215" cy="118" r="3.5" fill="#15803d"/>
      <circle cx="230" cy="138" r="3" fill="#991b1b"/>
      <path d="M 180,105 Q 185,95 195,100" stroke="#dc2626" stroke-width="3" fill="none" stroke-linecap="round"/>
    ''', '#271915')

    svgs['paneer_butter'] = wrap_svg('paneer_butter', 'Paneer Butter Masala', 'DINNER • VEG', '#22c55e', '''
      <circle cx="200" cy="135" r="85" fill="#3f3f46" filter="url(#shadow_paneer_butter)"/>
      <circle cx="200" cy="135" r="78" fill="#52525b"/>
      <!-- Rich Orange Gravy -->
      <circle cx="200" cy="135" r="72" fill="#ea580c"/>
      <circle cx="200" cy="135" r="62" fill="#f97316"/>
      <!-- Cream Swirl -->
      <path d="M 170,120 Q 200,105 220,130 Q 200,155 180,140" stroke="#ffffff" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.85"/>
      <!-- Fresh Paneer Cubes -->
      <rect x="155" y="125" width="22" height="18" rx="2" fill="#ffffff" filter="url(#shadow_paneer_butter)"/>
      <rect x="185" y="110" width="24" height="20" rx="2" fill="#ffffff" filter="url(#shadow_paneer_butter)"/>
      <rect x="210" y="132" width="22" height="18" rx="2" fill="#ffffff" filter="url(#shadow_paneer_butter)"/>
      <rect x="180" y="145" width="20" height="16" rx="2" fill="#ffffff" filter="url(#shadow_paneer_butter)"/>
      <!-- Coriander garnish -->
      <circle cx="198" cy="128" r="3" fill="#15803d"/>
    ''', '#271c14')

    svgs['kadai_chicken'] = wrap_svg('kadai_chicken', 'Kadai Chicken Curry', 'DINNER • NON-VEG', '#ef4444', '''
      <!-- Iron Wok / Kadai -->
      <ellipse cx="200" cy="140" rx="110" ry="65" fill="#18181b" filter="url(#shadow_kadai_chicken)"/>
      <!-- Kadai Handles -->
      <path d="M 75,135 Q 60,135 60,120 Q 60,105 78,110" stroke="#52525b" stroke-width="6" fill="none"/>
      <path d="M 325,135 Q 340,135 340,120 Q 340,105 322,110" stroke="#52525b" stroke-width="6" fill="none"/>
      <!-- Rich Spicy Gravy -->
      <ellipse cx="200" cy="138" rx="98" ry="55" fill="#991b1b"/>
      <!-- Chicken Pieces -->
      <ellipse cx="170" cy="130" rx="22" ry="14" fill="#7f1d1d" filter="url(#shadow_kadai_chicken)"/>
      <ellipse cx="220" cy="135" rx="20" ry="13" fill="#7f1d1d" filter="url(#shadow_kadai_chicken)"/>
      <!-- Bell peppers (Capsicum green &amp; red) -->
      <rect x="155" y="145" width="14" height="8" rx="2" fill="#16a34a"/>
      <rect x="210" y="120" width="12" height="8" rx="2" fill="#16a34a"/>
      <rect x="190" y="138" width="12" height="8" rx="2" fill="#dc2626"/>
    ''', '#281716')

    # =========================================================================
    # 4. SNACKS
    # =========================================================================
    svgs['samosa'] = wrap_svg('samosa', 'Crispy Golden Samosas (2 pcs)', 'SNACKS • VEG', '#22c55e', '''
      <ellipse cx="200" cy="155" rx="140" ry="65" fill="#27272a" filter="url(#shadow_samosa)"/>
      <!-- Samosa 1 (Left) -->
      <path d="M 130,75 L 70,175 L 190,175 Z" fill="#b45309" filter="url(#shadow_samosa)"/>
      <path d="M 130,82 L 78,170 L 182,170 Z" fill="#d97706"/>
      <path d="M 130,92 L 90,165 L 170,165 Z" fill="#f59e0b"/>
      <!-- Samosa 2 (Right) -->
      <path d="M 235,70 L 170,170 L 295,170 Z" fill="#b45309" filter="url(#shadow_samosa)"/>
      <path d="M 235,77 L 178,165 L 287,165 Z" fill="#d97706"/>
      <path d="M 235,87 L 190,160 L 275,160 Z" fill="#f59e0b"/>
      <!-- Mint Chutney Bowl -->
      <circle cx="310" cy="120" r="26" fill="#374151" filter="url(#shadow_samosa)"/>
      <circle cx="310" cy="120" r="22" fill="#15803d"/>
      <circle cx="312" cy="118" r="4" fill="#86efac" opacity="0.6"/>
      <!-- Fried Green Chili -->
      <path d="M 120,185 Q 160,180 200,188" stroke="#16a34a" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    ''', '#241d14')

    svgs['veg_puff'] = wrap_svg('veg_puff', 'Golden Bakery Veg Puff Pastry', 'SNACKS • VEG', '#22c55e', '''
      <ellipse cx="200" cy="155" rx="140" ry="60" fill="#27272a" filter="url(#shadow_veg_puff)"/>
      <!-- Flaky Laminated Puff Pastry -->
      <rect x="110" y="85" width="180" height="95" rx="8" fill="#b45309" filter="url(#shadow_veg_puff)"/>
      <rect x="115" y="90" width="170" height="85" rx="6" fill="#d97706"/>
      <rect x="120" y="95" width="160" height="75" rx="4" fill="#f59e0b"/>
      <!-- Top Crust diagonal cuts -->
      <line x1="140" y1="95" x2="165" y2="170" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
      <line x1="185" y1="95" x2="210" y2="170" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
      <line x1="230" y1="95" x2="255" y2="170" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
      <!-- Vegetable filling peek -->
      <rect x="112" y="125" width="8" height="15" fill="#ea580c"/>
      <circle cx="116" cy="132" r="2.5" fill="#15803d"/>
    ''', '#241d15')

    svgs['egg_puff'] = wrap_svg('egg_puff', 'Crispy Golden Egg Puff', 'SNACKS • EGG', '#f59e0b', '''
      <ellipse cx="200" cy="155" rx="140" ry="60" fill="#27272a" filter="url(#shadow_egg_puff)"/>
      <!-- Flaky puff -->
      <path d="M 110,140 Q 200,70 290,140 Q 200,195 110,140 Z" fill="#b45309" filter="url(#shadow_egg_puff)"/>
      <path d="M 118,138 Q 200,80 282,138 Q 200,185 118,138 Z" fill="#d97706"/>
      <path d="M 128,136 Q 200,90 272,136 Q 200,175 128,136 Z" fill="#f59e0b"/>
      <!-- Boiled egg half clearly visible inside -->
      <ellipse cx="200" cy="136" rx="34" ry="24" fill="#ffffff" filter="url(#shadow_egg_puff)"/>
      <ellipse cx="200" cy="136" rx="18" ry="14" fill="#f59e0b"/>
      <ellipse cx="200" cy="136" rx="12" ry="9" fill="#eab308"/>
      <!-- Black Pepper dusting on egg -->
      <circle cx="196" cy="132" r="1.5" fill="#18181b"/>
      <circle cx="204" cy="138" r="1.5" fill="#18181b"/>
    ''', '#261e15')

    svgs['biscuits'] = wrap_svg('biscuits', 'Assorted Tea Biscuits &amp; Cookies', 'SNACKS • VEG', '#22c55e', '''
      <!-- Plate -->
      <ellipse cx="200" cy="140" rx="140" ry="70" fill="#3f3f46" filter="url(#shadow_biscuits)"/>
      <!-- Round Butter Cookie 1 -->
      <circle cx="130" cy="135" r="38" fill="#ca8a04" filter="url(#shadow_biscuits)"/>
      <circle cx="130" cy="133" r="34" fill="#fef08a"/>
      <!-- Cookie dots -->
      <circle cx="120" cy="125" r="2.5" fill="#a16207"/>
      <circle cx="140" cy="125" r="2.5" fill="#a16207"/>
      <circle cx="130" cy="135" r="2.5" fill="#a16207"/>
      <circle cx="120" cy="145" r="2.5" fill="#a16207"/>
      <circle cx="140" cy="145" r="2.5" fill="#a16207"/>
      <!-- Bourbon Choco Biscuit 2 -->
      <rect x="180" y="105" width="90" height="42" rx="4" fill="#451a03" filter="url(#shadow_biscuits)"/>
      <rect x="183" y="108" width="84" height="36" rx="3" fill="#78350f"/>
      <circle cx="195" cy="126" r="2" fill="#fef08a"/>
      <circle cx="210" cy="126" r="2" fill="#fef08a"/>
      <circle cx="225" cy="126" r="2" fill="#fef08a"/>
      <circle cx="240" cy="126" r="2" fill="#fef08a"/>
      <circle cx="255" cy="126" r="2" fill="#fef08a"/>
      <!-- Oreo Cream Sandwich Biscuit 3 -->
      <circle cx="270" cy="160" r="32" fill="#18181b" filter="url(#shadow_biscuits)"/>
      <circle cx="270" cy="158" r="30" fill="#27272a"/>
      <circle cx="270" cy="156" r="24" fill="#ffffff"/>
      <circle cx="270" cy="154" r="24" fill="#18181b"/>
    ''', '#242019')

    svgs['potato_chips'] = wrap_svg('potato_chips', 'Crispy Golden Potato Chips', 'SNACKS • VEG', '#22c55e', '''
      <!-- Snack Bowl -->
      <ellipse cx="200" cy="150" rx="120" ry="60" fill="#1e3a8a" filter="url(#shadow_potato_chips)"/>
      <ellipse cx="200" cy="140" rx="110" ry="50" fill="#2563eb"/>
      <!-- Crunchy crinkle-cut chips -->
      <ellipse cx="160" cy="125" rx="36" ry="22" fill="#ca8a04" transform="rotate(-20 160 125)" filter="url(#shadow_potato_chips)"/>
      <ellipse cx="160" cy="123" rx="32" ry="18" fill="#fef08a" transform="rotate(-20 160 123)"/>
      <ellipse cx="230" cy="120" rx="38" ry="24" fill="#ca8a04" transform="rotate(25 230 120)" filter="url(#shadow_potato_chips)"/>
      <ellipse cx="230" cy="118" rx="34" ry="20" fill="#fef08a" transform="rotate(25 230 118)"/>
      <ellipse cx="195" cy="105" rx="40" ry="22" fill="#d97706" transform="rotate(-5 195 105)" filter="url(#shadow_potato_chips)"/>
      <ellipse cx="195" cy="103" rx="36" ry="18" fill="#fef9c3" transform="rotate(-5 195 103)"/>
      <!-- Spices paprika speckles -->
      <circle cx="190" cy="100" r="1.5" fill="#dc2626"/>
      <circle cx="205" cy="106" r="1.5" fill="#dc2626"/>
      <circle cx="165" cy="122" r="1.5" fill="#dc2626"/>
    ''', '#182029')

    svgs['french_fries'] = wrap_svg('french_fries', 'Peri Peri Golden French Fries', 'SNACKS • VEG', '#22c55e', '''
      <!-- Red Fry Cup -->
      <path d="M 150,110 L 160,210 L 240,210 L 250,110 Z" fill="#b91c1c" filter="url(#shadow_french_fries)"/>
      <path d="M 152,112 L 161,208 L 239,208 L 248,112 Z" fill="#dc2626"/>
      <circle cx="200" cy="160" r="16" fill="#fef08a"/>
      <!-- Hot Fries Sticking Out -->
      <rect x="165" y="55" width="10" height="80" rx="2" fill="#fef08a" transform="rotate(-15 165 55)" filter="url(#shadow_french_fries)"/>
      <rect x="180" y="45" width="10" height="90" rx="2" fill="#fef08a" transform="rotate(-5 180 45)" filter="url(#shadow_french_fries)"/>
      <rect x="195" y="40" width="10" height="95" rx="2" fill="#fde047" filter="url(#shadow_french_fries)"/>
      <rect x="210" y="50" width="10" height="85" rx="2" fill="#fef08a" transform="rotate(8 210 50)" filter="url(#shadow_french_fries)"/>
      <rect x="225" y="60" width="10" height="75" rx="2" fill="#fde047" transform="rotate(18 225 60)" filter="url(#shadow_french_fries)"/>
      <!-- Red Dip Bowl -->
      <circle cx="310" cy="165" r="24" fill="#374151" filter="url(#shadow_french_fries)"/>
      <circle cx="310" cy="165" r="20" fill="#ffffff"/>
      <circle cx="310" cy="165" r="17" fill="#dc2626"/>
    ''', '#271917')

    # =========================================================================
    # 5. DRINKS
    # =========================================================================
    svgs['water_bottle'] = wrap_svg('water_bottle', 'Mineral Water Bottle (1 Litre)', 'DRINKS • CHILLED', '#0ea5e9', '''
      <!-- Bottle Body -->
      <rect x="170" y="80" width="60" height="135" rx="10" fill="#38bdf8" opacity="0.3" filter="url(#shadow_water_bottle)"/>
      <rect x="175" y="85" width="50" height="125" rx="8" fill="#e0f2fe" opacity="0.75"/>
      <!-- Water level wave -->
      <path d="M 175,105 Q 187,100 200,105 Q 212,110 225,105 L 225,205 L 175,205 Z" fill="#0284c7" opacity="0.35"/>
      <!-- Bottle Neck &amp; Cap -->
      <rect x="188" y="58" width="24" height="24" fill="#e0f2fe" opacity="0.75"/>
      <rect x="185" y="45" width="30" height="16" rx="3" fill="#0284c7" filter="url(#shadow_water_bottle)"/>
      <!-- Blue Branded Label -->
      <rect x="170" y="125" width="60" height="45" fill="#0284c7"/>
      <rect x="170" y="127" width="60" height="41" fill="#0369a1"/>
      <text x="200" y="148" font-family="sans-serif" font-size="9" font-weight="900" fill="#ffffff" text-anchor="middle">MINERAL</text>
      <text x="200" y="159" font-family="sans-serif" font-size="7.5" font-weight="700" fill="#bae6fd" text-anchor="middle">WATER 1L</text>
      <!-- Water drops -->
      <circle cx="182" cy="180" r="2" fill="#ffffff" opacity="0.8"/>
      <circle cx="218" cy="190" r="2.5" fill="#ffffff" opacity="0.8"/>
    ''', '#10222b')

    svgs['orange_juice'] = wrap_svg('orange_juice', 'Fresh Cold-Pressed Orange Juice', 'DRINKS • FRESH', '#f97316', '''
      <!-- Glass -->
      <path d="M 160,70 L 172,210 L 228,210 L 240,70 Z" fill="#ffffff" opacity="0.25" filter="url(#shadow_orange_juice)"/>
      <!-- Orange Juice liquid -->
      <path d="M 164,90 L 174,206 L 226,206 L 236,90 Z" fill="#f97316"/>
      <ellipse cx="200" cy="90" rx="36" ry="10" fill="#fb923c"/>
      <!-- Ice cubes floating -->
      <rect x="185" y="105" width="18" height="18" rx="3" fill="#ffffff" opacity="0.5" transform="rotate(15 185 105)"/>
      <rect x="200" y="130" width="16" height="16" rx="3" fill="#ffffff" opacity="0.4" transform="rotate(-20 200 130)"/>
      <!-- Straw -->
      <line x1="210" y1="40" x2="195" y2="180" stroke="#22c55e" stroke-width="6" stroke-linecap="round"/>
      <line x1="210" y1="40" x2="235" y2="28" stroke="#22c55e" stroke-width="6" stroke-linecap="round"/>
      <!-- Orange Slice on Rim -->
      <circle cx="160" cy="70" r="24" fill="#ea580c" filter="url(#shadow_orange_juice)"/>
      <circle cx="160" cy="70" r="20" fill="#fed7aa"/>
      <circle cx="160" cy="70" r="17" fill="#f97316"/>
      <line x1="160" y1="53" x2="160" y2="87" stroke="#fed7aa" stroke-width="1.5"/>
      <line x1="143" y1="70" x2="177" y2="70" stroke="#fed7aa" stroke-width="1.5"/>
    ''', '#271a12')

    svgs['watermelon_juice'] = wrap_svg('watermelon_juice', 'Fresh Watermelon Juice with Mint', 'DRINKS • FRESH', '#ef4444', '''
      <!-- Glass -->
      <path d="M 160,70 L 172,210 L 228,210 L 240,70 Z" fill="#ffffff" opacity="0.25" filter="url(#shadow_watermelon_juice)"/>
      <!-- Ruby Red Watermelon Juice -->
      <path d="M 164,88 L 174,206 L 226,206 L 236,88 Z" fill="#dc2626"/>
      <ellipse cx="200" cy="88" rx="36" ry="10" fill="#ef4444"/>
      <!-- Floating black watermelon seeds -->
      <ellipse cx="185" cy="115" rx="2" ry="3.5" fill="#18181b"/>
      <ellipse cx="215" cy="135" rx="2" ry="3.5" fill="#18181b"/>
      <ellipse cx="190" cy="155" rx="2" ry="3.5" fill="#18181b"/>
      <!-- Ice cubes -->
      <rect x="180" y="100" width="18" height="18" rx="3" fill="#ffffff" opacity="0.5" transform="rotate(10 180 100)"/>
      <!-- Straw -->
      <line x1="215" y1="40" x2="200" y2="185" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
      <!-- Watermelon Wedge on Plate -->
      <path d="M 280,180 A 50 50 0 0 1 330,230 L 280,230 Z" fill="#15803d" transform="rotate(-35 280 180)" filter="url(#shadow_watermelon_juice)"/>
      <path d="M 285,185 A 44 44 0 0 1 325,225 L 285,225 Z" fill="#ef4444" transform="rotate(-35 280 180)"/>
      <!-- Fresh Mint Sprig -->
      <path d="M 165,70 Q 155,55 170,58 Q 175,70 165,70 Z" fill="#22c55e"/>
    ''', '#261416')

    svgs['chocolate_shake'] = wrap_svg('chocolate_shake', 'Belgian Chocolate Milkshake', 'DRINKS • SPECIAL', '#a855f7', '''
      <!-- Tall Milkshake Glass -->
      <path d="M 160,80 L 175,190 L 180,210 L 220,210 L 225,190 L 240,80 Z" fill="#ffffff" opacity="0.25" filter="url(#shadow_chocolate_shake)"/>
      <!-- Rich Chocolate Shake -->
      <path d="M 163,95 L 176,188 L 182,206 L 218,206 L 224,188 L 237,95 Z" fill="#581c87" opacity="0.3"/>
      <path d="M 163,95 L 176,188 L 182,206 L 218,206 L 224,188 L 237,95 Z" fill="#713f12"/>
      <!-- Whipped Cream Swirl on Top -->
      <path d="M 160,85 C 160,60 185,50 200,50 C 215,50 240,60 240,85 Z" fill="#f8fafc" filter="url(#shadow_chocolate_shake)"/>
      <path d="M 180,60 C 185,45 200,38 205,42 C 210,48 200,60 195,65 Z" fill="#f8fafc"/>
      <!-- Chocolate Syrup Drizzle -->
      <path d="M 175,65 Q 185,75 190,65 Q 200,80 205,65 Q 215,75 225,65" stroke="#451a03" stroke-width="3" fill="none"/>
      <!-- Straw -->
      <line x1="220" y1="30" x2="195" y2="160" stroke="#ec4899" stroke-width="6" stroke-linecap="round"/>
      <!-- Cherry on Top -->
      <circle cx="205" cy="40" r="7" fill="#dc2626"/>
    ''', '#241a29')

    svgs['oreo_shake'] = wrap_svg('oreo_shake', 'Oreo Cookies &amp; Cream Milkshake', 'DRINKS • SPECIAL', '#a855f7', '''
      <path d="M 160,80 L 175,190 L 180,210 L 220,210 L 225,190 L 240,80 Z" fill="#ffffff" opacity="0.25" filter="url(#shadow_oreo_shake)"/>
      <path d="M 163,95 L 176,188 L 182,206 L 218,206 L 224,188 L 237,95 Z" fill="#f4f4f5"/>
      <!-- Oreo black speckles in shake -->
      <circle cx="178" cy="120" r="2.5" fill="#18181b"/>
      <circle cx="215" cy="135" r="2.5" fill="#18181b"/>
      <circle cx="190" cy="150" r="2" fill="#18181b"/>
      <circle cx="220" cy="165" r="2" fill="#18181b"/>
      <!-- Whipped Cream -->
      <path d="M 160,85 C 160,60 185,50 200,50 C 215,50 240,60 240,85 Z" fill="#ffffff" filter="url(#shadow_oreo_shake)"/>
      <!-- Whole Oreo Cookie Inserted on Top -->
      <circle cx="175" cy="55" r="20" fill="#18181b" filter="url(#shadow_oreo_shake)"/>
      <circle cx="175" cy="55" r="17" fill="#27272a"/>
      <circle cx="175" cy="55" r="14" fill="#ffffff"/>
      <circle cx="175" cy="55" r="12" fill="#18181b"/>
      <!-- Straw -->
      <line x1="225" y1="30" x2="200" y2="160" stroke="#0ea5e9" stroke-width="6" stroke-linecap="round"/>
    ''', '#1f2025')

    svgs['cool_drinks'] = wrap_svg('cool_drinks', 'Chilled Cool Drinks (500ml)', 'DRINKS • CHILLED', '#0ea5e9', '''
      <!-- Bottle Base &amp; Body -->
      <rect x="175" y="85" width="50" height="125" rx="10" fill="#dc2626" filter="url(#shadow_cool_drinks)"/>
      <!-- Curved waist -->
      <path d="M 175,135 Q 185,145 175,155 L 175,200 L 225,200 L 225,155 Q 215,145 225,135 Z" fill="#b91c1c"/>
      <!-- Neck &amp; Cap -->
      <rect x="190" y="65" width="20" height="22" fill="#dc2626"/>
      <rect x="187" y="52" width="26" height="15" rx="3" fill="#ffffff" filter="url(#shadow_cool_drinks)"/>
      <!-- Red brand label -->
      <rect x="175" y="115" width="50" height="40" fill="#ffffff"/>
      <path d="M 175,135 Q 200,125 225,135" stroke="#dc2626" stroke-width="6" fill="none"/>
      <text x="200" y="140" font-family="sans-serif" font-size="8" font-weight="900" fill="#dc2626" text-anchor="middle">COLA</text>
      <!-- Glass with ice &amp; bubbles beside -->
      <rect x="250" y="130" width="40" height="75" rx="5" fill="#ffffff" opacity="0.3" filter="url(#shadow_cool_drinks)"/>
      <rect x="253" y="145" width="34" height="58" rx="4" fill="#78350f"/>
      <rect x="260" y="152" width="12" height="12" rx="2" fill="#ffffff" opacity="0.6"/>
    ''', '#271518')

    svgs['red_bull'] = wrap_svg('red_bull', 'Red Bull Energy Drink (250ml)', 'DRINKS • ENERGY', '#eab308', '''
      <!-- Aluminum Sleek Can -->
      <rect x="170" y="65" width="60" height="145" rx="6" fill="#0284c7" filter="url(#shadow_red_bull)"/>
      <!-- Silver &amp; Blue Diamond Quadrants -->
      <polygon points="170,65 230,65 170,135" fill="#e2e8f0"/>
      <polygon points="230,135 230,210 170,210" fill="#e2e8f0"/>
      <!-- Red Bull Golden Sun &amp; Red Bull Silhouette -->
      <circle cx="200" cy="135" r="16" fill="#eab308"/>
      <path d="M 185,140 Q 200,128 215,136 Q 205,145 185,140 Z" fill="#dc2626"/>
      <text x="200" y="162" font-family="sans-serif" font-size="8.5" font-weight="900" fill="#dc2626" text-anchor="middle">Red Bull</text>
      <text x="200" y="172" font-family="sans-serif" font-size="6.5" font-weight="700" fill="#ffffff" text-anchor="middle">ENERGY DRINK</text>
      <!-- Can Rim &amp; Tab -->
      <ellipse cx="200" cy="65" rx="30" ry="7" fill="#cbd5e1"/>
      <ellipse cx="200" cy="64" rx="22" ry="4" fill="#94a3b8"/>
      <!-- Condensation droplets -->
      <circle cx="178" cy="90" r="1.5" fill="#ffffff"/>
      <circle cx="222" cy="115" r="2" fill="#ffffff"/>
    ''', '#161e27')

    svgs['filter_coffee'] = wrap_svg('filter_coffee', 'Degree Filter Coffee (Dabarah &amp; Tumbler)', 'DRINKS • HOT', '#f59e0b', '''
      <!-- Traditional Brass Dabarah Bowl -->
      <ellipse cx="200" cy="180" rx="75" ry="32" fill="#b45309" filter="url(#shadow_filter_coffee)"/>
      <ellipse cx="200" cy="178" rx="70" ry="28" fill="#eab308"/>
      <ellipse cx="200" cy="176" rx="62" ry="24" fill="#ca8a04"/>
      <!-- Brass Tumbler -->
      <path d="M 175,85 L 182,170 L 218,170 L 225,85 Z" fill="#b45309" filter="url(#shadow_filter_coffee)"/>
      <path d="M 177,85 L 183,168 L 217,168 L 223,85 Z" fill="#eab308"/>
      <!-- Frothy Coffee Foam on Top -->
      <ellipse cx="200" cy="85" rx="24" ry="10" fill="#78350f"/>
      <ellipse cx="200" cy="84" rx="22" ry="8" fill="#fde047" opacity="0.85"/>
      <ellipse cx="200" cy="83" rx="19" ry="6" fill="#fef08a"/>
      <!-- Steam vapors -->
      <path d="M 190,65 Q 185,50 192,38" stroke="#ffffff" stroke-width="2.5" fill="none" opacity="0.6" stroke-linecap="round"/>
      <path d="M 205,68 Q 212,52 206,35" stroke="#ffffff" stroke-width="2.5" fill="none" opacity="0.6" stroke-linecap="round"/>
    ''', '#261e14')

    # =========================================================================
    # 6. CHOCOLATES
    # =========================================================================
    svgs['dairy_milk'] = wrap_svg('dairy_milk', 'Cadbury Dairy Milk Chocolate', 'CHOCOLATE', '#a855f7', '''
      <!-- Iconic Purple Bar -->
      <rect x="130" y="60" width="140" height="145" rx="8" fill="#4c1d95" filter="url(#shadow_dairy_milk)"/>
      <rect x="135" y="65" width="130" height="135" rx="6" fill="#5b21b6"/>
      <!-- Gold Foil peek on top -->
      <path d="M 135,65 L 265,65 L 265,90 L 135,80 Z" fill="#f59e0b"/>
      <path d="M 135,65 L 265,65 L 265,86 L 135,78 Z" fill="#fef08a"/>
      <!-- Embossed Chocolate Chunks in foil -->
      <rect x="160" y="68" width="35" height="20" rx="3" fill="#451a03"/>
      <rect x="205" y="68" width="35" height="20" rx="3" fill="#451a03"/>
      <!-- Cadbury Script Logo -->
      <text x="200" y="125" font-family="'Brush Script MT', cursive, sans-serif" font-size="20" font-weight="700" fill="#ffffff" text-anchor="middle">Cadbury</text>
      <!-- Dairy Milk Gold Text -->
      <text x="200" y="148" font-family="sans-serif" font-size="13" font-weight="900" fill="#fef08a" text-anchor="middle" letter-spacing="1">DAIRY MILK</text>
      <!-- Glass and a half milk splash icon -->
      <circle cx="185" cy="172" r="7" fill="#ffffff"/>
      <circle cx="215" cy="172" r="7" fill="#ffffff"/>
    ''', '#1f162e')

    svgs['kitkat'] = wrap_svg('kitkat', 'Nestle KitKat (4 Finger Wafer)', 'CHOCOLATE', '#ef4444', '''
      <!-- Iconic Red KitKat Wrapper -->
      <rect x="120" y="65" width="160" height="135" rx="8" fill="#991b1b" filter="url(#shadow_kitkat)"/>
      <rect x="125" y="70" width="150" height="125" rx="6" fill="#dc2626"/>
      <!-- White Oval Center -->
      <ellipse cx="200" cy="130" rx="65" ry="36" fill="#ffffff" stroke="#991b1b" stroke-width="3" filter="url(#shadow_kitkat)"/>
      <!-- Red KitKat Script -->
      <text x="200" y="138" font-family="Impact, sans-serif" font-size="24" font-weight="900" fill="#dc2626" text-anchor="middle" font-style="italic">KitKat</text>
      <!-- 4 Wafer Fingers Texture -->
      <rect x="145" y="78" width="22" height="10" rx="2" fill="#7f1d1d" opacity="0.6"/>
      <rect x="175" y="78" width="22" height="10" rx="2" fill="#7f1d1d" opacity="0.6"/>
      <rect x="205" y="78" width="22" height="10" rx="2" fill="#7f1d1d" opacity="0.6"/>
      <rect x="235" y="78" width="22" height="10" rx="2" fill="#7f1d1d" opacity="0.6"/>
      <text x="200" y="180" font-family="sans-serif" font-size="9" font-weight="800" fill="#fef08a" text-anchor="middle" letter-spacing="0.8">CRISP WAFER FINGERS</text>
    ''', '#2b1416')

    svgs['five_star'] = wrap_svg('five_star', 'Cadbury 5 Star (Caramel Nougat)', 'CHOCOLATE', '#eab308', '''
      <!-- Golden Wrapped Bar -->
      <rect x="115" y="75" width="170" height="115" rx="10" fill="#ca8a04" filter="url(#shadow_five_star)"/>
      <rect x="120" y="80" width="160" height="105" rx="8" fill="#eab308"/>
      <!-- Cadbury Script -->
      <text x="200" y="105" font-family="'Brush Script MT', cursive, sans-serif" font-size="16" fill="#ffffff" text-anchor="middle">Cadbury</text>
      <!-- 5 STAR Bold Red &amp; Black Shadow -->
      <text x="200" y="145" font-family="Impact, sans-serif" font-size="36" font-weight="900" fill="#991b1b" text-anchor="middle" letter-spacing="1">5 STAR</text>
      <!-- 5 Golden Stars -->
      <text x="200" y="168" font-size="14" fill="#ffffff" text-anchor="middle">★ ★ ★ ★ ★</text>
    ''', '#262013')

    svgs['munch'] = wrap_svg('munch', 'Nestle Munch Crunchy Wafer Bar', 'CHOCOLATE', '#22c55e', '''
      <!-- Green Vibrant Wrapper -->
      <rect x="110" y="80" width="180" height="105" rx="8" fill="#15803d" filter="url(#shadow_munch)"/>
      <rect x="115" y="85" width="170" height="95" rx="6" fill="#16a34a"/>
      <!-- Orange &amp; Yellow Burst -->
      <polygon points="120,85 280,85 260,180 140,180" fill="#facc15"/>
      <text x="200" y="112" font-family="sans-serif" font-size="10" font-weight="800" fill="#991b1b" text-anchor="middle">Nestle</text>
      <text x="200" y="148" font-family="Impact, sans-serif" font-size="34" font-weight="900" fill="#991b1b" text-anchor="middle" letter-spacing="1.5">MUNCH</text>
      <text x="200" y="168" font-family="sans-serif" font-size="9" font-weight="900" fill="#15803d" text-anchor="middle">CRUNCH COATED WAFER</text>
    ''', '#16261a')

    svgs['perk'] = wrap_svg('perk', 'Cadbury Perk Chocolate Wafer', 'CHOCOLATE', '#3b82f6', '''
      <!-- Purple/Blue &amp; Yellow Diagonal Wrapper -->
      <rect x="110" y="80" width="180" height="105" rx="8" fill="#1e3a8a" filter="url(#shadow_perk)"/>
      <rect x="115" y="85" width="170" height="95" rx="6" fill="#2563eb"/>
      <polygon points="140,85 285,85 260,180 115,180" fill="#facc15"/>
      <text x="200" y="112" font-family="'Brush Script MT', cursive, sans-serif" font-size="16" fill="#1e3a8a" text-anchor="middle">Cadbury</text>
      <text x="200" y="152" font-family="Impact, sans-serif" font-size="36" font-weight="900" fill="#1e3a8a" text-anchor="middle" letter-spacing="2" font-style="italic">PERK</text>
      <text x="200" y="172" font-family="sans-serif" font-size="8.5" font-weight="800" fill="#1e3a8a" text-anchor="middle">TWIN WAFER BAR</text>
    ''', '#151e2b')

    svgs['snickers'] = wrap_svg('snickers', 'Snickers Peanut Chocolate Bar', 'CHOCOLATE', '#f97316', '''
      <!-- Classic Brown Wrapper -->
      <rect x="110" y="75" width="180" height="115" rx="8" fill="#451a03" filter="url(#shadow_snickers)"/>
      <rect x="115" y="80" width="170" height="105" rx="6" fill="#78350f"/>
      <!-- White Brand Box with Blue Lettering -->
      <rect x="130" y="105" width="140" height="48" rx="4" fill="#ffffff" stroke="#dc2626" stroke-width="2.5"/>
      <text x="200" y="142" font-family="Impact, sans-serif" font-size="28" font-weight="900" fill="#1d4ed8" text-anchor="middle" letter-spacing="1">SNICKERS</text>
      <!-- Roasted peanuts banner -->
      <text x="200" y="172" font-family="sans-serif" font-size="9" font-weight="800" fill="#fef08a" text-anchor="middle" letter-spacing="0.5">PEANUTS • CARAMEL • NOUGAT</text>
    ''', '#271913')

    # =========================================================================
    # 7. BOOKS
    # =========================================================================
    def book_svg(slug, title, subtitle, color1, color2):
        return wrap_svg(slug, title, 'BOOKS • TEXTBOOK', '#3b82f6', f'''
          <!-- Book Spine &amp; Cover 3D angle -->
          <rect x="135" y="45" width="140" height="175" rx="6" fill="{color1}" filter="url(#shadow_{slug})"/>
          <rect x="140" y="50" width="130" height="165" rx="4" fill="{color2}"/>
          <!-- White spine band -->
          <rect x="135" y="45" width="16" height="175" rx="3" fill="#1e293b"/>
          <rect x="155" y="65" width="105" height="75" rx="4" fill="#ffffff" opacity="0.95"/>
          <text x="207" y="85" font-family="sans-serif" font-size="9.5" font-weight="900" fill="#0f172a" text-anchor="middle">{subtitle[:18]}</text>
          <text x="207" y="100" font-family="sans-serif" font-size="8" font-weight="800" fill="#2563eb" text-anchor="middle">{subtitle[18:36]}</text>
          <!-- Academic Emblem -->
          <circle cx="207" cy="122" r="10" fill="#e2e8f0"/>
          <text x="207" y="126" font-size="11" text-anchor="middle">🎓</text>
          <text x="207" y="175" font-family="sans-serif" font-size="8" font-weight="700" fill="#ffffff" text-anchor="middle">VEL TECH SYLLABUS</text>
          <text x="207" y="195" font-family="sans-serif" font-size="7" font-weight="600" fill="#94a3b8" text-anchor="middle">Standard Edition</text>
        ''', '#161c28')

    svgs['maths_book'] = book_svg('maths_book', 'Higher Engineering Mathematics', 'ENGINEERING MATHEMATICS VOL.1', '#1e3a8a', '#2563eb')
    svgs['physics_book'] = book_svg('physics_book', 'Engineering Physics Reference Book', 'ENGINEERING PHYSICS TEXTBOOK', '#4c1d95', '#6d28d9')
    svgs['chemistry_manual'] = book_svg('chemistry_manual', 'Chemistry Laboratory Manual', 'CHEMISTRY LAB EXPERIMENTS', '#065f46', '#059669')
    svgs['c_programming'] = book_svg('c_programming', 'Programming in C &amp; Algorithms', 'C PROGRAMMING &amp; ALGORITHMS', '#0f172a', '#334155')
    svgs['dsa_handbook'] = book_svg('dsa_handbook', 'Data Structures &amp; Algorithms Handbook', 'DATA STRUCTURES &amp; ALGORITHMS', '#831843', '#be185d')

    # =========================================================================
    # 8. NOTEBOOKS
    # =========================================================================
    svgs['spiral_notebook'] = wrap_svg('spiral_notebook', 'A4 Spiral Notebook (160 Pgs)', 'NOTEBOOKS', '#ec4899', '''
      <rect x="135" y="45" width="145" height="175" rx="8" fill="#0284c7" filter="url(#shadow_spiral_notebook)"/>
      <rect x="140" y="50" width="135" height="165" rx="6" fill="#38bdf8"/>
      <!-- Ruled lines preview -->
      <line x1="160" y1="90" x2="260" y2="90" stroke="#bae6fd" stroke-width="2"/>
      <line x1="160" y1="110" x2="260" y2="110" stroke="#bae6fd" stroke-width="2"/>
      <line x1="160" y1="130" x2="260" y2="130" stroke="#bae6fd" stroke-width="2"/>
      <line x1="160" y1="150" x2="260" y2="150" stroke="#bae6fd" stroke-width="2"/>
      <!-- Center badge -->
      <rect x="170" y="80" width="85" height="40" rx="4" fill="#ffffff" filter="url(#shadow_spiral_notebook)"/>
      <text x="212" y="98" font-family="sans-serif" font-size="9" font-weight="900" fill="#0284c7" text-anchor="middle">CLASSMATE</text>
      <text x="212" y="112" font-family="sans-serif" font-size="8" font-weight="700" fill="#64748b" text-anchor="middle">160 PAGES • A4</text>
      <!-- Spiral Wire Binding on Left -->
      ''' + "".join([f'<circle cx="135" cy="{55 + i*11}" r="4" fill="#475569"/><line x1="130" y1="{55 + i*11}" x2="140" y2="{55 + i*11}" stroke="#cbd5e1" stroke-width="3"/>' for i in range(15)]) + '''
    ''', '#161d28')

    svgs['ruled_longbook'] = wrap_svg('ruled_longbook', '200-Page Ruled Long Notebook', 'NOTEBOOKS', '#ec4899', '''
      <rect x="130" y="45" width="145" height="175" rx="6" fill="#be123c" filter="url(#shadow_ruled_longbook)"/>
      <rect x="135" y="50" width="135" height="165" rx="4" fill="#e11d48"/>
      <!-- Classmate Cover Graphic -->
      <rect x="150" y="70" width="105" height="50" rx="4" fill="#ffffff" filter="url(#shadow_ruled_longbook)"/>
      <text x="202" y="92" font-family="sans-serif" font-size="11" font-weight="900" fill="#be123c" text-anchor="middle">LONG BOOK</text>
      <text x="202" y="108" font-family="sans-serif" font-size="8.5" font-weight="700" fill="#64748b" text-anchor="middle">200 PAGES RULED</text>
      <text x="202" y="165" font-family="sans-serif" font-size="8" font-weight="700" fill="#ffffff" text-anchor="middle">PREMIUM 70 GSM PAPER</text>
    ''', '#27151c')

    svgs['graph_notebook'] = wrap_svg('graph_notebook', 'Engineering Graph Notebook', 'NOTEBOOKS', '#ec4899', '''
      <rect x="130" y="45" width="145" height="175" rx="6" fill="#047857" filter="url(#shadow_graph_notebook)"/>
      <rect x="135" y="50" width="135" height="165" rx="4" fill="#ffffff"/>
      <!-- Millimeter Grid Texture -->
      ''' + "".join([f'<line x1="{145 + i*8}" y1="60" x2="{145 + i*8}" y2="200" stroke="#a7f3d0" stroke-width="1"/>' for i in range(15)]) + '''
      ''' + "".join([f'<line x1="145" y1="{60 + i*8}" x2="257" y2="{60 + i*8}" stroke="#a7f3d0" stroke-width="1"/>' for i in range(18)]) + '''
      <!-- Center Title Badge -->
      <rect x="155" y="105" width="95" height="40" rx="4" fill="#047857" filter="url(#shadow_graph_notebook)"/>
      <text x="202" y="122" font-family="sans-serif" font-size="9" font-weight="900" fill="#ffffff" text-anchor="middle">GRAPH NOTEBOOK</text>
      <text x="202" y="136" font-family="sans-serif" font-size="7.5" font-weight="700" fill="#a7f3d0" text-anchor="middle">1mm Grid • 64 Pages</text>
    ''', '#14251e')

    svgs['lab_record'] = wrap_svg('lab_record', 'Hardcover Lab Record Notebook', 'NOTEBOOKS', '#ec4899', '''
      <rect x="130" y="45" width="145" height="175" rx="6" fill="#18181b" filter="url(#shadow_lab_record)"/>
      <!-- Stitched Spine with cloth tape -->
      <rect x="130" y="45" width="22" height="175" fill="#dc2626"/>
      <!-- Marble Texture Cover -->
      <rect x="152" y="45" width="123" height="175" fill="#27272a"/>
      <!-- Gold Label in Center -->
      <rect x="165" y="90" width="98" height="60" rx="4" fill="#fef08a" stroke="#ca8a04" stroke-width="2" filter="url(#shadow_lab_record)"/>
      <text x="214" y="112" font-family="sans-serif" font-size="10" font-weight="900" fill="#78350f" text-anchor="middle">LAB RECORD</text>
      <text x="214" y="126" font-family="sans-serif" font-size="8" font-weight="700" fill="#854d0e" text-anchor="middle">VEL TECH UNIVERSITY</text>
      <line x1="175" y1="135" x2="253" y2="135" stroke="#ca8a04" stroke-width="1"/>
    ''', '#1f1b20')

    svgs['sketch_book'] = wrap_svg('sketch_book', 'A3 Drawing &amp; Sketch Book', 'NOTEBOOKS', '#ec4899', '''
      <!-- Landscape A3 format pad -->
      <rect x="90" y="65" width="220" height="140" rx="6" fill="#334155" filter="url(#shadow_sketch_book)"/>
      <rect x="95" y="70" width="210" height="130" rx="4" fill="#f8fafc"/>
      <rect x="90" y="65" width="220" height="16" fill="#0284c7"/>
      <text x="200" y="120" font-family="sans-serif" font-size="14" font-weight="900" fill="#0284c7" text-anchor="middle">A3 SKETCH BOOK</text>
      <text x="200" y="140" font-family="sans-serif" font-size="9" font-weight="700" fill="#64748b" text-anchor="middle">140 GSM Cartridge Paper • Engineering Graphics</text>
      <!-- Pencil illustration lying across -->
      <rect x="140" y="160" width="110" height="8" rx="2" fill="#eab308" transform="rotate(-5 140 160)"/>
    ''', '#17222d')

    # =========================================================================
    # 9. PENS
    # =========================================================================
    svgs['reynolds_pen'] = wrap_svg('reynolds_pen', 'Reynolds 045 Ballpoint Pen (Blue)', 'PENS', '#3b82f6', '''
      <!-- White Pen Body -->
      <rect x="90" y="125" width="180" height="12" rx="3" fill="#ffffff" filter="url(#shadow_reynolds_pen)"/>
      <text x="180" y="134" font-family="sans-serif" font-size="7" font-weight="900" fill="#1d4ed8" text-anchor="middle">Reynolds 045 Fine Carbure</text>
      <!-- Blue Cap with Pocket Clip -->
      <rect x="250" y="122" width="60" height="18" rx="4" fill="#1d4ed8" filter="url(#shadow_reynolds_pen)"/>
      <rect x="255" y="116" width="45" height="4" rx="2" fill="#1e40af"/>
      <!-- Brass Ballpoint Tip -->
      <polygon points="90,126 90,136 72,131" fill="#eab308"/>
      <circle cx="71" cy="131" r="1.5" fill="#1e293b"/>
    ''', '#151e2b')

    svgs['parker_pen'] = wrap_svg('parker_pen', 'Parker Vector Stainless Steel Rollerball', 'PENS', '#3b82f6', '''
      <!-- Brushed Stainless Steel Body -->
      <rect x="90" y="124" width="140" height="14" rx="4" fill="#cbd5e1" filter="url(#shadow_parker_pen)"/>
      <rect x="95" y="126" width="130" height="4" fill="#f8fafc" opacity="0.8"/>
      <!-- Parker Cap with Arrow Clip -->
      <rect x="220" y="122" width="90" height="18" rx="4" fill="#94a3b8" filter="url(#shadow_parker_pen)"/>
      <!-- Signature Parker Arrow Clip -->
      <path d="M 230,118 L 290,118 L 295,121 L 290,124 L 230,124 Z" fill="#475569"/>
      <!-- Fine roller tip -->
      <polygon points="90,126 90,136 72,131" fill="#475569"/>
      <circle cx="70" cy="131" r="1.5" fill="#0f172a"/>
    ''', '#1b2027')

    svgs['gel_pens'] = wrap_svg('gel_pens', 'Japanese Gel Pen Set (Pack of 5)', 'PENS', '#3b82f6', '''
      ''' + "".join([f'<rect x="90" y="{85 + i*22}" width="200" height="11" rx="3" fill="{["#2563eb", "#0f172a", "#dc2626", "#16a34a", "#9333ea"][i]}" filter="url(#shadow_gel_pens)"/><rect x="180" y="{85 + i*22}" width="40" height="11" fill="#e2e8f0" opacity="0.3"/><polygon points="90,{86+i*22} 90,{95+i*22} 75,{90.5+i*22}" fill="#ca8a04"/>' for i in range(5)]) + '''
    ''', '#1a1f29')

    svgs['pilot_pen'] = wrap_svg('pilot_pen', 'Pilot G2 0.5mm Retractable Gel Pen', 'PENS', '#3b82f6', '''
      <rect x="90" y="123" width="190" height="16" rx="5" fill="#1e293b" filter="url(#shadow_pilot_pen)"/>
      <!-- Ergonomic Rubber Grip -->
      <rect x="100" y="123" width="50" height="16" rx="3" fill="#2563eb"/>
      <!-- Ink Window -->
      <rect x="165" y="127" width="40" height="8" rx="2" fill="#60a5fa" opacity="0.75"/>
      <text x="235" y="134" font-family="sans-serif" font-size="7" font-weight="900" fill="#ffffff">PILOT G-2 05</text>
      <!-- Click plunger on back -->
      <rect x="280" y="126" width="20" height="10" rx="2" fill="#2563eb"/>
      <polygon points="90,126 90,136 74,131" fill="#cbd5e1"/>
    ''', '#151e2b')

    svgs['markers'] = wrap_svg('markers', 'Permanent Marker Set (4 Colors)', 'PENS', '#3b82f6', '''
      ''' + "".join([f'<rect x="100" y="{80 + i*28}" width="180" height="18" rx="5" fill="{["#0f172a", "#1d4ed8", "#b91c1c", "#15803d"][i]}" filter="url(#shadow_markers)"/><text x="180" y="{92+i*28}" font-family="sans-serif" font-size="8" font-weight="800" fill="#ffffff">CHISEL TIP PERMANENT MARKER</text><rect x="250" y="{80 + i*28}" width="30" height="18" fill="#ffffff" opacity="0.2"/>' for i in range(4)]) + '''
    ''', '#1a1e27')

    # =========================================================================
    # 10. PENCILS
    # =========================================================================
    svgs['apsara_pencils'] = wrap_svg('apsara_pencils', 'Apsara Platinum Extra Dark HB Pencils', 'PENCILS', '#6366f1', '''
      <!-- Pencil Box -->
      <rect x="90" y="75" width="220" height="110" rx="8" fill="#18181b" stroke="#cbd5e1" stroke-width="2" filter="url(#shadow_apsara_pencils)"/>
      <!-- Platinum Silver/Black striped design -->
      <rect x="95" y="80" width="210" height="100" rx="6" fill="#0f172a"/>
      <text x="200" y="115" font-family="Impact, sans-serif" font-size="22" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="2">APSARA PLATINUM</text>
      <text x="200" y="135" font-family="sans-serif" font-size="10" font-weight="800" fill="#38bdf8" text-anchor="middle">EXTRA DARK HB PENCILS (10 PCS)</text>
      <!-- Pencil drawn sticking out -->
      <rect x="110" y="152" width="180" height="8" rx="2" fill="#64748b"/>
      <polygon points="110,152 110,160 96,156" fill="#fde047"/>
      <polygon points="99,155 99,157 96,156" fill="#0f172a"/>
    ''', '#181b27')

    svgs['mechanical_pencil'] = wrap_svg('mechanical_pencil', 'Mechanical Drafting Pencil 0.5mm', 'PENCILS', '#6366f1', '''
      <rect x="80" y="125" width="200" height="12" rx="3" fill="#1e293b" filter="url(#shadow_mechanical_pencil)"/>
      <!-- Metallic Grip Section -->
      <rect x="95" y="125" width="45" height="12" fill="#94a3b8"/>
      <!-- Lead pipe tip -->
      <rect x="80" y="129" width="15" height="4" fill="#cbd5e1"/>
      <line x1="72" y1="131" x2="80" y2="131" stroke="#0f172a" stroke-width="1.5"/>
      <!-- Label -->
      <text x="190" y="134" font-family="sans-serif" font-size="7.5" font-weight="800" fill="#38bdf8">DRAFTING 0.5 mm</text>
      <!-- Metal Clip &amp; Eraser Cap -->
      <rect x="250" y="120" width="30" height="4" rx="1.5" fill="#94a3b8"/>
      <rect x="270" y="127" width="16" height="8" fill="#e2e8f0"/>
    ''', '#161c28')

    svgs['color_pencils'] = wrap_svg('color_pencils', 'Faber-Castell Color Pencils (12 Shades)', 'PENCILS', '#6366f1', '''
      <!-- Rainbow Spectrum Fans -->
      ''' + "".join([f'<rect x="{100 + i*16}" y="65" width="12" height="130" rx="3" fill="{["#ef4444","#f97316","#facc15","#22c55e","#06b6d4","#3b82f6","#6366f1","#a855f7","#ec4899","#78350f","#64748b","#0f172a"][i]}" filter="url(#shadow_color_pencils)"/><polygon points="{100+i*16},65 {112+i*16},65 {106+i*16},48" fill="#fde047"/><polygon points="{104+i*16},54 {108+i*16},54 {106+i*16},48" fill="{["#ef4444","#f97316","#facc15","#22c55e","#06b6d4","#3b82f6","#6366f1","#a855f7","#ec4899","#78350f","#64748b","#0f172a"][i]}"/>' for i in range(12)]) + '''
    ''', '#1b1b28')

    svgs['sketching_pencils'] = wrap_svg('sketching_pencils', 'Drawing Sketching Pencil Set (6 Grades)', 'PENCILS', '#6366f1', '''
      <!-- Set of 6 Graphite grading pencils -->
      ''' + "".join([f'<rect x="90" y="{70 + i*23}" width="200" height="12" rx="2" fill="#292524" filter="url(#shadow_sketching_pencils)"/><polygon points="90,{70+i*23} 90,{82+i*23} 72,{76+i*23}" fill="#fde047"/><polygon points="78,{74+i*23} 78,{78+i*23} 72,{76+i*23}" fill="#0c0a09"/><text x="270" y="{79+i*23}" font-family="sans-serif" font-size="8" font-weight="900" fill="#facc15">{["2H", "HB", "2B", "4B", "6B", "8B"][i]}</text>' for i in range(6)]) + '''
    ''', '#1d1b1a')

    svgs['lumograph_pencil'] = wrap_svg('lumograph_pencil', 'Staedtler Mars Lumograph Blue Pencil', 'PENCILS', '#6366f1', '''
      <!-- Classic Blue Body -->
      <rect x="80" y="125" width="220" height="13" rx="2" fill="#0284c7" filter="url(#shadow_lumograph_pencil)"/>
      <rect x="270" y="125" width="30" height="13" fill="#0f172a"/>
      <text x="180" y="134" font-family="sans-serif" font-size="7.5" font-weight="900" fill="#ffffff">STAEDTLER Mars Lumograph 2B</text>
      <!-- Sharpened wood cone -->
      <polygon points="80,125 80,138 60,131.5" fill="#fef08a"/>
      <polygon points="66,129 66,134 60,131.5" fill="#0f172a"/>
    ''', '#151f2b')

    # =========================================================================
    # 11. ERASERS
    # =========================================================================
    svgs['faber_eraser'] = wrap_svg('faber_eraser', 'Faber-Castell Dust-Free Vinyl Eraser', 'ERASERS', '#14b8a6', '''
      <!-- White Eraser Block -->
      <rect x="130" y="85" width="140" height="85" rx="4" fill="#ffffff" filter="url(#shadow_faber_eraser)"/>
      <rect x="132" y="87" width="136" height="81" rx="3" fill="#f8fafc"/>
      <!-- Blue/Green Protective Cardboard Sleeve -->
      <rect x="160" y="85" width="110" height="85" rx="2" fill="#065f46" filter="url(#shadow_faber_eraser)"/>
      <rect x="163" y="88" width="104" height="79" fill="#047857"/>
      <!-- Faber Castell Logo -->
      <text x="215" y="115" font-family="sans-serif" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle">FABER-CASTELL</text>
      <text x="215" y="135" font-family="sans-serif" font-size="11" font-weight="800" fill="#a7f3d0" text-anchor="middle">DUST-FREE</text>
      <text x="215" y="152" font-family="sans-serif" font-size="7.5" font-weight="700" fill="#ffffff" text-anchor="middle">VINYL ERASER</text>
      <!-- Shavings -->
      <path d="M 115,160 Q 120,155 125,162" stroke="#e2e8f0" stroke-width="2.5" fill="none"/>
    ''', '#132420')

    svgs['drafting_eraser'] = wrap_svg('drafting_eraser', 'Precision Drafting Vinyl Eraser', 'ERASERS', '#14b8a6', '''
      <!-- Sharp Beveled Technical Eraser -->
      <rect x="130" y="90" width="140" height="80" rx="3" fill="#f1f5f9" filter="url(#shadow_drafting_eraser)"/>
      <!-- Sleeve -->
      <rect x="175" y="90" width="95" height="80" fill="#1e293b"/>
      <text x="222" y="125" font-family="sans-serif" font-size="9" font-weight="900" fill="#38bdf8" text-anchor="middle">DRAFTING</text>
      <text x="222" y="142" font-family="sans-serif" font-size="8" font-weight="700" fill="#ffffff" text-anchor="middle">NON-ABRASIVE</text>
    ''', '#171e27')

    svgs['putty_eraser'] = wrap_svg('putty_eraser', 'Artist Kneaded Putty Eraser', 'ERASERS', '#14b8a6', '''
      <!-- Kneaded grey dough block with sculpted impression -->
      <rect x="135" y="90" width="130" height="80" rx="8" fill="#64748b" filter="url(#shadow_putty_eraser)"/>
      <path d="M 140,110 C 170,95 230,120 260,105 L 260,165 L 140,165 Z" fill="#475569" opacity="0.6"/>
      <text x="200" y="138" font-family="sans-serif" font-size="10" font-weight="800" fill="#f8fafc" text-anchor="middle">KNEADED ART PUTTY</text>
    ''', '#181e25')

    svgs['color_erasers'] = wrap_svg('color_erasers', 'Multicolor Student Erasers (Pack of 5)', 'ERASERS', '#14b8a6', '''
      ''' + "".join([f'<rect x="{95 + i*42}" y="95" width="36" height="70" rx="4" fill="{["#f43f5e", "#06b6d4", "#a855f7", "#eab308", "#10b981"][i]}" filter="url(#shadow_color_erasers)"/>' for i in range(5)]) + '''
    ''', '#1b2225')

    svgs['jumbo_eraser'] = wrap_svg('jumbo_eraser', 'Jumbo Non-Dust Big Block Eraser', 'ERASERS', '#14b8a6', '''
      <rect x="120" y="80" width="160" height="95" rx="6" fill="#ffffff" filter="url(#shadow_jumbo_eraser)"/>
      <rect x="160" y="80" width="120" height="95" rx="4" fill="#2563eb"/>
      <text x="220" y="125" font-family="Impact, sans-serif" font-size="18" fill="#ffffff" text-anchor="middle">JUMBO</text>
      <text x="220" y="145" font-family="sans-serif" font-size="9" font-weight="700" fill="#93c5fd" text-anchor="middle">NON-DUST ERASER</text>
    ''', '#161f2c')

    # =========================================================================
    # 12. SHARPENERS
    # =========================================================================
    svgs['canister_sharpener'] = wrap_svg('canister_sharpener', 'Double-Hole Canister Sharpener', 'SHARPENERS', '#14b8a6', '''
      <!-- Translucent Canister Body -->
      <rect x="145" y="70" width="110" height="120" rx="20" fill="#0284c7" opacity="0.65" filter="url(#shadow_canister_sharpener)"/>
      <!-- Inner Pencil Shavings -->
      <path d="M 155,140 Q 180,130 200,150 Q 230,135 245,150 L 245,180 L 155,180 Z" fill="#d97706" opacity="0.8"/>
      <!-- Top Cap with 2 Holes -->
      <rect x="140" y="65" width="120" height="30" rx="8" fill="#0369a1"/>
      <circle cx="180" cy="80" r="8" fill="#0f172a"/>
      <circle cx="215" cy="80" r="10" fill="#0f172a"/>
    ''', '#141e28')

    svgs['crank_sharpener'] = wrap_svg('crank_sharpener', 'Rotary Desktop Crank Sharpener', 'SHARPENERS', '#14b8a6', '''
      <!-- Machine body -->
      <rect x="130" y="85" width="120" height="110" rx="10" fill="#dc2626" filter="url(#shadow_crank_sharpener)"/>
      <!-- Clear waste tray drawer -->
      <rect x="145" y="135" width="90" height="50" rx="4" fill="#38bdf8" opacity="0.5"/>
      <!-- Pencil insert hole -->
      <circle cx="190" cy="110" r="14" fill="#18181b"/>
      <circle cx="190" cy="110" r="8" fill="#71717a"/>
      <!-- Rotary Hand Crank Handle on Right -->
      <rect x="250" y="125" width="25" height="10" rx="2" fill="#94a3b8"/>
      <circle cx="280" cy="130" r="8" fill="#18181b"/>
    ''', '#261517')

    svgs['metal_sharpener'] = wrap_svg('metal_sharpener', 'Staedtler Metal Wedge Sharpener', 'SHARPENERS', '#14b8a6', '''
      <!-- Die-cast Zinc Wedge -->
      <polygon points="135,175 145,85 245,85 255,175" fill="#94a3b8" filter="url(#shadow_metal_sharpener)"/>
      <polygon points="140,170 148,90 242,90 250,170" fill="#cbd5e1"/>
      <!-- Steel Blade held by screw -->
      <rect x="175" y="95" width="45" height="70" fill="#64748b"/>
      <rect x="180" y="98" width="38" height="64" fill="#f8fafc"/>
      <!-- Small Phillips screw -->
      <circle cx="199" cy="130" r="6" fill="#475569"/>
      <line x1="196" y1="130" x2="202" y2="130" stroke="#f8fafc" stroke-width="1.5"/>
      <line x1="199" y1="127" x2="199" y2="133" stroke="#f8fafc" stroke-width="1.5"/>
      <!-- Pencil entry cone -->
      <polygon points="150,110 175,125 150,140" fill="#1e293b"/>
    ''', '#1a1f26')

    svgs['electric_sharpener'] = wrap_svg('electric_sharpener', 'Electric Automatic Sharpener', 'SHARPENERS', '#14b8a6', '''
      <rect x="145" y="75" width="110" height="120" rx="16" fill="#18181b" stroke="#38bdf8" stroke-width="2" filter="url(#shadow_electric_sharpener)"/>
      <circle cx="200" cy="115" r="18" fill="#38bdf8"/>
      <circle cx="200" cy="115" r="10" fill="#0f172a"/>
      <text x="200" y="165" font-family="sans-serif" font-size="8" font-weight="900" fill="#38bdf8" text-anchor="middle">AUTO SHARP 3s</text>
    ''', '#151e29')

    svgs['travel_sharpener'] = wrap_svg('travel_sharpener', 'Compact Pocket Travel Sharpener', 'SHARPENERS', '#14b8a6', '''
      <rect x="145" y="90" width="110" height="85" rx="14" fill="#ec4899" filter="url(#shadow_travel_sharpener)"/>
      <rect x="150" y="95" width="100" height="75" rx="10" fill="#f43f5e"/>
      <circle cx="200" cy="132" r="12" fill="#18181b"/>
    ''', '#261620')

    # =========================================================================
    # 13. RULERS
    # =========================================================================
    svgs['acrylic_ruler'] = wrap_svg('acrylic_ruler', '30cm Transparent Acrylic Metric Ruler', 'RULERS', '#8b5cf6', '''
      <!-- Clear Acrylic Ruler 30cm -->
      <rect x="50" y="105" width="300" height="50" rx="3" fill="#ffffff" opacity="0.8" filter="url(#shadow_acrylic_ruler)"/>
      <rect x="52" y="107" width="296" height="46" rx="2" fill="#f8fafc" opacity="0.85"/>
      <!-- Centimeter and Millimeter graduations -->
      ''' + "".join([f'<line x1="{60 + i*9.5}" y1="107" x2="{60 + i*9.5}" y2="{122 if i%5==0 else 114}" stroke="#1e293b" stroke-width="{1.5 if i%5==0 else 0.8}"/>' for i in range(31)]) + '''
      ''' + "".join([f'<text x="{60 + i*9.5*5}" y="132" font-family="sans-serif" font-size="7.5" font-weight="800" fill="#1e293b" text-anchor="middle">{i*5}</text>' for i in range(7)]) + '''
      <text x="320" y="145" font-family="sans-serif" font-size="8" font-weight="900" fill="#2563eb">30 cm</text>
    ''', '#191d29')

    svgs['set_squares'] = wrap_svg('set_squares', 'Technical Drafting Set Squares (Pair)', 'RULERS', '#8b5cf6', '''
      <!-- 45-degree triangle -->
      <polygon points="80,185 200,185 80,65" fill="#38bdf8" opacity="0.65" stroke="#0284c7" stroke-width="2" filter="url(#shadow_set_squares)"/>
      <polygon points="100,170 170,170 100,100" fill="#18181b"/>
      <!-- 30/60 degree triangle -->
      <polygon points="190,185 320,185 190,45" fill="#a855f7" opacity="0.65" stroke="#7e22ce" stroke-width="2" filter="url(#shadow_set_squares)"/>
      <polygon points="210,165 290,165 210,80" fill="#18181b"/>
    ''', '#1b1b2a')

    svgs['protractor'] = wrap_svg('protractor', '180 Degree Precision Protractor', 'RULERS', '#8b5cf6', '''
      <!-- 180 Degree Half Circle -->
      <path d="M 90,170 A 110 110 0 0 1 310,170 Z" fill="#ffffff" opacity="0.75" stroke="#2563eb" stroke-width="2" filter="url(#shadow_protractor)"/>
      <path d="M 140,170 A 60 60 0 0 1 260,170 Z" fill="#18181b"/>
      <!-- Angle lines &amp; Center guide -->
      <circle cx="200" cy="170" r="4" fill="#2563eb"/>
      <line x1="200" y1="170" x2="200" y2="65" stroke="#2563eb" stroke-width="1.5"/>
      <text x="200" y="80" font-family="sans-serif" font-size="8" font-weight="800" fill="#1e293b" text-anchor="middle">90°</text>
      <text x="110" y="165" font-family="sans-serif" font-size="8" font-weight="800" fill="#1e293b">0°</text>
      <text x="290" y="165" font-family="sans-serif" font-size="8" font-weight="800" fill="#1e293b">180°</text>
    ''', '#161c28')

    svgs['geometry_box'] = wrap_svg('geometry_box', 'Mathematical Geometry Tin Box', 'RULERS', '#8b5cf6', '''
      <!-- Tin Metal Geometry Box -->
      <rect x="90" y="70" width="220" height="120" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="2" filter="url(#shadow_geometry_box)"/>
      <rect x="95" y="75" width="210" height="110" rx="6" fill="#0284c7"/>
      <text x="200" y="105" font-family="sans-serif" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">MATHEMATICAL</text>
      <text x="200" y="125" font-family="sans-serif" font-size="11" font-weight="800" fill="#fef08a" text-anchor="middle">INSTRUMENTS BOX</text>
      <text x="200" y="155" font-family="sans-serif" font-size="8" font-weight="700" fill="#ffffff" text-anchor="middle">Compass • Divider • Protractor • Set Squares</text>
    ''', '#16202c')

    svgs['scale_ruler'] = wrap_svg('scale_ruler', 'Engineering Triangular Scale Ruler', 'RULERS', '#8b5cf6', '''
      <!-- 3-Sided Architect Scale Ruler -->
      <polygon points="60,110 340,110 330,145 70,145" fill="#f8fafc" stroke="#94a3b8" stroke-width="2" filter="url(#shadow_scale_ruler)"/>
      <!-- Colored groove strips -->
      <line x1="60" y1="110" x2="340" y2="110" stroke="#dc2626" stroke-width="4"/>
      <line x1="70" y1="145" x2="330" y2="145" stroke="#2563eb" stroke-width="4"/>
      <text x="200" y="132" font-family="sans-serif" font-size="9" font-weight="900" fill="#0f172a" text-anchor="middle">ENGINEERING ARCHITECT SCALE 1:100 / 1:200</text>
    ''', '#181e28')

    # =========================================================================
    # 14. FILES &amp; FOLDERS
    # =========================================================================
    svgs['ring_binder'] = wrap_svg('ring_binder', 'A4 Ring Binder Document File', 'FILES', '#0ea5e9', '''
      <rect x="120" y="45" width="160" height="175" rx="6" fill="#1e40af" filter="url(#shadow_ring_binder)"/>
      <rect x="125" y="50" width="150" height="165" rx="4" fill="#2563eb"/>
      <!-- 2 Steel D-Rings -->
      <circle cx="140" cy="100" r="12" fill="none" stroke="#cbd5e1" stroke-width="5"/>
      <circle cx="140" cy="165" r="12" fill="none" stroke="#cbd5e1" stroke-width="5"/>
      <!-- Spine Label Pocket -->
      <rect x="155" y="70" width="95" height="40" rx="3" fill="#ffffff"/>
      <text x="202" y="94" font-family="sans-serif" font-size="9" font-weight="900" fill="#1e3a8a" text-anchor="middle">A4 2-D RING</text>
      <text x="202" y="105" font-family="sans-serif" font-size="7.5" font-weight="700" fill="#64748b" text-anchor="middle">DOCUMENT BINDER</text>
    ''', '#151e2c')

    svgs['clear_folder'] = wrap_svg('clear_folder', 'Clear L-Type Plastic Folder (Pack of 5)', 'FILES', '#0ea5e9', '''
      <!-- Transparent Document Sleeve -->
      <rect x="130" y="50" width="140" height="165" rx="4" fill="#ffffff" opacity="0.65" stroke="#38bdf8" stroke-width="2" filter="url(#shadow_clear_folder)"/>
      <!-- Sheet of paper inside -->
      <rect x="138" y="58" width="124" height="149" fill="#f8fafc"/>
      <line x1="150" y1="80" x2="245" y2="80" stroke="#cbd5e1" stroke-width="3"/>
      <line x1="150" y1="100" x2="245" y2="100" stroke="#cbd5e1" stroke-width="2"/>
      <line x1="150" y1="120" x2="245" y2="120" stroke="#cbd5e1" stroke-width="2"/>
      <text x="200" y="155" font-family="sans-serif" font-size="9" font-weight="800" fill="#0284c7" text-anchor="middle">L-FOLDER (5 PCS)</text>
    ''', '#15202b')

    svgs['mesh_file'] = wrap_svg('mesh_file', 'Zipper Mesh Bag File', 'FILES', '#0ea5e9', '''
      <rect x="110" y="65" width="180" height="135" rx="8" fill="#10b981" opacity="0.75" filter="url(#shadow_mesh_file)"/>
      <!-- Mesh Grid Texture -->
      ''' + "".join([f'<line x1="{115 + i*10}" y1="70" x2="{115 + i*10}" y2="195" stroke="#ffffff" stroke-width="1" opacity="0.3"/>' for i in range(18)]) + '''
      <!-- Zipper Track along Top -->
      <rect x="110" y="65" width="180" height="14" fill="#065f46"/>
      <rect x="130" y="67" width="16" height="10" rx="2" fill="#ffffff"/>
      <text x="200" y="140" font-family="sans-serif" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle">ZIPPER MESH POUCH</text>
    ''', '#13241e')

    svgs['binder_clips'] = wrap_svg('binder_clips', 'Butterfly Binder Clips (Box of 12)', 'FILES', '#0ea5e9', '''
      <!-- Real Foldback Black Binder Clip -->
      <polygon points="170,120 230,120 240,165 160,165" fill="#0f172a" filter="url(#shadow_binder_clips)"/>
      <rect x="160" y="160" width="80" height="8" rx="2" fill="#1e293b"/>
      <!-- Silver Wire Arms -->
      <path d="M 175,120 L 175,80 Q 175,70 185,70 L 190,70" stroke="#cbd5e1" stroke-width="4.5" fill="none"/>
      <path d="M 225,120 L 225,80 Q 225,70 215,70 L 210,70" stroke="#cbd5e1" stroke-width="4.5" fill="none"/>
      <text x="200" y="195" font-family="sans-serif" font-size="9" font-weight="800" fill="#cbd5e1" text-anchor="middle">TEMPERED STEEL 32mm</text>
    ''', '#161d27')

    svgs['lever_arch'] = wrap_svg('lever_arch', 'Hardboard Arch Lever Box File', 'FILES', '#0ea5e9', '''
      <rect x="130" y="45" width="140" height="175" rx="6" fill="#1e293b" filter="url(#shadow_lever_arch)"/>
      <!-- Black &amp; white marble patterned cover -->
      <rect x="135" y="50" width="130" height="165" fill="#334155"/>
      <!-- Spine Label &amp; Thumb hole ring -->
      <rect x="170" y="70" width="60" height="40" fill="#ffffff"/>
      <text x="200" y="95" font-family="sans-serif" font-size="8" font-weight="900" fill="#0f172a" text-anchor="middle">LEVER ARCH</text>
      <circle cx="200" cy="145" r="12" fill="#0f172a" stroke="#cbd5e1" stroke-width="3"/>
    ''', '#171d27')

    # =========================================================================
    # 15. OTHER STATIONERY
    # =========================================================================
    svgs['stapler'] = wrap_svg('stapler', 'Desktop Metal Stapler (No. 10)', 'STATIONERY', '#eab308', '''
      <!-- Heavy Duty Desktop Stapler -->
      <path d="M 120,165 L 260,165 L 255,145 L 140,145 Z" fill="#475569" filter="url(#shadow_stapler)"/>
      <path d="M 130,145 L 260,145 Q 275,145 265,125 L 150,110 Q 130,110 130,145 Z" fill="#2563eb" filter="url(#shadow_stapler)"/>
      <rect x="120" y="165" width="150" height="12" rx="2" fill="#1e293b"/>
      <circle cx="240" cy="132" r="6" fill="#cbd5e1"/>
      <text x="200" y="132" font-family="sans-serif" font-size="7.5" font-weight="900" fill="#ffffff">NO.10 STAPLER</text>
    ''', '#171d29')

    svgs['stapler_pins'] = wrap_svg('stapler_pins', 'Steel Stapler Pins (Box of 1000)', 'STATIONERY', '#eab308', '''
      <!-- Box of Staple Pins -->
      <rect x="120" y="85" width="160" height="95" rx="6" fill="#15803d" stroke="#fef08a" stroke-width="2" filter="url(#shadow_stapler_pins)"/>
      <rect x="125" y="90" width="150" height="85" rx="4" fill="#16a34a"/>
      <text x="200" y="125" font-family="sans-serif" font-size="12" font-weight="900" fill="#ffffff" text-anchor="middle">STAPLE PINS</text>
      <text x="200" y="142" font-family="sans-serif" font-size="9" font-weight="800" fill="#fef08a" text-anchor="middle">No. 10 • 1000 PINS</text>
      <!-- Silver pin strip drawn -->
      <rect x="145" y="152" width="110" height="6" fill="#cbd5e1"/>
    ''', '#13241b')

    svgs['scissors'] = wrap_svg('scissors', 'Stainless Steel Paper Scissors', 'STATIONERY', '#eab308', '''
      <!-- Twin Steel Blades Crossing -->
      <path d="M 160,135 L 260,75 L 255,70 L 150,130 Z" fill="#e2e8f0" filter="url(#shadow_scissors)"/>
      <path d="M 160,135 L 260,175 L 255,180 L 150,138 Z" fill="#cbd5e1" filter="url(#shadow_scissors)"/>
      <!-- Pivot Screw -->
      <circle cx="160" cy="135" r="5" fill="#475569"/>
      <!-- Ergonomic Finger Loops (Orange/Black) -->
      <ellipse cx="120" cy="115" rx="24" ry="16" fill="none" stroke="#ea580c" stroke-width="10" transform="rotate(-25 120 115)"/>
      <ellipse cx="120" cy="155" rx="24" ry="16" fill="none" stroke="#ea580c" stroke-width="10" transform="rotate(25 120 155)"/>
    ''', '#251b14')

    svgs['whiteboard_markers'] = wrap_svg('whiteboard_markers', 'Whiteboard Marker Set (4 Pens)', 'STATIONERY', '#eab308', '''
      ''' + "".join([f'<rect x="100" y="{80 + i*28}" width="180" height="18" rx="5" fill="#f8fafc" stroke="{["#0f172a", "#1d4ed8", "#b91c1c", "#15803d"][i]}" stroke-width="2.5" filter="url(#shadow_whiteboard_markers)"/><rect x="245" y="{80 + i*28}" width="35" height="18" rx="3" fill="{["#0f172a", "#1d4ed8", "#b91c1c", "#15803d"][i]}"/><text x="175" y="{92+i*28}" font-family="sans-serif" font-size="7.5" font-weight="900" fill="{["#0f172a", "#1d4ed8", "#b91c1c", "#15803d"][i]}">WHITEBOARD DRY-ERASE</text>' for i in range(4)]) + '''
    ''', '#181e28')

    svgs['whitener_pen'] = wrap_svg('whitener_pen', 'Correction Pen Fluid (Whited Out)', 'STATIONERY', '#eab308', '''
      <rect x="170" y="80" width="60" height="120" rx="12" fill="#2563eb" filter="url(#shadow_whitener_pen)"/>
      <text x="200" y="130" font-family="sans-serif" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle">CORRECTION</text>
      <text x="200" y="145" font-family="sans-serif" font-size="8" font-weight="800" fill="#93c5fd" text-anchor="middle">PEN FLUID</text>
      <!-- Cap &amp; Fine Needle Tip -->
      <rect x="185" y="55" width="30" height="25" rx="4" fill="#ffffff" filter="url(#shadow_whitener_pen)"/>
      <line x1="200" y1="40" x2="200" y2="55" stroke="#94a3b8" stroke-width="3"/>
      <circle cx="200" cy="40" r="1.5" fill="#ffffff"/>
    ''', '#151d29')

    svgs['highlighters'] = wrap_svg('highlighters', 'Pastel Highlighter Set (Pack of 5)', 'STATIONERY', '#eab308', '''
      <!-- 5 Pastel Highlighters Side by Side -->
      ''' + "".join([f'<rect x="{100 + i*40}" y="75" width="28" height="120" rx="6" fill="{["#fef08a", "#bbf7d0", "#fbcfe8", "#fed7aa", "#bae6fd"][i]}" stroke="{["#eab308", "#22c55e", "#ec4899", "#f97316", "#3b82f6"][i]}" stroke-width="2" filter="url(#shadow_highlighters)"/><rect x="{100 + i*40}" y="75" width="28" height="35" rx="4" fill="{["#fde047", "#86efac", "#f472b6", "#fb923c", "#60a5fa"][i]}"/>' for i in range(5)]) + '''
    ''', '#1e2429')

    svgs['sticky_notes'] = wrap_svg('sticky_notes', 'Canary Yellow Self-Adhesive Sticky Notes', 'STATIONERY', '#eab308', '''
      <!-- Square Post-it Sticky Pad -->
      <rect x="135" y="70" width="130" height="130" rx="4" fill="#ca8a04" filter="url(#shadow_sticky_notes)"/>
      <rect x="135" y="66" width="130" height="130" rx="4" fill="#fef08a"/>
      <rect x="135" y="66" width="130" height="24" fill="#fde047" opacity="0.6"/>
      <!-- Peeling bottom corner -->
      <path d="M 235,196 L 265,166 L 235,166 Z" fill="#eab308"/>
      <text x="200" y="125" font-family="'Comic Sans MS', cursive, sans-serif" font-size="12" font-weight="700" fill="#78350f" text-anchor="middle">Sticky Notes</text>
      <text x="200" y="145" font-family="sans-serif" font-size="8" font-weight="700" fill="#a16207" text-anchor="middle">100 SHEETS • 3x3 INCH</text>
    ''', '#262214')

    svgs['paper_clips'] = wrap_svg('paper_clips', 'Vinyl-Coated Paper Clips (Box of 100)', 'STATIONERY', '#eab308', '''
      <!-- Colorful wire paper clips -->
      ''' + "".join([f'<path d="M {120 + i*40},95 L {120 + i*40},155 Q {120+i*40},175 {135+i*40},175 Q {150+i*40},175 {150+i*40},155 L {150+i*40},110 Q {150+i*40},90 {138+i*40},90 Q {128+i*40},90 {128+i*40},110 L {128+i*40},145" stroke="{["#dc2626", "#2563eb", "#16a34a", "#eab308"][i]}" stroke-width="4.5" fill="none" stroke-linecap="round" filter="url(#shadow_paper_clips)"/>' for i in range(4)]) + '''
    ''', '#1b2229')

    svgs['rubber_bands'] = wrap_svg('rubber_bands', 'Elastic Rubber Bands Pack', 'STATIONERY', '#eab308', '''
      <!-- Elastic Loops -->
      <ellipse cx="170" cy="130" rx="55" ry="32" fill="none" stroke="#eab308" stroke-width="6" transform="rotate(-20 170 130)" filter="url(#shadow_rubber_bands)"/>
      <ellipse cx="230" cy="135" rx="50" ry="28" fill="none" stroke="#ef4444" stroke-width="6" transform="rotate(30 230 135)" filter="url(#shadow_rubber_bands)"/>
      <ellipse cx="200" cy="125" rx="45" ry="25" fill="none" stroke="#22c55e" stroke-width="5" filter="url(#shadow_rubber_bands)"/>
    ''', '#241f17')

    svgs['flash_cards'] = wrap_svg('flash_cards', 'Study Revision Index Flash Cards', 'STATIONERY', '#eab308', '''
      <!-- Stack of Ruled Flash Cards on Ring -->
      <rect x="120" y="80" width="160" height="105" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" filter="url(#shadow_flash_cards)"/>
      <circle cx="140" cy="95" r="5" fill="#0f172a"/>
      <circle cx="140" cy="95" r="16" fill="none" stroke="#94a3b8" stroke-width="3.5"/>
      <line x1="160" y1="110" x2="260" y2="110" stroke="#93c5fd" stroke-width="2"/>
      <line x1="160" y1="130" x2="260" y2="130" stroke="#93c5fd" stroke-width="2"/>
      <line x1="160" y1="150" x2="260" y2="150" stroke="#93c5fd" stroke-width="2"/>
      <text x="210" y="105" font-family="sans-serif" font-size="9" font-weight="900" fill="#1e3a8a">FORMULA REVISION</text>
    ''', '#171e28')

    return svgs

# Mapping each of the 90 items in canteen.db to its exact dedicated SVG
ITEM_SLUG_MAP = {
    # Tiffin
    'Idli (2 pcs)': 'idli',
    'Crispy Dosa': 'crispy_dosa',
    'Poori Masala (2 pcs)': 'poori_masala',
    'Rava Upma': 'rava_upma',
    'Ghee Ven Pongal': 'ghee_pongal',
    'Masala Dosa': 'masala_dosa',
    'Medu Vada (2 pcs)': 'medu_vada',

    # Lunch
    'South Indian Veg Meals': 'veg_meals',
    'Special Chicken Meals': 'chicken_meals',
    'Veg Fried Rice': 'veg_fried_rice',
    'Royal Veg Dum Biryani': 'veg_biryani',
    'Hyderabadi Chicken Biryani': 'chicken_biryani',
    'Curd Rice': 'curd_rice',
    'Egg Fried Rice': 'egg_fried_rice',

    # Dinner
    'Wheat Chapati with Kurma (2 pcs)': 'chapati_kurma',
    'Malabar Parotta with Salna (2 pcs)': 'parotta_salna',
    'Dinner Roast Dosa': 'dinner_dosa',
    'Schezwan Fried Rice': 'schezwan_rice',
    'Paneer Butter Masala': 'paneer_butter',
    'Kadai Chicken Curry': 'kadai_chicken',

    # Snacks
    'Crispy Samosa (2 pcs)': 'samosa',
    'Veg Puff Pastry': 'veg_puff',
    'Egg Puff': 'egg_puff',
    'Assorted Biscuits Pack': 'biscuits',
    'Crispy Potato Chips': 'potato_chips',
    'Peri Peri French Fries': 'french_fries',

    # Drinks
    'Mineral Water Bottle (1 Litre)': 'water_bottle',
    'Fresh Cold Pressed Orange Juice': 'orange_juice',
    'Fresh Watermelon Juice': 'watermelon_juice',
    'Belgian Chocolate Milkshake': 'chocolate_shake',
    'Oreo Cookie Milkshake': 'oreo_shake',
    'Chilled Cool Drinks (500ml)': 'cool_drinks',
    'Red Bull Energy Drink (250ml)': 'red_bull',
    'South Indian Filter Coffee': 'filter_coffee',

    # Chocolates
    'Cadbury Dairy Milk': 'dairy_milk',
    'Nestlé KitKat 4 Finger': 'kitkat',
    'Cadbury 5 Star': 'five_star',
    'Nestlé Munch Crunch Bar': 'munch',
    'Cadbury Perk Wafer Bar': 'perk',
    'Snickers Peanut Chocolate Bar': 'snickers',

    # Books
    'Engineering Mathematics Textbook': 'maths_book',
    'Engineering Physics Reference Book': 'physics_book',
    'Chemistry Laboratory Manual': 'chemistry_manual',
    'Programming in C &amp; Algorithms': 'c_programming',
    'Data Structures &amp; Algorithms Handbook': 'dsa_handbook',

    # Notebooks
    'A4 Spiral Notebook (160 Pages)': 'spiral_notebook',
    '200-Page Ruled Long Notebook': 'ruled_longbook',
    'Engineering Graph Notebook': 'graph_notebook',
    'Hardcover Lab Record Notebook': 'lab_record',
    'A3 Drawing &amp; Sketch Book': 'sketch_book',

    # Pens
    'Reynolds 045 Ball Pen (Blue)': 'reynolds_pen',
    'Parker Vector Rollerball Pen': 'parker_pen',
    'Gel Pen Set (Pack of 5)': 'gel_pens',
    'Pilot G2 0.5mm Gel Pen': 'pilot_pen',
    'Permanent Marker Set (4 Colors)': 'markers',

    # Pencils
    'Apsara Platinum HB Pencils (Box of 10)': 'apsara_pencils',
    'Mechanical Drafting Pencil (0.5mm)': 'mechanical_pencil',
    'Faber-Castell Color Pencils (12 Shades)': 'color_pencils',
    'Drawing Sketching Pencil Set (6 Grades)': 'sketching_pencils',
    'Staedtler Mars Lumograph Pencil': 'lumograph_pencil',

    # Erasers
    'Faber-Castell Dust-Free Eraser': 'faber_eraser',
    'Precision Drafting Vinyl Eraser': 'drafting_eraser',
    'Artist Kneaded Putty Eraser': 'putty_eraser',
    'Multicolor Student Erasers (Pack of 5)': 'color_erasers',
    'Jumbo Non-Dust Eraser': 'jumbo_eraser',

    # Sharpeners
    'Double Hole Canister Sharpener': 'canister_sharpener',
    'Rotary Desktop Crank Sharpener': 'crank_sharpener',
    'Staedtler Metal Wedge Sharpener': 'metal_sharpener',
    'Electric Battery Operated Sharpener': 'electric_sharpener',
    'Compact Travel Pencil Sharpener': 'travel_sharpener',

    # Rulers
    '30cm Transparent Acrylic Ruler': 'acrylic_ruler',
    'Technical Set Squares (Pair)': 'set_squares',
    '180 Degree Precision Protractor': 'protractor',
    'Complete Mathematical Geometry Box': 'geometry_box',
    'Engineering Scale Triangular Ruler': 'scale_ruler',

    # Files
    'A4 Ring Binder Document File': 'ring_binder',
    'Clear L-Type Plastic Folder (Pack of 5)': 'clear_folder',
    'Zipper Mesh Bag File': 'mesh_file',
    'Butterfly Binder Clips (Box of 12)': 'binder_clips',
    'Hardboard Arch Lever Box File': 'lever_arch',

    # Other Stationery
    'Desktop Metal Stapler (No. 10)': 'stapler',
    'Steel Stapler Pins (Box of 1000)': 'stapler_pins',
    'Stainless Steel Paper Scissors': 'scissors',
    'Whiteboard Marker Set (4 Pens)': 'whiteboard_markers',
    'Correction Pen Fluid (Whited Out)': 'whitener_pen',
    'Pastel Highlighter Set (Pack of 5)': 'highlighters',
    'Self-Adhesive Sticky Notes (100 Sheets)': 'sticky_notes',
    'Vinyl Coated Paper Clips (Box of 100)': 'paper_clips',
    'Elastic Rubber Bands Pack': 'rubber_bands',
    'Study Revision Index Flash Cards': 'flash_cards'
}

def main():
    svgs = build_all_svgs()
    print(f"Generated {len(svgs)} SVG templates.")

    # Write SVGs to public/img/items/
    for slug, code in svgs.items():
        path = os.path.join(ITEMS_DIR, f"{slug}.svg")
        with open(path, 'w', encoding='utf-8') as f:
            f.write(code)

    print(f"Wrote all SVG files to {ITEMS_DIR}")

    # Update canteen.db
    db_path = os.path.join(os.path.dirname(__file__), 'canteen.db')
    conn = sqlite3.connect(db_path)
    c = conn.cursor()

    updated = 0
    for name, slug in ITEM_SLUG_MAP.items():
        if slug in svgs:
            local_url = f"/img/items/{slug}.svg"
            c.execute("UPDATE food_items SET image_url = ? WHERE name = ?", (local_url, name))
            if c.rowcount > 0:
                updated += c.rowcount

    conn.commit()
    conn.close()
    print(f"Updated {updated} items in {db_path} to point to local SVGs.")

if __name__ == '__main__':
    main()
