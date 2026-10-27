from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from backend.app.data.store import db
from backend.app.schemas.api_models import MerchantProfile, MerchantKPIs
from backend.app.models.merchantmind_scorer import scorer_engine
from backend.app.models.cashflow_predictor import cashflow_engine

router = APIRouter(prefix="/api/merchants", tags=["Merchants"])

@router.get("/", response_model=List[MerchantProfile])
def list_merchants():
    return db.get_all_merchants()

@router.get("/{merchant_id}", response_model=MerchantProfile)
def get_merchant(merchant_id: str):
    m = db.get_merchant(merchant_id)
    if not m:
        raise HTTPException(status_code=404, detail="Merchant not found")
    return m

@router.get("/{merchant_id}/kpis", response_model=MerchantKPIs)
def get_merchant_kpis(merchant_id: str):
    m = db.get_merchant(merchant_id)
    if not m:
        raise HTTPException(status_code=404, detail="Merchant not found")
        
    sales = db.get_sales_history(merchant_id)
    today_rev = sales[-1]["revenue_inr"] if sales else 5200.0
    yest_rev = sales[-2]["revenue_inr"] if len(sales) >= 2 else 4800.0
    week_rev = sum(s["revenue_inr"] for s in sales[-7:]) if len(sales) >= 7 else 36000.0
    month_rev = sum(s["revenue_inr"] for s in sales[-30:]) if len(sales) >= 30 else 145000.0
    
    score_data = scorer_engine.calculate_score(merchant_id)
    cf_data = cashflow_engine.project_cashflow(merchant_id)
    actions = db.get_actions(merchant_id)
    pending_count = sum(1 for a in actions if a["status"] == "PENDING_APPROVAL")
    
    customers = db.get_customers(merchant_id)
    at_risk_count = sum(1 for c in customers if c["churn_probability"] > 0.6)

    return {
        "today_revenue": today_rev,
        "yesterday_revenue": yest_rev,
        "week_revenue": round(week_rev, 2),
        "month_revenue": round(month_rev, 2),
        "top_selling_item": "Maggi 2-Minute Masala Noodles",
        "active_customers_count": len(customers) - at_risk_count,
        "at_risk_customers_count": at_risk_count,
        "pending_actions_count": pending_count,
        "merchantmind_score": score_data["total_score"],
        "cash_shortfall_risk": cf_data["crunch_alert"] is not None
    }
