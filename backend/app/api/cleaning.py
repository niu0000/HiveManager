from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app.models.base import CleaningRecord, Bed, CleaningStatus
from app.schemas import CleaningRecordCreate, CleaningRecordResponse, CleaningRecordUpdate

router = APIRouter()


@router.get("/", response_model=List[CleaningRecordResponse])
def get_cleaning_records(date: str = None, db: Session = Depends(get_db)):
    """清掃記録を取得（日付指定可能）"""
    query = db.query(CleaningRecord)
    
    if date:
        try:
            target_date = datetime.strptime(date, '%Y-%m-%d').date()
            query = query.filter(CleaningRecord.cleaning_date >= target_date)
            query = query.filter(CleaningRecord.cleaning_date < target_date.replace(day=target_date.day + 1) if target_date.day != 28 else target_date.replace(month=target_date.month + 1, day=1))
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    
    records = query.all()
    return records


@router.get("/{record_id}", response_model=CleaningRecordResponse)
def get_cleaning_record(record_id: int, db: Session = Depends(get_db)):
    record = db.query(CleaningRecord).filter(CleaningRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Cleaning record not found")
    return record


@router.post("/", response_model=CleaningRecordResponse)
def create_cleaning_record(record: CleaningRecordCreate, db: Session = Depends(get_db)):
    # Verify bed exists
    bed = db.query(Bed).filter(Bed.id == record.bed_id).first()
    if not bed:
        raise HTTPException(status_code=404, detail="Bed not found")
    
    db_record = CleaningRecord(**record.model_dump())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record


@router.put("/{record_id}", response_model=CleaningRecordResponse)
def update_cleaning_record(record_id: int, record_update: CleaningRecordUpdate, db: Session = Depends(get_db)):
    db_record = db.query(CleaningRecord).filter(CleaningRecord.id == record_id).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="Cleaning record not found")
    
    update_data = record_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_record, key, value)
    
    # Auto-set timestamps based on status changes
    if record_update.status == CleaningStatus.IN_PROGRESS and not db_record.started_at:
        db_record.started_at = datetime.utcnow()
    elif record_update.status == CleaningStatus.COMPLETED and not db_record.completed_at:
        db_record.completed_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_record)
    return db_record


@router.get("/bed/{bed_id}", response_model=List[CleaningRecordResponse])
def get_bed_cleaning_records(bed_id: int, db: Session = Depends(get_db)):
    """特定ベッドの清掃記録を取得"""
    records = db.query(CleaningRecord).filter(CleaningRecord.bed_id == bed_id).all()
    return records


@router.post("/bed/{bed_id}/start", response_model=CleaningRecordResponse)
def start_cleaning(bed_id: int, staff_id: int = None, db: Session = Depends(get_db)):
    """清掃開始"""
    # Check if there's a pending record for today
    today = datetime.utcnow().date()
    record = db.query(CleaningRecord).filter(
        CleaningRecord.bed_id == bed_id,
        CleaningRecord.cleaning_date >= today,
        CleaningRecord.status == CleaningStatus.PENDING
    ).first()
    
    if not record:
        # Create new record
        record = CleaningRecord(
            bed_id=bed_id,
            cleaning_date=datetime.utcnow(),
            status=CleaningStatus.PENDING,
            staff_id=staff_id
        )
        db.add(record)
    
    record.status = CleaningStatus.IN_PROGRESS
    record.started_at = datetime.utcnow()
    record.staff_id = staff_id
    
    db.commit()
    db.refresh(record)
    return record


@router.post("/bed/{bed_id}/complete", response_model=CleaningRecordResponse)
def complete_cleaning(bed_id: int, notes: str = None, db: Session = Depends(get_db)):
    """清掃完了"""
    today = datetime.utcnow().date()
    record = db.query(CleaningRecord).filter(
        CleaningRecord.bed_id == bed_id,
        CleaningRecord.cleaning_date >= today,
        CleaningRecord.status == CleaningStatus.IN_PROGRESS
    ).first()
    
    if not record:
        raise HTTPException(status_code=404, detail="No active cleaning record found for this bed")
    
    record.status = CleaningStatus.COMPLETED
    record.completed_at = datetime.utcnow()
    if notes:
        record.notes = notes
    
    db.commit()
    db.refresh(record)
    return record
