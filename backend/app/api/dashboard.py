from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.base import Assignment, AssignmentStatus, Bed, Reservation
from datetime import datetime, date

router = APIRouter()

@router.get("/status")
def get_dashboard_status(db: Session = Depends(get_db)):
    today = datetime.now().date()
    
    # 今日チェックインの予約数
    check_in_today = db.query(Reservation).filter(
        Reservation.check_in_date >= today,
        Reservation.check_in_date < today.replace(day=today.day+1) if hasattr(today, 'replace') else today
    ).count()
    
    # 今日チェックアウトの予約数
    check_out_today = db.query(Reservation).filter(
        Reservation.check_out_date >= today,
        Reservation.check_out_date < today.replace(day=today.day+1) if hasattr(today, 'replace') else today
    ).count()
    
    # ベッド数の統計
    total_beds = db.query(Bed).count()
    assigned_beds = db.query(Assignment).filter(
        Assignment.check_in_date <= datetime.now(),
        Assignment.check_out_date >= datetime.now(),
        Assignment.status == AssignmentStatus.CONFIRMED
    ).count()
    available_beds = total_beds - assigned_beds
    
    # ダミーのアラートとエラー（実際にはもっと高度なロジックが必要）
    alerts = []
    errors = []
    
    return {
        "checkInToday": check_in_today,
        "checkOutToday": check_out_today,
        "availableBeds": max(0, available_beds),
        "totalBeds": total_beds,
        "alerts": alerts,
        "errors": errors
    }
