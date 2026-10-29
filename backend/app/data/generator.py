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
        "category": "सुपरमार्केट व एफएमसीजी (Supermarket)",
        "city": "इंदिरानगर, बेंगलुरु (Bengaluru)",
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

FIRST_NAMES = ["Amit", "Rahul", "Pooja", "Sunil", "Anjali", "Deepak", "Sneha", "Karan", "Priya", "Manoj",
               "Neeraj", "Rohit", "Kavita", "Sanjay", "Ritu", "Mohit", "Aakash", "Geeta", "Vikram", "Shweta"]

def generate_merchants() -> List[Dict[str, Any]]:
    return [dict(m) for m in MERCHANT_PROFILES]

def generate_inventory(merchant_id: str) -> List[Dict[str, Any]]:
    items = []
    for idx, prod in enumerate(KIRANA_CATALOG):
        item_id = f"ITEM_{idx+1:03d}"
        daily = prod["daily_base"]
        
        # Make a couple critical for demo purposes (e.g. Maggi and Kurkure)
        if prod["name"].startswith("Maggi"):
            current = int(daily * 0.8) # Low stock
            status = "low"
        elif prod["name"].startswith("Kurkure"):
            current = 0 # Out of stock
            status = "critical"
        elif prod["name"].startswith("Organic Sharbati"):
            current = int(daily * 1.5)
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
        preferred_cat = random.choice(["Dairy", "Snacks & Namkeen", "Edible Oils", "Tea & Coffee", "Flours & Grains"])
        
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
