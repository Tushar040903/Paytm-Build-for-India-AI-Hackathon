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
        return [
            {
                "action_id": f"ACT_{merchant_id}_01",
                "action_type": "REORDER_WHATSAPP",
                "title": "WhatsApp Reorder: 3 Cartons Maggi to Sharma Distributors",
                "description": "Stock is at 20% while weekend demand is predicted 40% above normal. Auto-drafted order ready to dispatch.",
                "details": {
                    "supplier_name": "Sharma Distributors (Wholesale)",
                    "supplier_phone": "+91 9811223344",
                    "item_name": "Maggi 2-Minute Noodles",
                    "quantity": "3 cartons (72 units)",
                    "total_cost_inr": 900.0,
                    "estimated_arrival": "Tomorrow, 11:00 AM"
                },
                "status": "PENDING_APPROVAL",
                "created_at": datetime.now().strftime("%Y-%m-%d %H:%M"),
                "requires_confirmation": True,
                "estimated_roi_inr": 1008.0
            },
            {
                "action_id": f"ACT_{merchant_id}_02",
                "action_type": "CUSTOMER_WINBACK_COUPON",
                "title": "Paytm Win-Back Offer: ₹20 Cashback to 12 Lapsed Regulars",
                "description": "12 regular customers haven't visited in 14+ days. One-tap approval sends instant notification via Paytm app.",
                "details": {
                    "target_customers_count": 12,
                    "cashback_per_customer_inr": 20.0,
                    "min_bill_inr": 150.0,
                    "validity_days": 5,
                    "estimated_spend_lift_inr": 3600.0
                },
                "status": "PENDING_APPROVAL",
                "created_at": datetime.now().strftime("%Y-%m-%d %H:%M"),
                "requires_confirmation": True,
                "estimated_roi_inr": 3360.0
            },
            {
                "action_id": f"ACT_{merchant_id}_03",
                "action_type": "LOAN_APPLY",
                "title": "Paytm Business Loan Pre-Approval: ₹25,000 for Festival Stock",
                "description": "Predictive Cash Flow detected ₹6,000 shortfall on 7th. Pre-approved instant disbursal at 1.1% monthly.",
                "details": {
                    "lending_partner": "Paytm Lending",
                    "preapproved_amount_inr": 25000.0,
                    "tenure_months": 3,
                    "monthly_emi_inr": 8600.0,
                    "processing_time": "Instant to Paytm Payments Bank"
                },
                "status": "PENDING_APPROVAL",
                "created_at": datetime.now().strftime("%Y-%m-%d %H:%M"),
                "requires_confirmation": True,
                "estimated_roi_inr": 8500.0
            }
        ]

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
