from fastapi import APIRouter, HTTPException
from backend.app.schemas.api_models import MerchantMindScoreResponse
from backend.app.models.merchantmind_scorer import scorer_engine

router = APIRouter(tags=["MerchantMind Credit Score"])

@router.get("/api/scorer/credit-health/{merchant_id}", response_model=MerchantMindScoreResponse)
@router.get("/api/scorer/{merchant_id}", response_model=MerchantMindScoreResponse)
@router.get("/api/score/{merchant_id}", response_model=MerchantMindScoreResponse)
def get_merchantmind_score(merchant_id: str):
    try:
        return scorer_engine.calculate_score(merchant_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
