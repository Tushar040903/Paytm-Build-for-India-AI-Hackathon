from fastapi import APIRouter, HTTPException
from backend.app.schemas.api_models import VoiceQueryRequest, VoiceQueryResponse
from backend.app.models.voice_copilot import voice_copilot

router = APIRouter(prefix="/api/copilot", tags=["Voice Copilot"])

@router.post("/query", response_model=VoiceQueryResponse)
def copilot_query(payload: VoiceQueryRequest):
    try:
        return voice_copilot.process_query(
            merchant_id=payload.merchant_id,
            text_query=payload.text_query,
            audio_base64=payload.audio_base64,
            language=payload.language
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
