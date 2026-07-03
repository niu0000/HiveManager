from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.google_sheets_service import GoogleSheetsService
from app.services.settings_service import SettingsService

router = APIRouter()

@router.get("/test")
def test_connection(db: Session = Depends(get_db)):
    sheet_id = SettingsService.get(db, "google_sheet_id")
    if not sheet_id:
        raise HTTPException(status_code=400, detail="Sheet ID not configured")
    
    service = GoogleSheetsService()
    if not service.service:
        raise HTTPException(status_code=500, detail="Google Service initialization failed")
    
    return {"status": "connected", "sheet_id": sheet_id}

@router.get("/colors")
def get_background_colors(
    db: Session = Depends(get_db),
    spreadsheet_id: str = Query(None),
    range: str = Query("Sheet1!A1:Z1000")
):
    sheet_id = spreadsheet_id or SettingsService.get(db, "google_sheet_id")
    if not sheet_id:
        raise HTTPException(status_code=400, detail="Sheet ID not configured")
    
    service = GoogleSheetsService()
    if not service.service:
        raise HTTPException(status_code=500, detail="Google Service initialization failed")
    
    try:
        colors = service.get_background_colors(sheet_id, range)
        return {"colors": colors}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))