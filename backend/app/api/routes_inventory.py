from fastapi import APIRouter, HTTPException, UploadFile, File, Query, Path
from typing import Dict, Any, List, Optional
from backend.app.schemas.api_models import ShelfScanResponse
from backend.app.models.inventory_optimizer import inventory_engine
from backend.app.models.shelf_scanner import shelf_scanner
from backend.app.data.store import db

router = APIRouter(prefix="/api/inventory", tags=["Inventory & Shelf Scanner"])

@router.get("/recommendations/{merchant_id}")
@router.get("/{merchant_id}")
def get_inventory(merchant_id: str):
    return inventory_engine.get_inventory_status(merchant_id)

@router.get("/{merchant_id}/cross-sell/{product_name}")
def get_cross_sell(merchant_id: str, product_name: str):
    return inventory_engine.get_complementary_recommendations(product_name)

@router.post("/scan-shelf", response_model=ShelfScanResponse)
async def scan_shelf_query(
    merchant_id: str = Query(default="PAYTM_M_1001"),
    file: Optional[UploadFile] = File(None)
):
    image_bytes = None
    filename = "shelf_camera.jpg"
    if file:
        image_bytes = await file.read()
        filename = file.filename or filename
        
    scan_result = shelf_scanner.process_shelf_image(image_bytes=image_bytes, file_name=filename)
    db.add_shelf_scan(merchant_id, scan_result)
    return scan_result

@router.post("/{merchant_id}/scan-shelf", response_model=ShelfScanResponse)
async def scan_shelf_path(
    merchant_id: str = Path(...),
    file: Optional[UploadFile] = File(None)
):
    return await scan_shelf_query(merchant_id=merchant_id, file=file)
