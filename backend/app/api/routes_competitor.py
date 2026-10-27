from fastapi import APIRouter, HTTPException
from backend.app.schemas.api_models import CompetitorRadarResponse
from backend.app.models.competitor_radar import competitor_radar

router = APIRouter(prefix="/api/competitor", tags=["Competitor Radar"])

@router.get("/radar/{merchant_id}", response_model=CompetitorRadarResponse)
@router.get("/{merchant_id}", response_model=CompetitorRadarResponse)
def get_competitor_radar(merchant_id: str):
    try:
        return competitor_radar.scan_neighborhood(merchant_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
