import os
import json
from typing import Dict, List, Any, Optional
from datetime import datetime
from backend.app.core.logger import logger
from backend.app.data.generator import (
    generate_merchants,
    generate_inventory,
    generate_historical_sales,
    generate_customers,
    generate_recurring_expenses,
    MERCHANT_CATEGORY_MAP,
    KIRANA_CATALOG
)

class DataStore:
    """In-memory fast stateful store with JSON file backing for DukaanSaathi AI."""
    
    def __init__(self):
        self.merchants: Dict[str, Dict[str, Any]] = {}
        self.inventory: Dict[str, List[Dict[str, Any]]] = {}
        self.sales_history: Dict[str, List[Dict[str, Any]]] = {}
        self.customers: Dict[str, List[Dict[str, Any]]] = {}
        self.expenses: List[Dict[str, Any]] = []
        self.agentic_actions: Dict[str, List[Dict[str, Any]]] = {}
        self.shelf_scans: Dict[str, List[Dict[str, Any]]] = {}
        self._initialize()

    def _initialize(self):
        logger.info("Initializing DukaanSaathi DataStore with realistic Indian retail data...")
        raw_merchants = generate_merchants()
        self.expenses = generate_recurring_expenses()
        
        for m in raw_merchants:
            m_id = m["merchant_id"]
            self.merchants[m_id] = m
            self.inventory[m_id] = generate_inventory(m_id)
            self.sales_history[m_id] = generate_historical_sales(m_id, days=180)
            self.customers[m_id] = generate_customers(m_id, count=60)
            self.agentic_actions[m_id] = self._create_initial_actions(m_id)
            self.shelf_scans[m_id] = []
            
        logger.info(f"Loaded {len(self.merchants)} merchants and initialized all datasets.")

    def _create_initial_actions(self, merchant_id: str) -> List[Dict[str, Any]]:
        m = self.merchants.get(merchant_id, {})
        cat_type = MERCHANT_CATEGORY_MAP.get(merchant_id, "KIRANA")
        daily_sales = float(m.get("avg_daily_sales_inr", 15000.0))
        monthly_gmv = daily_sales * 30.0
        score = int(m.get("merchantmind_score", 742))
        
        # Pull real at-risk customer count from generated customers
        custs = self.customers.get(merchant_id, [])
        at_risk_count = sum(1 for c in custs if c.get("churn_probability", 0) > 0.6) or 8
        
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M")
        actions = []
        
        # Action 1: Category-Specific WhatsApp Supplier Reorder PO
        if cat_type == "MOBILE":
            reorder_title_en = "WhatsApp Reorder: 25 Units 65W Fast Chargers to Patna Electronics Dist."
            reorder_title_hi = "व्हाट्सएप ऑर्डर: 25 यूनिट 65W GaN चार्जर (पटना इलेक्ट्रॉनिक्स डिपो)"
            reorder_desc_en = "Stock is down to 20% while weekend demand is forecast +42% higher. 1-click PO drafted for instant WhatsApp dispatch."
            reorder_desc_hi = "स्टॉक 20% पर आ गया है जबकि सप्ताहांत में मांग 42% अधिक रहने का अनुमान है। होलसेलर के लिए पर्चा तैयार है।"
            sup_name = "Patna Electronics & Accessories Wholesalers"
            sup_phone = "+91 98350 12345"
            item_name = "65W GaN Fast Charger (Type-C)"
            qty = "25 units"
            cost = 8750.0
            roi_inr = 14250.0
            roi_str_en = "₹5,500 Gross Margin (63% ROI)"
            roi_str_hi = "₹5,500 शुद्ध मुनाफा (63% ROI)"
        elif cat_type == "PHARMACY":
            reorder_title_en = "WhatsApp Reorder: 50 Strips Dolo 650mg & Ayurvedic Kadha to Varanasi Pharma"
            reorder_title_hi = "व्हाट्सएप ऑर्डर: 50 स्ट्रिप डोलो 650mg व काढ़ा (वाराणसी फार्मा डिपो)"
            reorder_desc_en = "Seasonal viral surge driving high OTC turnover. Restock PO drafted for same-day delivery."
            reorder_desc_hi = "मौसमी बुखार के कारण दवाओं की मांग में तेज़ी है। शेल्फ 100% भरने हेतु व्हाट्सएप चालान तैयार है।"
            sup_name = "Varanasi Pharma & Surgicals Dist."
            sup_phone = "+91 94150 23456"
            item_name = "Dolo 650mg Paracetamol & Herbal Kadha"
            qty = "50 strips + 25 bottles"
            cost = 4800.0
            roi_inr = 7200.0
            roi_str_en = "₹2,400 OTC Margin (50% ROI)"
            roi_str_hi = "₹2,400 शुद्ध मुनाफा (50% ROI)"
        elif cat_type == "SWEETS":
            reorder_title_en = "WhatsApp Reorder: 15kg Pure Desi Ghee & Cashews to Jaipur Mandi Wholesalers"
            reorder_title_hi = "व्हाट्सएप ऑर्डर: 15 किग्रा देसी घी व काजू (जयपुर मंडी सप्लायर्स)"
            reorder_desc_en = "Festive sweet batch production surge expected this weekend. Urgent raw material restock drafted."
            reorder_desc_hi = "त्योहारी काजू कतली और लड्डू उत्पादन के लिए कच्चा माल कम हो रहा है। 1-क्लिक में सप्लायर को पर्चा भेजें।"
            sup_name = "Jaipur Mandi Dairy & Dry Fruits Wholesalers"
            sup_phone = "+91 94140 34567"
            item_name = "Pure Desi Ghee & Premium Cashews (Kaju)"
            qty = "15kg Ghee + 10kg Kaju"
            cost = 14500.0
            roi_inr = 22800.0
            roi_str_en = "₹8,300 Margin (57% ROI)"
            roi_str_hi = "₹8,300 शुद्ध मुनाफा (57% ROI)"
        elif cat_type == "CAFE":
            reorder_title_en = "WhatsApp Reorder: 10kg Amul Butter & Tea Leaves to Metro Food Supply"
            reorder_title_hi = "व्हाट्सएप ऑर्डर: 10 किग्रा अमूल बटर व चायपत्ती (साइबर सिटी डेयरी सप्लायर्स)"
            reorder_desc_en = "Corporate breakfast tea and bun maska demand up 44%. Early morning restock order ready to dispatch."
            reorder_desc_hi = "कार्यालय कर्मचारियों में कुल्हड़ चाय और बन मस्का की मांग 44% बढ़ी है। सुबह की डिलीवरी के लिए आर्डर तैयार।"
            sup_name = "Gurugram Metro Dairy & Food Supply"
            sup_phone = "+91 98120 45678"
            item_name = "Amul Table Butter Blocks & Assam Tea Leaves"
            qty = "10kg Butter + 5kg Tea Leaves"
            cost = 4600.0
            roi_inr = 8400.0
            roi_str_en = "₹3,800 Breakfast Margin (82% ROI)"
            roi_str_hi = "₹3,800 शुद्ध मुनाफा (82% ROI)"
        elif cat_type == "APPAREL":
            reorder_title_en = "WhatsApp Reorder: 12 Pure Banarasi Silk Sarees to Lucknow Handloom Depot"
            reorder_title_hi = "व्हाट्सएप ऑर्डर: 12 बनारसी जरी सिल्क साड़ियां (लखनऊ हैंडलूम डिपो)"
            reorder_desc_en = "Bridal wedding rush driving high margin saree turnover. Direct artisan handloom restock drafted."
            reorder_desc_hi = "लगन व शादी सीज़न के कारण बनारसी साड़ियों की भारी मांग। थोक बुनकर डिपो को आर्डर भेजने के लिए तैयार।"
            sup_name = "Lucknow Silk & Handloom Mills Depot"
            sup_phone = "+91 94500 56789"
            item_name = "Pure Banarasi Silk Zari Saree"
            qty = "12 sarees"
            cost = 26400.0
            roi_inr = 42000.0
            roi_str_en = "₹15,600 Bridal Margin (59% ROI)"
            roi_str_hi = "₹15,600 शुद्ध मुनाफा (59% ROI)"
        elif merchant_id in ["PAYTM_M_1003", "PAYTM_M_1010"]:
            reorder_title_en = "WhatsApp Reorder: Cold-Pressed Oils & Gourmet Snacks to Metro Cash & Carry"
            reorder_title_hi = "व्हाट्सएप ऑर्डर: कोल्ड-प्रेस्ड ऑयल व प्रीमियम स्नैक्स (मेट्रो कैश एंड कैरी)"
            reorder_desc_en = "Weekend basket demand for high-margin organic oils and gourmet snacks. 1-click PO ready."
            reorder_desc_hi = "प्रीमियम ग्राहकों द्वारा ऑर्गेनिक तेल और इम्पोर्टेड स्नैक्स की सप्ताहांत टोकरी खरीदारी हेतु रीस्टॉक चालान।"
            sup_name = "Metro Cash & Carry Wholesale FMCG"
            sup_phone = "+91 98100 87654"
            item_name = "Cold-Pressed Mustard Oil & Imported Snacks"
            qty = "40 units Oils + 60 packs Snacks"
            cost = 28500.0
            roi_inr = 39500.0
            roi_str_en = "₹11,000 FMCG Margin (38% ROI)"
            roi_str_hi = "₹11,000 शुद्ध मुनाफा (38% ROI)"
        else: # Kirana
            reorder_title_en = "WhatsApp Reorder: 3 Cartons Maggi & Parle-G to Sharma Distributors"
            reorder_title_hi = "व्हाट्सएप ऑर्डर: 3 कार्टन मैगी व पारले-जी (शर्मा डिस्ट्रीब्यूटर्स)"
            reorder_desc_en = "Fast-moving staples down to reorder point with high weekend velocity. WhatsApp message ready."
            reorder_desc_hi = "मैगी और बिस्कुट का स्टॉक 20% पर है। सप्ताहांत में मांग सामान्य से 40% अधिक रहने का अनुमान है।"
            sup_name = "Sharma Distributors (Wholesale FMCG)"
            sup_phone = "+91 98112 23344"
            item_name = "Maggi 2-Minute Noodles & Parle-G Gold"
            qty = "3 cartons Maggi + 2 cartons Parle-G"
            cost = 1850.0
            roi_inr = 2450.0
            roi_str_en = "₹600 Fast-FMCG Lift (32% ROI)"
            roi_str_hi = "₹600 त्वरित मुनाफा (32% ROI)"

        actions.append({
            "action_id": f"ACT_{merchant_id}_01",
            "action_type": "REORDER_WHATSAPP",
            "action_type_hi": "सप्लायर आर्डर (WhatsApp)",
            "action_type_en": "Supplier Reorder (WhatsApp)",
            "title": reorder_title_en,
            "title_hi": reorder_title_hi,
            "title_en": reorder_title_en,
            "description": reorder_desc_en,
            "description_hi": reorder_desc_hi,
            "description_en": reorder_desc_en,
            "priority": "HIGH",
            "priority_hi": "अति आवश्यक (HIGH)",
            "priority_en": "HIGH URGENT",
            "details": {
                "supplier_name": sup_name,
                "supplier_phone": sup_phone,
                "item_name": item_name,
                "quantity": qty,
                "total_cost_inr": cost,
                "estimated_arrival": "Tomorrow, 10:30 AM"
            },
            "status": "PENDING_APPROVAL",
            "created_at": now_str,
            "requires_confirmation": True,
            "estimated_roi_inr": roi_inr,
            "expected_roi": roi_str_en,
            "expected_roi_hi": roi_str_hi,
            "expected_roi_en": roi_str_en
        })

        # Action 2: Tailored Win-Back Campaign for Live At-Risk Customers
        spend_lift = at_risk_count * 280.0
        voucher_cost = at_risk_count * 20.0
        net_roi = spend_lift - voucher_cost
        wb_title_en = f"Paytm Win-Back Offer: ₹20 Cashback to {at_risk_count} Lapsed Regulars"
        wb_title_hi = f"पेटीएम विन-बैक ऑफर: छूटे हुए {at_risk_count} पक्के ग्राहकों को ₹20 कैशबैक वाउचर"
        wb_desc_en = f"{at_risk_count} regular customers haven't visited in 14+ days. One-tap approval delivers instant ₹20 cashback voucher to their Paytm app."
        wb_desc_hi = f"दुकान के {at_risk_count} पक्के ग्राहक 14+ दिनों से नहीं आए हैं। 1-क्लिक में उनके फोन पर ₹20 का कैशबैक वाउचर डिलीवर होगा।"

        actions.append({
            "action_id": f"ACT_{merchant_id}_02",
            "action_type": "CUSTOMER_WINBACK_COUPON",
            "action_type_hi": "ग्राहक विन-बैक (Paytm)",
            "action_type_en": "Customer Retention (Paytm)",
            "title": wb_title_en,
            "title_hi": wb_title_hi,
            "title_en": wb_title_en,
            "description": wb_desc_en,
            "description_hi": wb_desc_hi,
            "description_en": wb_desc_en,
            "priority": "HIGH",
            "priority_hi": "अति आवश्यक (HIGH)",
            "priority_en": "HIGH IMPACT",
            "details": {
                "target_customers_count": at_risk_count,
                "cashback_per_customer_inr": 20.0,
                "min_bill_inr": 150.0,
                "validity_days": 5,
                "estimated_spend_lift_inr": spend_lift
            },
            "status": "PENDING_APPROVAL",
            "created_at": now_str,
            "requires_confirmation": True,
            "estimated_roi_inr": net_roi,
            "expected_roi": f"+₹{net_roi:,.0f} Spend Lift",
            "expected_roi_hi": f"+₹{net_roi:,.0f} बिक्री बढ़ोतरी",
            "expected_roi_en": f"+₹{net_roi:,.0f} Spend Lift"
        })

        # Action 3: Financial Action (Working Capital Loan vs Early Vendor Cash Discount)
        if score >= 800:
            disc_amt = round(daily_sales * 0.18 / 500) * 500
            inv_amt = round(daily_sales * 3.5 / 1000) * 1000
            actions.append({
                "action_id": f"ACT_{merchant_id}_03",
                "action_type": "SUPPLIER_DISCOUNT",
                "action_type_hi": "सप्लायर छूट (Early Settlement)",
                "action_type_en": "Vendor Cash Discount",
                "title": f"Supplier Consignment Early Payment: Capture ₹{disc_amt:,.0f} Cash Discount",
                "title_hi": f"थोक चालान पर ₹{disc_amt:,.0f} नकद छूट: सप्लायर को 5 दिन पहले भुगतान करें",
                "title_en": f"Supplier Consignment Early Payment: Capture ₹{disc_amt:,.0f} Cash Discount",
                "description": f"Healthy cash surplus allows early payment of ₹{inv_amt:,.0f} shipment, securing ₹{disc_amt:,.0f} instant cash savings.",
                "description_hi": f"दुकान में पर्याप्त नकदी सरप्लस है। ₹{inv_amt:,.0f} के थोक चालान का 5 दिन पहले भुगतान करके ₹{disc_amt:,.0f} की सीधी नकद बचत लॉक करें।",
                "description_en": f"Healthy cash surplus allows early payment of ₹{inv_amt:,.0f} shipment, securing ₹{disc_amt:,.0f} instant cash savings.",
                "priority": "MEDIUM",
                "priority_hi": "सुझाव (MEDIUM)",
                "priority_en": "SUGGESTION",
                "details": {
                    "supplier_name": sup_name,
                    "invoice_amount_inr": inv_amt,
                    "cash_discount_inr": disc_amt,
                    "days_ahead": 5
                },
                "status": "PENDING_APPROVAL",
                "created_at": now_str,
                "requires_confirmation": True,
                "estimated_roi_inr": disc_amt,
                "expected_roi": f"₹{disc_amt:,.0f} Direct Cash Savings",
                "expected_roi_hi": f"₹{disc_amt:,.0f} सीधी नकद बचत",
                "expected_roi_en": f"₹{disc_amt:,.0f} Direct Cash Savings"
            })
        else:
            loan_amt = max(15000.0, min(80000.0, round((monthly_gmv * 0.18) / 5000.0) * 5000))
            emi_amt = round(loan_amt / 3.0 * 1.025)
            actions.append({
                "action_id": f"ACT_{merchant_id}_03",
                "action_type": "LOAN_APPLY",
                "action_type_hi": "पेटीएम लोन (Working Capital)",
                "action_type_en": "Paytm Working Capital",
                "title": f"Paytm Business Loan Pre-Approval: ₹{loan_amt:,.0f} Working Capital Disbursal",
                "title_hi": f"पेटीएम बिज़नेस लोन स्वीकृति: ₹{loan_amt:,.0f} तुरंत मर्चेंट वॉलेट में प्राप्त करें",
                "title_en": f"Paytm Business Loan Pre-Approval: ₹{loan_amt:,.0f} Working Capital Disbursal",
                "description": f"Pre-approved instant disbursal based on daily Soundbox UPI volume to bridge supplier invoices without cash strain.",
                "description_hi": f"साउंडबॉक्स दैनिक लेनदेन के आधार पर बिना किसी कागजी कार्रवाई ₹{loan_amt:,.0f} का लोन तुरंत स्वीकृत है।",
                "description_en": f"Pre-approved instant disbursal based on daily Soundbox UPI volume to bridge supplier invoices without cash strain.",
                "priority": "HIGH" if score < 700 else "MEDIUM",
                "priority_hi": "अति आवश्यक (HIGH)" if score < 700 else "सुझाव (MEDIUM)",
                "priority_en": "HIGH URGENT" if score < 700 else "SUGGESTION",
                "details": {
                    "lending_partner": "Paytm Lending",
                    "preapproved_amount_inr": loan_amt,
                    "tenure_months": 3,
                    "monthly_emi_inr": emi_amt,
                    "processing_time": "Instant to Paytm Payments Bank"
                },
                "status": "PENDING_APPROVAL",
                "created_at": now_str,
                "requires_confirmation": True,
                "estimated_roi_inr": loan_amt * 0.25,
                "expected_roi": f"₹{loan_amt:,.0f} Working Capital Liquidity",
                "expected_roi_hi": f"₹{loan_amt:,.0f} कार्यशील पूंजी",
                "expected_roi_en": f"₹{loan_amt:,.0f} Working Capital Liquidity"
            })

        # Action 4: Hyperlocal Festive & Demand Promotion
        if cat_type == "MOBILE":
            p_title_en = "Festive Bundle Promotion: 65W Charger + Braided Cable with ₹50 Cashback"
            p_title_hi = "त्योहारी कॉम्बो प्रचार: 65W चार्जर + केबल पर ₹50 कैशबैक ऑफर चालू करें"
            p_desc_en = "Activate ₹50 festive cashback voucher on Soundbox for high-margin charger bundles. Broadcasts on Paytm app within 2km."
            p_desc_hi = "साउंडबॉक्स पर ₹50 कैशबैक का कॉम्बो ऑफर लगाकर 2 किमी दायरे के ग्राहकों को आकर्षित करें।"
            p_roi = 18500.0
        elif cat_type == "SWEETS":
            p_title_en = "Diwali Kaju Katli Advance Booking: 5% Early-Bird Paytm QR Cashback"
            p_title_hi = "दीवाली काजू कतली एडवांस बुकिंग: 5% अर्ली-बर्ड क्यूआर कैशबैक सक्रिय करें"
            p_desc_en = "Enable QR advance token booking for corporate & family Diwali boxes to lock festival revenue in advance."
            p_desc_hi = "पेटीएम क्यूआर से एडवांस काजू कतली डिब्बों की बुकिंग पर 5% कैशबैक देकर पहले से ऑर्डर पक्के करें।"
            p_roi = 45000.0
        elif cat_type == "CAFE":
            p_title_en = "Corporate Weekly Chai Pass: 10% Extra Balance with Soundbox Tap-Pay"
            p_title_hi = "पेटीएम कॉर्पोरेट चाय पास: 10% अतिरिक्त बैलेंस के साथ वीकली पास सक्रिय करें"
            p_desc_en = "Offer ₹250 weekly tea passes to nearby office teams with zero-waiting tap-and-pay Soundbox billing."
            p_desc_hi = "ऑफिस कर्मचारियों के लिए ₹250 का साप्ताहिक चाय पास बेचें और साउंडबॉक्स से बिना लाइन त्वरित भुगतान लें।"
            p_roi = 22000.0
        elif cat_type == "APPAREL":
            p_title_en = "Bridal Wear 0% Postpaid EMI Financing Promotion on Soundbox"
            p_title_hi = "वेडिंग सिल्क साड़ी पर 0% आसान किस्त (पेटीएम पोस्टपेड प्रचार सक्रिय करें)"
            p_desc_en = "Enable 3-month split payments for bridal sarees above ₹5,000 on Paytm Postpaid to boost high-ticket sales."
            p_desc_hi = "₹5,000 से ऊपर की साड़ियों पर 3 महीने की आसान पेटीएम पोस्टपेड किस्त देकर बड़ा बिल बनाएं।"
            p_roi = 38000.0
        else:
            p_title_en = "Weekend Breakfast & Fasting Combo: Special ₹220 Essentials Kit Promo"
            p_title_hi = "सप्ताहांत व त्योहारी राशन कॉम्बो: ₹220 स्पेशल बचत किट का प्रचार सक्रिय करें"
            p_desc_en = "Pre-bundle fast-moving essentials (Atta + Ghee + Tea) on Paytm App and Soundbox counter display."
            p_desc_hi = "आटा, घी और चायपत्ती का ₹220 कॉम्बो पैक बनाकर साउंडबॉक्स पर स्पेशल डिस्काउंट प्रचार चालू करें।"
            p_roi = 16500.0

        actions.append({
            "action_id": f"ACT_{merchant_id}_04",
            "action_type": "FESTIVE_PROMOTION",
            "action_type_hi": "त्योहारी प्रचार (Local Promo)",
            "action_type_en": "Hyperlocal Festive Promo",
            "title": p_title_en,
            "title_hi": p_title_hi,
            "title_en": p_title_en,
            "description": p_desc_en,
            "description_hi": p_desc_hi,
            "description_en": p_desc_en,
            "priority": "MEDIUM",
            "priority_hi": "सुझाव (MEDIUM)",
            "priority_en": "SUGGESTION",
            "details": {
                "offer_name": p_title_en,
                "channel": "Paytm Consumer App & Soundbox Broadcast",
                "radius_km": 2.0
            },
            "status": "PENDING_APPROVAL",
            "created_at": now_str,
            "requires_confirmation": True,
            "estimated_roi_inr": p_roi,
            "expected_roi": f"+₹{p_roi:,.0f} Extra Sales",
            "expected_roi_hi": f"+₹{p_roi:,.0f} अतिरिक्त बिक्री",
            "expected_roi_en": f"+₹{p_roi:,.0f} Extra Sales"
        })

        return actions

    def get_merchant(self, merchant_id: str) -> Optional[Dict[str, Any]]:
        return self.merchants.get(merchant_id)

    def get_all_merchants(self) -> List[Dict[str, Any]]:
        return list(self.merchants.values())

    def get_inventory(self, merchant_id: str) -> List[Dict[str, Any]]:
        return self.inventory.get(merchant_id, [])

    def get_sales_history(self, merchant_id: str) -> List[Dict[str, Any]]:
        return self.sales_history.get(merchant_id, [])

    def get_customers(self, merchant_id: str) -> List[Dict[str, Any]]:
        return self.customers.get(merchant_id, [])

    def get_expenses(self) -> List[Dict[str, Any]]:
        return self.expenses

    def get_actions(self, merchant_id: str) -> List[Dict[str, Any]]:
        return self.agentic_actions.get(merchant_id, [])

    def update_action_status(self, merchant_id: str, action_id: str, approved: bool) -> Optional[Dict[str, Any]]:
        actions = self.agentic_actions.get(merchant_id, [])
        for act in actions:
            if act["action_id"] == action_id:
                act["status"] = "EXECUTED" if approved else "REJECTED"
                act["resolved_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                return act
        return None

    def add_shelf_scan(self, merchant_id: str, scan_data: Dict[str, Any]):
        if merchant_id not in self.shelf_scans:
            self.shelf_scans[merchant_id] = []
        self.shelf_scans[merchant_id].insert(0, scan_data)

# Singleton global instance
db = DataStore()
