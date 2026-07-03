from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.base import CleaningRecord, CleaningStatus
from app.schemas.cleaning import CleaningResponse, CleaningUpdate
from app.services.cleaning_service import CleaningService

router = APIRouter()

@router.get("/{bed_id}", response_model=CleaningResponse)
def get_cleaning_status(bed_id: int, db: Session = Depends(get_db)):
    return CleaningService.get_status(db, bed_id)

@router.put("/{bed_id}", response_model=CleaningResponse)
def update_cleaning_status(bed_id: int, update: CleaningUpdate, db: Session = Depends(get_db)):
    return CleaningService.update_status(
        db, bed_id, update.status, update.staff_name, update.notes
    )