import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from backend.app.config import settings
from backend.app.core.logger import logger

# Import API Routers
from backend.app.api.routes_merchant import router as merchant_router
from backend.app.api.routes_demand import router as demand_router
from backend.app.api.routes_inventory import router as inventory_router
from backend.app.api.routes_retention import router as retention_router
from backend.app.api.routes_cashflow import router as cashflow_router
from backend.app.api.routes_scorer import router as scorer_router
from backend.app.api.routes_competitor import router as competitor_router
from backend.app.api.routes_actions import router as actions_router
from backend.app.api.routes_voice_copilot import router as copilot_router

# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="DukaanSaathi AI (दुकान साथी) — The AI Business Copilot for Paytm Merchants | Paytm Build for India AI Hackathon 2026",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for local & remote dashboard access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(merchant_router)
app.include_router(demand_router)
app.include_router(inventory_router)
app.include_router(retention_router)
app.include_router(cashflow_router)
app.include_router(scorer_router)
app.include_router(competitor_router)
app.include_router(actions_router)
app.include_router(copilot_router)

# Static files directory
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
frontend_static = os.path.join(project_root, "frontend", "static")
frontend_index = os.path.join(project_root, "frontend", "index.html")

if os.path.exists(frontend_static):
    app.mount("/static", StaticFiles(directory=frontend_static), name="static")

@app.get("/health", tags=["System"])
def health_check():
    return {
        "status": "HEALTHY",
        "app": settings.APP_NAME,
        "version": settings.VERSION,
        "tagline": settings.APP_TAGLINE,
        "sarvam_ai_configured": bool(settings.SARVAM_API_KEY),
        "gemini_configured": bool(settings.GEMINI_API_KEY)
    }

@app.get("/")
def serve_dashboard():
    if os.path.exists(frontend_index):
        return FileResponse(frontend_index)
    return JSONResponse({
        "message": "DukaanSaathi AI API is running. Access interactive documentation at /docs",
        "app": settings.APP_NAME,
        "track": "Track 1: Merchant Growth AI",
        "hackathon": "Paytm Build for India AI Hackathon 2026"
    })

logger.info(f"🚀 {settings.APP_NAME} v{settings.VERSION} initialized and ready.")
