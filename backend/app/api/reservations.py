from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.base import Reservation
from app.schemas.reservation import ReservationResponse
from app.services.assignment_service import AssignmentService
import shutil
import os

router = APIRouter()

@router.get("/", response_model=List[ReservationResponse])
def get_reservations(db: Session = Depends(get_db)):
    return db.query(Reservation).all()

@router.post("/import")
def import_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    file_path = f"data/uploads/{file.filename}"
    os.makedirs("data/uploads", exist_ok=True)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        count = AssignmentService.import_csv(db, file_path)
        return {"status": "success", "imported_count": count}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)