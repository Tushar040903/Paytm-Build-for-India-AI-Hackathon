from fastapi import APIRouter, HTTPException, Query
from backend.app.schemas.api_models import CashFlowResponse
from backend.app.models.cashflow_predictor import cashflow_engine

router = APIRouter(prefix="/api/cashflow", tags=["Cash Flow Predictor"])

@router.get("/projection/{merchant_id}", response_model=CashFlowResponse)
@router.get("/{merchant_id}", response_model=CashFlowResponse)
def get_cash_flow(merchant_id: str, days: int = Query(default=30, ge=7, le=60)):
    try:
        return cashflow_engine.project_cashflow(merchant_id, days=days)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
