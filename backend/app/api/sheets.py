from fastapi import APIRouter, Depends, HTTPException
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