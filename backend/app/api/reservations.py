from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app.models.base import Reservation, ReservationStatus
from app.schemas import ReservationCreate, ReservationResponse, ReservationUpdate
from app.services.csv_parser import parse_neppan_csv

router = APIRouter()


@router.get("/", response_model=List[ReservationResponse])
def get_reservations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    reservations = db.query(Reservation).offset(skip).limit(limit).all()
    return reservations


@router.get("/{reservation_id}", response_model=ReservationResponse)
def get_reservation(reservation_id: int, db: Session = Depends(get_db)):
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return reservation


@router.post("/", response_model=ReservationResponse)
def create_reservation(reservation: ReservationCreate, db: Session = Depends(get_db)):
    db_reservation = Reservation(**reservation.model_dump())
    db.add(db_reservation)
    db.commit()
    db.refresh(db_reservation)
    return db_reservation


@router.put("/{reservation_id}", response_model=ReservationResponse)
def update_reservation(reservation_id: int, reservation_update: ReservationUpdate, db: Session = Depends(get_db)):
    db_reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not db_reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    
    update_data = reservation_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_reservation, key, value)
    
    db.commit()
    db.refresh(db_reservation)
    return db_reservation


@router.post("/upload-csv", response_model=dict)
async def upload_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """ねっぱん CSV ファイルをアップロードして予約データをインポート"""
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV")
    
    contents = await file.read()
    try:
        reservations_data = parse_neppan_csv(contents.decode('utf-8-sig'))
        
        created_count = 0
        for res_data in reservations_data:
            # Check if already exists (based on booking_date, name, email)
            existing = db.query(Reservation).filter(
                Reservation.booking_date == res_data['booking_date'],
                Reservation.first_name == res_data['first_name'],
                Reservation.last_name == res_data['last_name'],
            ).first()
            
            if not existing:
                db_reservation = Reservation(**res_data)
                db.add(db_reservation)
                created_count += 1
        
        db.commit()
        
        return {
            "message": f"Successfully imported {created_count} reservations",
            "count": created_count
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error parsing CSV: {str(e)}")
