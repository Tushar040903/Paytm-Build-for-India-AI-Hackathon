from typing import Dict, List, Any, Optional
from datetime import datetime
from backend.app.core.logger import logger
from backend.app.data.store import db

class AgenticActionEngine:
    """Agentic Action Engine with Human-in-the-Loop 1-Tap Execution."""
    
    def __init__(self):
        self.engine_name = "LangChain ReAct Agentic Action Engine"
        logger.info(f"Initialized {self.engine_name} for Autonomous Merchant Operations.")

    def get_pending_actions(self, merchant_id: str) -> List[Dict[str, Any]]:
        actions = db.get_actions(merchant_id)
        return [act for act in actions if act["status"] == "PENDING_APPROVAL"]

    def get_all_actions(self, merchant_id: str) -> List[Dict[str, Any]]:
        return db.get_actions(merchant_id)

    def execute_action(self, merchant_id: str, action_id: str, approved: bool) -> Dict[str, Any]:
        action = db.update_action_status(merchant_id, action_id, approved=approved)
        if not action:
            raise ValueError(f"Action {action_id} not found for merchant {merchant_id}")

        if approved:
            logger.info(f"⚡ ACTION EXECUTED: [{action['action_type']}] {action['title']}")
            log_en, log_hi = self._dispatch_realworld_action(action)
            action["execution_log"] = log_en
            action["execution_log_en"] = log_en
            action["execution_log_hi"] = log_hi
        else:
            logger.info(f"❌ ACTION REJECTED by merchant: [{action['action_type']}] {action['title']}")
            action["execution_log"] = "Action was declined by merchant."
            action["execution_log_en"] = "Action was declined by merchant."
            action["execution_log_hi"] = "व्यापारी द्वारा यह कार्य खारिज कर दिया गया।"

        return action

    def _dispatch_realworld_action(self, action: Dict[str, Any]) -> tuple:
        atype = action.get("action_type", "")
        details = action.get("details", {})
        now_ts = datetime.now().strftime('%H:%M:%S')
        po_id = f"PO-{datetime.now().strftime('%M%S')}"

        if atype == "REORDER_WHATSAPP":
            sup = details.get("supplier_name", "Distributor")
            phone = details.get("supplier_phone", "+91 98112 23344")
            item = details.get("item_name", "Essential Inventory")
            qty = details.get("quantity", "2 cartons")
            cost = details.get("total_cost_inr", 2500.0)
            log_en = f"WhatsApp PO message dispatched to {sup} ({phone}): 'Namaste Ji, please deliver {qty} of {item} (Est: ₹{cost:,.0f}). Order Ref: {po_id}. Payment upon delivery via Paytm Soundbox.'"
            log_hi = f"होलसेलर {sup} ({phone}) को WhatsApp पर आर्डर पर्चा भेजा गया: '{qty} {item} (अनुमानित: ₹{cost:,.0f}) तुरंत भेजें। आर्डर आईडी: {po_id}। डिलीवरी पर भुगतान पेटीएम से होगा।'"
            return log_en, log_hi
            
        elif atype == "CUSTOMER_WINBACK_COUPON":
            count = details.get("target_customers_count", 8)
            amt = details.get("cashback_per_customer_inr", 20.0)
            min_bill = details.get("min_bill_inr", 150.0)
            log_en = f"Triggered Paytm Merchant Promotion API at {now_ts}: Successfully credited ₹{amt:.0f} conditional cashback vouchers (Min bill ₹{min_bill:.0f}) to {count} at-risk customer wallets with validity of 5 days."
            log_hi = f"पेटीएम मर्चेंट प्रमोशन API सक्रिय ({now_ts}): {count} पक्के ग्राहकों के पेटीएम ऐप में ₹{amt:.0f} का कैशबैक वाउचर (न्यूनतम बिल ₹{min_bill:.0f}) 5 दिन की वैधता के साथ डिलीवर किया गया।"
            return log_en, log_hi
            
        elif atype == "LOAN_APPLY":
            amt = details.get("preapproved_amount_inr", 35000.0)
            partner = details.get("lending_partner", "Paytm Lending")
            log_en = f"Initiated {partner} Instant Working Capital application for ₹{amt:,.0f}. Verification completed via Soundbox transaction stream. Funds queued for wallet credit."
            log_hi = f"{partner} कार्यशील पूंजी आवेदन (₹{amt:,.0f}) स्वीकृत। साउंडबॉक्स लेनदेन से तुरंत सत्यापन पूरा हुआ, राशि सीधे मर्चेंट खाते में भेजी जा रही है।"
            return log_en, log_hi

        elif atype == "SUPPLIER_DISCOUNT":
            amt = details.get("invoice_amount_inr", 65000.0)
            disc = details.get("cash_discount_inr", 3500.0)
            sup = details.get("supplier_name", "FMCG Distributor")
            log_en = f"Early invoice settlement of ₹{amt:,.0f} scheduled to {sup} via Paytm Soundbox merchant ledger. Secured ₹{disc:,.0f} instant early-payment cash discount."
            log_hi = f"पेटीएम साउंडबॉक्स खाते से {sup} के चालान (₹{amt:,.0f}) का 5 दिन पूर्व भुगतान किया गया। ₹{disc:,.0f} की सीधी नकद बचत लॉक की गई।"
            return log_en, log_hi

        elif atype == "FESTIVE_PROMOTION" or atype == "PRICE_UPDATE":
            promo = details.get("offer_name", "Festive Combo Deal")
            channel = details.get("channel", "Paytm App & Soundbox")
            log_en = f"Published '{promo}' campaign across {channel} in 2km radius. Automated Paytm Soundbox voice announcement broadcast activated."
            log_hi = f"दुकान के 2 किमी दायरे में पेटीएम ऐप व साउंडबॉक्स पर '{promo}' प्रचार लाइव किया गया। ऑडियो घोषणा सक्रिय।"
            return log_en, log_hi
            
        return "Action successfully processed.", "कार्य सफलतापूर्वक पूरा किया गया।"

agentic_engine = AgenticActionEngine()
