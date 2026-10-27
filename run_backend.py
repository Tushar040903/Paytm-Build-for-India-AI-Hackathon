"""
DukaanSaathi AI - Server Launcher
Paytm Build for India AI Hackathon 2026 - Track 1: Merchant Growth AI
"""

import sys
import uvicorn
from backend.app.config import settings
from backend.app.core.logger import logger

def main():
    logger.info("=" * 70)
    logger.info("🏪 DukaanSaathi AI (दुकान साथी) Server Launcher")
    logger.info("🇮🇳 Track 1: Merchant Growth AI | Paytm Build for India 2026")
    logger.info(f"🌐 Host: {settings.HOST}:{settings.PORT}")
    logger.info(f"📊 Dashboard URL: http://localhost:{settings.PORT}")
    logger.info(f"📚 OpenAPI Docs: http://localhost:{settings.PORT}/docs")
    logger.info("=" * 70)

    uvicorn.run(
        "backend.app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )

if __name__ == "__main__":
    main()
