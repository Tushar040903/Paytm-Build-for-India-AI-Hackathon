import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    APP_NAME: str = "DukaanSaathi AI"
    APP_TAGLINE: str = "दुकान साथी — हर दुकान का अपना AI Business Copilot"
    VERSION: str = "2.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # AI Partner Keys
    SARVAM_API_KEY: Optional[str] = os.getenv("SARVAM_API_KEY", "")
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY", "")
    
    # Feature Flags
    USE_MOCK_VOICE: bool = True       # Falls back to realistic mock audio synthesis if no Sarvam key
    USE_MOCK_LLM: bool = True         # Falls back to local smart reasoning engine if no Gemini key
    USE_MOCK_VISION: bool = True      # Uses YOLOv8 if model weight exists, else smart synthetic shelf detector
    
    # Paths
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    DATA_DIR: str = os.path.join(BASE_DIR, "data", "storage")
    LOG_DIR: str = os.path.join(os.path.dirname(BASE_DIR), "logs")
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
os.makedirs(settings.DATA_DIR, exist_ok=True)
os.makedirs(settings.LOG_DIR, exist_ok=True)
