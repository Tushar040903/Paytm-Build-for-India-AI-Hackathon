from fastapi import APIRouter, HTTPException
from backend.app.schemas.api_models import CustomerRetentionResponse
from backend.app.models.customer_retention import retention_engine

router = APIRouter(prefix="/api/retention", tags=["Customer Retention"])

@router.get("/insights/{merchant_id}", response_model=CustomerRetentionResponse)
@router.get("/{merchant_id}", response_model=CustomerRetentionResponse)
def get_customer_retention(merchant_id: str):
    try:
        return retention_engine.analyze_retention(merchant_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
