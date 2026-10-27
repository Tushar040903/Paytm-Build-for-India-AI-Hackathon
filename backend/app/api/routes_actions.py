from fastapi import APIRouter, HTTPException, Query, Body, Path
from typing import List, Dict, Any, Optional
from backend.app.schemas.api_models import AgenticAction, ActionApprovalRequest
from backend.app.models.agentic_action_engine import agentic_engine

router = APIRouter(prefix="/api/actions", tags=["Agentic Actions"])

@router.get("/pending/{merchant_id}", response_model=List[AgenticAction])
@router.get("/{merchant_id}", response_model=List[AgenticAction])
def get_actions(merchant_id: str):
    return agentic_engine.get_pending_actions(merchant_id)

@router.post("/approve")
def approve_action_query(
    merchant_id: str = Query(default="PAYTM_M_1001"),
    action_id: Optional[str] = Query(default=None),
    approved: bool = Query(default=True),
    payload: Optional[ActionApprovalRequest] = Body(default=None)
):
    try:
        final_action_id = action_id
        final_approved = approved
        if payload:
            final_action_id = payload.action_id
            final_approved = payload.approved
            
        if not final_action_id:
            raise HTTPException(status_code=400, detail="action_id must be provided")

        return agentic_engine.execute_action(merchant_id, final_action_id, approved=final_approved)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/{merchant_id}/approve")
def approve_action_path(
    merchant_id: str = Path(...),
    payload: ActionApprovalRequest = Body(...)
):
    try:
        return agentic_engine.execute_action(merchant_id, payload.action_id, approved=payload.approved)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
