from sqlalchemy.orm import Session
from app.models.base import CleaningRecord, Bed, CleaningStatus
from datetime import datetime
from typing import List

class CleaningService:
    @staticmethod
    def get_status(db: Session, bed_id: int) -> CleaningRecord:
        record = db.query(CleaningRecord).filter(CleaningRecord.bed_id == bed_id).order_by(CleaningRecord.id.desc()).first()
        if not record:
            # 初期レコード作成
            record = CleaningRecord(bed_id=bed_id, status=CleaningStatus.PENDING)
            db.add(record)
            db.commit()
            db.refresh(record)
        return record

    @staticmethod
    def update_status(db: Session, bed_id: int, status: CleaningStatus, staff_name: str = None, notes: str = None) -> CleaningRecord:
        record = CleaningService.get_status(db, bed_id)
        record.status = status
        if staff_name:
            record.staff_name = staff_name
        if notes:
            record.notes = notes
        
        if status == CleaningStatus.IN_PROGRESS and not record.started_at:
            record.started_at = datetime.utcnow()
        elif status == CleaningStatus.COMPLETED and not record.completed_at:
            record.completed_at = datetime.utcnow()
            
        db.commit()
        db.refresh(record)
        return record

    @staticmethod
    def get_priority_list(db: Session) -> List[CleaningRecord]:
        # チェックインが近い順にソート
        records = db.query(CleaningRecord).join(Bed).filter(CleaningRecord.status != CleaningStatus.COMPLETED).all()
        return sorted(records, key=lambda x: x.id) # 簡易ソート