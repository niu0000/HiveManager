from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.sync_service import SyncService
from app.schemas.sync import SyncStatusResponse, SyncResultResponse

router = APIRouter()

@router.post("/pull", response_model=SyncResultResponse)
def pull_sync(db: Session = Depends(get_db)):
    try:
        service = SyncService(db)
        result = service.pull_from_sheet()
        return SyncResultResponse(success=True, message="Pull completed", details=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/push", response_model=SyncResultResponse)
def push_sync(db: Session = Depends(get_db)):
    try:
        service = SyncService(db)
        result = service.push_to_sheet()
        return SyncResultResponse(success=True, message="Push completed", details=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/full", response_model=SyncResultResponse)
def full_sync(db: Session = Depends(get_db)):
    try:
        service = SyncService(db)
        result = service.full_sync()
        return SyncResultResponse(success=True, message="Full sync completed", details=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status", response_model=SyncStatusResponse)
def get_sync_status(db: Session = Depends(get_db)):
    from app.services.settings_service import SettingsService
    sheet_id = SettingsService.get(db, "google_sheet_id")
    return SyncStatusResponse(sheet_id=sheet_id, status="ready")