import random
import math
from datetime import datetime, timedelta
from typing import Dict, List, Any

# Fix seed for reproducible high quality synthetic data
random.seed(42)

MERCHANT_PROFILES = [
    {
        "merchant_id": "PAYTM_M_1001",
        "name": "तुषार शर्मा (Tushar Sharma)",
        "business_name": "तुषार किराना स्टोर & सुपरमार्ट",
        "business_name_en": "Tushar Kirana & Supermart",
        "category": "किराना व दैनिक उपभोग (Kirana & Grocery)",
        "city": "सेक्टर 18, नोएडा (Noida)",
        "pincode": "201301",
        "latitude": 28.5708,
        "longitude": 77.3260,
        "joined_date": "2023-04-15",
        "paytm_soundbox": True,
        "soundbox_serial_id": "SBX-4G-99201",
        "paytm_postpaid_enabled": True,
        "tier": "Gold",
        "tier_badge": "गोल्ड व्यापारी 🥇 (Gold Tier)",
        "merchantmind_score": 742,
        "avg_daily_sales_inr": 14850.0,
        "monthly_gmv": 445500.0,
        "total_transactions_30d": 2180
    },
    {
        "merchant_id": "PAYTM_M_1002",
        "name": "रमेश गुप्ता (Ramesh Gupta)",
        "business_name": "लक्ष्मी प्रोविजन स्टोर",
        "business_name_en": "Laxmi Provision Store",
        "category": "राशन व डेयरी (Grocery & Dairy)",
        "city": "चांदनी चौक, पुरानी दिल्ली (Delhi)",
        "pincode": "110006",
        "latitude": 28.6505,
        "longitude": 77.2303,
        "joined_date": "2022-11-10",
        "paytm_soundbox": True,
        "soundbox_serial_id": "SBX-4G-88142",
        "paytm_postpaid_enabled": True,
        "tier": "Platinum",
        "tier_badge": "प्लैटिनम व्यापारी 💎 (Platinum Tier)",
        "merchantmind_score": 815,
        "avg_daily_sales_inr": 21400.0,
        "monthly_gmv": 642000.0,
        "total_transactions_30d": 3420
    },
    {
        "merchant_id": "PAYTM_M_1003",
        "name": "सुरेश पटेल (Suresh Patel)",
        "business_name": "बालाजी सुपर डेली मार्ट",
        "business_name_en": "Balaji Super Daily Mart",
        "category": "सुपरमार्केट व एफएमसीजी (Supermarket)",
        "city": "इंदिरानगर, Bengaluru (Bengaluru)",
        "pincode": "560038",
        "latitude": 12.9784,
        "longitude": 77.6408,
        "joined_date": "2021-08-20",
        "paytm_soundbox": True,
        "soundbox_serial_id": "SBX-4G-77319",
        "paytm_postpaid_enabled": True,
        "tier": "Platinum",
        "tier_badge": "प्लैटिनम व्यापारी 💎 (Platinum Tier)",
        "merchantmind_score": 860,
        "avg_daily_sales_inr": 34200.0,
        "monthly_gmv": 1026000.0,
        "total_transactions_30d": 4890
    },
    {
        "merchant_id": "PAYTM_M_1004",
        "name": "अमित गुप्ता (Amit Gupta)",
        "business_name": "गुप्ता ब्रदर्स जनरल स्टोर",
        "business_name_en": "Gupta Brothers General Store",
        "category": "जनरल स्टोर (General Store)",
        "city": "हज़रतगंज, लखनऊ (Lucknow)",
        "pincode": "226001",
        "latitude": 26.8467,
        "longitude": 80.9462,
        "joined_date": "2023-09-01",
        "paytm_soundbox": True,
        "soundbox_serial_id": "SBX-4G-66405",
        "paytm_postpaid_enabled": True,
        "tier": "Silver",
        "tier_badge": "सिल्वर व्यापारी 🥈 (Silver Tier)",
        "merchantmind_score": 680,
        "avg_daily_sales_inr": 11300.0,
        "monthly_gmv": 339000.0,
        "total_transactions_30d": 1640
    },
    {
        "merchant_id": "PAYTM_M_1005",
        "name": "पवन अग्रवाल (Pawan Aggarwal)",
        "business_name": "अग्रवाल स्वीट्स & नमकीन",
        "business_name_en": "Aggarwal Sweets & Namkeen",
        "category": "मिठाई व नमकीन (Sweets & Snacks)",
        "city": "राजा पार्क, जयपुर (Jaipur)",
        "pincode": "302004",
        "latitude": 26.8929,
        "longitude": 75.8267,
        "joined_date": "2022-03-14",
        "paytm_soundbox": True,
        "soundbox_serial_id": "SBX-4G-55210",
        "paytm_postpaid_enabled": True,
        "tier": "Gold",
        "tier_badge": "गोल्ड व्यापारी 🥇 (Gold Tier)",
        "merchantmind_score": 790,
        "avg_daily_sales_inr": 28600.0,
        "monthly_gmv": 858000.0,
        "total_transactions_30d": 4120
    },
    {
        "merchant_id": "PAYTM_M_1006",
        "name": "मुकेश यादव (Mukesh Yadav)",
        "business_name": "चाय पॉइंट & कैफे कॉर्नर",
        "business_name_en": "Chai Point & Cafe Corner",
        "category": "चाय व स्नैक्स (Tea & Quick Bites)",
        "city": "साइबर सिटी, गुरुग्राम (Gurugram)",
        "pincode": "122002",
        "latitude": 28.4950,
        "longitude": 77.0895,
        "joined_date": "2024-01-10",
        "paytm_soundbox": True,
        "soundbox_serial_id": "SBX-4G-44119",
        "paytm_postpaid_enabled": True,
        "tier": "Silver",
        "tier_badge": "सिल्वर व्यापारी 🥈 (Silver Tier)",
        "merchantmind_score": 620,
        "avg_daily_sales_inr": 8750.0,
        "monthly_gmv": 262500.0,
        "total_transactions_30d": 2450
    },
    {
        "merchant_id": "PAYTM_M_1007",
        "name": "डॉ. आलोक वर्मा (Dr. Alok Verma)",
        "business_name": "संजीवनी मेडिकोज & फार्मा",
        "business_name_en": "Sanjeevani Medicos & Pharma",
        "category": "दवा व स्वास्थ्य (Pharmacy & Healthcare)",
        "city": "गोदौलिया, वाराणसी (Varanasi)",
        "pincode": "221001",
        "latitude": 25.3109,
        "longitude": 83.0104,
        "joined_date": "2022-06-18",
        "paytm_soundbox": True,
        "soundbox_serial_id": "SBX-4G-33982",
        "paytm_postpaid_enabled": True,
        "tier": "Gold",
        "tier_badge": "गोल्ड व्यापारी 🥇 (Gold Tier)",
        "merchantmind_score": 765,
        "avg_daily_sales_inr": 17900.0,
        "monthly_gmv": 537000.0,
        "total_transactions_30d": 1980
    },
    {
        "merchant_id": "PAYTM_M_1008",
        "name": "विकास सिंह (Vikas Singh)",
        "business_name": "साईं मोबाइल & एक्सेसरीज",
        "business_name_en": "Sai Mobiles & Accessories",
        "category": "इलेक्ट्रॉनिक्स व मोबाइल (Electronics & Mobile)",
        "city": "कंकड़बाग, पटना (Patna)",
        "pincode": "800020",
        "latitude": 25.5941,
        "longitude": 85.1376,
        "joined_date": "2023-02-28",
        "paytm_soundbox": True,
        "soundbox_serial_id": "SBX-4G-22871",
        "paytm_postpaid_enabled": True,
        "tier": "Gold",
        "tier_badge": "गोल्ड व्यापारी 🥇 (Gold Tier)",
        "merchantmind_score": 710,
        "avg_daily_sales_inr": 13400.0,
        "monthly_gmv": 402000.0,
        "total_transactions_30d": 1150
    },
    {
        "merchant_id": "PAYTM_M_1009",
        "name": "सुनीता देवी (Sunita Devi)",
        "business_name": "श्रृंगार वस्त्रालय & साड़ी सदन",
        "business_name_en": "Shringar Vastralaya & Saree Sadan",
        "category": "कपड़े व वस्त्र (Apparel & Garments)",
        "city": "अमीनाबाद, लखनऊ (Aminabad, Lucknow)",
        "pincode": "226018",
        "latitude": 26.8480,
        "longitude": 80.9270,
        "joined_date": "2024-03-01",
        "paytm_soundbox": True,
        "soundbox_serial_id": "SBX-4G-11760",
        "paytm_postpaid_enabled": True,
        "tier": "Bronze",
        "tier_badge": "ब्रॉन्ज व्यापारी 🥉 (Bronze Tier)",
        "merchantmind_score": 580,
        "avg_daily_sales_inr": 9200.0,
        "monthly_gmv": 276000.0,
        "total_transactions_30d": 780
    },
    {
        "merchant_id": "PAYTM_M_1010",
        "name": "तुषार भारद्वाज (Tushar Bhardwaj)",
        "business_name": "भारद्वाज मेगा सुपरमार्ट",
        "business_name_en": "Bhardwaj Mega Supermart",
        "category": "हाइपर किराना व सुपरस्टोर (Hypermarket & FMCG)",
        "city": "साउथ एक्स, नई दिल्ली (New Delhi)",
        "pincode": "110049",
        "latitude": 28.5700,
        "longitude": 77.2200,
        "joined_date": "2021-01-15",
        "paytm_soundbox": True,
        "soundbox_serial_id": "SBX-4G-99888",
        "paytm_postpaid_enabled": True,
        "tier": "Platinum",
        "tier_badge": "प्लैटिनम व्यापारी 💎 (Platinum Tier)",
        "merchantmind_score": 885,
        "avg_daily_sales_inr": 42500.0,
        "monthly_gmv": 1275000.0,
        "total_transactions_30d": 5600
    }
]

KIRANA_CATALOG = [
    {"name": "Parle-G Gold 100g", "category": "Biscuits & Bakery", "cost": 9.0, "price": 10.0, "unit": "packet", "daily_base": 42},
    {"name": "Maggi 2-Minute Masala Noodles", "category": "Instant Noodles", "cost": 12.5, "price": 14.0, "unit": "pack", "daily_base": 55},
    {"name": "Amul Taaza Toned Milk 500ml", "category": "Dairy", "cost": 25.5, "price": 27.0, "unit": "pouch", "daily_base": 78},
    {"name": "Fortune Sunlite Refined Oil 1L", "category": "Edible Oils", "cost": 132.0, "price": 145.0, "unit": "pouch", "daily_base": 18},
    {"name": "Aashirvaad Shudh Chakki Atta 5kg", "category": "Flours & Grains", "cost": 215.0, "price": 240.0, "unit": "bag", "daily_base": 14},
    {"name": "Tata Salt Vacuum Evaporated 1kg", "category": "Spices & Cooking", "cost": 24.0, "price": 28.0, "unit": "packet", "daily_base": 22},
    {"name": "Britannia Good Day Butter 120g", "category": "Biscuits & Bakery", "cost": 26.0, "price": 30.0, "unit": "pack", "daily_base": 30},
    {"name": "Kurkure Masala Munch 80g", "category": "Snacks & Namkeen", "cost": 17.5, "price": 20.0, "unit": "packet", "daily_base": 40},
    {"name": "Lay's India's Magic Masala 50g", "category": "Snacks & Namkeen", "cost": 17.5, "price": 20.0, "unit": "packet", "daily_base": 48},
    {"name": "Surf Excel Easy Wash Detergent 1kg", "category": "Home & Cleaning", "cost": 120.0, "price": 138.0, "unit": "pack", "daily_base": 11},
    {"name": "Dettol Original Germ Protection Soap 75g", "category": "Personal Care", "cost": 34.0, "price": 40.0, "unit": "bar", "daily_base": 19},
    {"name": "Brooke Bond Red Label Tea 250g", "category": "Tea & Coffee", "cost": 110.0, "price": 130.0, "unit": "pack", "daily_base": 16},
    {"name": "Everest Sabji Masala 100g", "category": "Spices & Cooking", "cost": 38.0, "price": 46.0, "unit": "box", "daily_base": 15},
    {"name": "Haldiram's Aloo Bhujia 400g", "category": "Snacks & Namkeen", "cost": 88.0, "price": 105.0, "unit": "packet", "daily_base": 20},
    {"name": "Dabur Pure Honey 250g", "category": "Health Foods", "cost": 115.0, "price": 135.0, "unit": "bottle", "daily_base": 8},
    {"name": "Organic Sharbati Atta 5kg", "category": "Premium Grains", "cost": 290.0, "price": 350.0, "unit": "bag", "daily_base": 6},
    {"name": "Amul Pure Ghee 1L Pouch", "category": "Dairy & Ghee", "cost": 540.0, "price": 590.0, "unit": "pouch", "daily_base": 7},
    {"name": "MDH Deggi Mirch 100g", "category": "Spices & Cooking", "cost": 72.0, "price": 85.0, "unit": "box", "daily_base": 12},
    {"name": "Catch Sprinklers Chat Masala 100g", "category": "Spices & Cooking", "cost": 55.0, "price": 68.0, "unit": "tin", "daily_base": 9},
    {"name": "Colgate Strong Teeth Toothpaste 200g", "category": "Personal Care", "cost": 92.0, "price": 110.0, "unit": "tube", "daily_base": 14}
]

MOBILE_CATALOG = [
    {"name": "65W GaN Fast Charger (Type-C)", "category": "Chargers & Adapters", "cost": 650.0, "price": 899.0, "unit": "piece", "daily_base": 14},
    {"name": "9D Curved Tempered Glass (HD Clear)", "category": "Screen Protectors", "cost": 35.0, "price": 150.0, "unit": "piece", "daily_base": 28},
    {"name": "boAt Bassheads 242 Wired Earphones", "category": "Audio & Earphones", "cost": 320.0, "price": 499.0, "unit": "piece", "daily_base": 12},
    {"name": "Silicon Matte Protective Back Cover", "category": "Mobile Covers", "cost": 60.0, "price": 199.0, "unit": "piece", "daily_base": 22},
    {"name": "Mi 10000mAh Power Bank 3i Dual USB", "category": "Power Banks", "cost": 850.0, "price": 1199.0, "unit": "piece", "daily_base": 6},
    {"name": "Type-C Braided Fast Charging Cable 1m", "category": "Cables & Connectors", "cost": 85.0, "price": 249.0, "unit": "piece", "daily_base": 24},
    {"name": "SanDisk 64GB Ultra MicroSD Card", "category": "Memory & Storage", "cost": 380.0, "price": 549.0, "unit": "piece", "daily_base": 8},
    {"name": "OTG Type-C to USB 3.0 Metal Adapter", "category": "Cables & Connectors", "cost": 45.0, "price": 120.0, "unit": "piece", "daily_base": 15},
    {"name": "Mobile Camera Lens Protector Ring", "category": "Screen Protectors", "cost": 30.0, "price": 99.0, "unit": "piece", "daily_base": 18},
    {"name": "Universal Magnetic Car Dashboard Mount", "category": "Car Accessories", "cost": 160.0, "price": 349.0, "unit": "piece", "daily_base": 7},
    {"name": "Portronics SoundDrum 10W Bluetooth Speaker", "category": "Audio & Speakers", "cost": 950.0, "price": 1499.0, "unit": "piece", "daily_base": 4},
    {"name": "Ring Light 10-inch with Metal Tripod", "category": "Content & Camera", "cost": 480.0, "price": 799.0, "unit": "piece", "daily_base": 5},
    {"name": "TWS Earbuds Silicon Protective Case", "category": "Audio & Earphones", "cost": 40.0, "price": 149.0, "unit": "piece", "daily_base": 10},
    {"name": "Micro-USB High Speed Data Cable 1m", "category": "Cables & Connectors", "cost": 50.0, "price": 149.0, "unit": "piece", "daily_base": 16},
    {"name": "Bluetooth Wireless Neckband ENC Mic", "category": "Audio & Earphones", "cost": 520.0, "price": 799.0, "unit": "piece", "daily_base": 9}
]

PHARMACY_CATALOG = [
    {"name": "Dolo 650mg Paracetamol (Strip of 15)", "category": "Pain & Fever", "cost": 24.0, "price": 32.0, "unit": "strip", "daily_base": 45},
    {"name": "Electral ORS Powder 21.8g Sachet", "category": "Digestive & ORS", "cost": 18.0, "price": 22.5, "unit": "sachet", "daily_base": 36},
    {"name": "Digene Acidity Relief Gel Mint 200ml", "category": "Antacids & Digestion", "cost": 125.0, "price": 152.0, "unit": "bottle", "daily_base": 14},
    {"name": "Band-Aid Waterproof Strips (Box of 20)", "category": "First Aid & Wound", "cost": 42.0, "price": 55.0, "unit": "box", "daily_base": 18},
    {"name": "Limcee Vitamin C 500mg Chewable (Strip 15)", "category": "Vitamins & Minerals", "cost": 21.0, "price": 28.0, "unit": "strip", "daily_base": 25},
    {"name": "Dettol Antiseptic Liquid 250ml", "category": "Antiseptics", "cost": 115.0, "price": 138.0, "unit": "bottle", "daily_base": 12},
    {"name": "Omron Digital Forehead Thermometer", "category": "Medical Devices", "cost": 1150.0, "price": 1550.0, "unit": "piece", "daily_base": 3},
    {"name": "Moov Pain Relief Fast Spray 50g", "category": "Pain Relief", "cost": 145.0, "price": 175.0, "unit": "can", "daily_base": 15},
    {"name": "Volini Instant Pain Relief Gel 30g", "category": "Pain Relief", "cost": 98.0, "price": 125.0, "unit": "tube", "daily_base": 16},
    {"name": "Crocin Advance Fast Release 500mg", "category": "Pain & Fever", "cost": 16.0, "price": 21.0, "unit": "strip", "daily_base": 30},
    {"name": "Vicks VapoRub Cold Relief Balm 50g", "category": "Cold & Cough", "cost": 120.0, "price": 145.0, "unit": "tin", "daily_base": 19},
    {"name": "Betadine 10% Antiseptic Ointment 20g", "category": "First Aid & Wound", "cost": 95.0, "price": 118.0, "unit": "tube", "daily_base": 11},
    {"name": "Revital H Daily Health Capsules (Strip 10)", "category": "Vitamins & Minerals", "cost": 92.0, "price": 115.0, "unit": "strip", "daily_base": 14},
    {"name": "Otrivin Oxy Fast Relief Nasal Spray 10ml", "category": "Cold & Cough", "cost": 84.0, "price": 105.0, "unit": "bottle", "daily_base": 13},
    {"name": "Boroline Ayurvedic Antiseptic Cream 40g", "category": "Skin & First Aid", "cost": 38.0, "price": 48.0, "unit": "tube", "daily_base": 20}
]

SWEETS_CATALOG = [
    {"name": "Kaju Katli Premium Box 500g", "category": "Kaju Sweets", "cost": 380.0, "price": 480.0, "unit": "box", "daily_base": 22},
    {"name": "Desi Ghee Motichoor Ladoo 1kg", "category": "Desi Ghee Sweets", "cost": 360.0, "price": 460.0, "unit": "box", "daily_base": 26},
    {"name": "Gulab Jamun Desi Ghee 1kg", "category": "Desi Ghee Sweets", "cost": 320.0, "price": 420.0, "unit": "box", "daily_base": 20},
    {"name": "Spongy White Rasgulla Tin (1kg)", "category": "Bengali Sweets", "cost": 210.0, "price": 270.0, "unit": "tin", "daily_base": 18},
    {"name": "Garam Aloo Samosa (Pack of 4)", "category": "Fresh Snacks", "cost": 40.0, "price": 60.0, "unit": "pack", "daily_base": 65},
    {"name": "Khasta Hing Kachori (Pack of 4)", "category": "Fresh Snacks", "cost": 42.0, "price": 64.0, "unit": "pack", "daily_base": 50},
    {"name": "Khaman Dhokla Fresh Tray 500g", "category": "Fresh Snacks", "cost": 70.0, "price": 110.0, "unit": "tray", "daily_base": 25},
    {"name": "Ratlami Spicy Sev 400g", "category": "Namkeen & Farsan", "cost": 90.0, "price": 125.0, "unit": "packet", "daily_base": 30},
    {"name": "Bikaneri Bhujia Special 400g", "category": "Namkeen & Farsan", "cost": 92.0, "price": 130.0, "unit": "packet", "daily_base": 35},
    {"name": "Kaju Pista Roll Luxury Pack 500g", "category": "Kaju Sweets", "cost": 440.0, "price": 580.0, "unit": "box", "daily_base": 12},
    {"name": "Royal Assorted Dry Fruit Gift Box 500g", "category": "Gift Hampers", "cost": 550.0, "price": 750.0, "unit": "box", "daily_base": 15},
    {"name": "Pure Desi Ghee Besan Ladoo 1kg", "category": "Desi Ghee Sweets", "cost": 340.0, "price": 440.0, "unit": "box", "daily_base": 18},
    {"name": "Alwar Special Milk Cake 500g", "category": "Milk Sweets", "cost": 240.0, "price": 310.0, "unit": "box", "daily_base": 16},
    {"name": "Crispy Masala Mathri 500g", "category": "Namkeen & Farsan", "cost": 85.0, "price": 120.0, "unit": "packet", "daily_base": 22},
    {"name": "Soan Papdi Festive Pack 500g", "category": "Packaged Sweets", "cost": 110.0, "price": 150.0, "unit": "box", "daily_base": 24}
]

CAFE_CATALOG = [
    {"name": "Special Kulhad Masala Chai", "category": "Chai & Tea", "cost": 6.0, "price": 20.0, "unit": "cup", "daily_base": 160},
    {"name": "Bun Maska Fresh Amul Butter", "category": "Bakery & Buns", "cost": 18.0, "price": 40.0, "unit": "plate", "daily_base": 55},
    {"name": "Crispy Aloo Veg Puff", "category": "Bakery & Puffs", "cost": 14.0, "price": 30.0, "unit": "piece", "daily_base": 48},
    {"name": "Iced Cold Coffee 300ml", "category": "Coffee & Coolers", "cost": 35.0, "price": 85.0, "unit": "glass", "daily_base": 38},
    {"name": "Grilled Paneer Tikka Sandwich", "category": "Sandwiches", "cost": 45.0, "price": 99.0, "unit": "plate", "daily_base": 32},
    {"name": "Mumbai Vada Pav with Chutney (Pair)", "category": "Street Bites", "cost": 22.0, "price": 50.0, "unit": "plate", "daily_base": 70},
    {"name": "Peri Peri French Fries (Medium)", "category": "Quick Bites", "cost": 30.0, "price": 75.0, "unit": "box", "daily_base": 35},
    {"name": "Ginger Elaichi Tea (Flask 500ml)", "category": "Chai & Tea", "cost": 28.0, "price": 70.0, "unit": "flask", "daily_base": 22},
    {"name": "Filter Coffee South Indian Style", "category": "Coffee & Coolers", "cost": 12.0, "price": 35.0, "unit": "cup", "daily_base": 42},
    {"name": "Cheesy Masala Maggi Bowl", "category": "Quick Bites", "cost": 28.0, "price": 65.0, "unit": "bowl", "daily_base": 40},
    {"name": "Veg Cheese Grilled Burger", "category": "Burgers", "cost": 42.0, "price": 89.0, "unit": "piece", "daily_base": 26},
    {"name": "Lemon Mint Iced Tea 300ml", "category": "Coffee & Coolers", "cost": 25.0, "price": 65.0, "unit": "glass", "daily_base": 28},
    {"name": "Samosa Pav with Spicy Garlic Chutney", "category": "Street Bites", "cost": 16.0, "price": 35.0, "unit": "plate", "daily_base": 45},
    {"name": "Chocolate Walnut Brownie", "category": "Desserts", "cost": 40.0, "price": 90.0, "unit": "piece", "daily_base": 18},
    {"name": "Hot Chocolate with Marshmallows", "category": "Coffee & Coolers", "cost": 38.0, "price": 95.0, "unit": "cup", "daily_base": 16}
]

APPAREL_CATALOG = [
    {"name": "Pure Banarasi Silk Zari Saree", "category": "Silk Sarees", "cost": 2200.0, "price": 3499.0, "unit": "saree", "daily_base": 5},
    {"name": "Chanderi Cotton Printed Kurti (L/XL)", "category": "Kurtis & Tunics", "cost": 380.0, "price": 699.0, "unit": "piece", "daily_base": 14},
    {"name": "Embroidered Festive Kurta Pyjama Set", "category": "Men's Ethnic", "cost": 850.0, "price": 1499.0, "unit": "set", "daily_base": 8},
    {"name": "Chiffon Party Wear Embroidered Dupatta", "category": "Dupattas & Stoles", "cost": 160.0, "price": 349.0, "unit": "piece", "daily_base": 18},
    {"name": "Cotton Daily Wear Salwar Suit Material", "category": "Dress Material", "cost": 550.0, "price": 950.0, "unit": "set", "daily_base": 11},
    {"name": "Designer Brocade Saree Blouse Piece", "category": "Blouses & Fabric", "cost": 120.0, "price": 280.0, "unit": "piece", "daily_base": 20},
    {"name": "Rayon Anarkali Festive Long Kurti", "category": "Kurtis & Tunics", "cost": 490.0, "price": 899.0, "unit": "piece", "daily_base": 10},
    {"name": "Men's Pure Cotton Ethnic Kurta", "category": "Men's Ethnic", "cost": 420.0, "price": 799.0, "unit": "piece", "daily_base": 9},
    {"name": "Georgette Floral Printed Saree", "category": "Daily Sarees", "cost": 580.0, "price": 999.0, "unit": "saree", "daily_base": 12},
    {"name": "Silk Blend Modi Nehru Jacket", "category": "Men's Ethnic", "cost": 650.0, "price": 1199.0, "unit": "piece", "daily_base": 6},
    {"name": "Premium Stretch Leggings Combo (Pack 2)", "category": "Bottom Wear", "cost": 240.0, "price": 499.0, "unit": "pack", "daily_base": 16},
    {"name": "Rajasthani Bandhani Bandhej Dupatta", "category": "Dupattas & Stoles", "cost": 190.0, "price": 399.0, "unit": "piece", "daily_base": 14},
    {"name": "Kashmiri Woolen Embroidered Shawl", "category": "Winter & Shawls", "cost": 850.0, "price": 1599.0, "unit": "piece", "daily_base": 4},
    {"name": "Traditional Handloom Cotton Saree", "category": "Cotton Sarees", "cost": 720.0, "price": 1250.0, "unit": "saree", "daily_base": 7},
    {"name": "Kids Ethnic Kurta Dhoti Set", "category": "Kids Ethnic", "cost": 380.0, "price": 699.0, "unit": "set", "daily_base": 8}
]

MERCHANT_CATEGORY_MAP = {
    "PAYTM_M_1001": "KIRANA",
    "PAYTM_M_1002": "KIRANA",
    "PAYTM_M_1003": "KIRANA",
    "PAYTM_M_1004": "KIRANA",
    "PAYTM_M_1005": "SWEETS",
    "PAYTM_M_1006": "CAFE",
    "PAYTM_M_1007": "PHARMACY",
    "PAYTM_M_1008": "MOBILE",
    "PAYTM_M_1009": "APPAREL",
    "PAYTM_M_1010": "KIRANA",
}

def get_catalog_for_merchant(merchant_id: str) -> List[Dict[str, Any]]:
    cat_type = MERCHANT_CATEGORY_MAP.get(merchant_id, "KIRANA")
    if cat_type == "MOBILE":
        return MOBILE_CATALOG
    elif cat_type == "PHARMACY":
        return PHARMACY_CATALOG
    elif cat_type == "SWEETS":
        return SWEETS_CATALOG
    elif cat_type == "CAFE":
        return CAFE_CATALOG
    elif cat_type == "APPAREL":
        return APPAREL_CATALOG
    return KIRANA_CATALOG

FIRST_NAMES = ["Amit", "Rahul", "Pooja", "Sunil", "Anjali", "Deepak", "Sneha", "Karan", "Priya", "Manoj",
               "Neeraj", "Rohit", "Kavita", "Sanjay", "Ritu", "Mohit", "Aakash", "Geeta", "Vikram", "Shweta"]

def generate_merchants() -> List[Dict[str, Any]]:
    return [dict(m) for m in MERCHANT_PROFILES]

def generate_inventory(merchant_id: str) -> List[Dict[str, Any]]:
    catalog = get_catalog_for_merchant(merchant_id)
    items = []
    for idx, prod in enumerate(catalog):
        item_id = f"ITEM_{merchant_id[-4:]}_{idx+1:03d}"
        daily = prod["daily_base"]
        
        # Designate item 0 as low stock, item 1 as critical/out-of-stock, item 4 as low stock
        if idx == 0:
            current = int(daily * 0.7)  # Low stock
            status = "low"
        elif idx == 1:
            current = 0  # Out of stock / Critical alert
            status = "critical"
        elif idx == 4:
            current = int(daily * 1.3)  # Low stock
            status = "low"
        else:
            current = random.randint(int(daily * 3.5), int(daily * 8.0))
            status = "healthy"
            
        optimal = int(daily * 7)
        reorder = int(daily * 2.5)
        days_left = round(current / max(1, daily), 1)
        
        items.append({
            "item_id": item_id,
            "name": prod["name"],
            "category": prod["category"],
            "current_stock": current,
            "unit": prod["unit"],
            "reorder_point": reorder,
            "optimal_stock_level": optimal,
            "unit_cost_inr": prod["cost"],
            "selling_price_inr": prod["price"],
            "stock_status": status,
            "days_until_stockout": days_left,
            "dead_stock": False if current < optimal * 2 else True
        })
    return items

def generate_historical_sales(merchant_id: str, days: int = 180) -> List[Dict[str, Any]]:
    sales = []
    base_date = datetime.now() - timedelta(days=days)
    
    for day_idx in range(days):
        current_date = base_date + timedelta(days=day_idx)
        date_str = current_date.strftime("%Y-%m-%d")
        dow = current_date.weekday() # 0 = Mon, 6 = Sun
        day_of_month = current_date.day
        
        # Base daily revenue scaled to the specific merchant's real business profile
        merch_profile = next((m for m in MERCHANT_PROFILES if m["merchant_id"] == merchant_id), MERCHANT_PROFILES[0])
        base_revenue = merch_profile.get("avg_daily_sales_inr", 14850.0)
        
        # Day of week factor (Fri, Sat, Sun are higher)
        dow_factor = 1.0
        if dow in [4, 5]: # Fri, Sat
            dow_factor = 1.25
        elif dow == 6: # Sun
            dow_factor = 1.35
            
        # Month start factor (1st to 7th has salary shopping)
        month_factor = 1.20 if day_of_month <= 7 else 1.0
        
        # Random weather / festival variation
        noise = random.uniform(0.92, 1.08)
        
        # Check festivals (simulated dates)
        is_festival = False
        fest_name = None
        if current_date.month in [10, 11] and current_date.day in [12, 13, 14, 24, 25]:
            is_festival = True
            fest_name = "Diwali Festive Rush"
            dow_factor *= 1.65
        elif current_date.month in [3, 4] and current_date.day in [18, 19]:
            is_festival = True
            fest_name = "Holi Weekend"
            dow_factor *= 1.40
            
        daily_revenue = round(base_revenue * dow_factor * month_factor * noise, 2)
        transactions = int(daily_revenue / random.uniform(85, 140))
        
        sales.append({
            "date": date_str,
            "revenue_inr": daily_revenue,
            "transactions": transactions,
            "is_festival": is_festival,
            "festival_name": fest_name,
            "day_of_week": current_date.strftime("%A")
        })
    return sales

def generate_customers(merchant_id: str, count: int = 80) -> List[Dict[str, Any]]:
    customers = []
    for i in range(count):
        c_id = f"CUST_{i+1:04d}"
        fname = random.choice(FIRST_NAMES)
        phone = f"+91 98765{i+1:04d}*"
        
        # Churn distribution: 20% at-risk/churned, 50% active regulars, 30% occasional
        r_type = random.random()
        if r_type < 0.20:
            days_ago = random.randint(16, 45)
            past_visits = random.randint(4, 9)
            churn_prob = round(random.uniform(0.68, 0.94), 2)
        elif r_type < 0.70:
            days_ago = random.randint(1, 7)
            past_visits = random.randint(6, 18)
            churn_prob = round(random.uniform(0.05, 0.25), 2)
        else:
            days_ago = random.randint(8, 15)
            past_visits = random.randint(2, 5)
            churn_prob = round(random.uniform(0.30, 0.55), 2)
            
        lifetime_spend = round(past_visits * random.uniform(350, 950), 2)
        cat_type = MERCHANT_CATEGORY_MAP.get(merchant_id, "KIRANA")
        if cat_type == "MOBILE":
            pref_cats = ["Chargers & Cables", "Screen Protectors", "Mobile Covers", "Audio & Earphones", "Power Banks"]
        elif cat_type == "PHARMACY":
            pref_cats = ["Pain & Fever", "Digestive & ORS", "First Aid & Wound", "Vitamins & Minerals", "Cold & Cough"]
        elif cat_type == "SWEETS":
            pref_cats = ["Desi Ghee Sweets", "Fresh Snacks", "Namkeen & Farsan", "Gift Hampers", "Bengali Sweets"]
        elif cat_type == "CAFE":
            pref_cats = ["Chai & Tea", "Bakery & Buns", "Sandwiches", "Street Bites", "Coffee & Coolers"]
        elif cat_type == "APPAREL":
            pref_cats = ["Silk Sarees", "Kurtis & Tunics", "Men's Ethnic", "Dupattas & Stoles", "Dress Material"]
        else:
            pref_cats = ["Dairy", "Snacks & Namkeen", "Edible Oils", "Tea & Coffee", "Flours & Grains"]
        preferred_cat = random.choice(pref_cats)
        
        customers.append({
            "customer_id": c_id,
            "name": f"{fname} ji",
            "phone_masked": phone,
            "days_since_last_visit": days_ago,
            "past_30d_visits": past_visits,
            "total_lifetime_spend_inr": lifetime_spend,
            "churn_probability": churn_prob,
            "preferred_category": preferred_cat,
            "recommended_offer_inr": 20.0 if churn_prob > 0.6 else 10.0
        })
    return customers

def generate_recurring_expenses() -> List[Dict[str, Any]]:
    return [
        {"name": "Shop Monthly Rent", "amount_inr": 16000.0, "day_of_month": 5, "category": "Rent"},
        {"name": "Wholesale Distributor (Sharma & Sons)", "amount_inr": 12500.0, "day_of_month": 8, "category": "Inventory"},
        {"name": "Electricity Bill (UPPCL)", "amount_inr": 3200.0, "day_of_month": 14, "category": "Utilities"},
        {"name": "FMCG Restock Settlement", "amount_inr": 9000.0, "day_of_month": 22, "category": "Inventory"},
        {"name": "Paytm Soundbox + POS Monthly Rental", "amount_inr": 125.0, "day_of_month": 28, "category": "Tech"}
    ]
