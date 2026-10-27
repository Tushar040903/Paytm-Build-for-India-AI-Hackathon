import random
import math
from datetime import datetime, timedelta
from typing import Dict, List, Any

# Fix seed for reproducible high quality synthetic data
random.seed(42)

MERCHANT_NAMES = [
    ("Sharma Kirana & General Store", "Tushar Sharma", "Kirana & Grocery", "Sector 62, Noida", "201301", 28.6280, 77.3649),
    ("Laxmi Provision Store", "Ramesh Gupta", "Kirana & Grocery", "Sector 62, Noida", "201301", 28.6295, 77.3621),
    ("Balaji Super Daily", "Suresh Patel", "Kirana & Grocery", "Sector 62, Noida", "201301", 28.6261, 77.3670),
    ("Gupta Brothers Retail", "Amit Gupta", "Kirana & Grocery", "Sector 62, Noida", "201301", 28.6310, 77.3695),
    ("Aggarwal Sweets & Namkeen", "Pawan Aggarwal", "Fast Food & Snacks", "Sector 62, Noida", "201301", 28.6275, 77.3655),
    ("Chai Point Corner", "Mukesh Yadav", "Fast Food & Snacks", "Sector 62, Noida", "201301", 28.6288, 77.3638),
    ("Sanjeevani Medicos", "Dr. Alok Verma", "Pharmacy & Health", "Sector 62, Noida", "201301", 28.6290, 77.3660),
    ("Sai Mobile & Electronics", "Vikas Singh", "Electronics & Mobile", "Sector 62, Noida", "201301", 28.6270, 77.3680),
    ("Shringar Vastralaya", "Sunita Devi", "Apparel & Garments", "Sector 62, Noida", "201301", 28.6265, 77.3640),
    ("Bhardwaj Mega Mart", "Tushar Bhardwaj", "Kirana & Grocery", "Sector 62, Noida", "201301", 28.6282, 77.3650),
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
    merchants = []
    for idx, (b_name, owner, cat, city, pin, lat, lon) in enumerate(MERCHANT_NAMES):
        m_id = f"PAYTM_M_{1001 + idx}"
        # Set primary demo merchant as M_1001 or M_1010
        merchants.append({
            "merchant_id": m_id,
            "name": owner,
            "business_name": b_name,
            "category": cat,
            "city": city,
            "pincode": pin,
            "latitude": lat,
            "longitude": lon,
            "joined_date": "2023-04-15",
            "paytm_soundbox": True,
            "paytm_postpaid_enabled": True,
            "tier": "Silver" if idx != 9 else "Gold",
            "monthly_gmv": round(random.uniform(95000, 240000), 2),
            "total_transactions_30d": random.randint(1400, 3100)
        })
    return merchants

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
        
        # Base daily revenue ~ 4,500 INR
        base_revenue = 4800.0
        
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
