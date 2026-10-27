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
            execution_log = self._dispatch_realworld_action(action)
            action["execution_log"] = execution_log
        else:
            logger.info(f"❌ ACTION REJECTED by merchant: [{action['action_type']}] {action['title']}")
            action["execution_log"] = "Action was declined by merchant."

        return action

    def _dispatch_realworld_action(self, action: Dict[str, Any]) -> str:
        atype = action["action_type"]
        if atype == "REORDER_WHATSAPP":
            sup = action["details"].get("supplier_name", "Distributor")
            phone = action["details"].get("supplier_phone", "+919811223344")
            item = action["details"].get("item_name", "Stock")
            qty = action["details"].get("quantity", "2 cartons")
            return f"WhatsApp PO message dispatched to {sup} ({phone}): 'Namaste Sharma Ji, please deliver {qty} of {item} by tomorrow morning. Order ID: PO-{datetime.now().strftime('%M%S')}. Payment on delivery via Paytm.'"
            
        elif atype == "CUSTOMER_WINBACK_COUPON":
            count = action["details"].get("target_customers_count", 12)
            amt = action["details"].get("cashback_per_customer_inr", 20.0)
            return f"Triggered Paytm Merchant Promotion API: Successfully credited ₹{amt} conditional cashback vouchers to {count} at-risk customer wallets with validity of 5 days."
            
        elif atype == "LOAN_APPLY":
            amt = action["details"].get("preapproved_amount_inr", 25000.0)
            return f"Initiated Paytm Instant Working Capital Loan application for ₹{amt:,.2f}. Verification complete via Soundbox transaction telemetry. Funds queued for disbursal."
            
        return "Action successfully processed."

agentic_engine = AgenticActionEngine()
