from fastapi import APIRouter, HTTPException, Query
from backend.app.schemas.api_models import DemandForecastResponse
from backend.app.models.demand_forecaster import demand_engine

router = APIRouter(prefix="/api/demand", tags=["Demand Forecasting"])

@router.get("/forecast/{merchant_id}", response_model=DemandForecastResponse)
@router.get("/{merchant_id}", response_model=DemandForecastResponse)
def get_demand_forecast(merchant_id: str, horizon_days: int = Query(default=7, ge=1, le=14), horizon: int = Query(default=7)):
    try:
        h = horizon_days if horizon_days != 7 else horizon
        return demand_engine.predict_demand(merchant_id, horizon_days=h)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
