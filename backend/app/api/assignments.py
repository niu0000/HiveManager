from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.base import Assignment, Bed, AssignmentStatus
from app.schemas.assignment import (
    AssignmentResponse, 
    ManualAssignRequest, 
    AssignRunResponse, 
    AssignFailureItem,
    LockAssignmentRequest,
    UnlockAssignmentRequest
)
from app.services.assignment_service import AssignmentService
from app.services.qr_service import QRCodeService
from fastapi.responses import Response

router = APIRouter()

@router.get("/status")
def get_status(db: Session = Depends(get_db)):
    assignments = db.query(Assignment).all()
    beds = db.query(Bed).all()
    return {"assignments": len(assignments), "total_beds": len(beds)}

@router.post("/run", response_model=AssignRunResponse)
def run_auto_assign(db: Session = Depends(get_db)):
    success, failures = AssignmentService.run_auto_assign(db)
    failure_items = [AssignFailureItem(**f) for f in failures]
    return AssignRunResponse(success_count=success, failure_count=len(failures), failures=failure_items)

@router.post("/manual", response_model=AssignmentResponse)
def manual_assign(req: ManualAssignRequest, db: Session = Depends(get_db)):
    try:
        # ユーザー名は認証システムから取得（現在はダミー）
        user_name = "staff_user"  # TODO: 認証システムから取得
        assignment = AssignmentService.manual_assign(
            db, 
            req.reservation_id, 
            req.bed_id, 
            req.force,
            req.lock,
            req.lock_reason,
            user_name
        )
        return assignment
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{assignment_id}/lock", response_model=AssignmentResponse)
def lock_assignment(
    assignment_id: int, 
    req: LockAssignmentRequest, 
    db: Session = Depends(get_db)
):
    """
    アサインのロック/アンロック
    - 手動確定ベッドの上書き防止
    - 監査証跡の記録
    """
    try:
        user_name = "staff_user"  # TODO: 認証システムから取得
        assignment = AssignmentService.lock_assignment(
            db, 
            assignment_id, 
            req.lock, 
            req.lock_reason, 
            user_name
        )
        return assignment
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/locked", response_model=List[AssignmentResponse])
def get_locked_assignments(db: Session = Depends(get_db)):
    """
    ロック中のアサイン一覧を取得
    """
    assignments = AssignmentService.get_locked_assignments(db)
    return assignments

@router.post("/unlock-bulk")
def bulk_unlock(db: Session = Depends(get_db)):
    """
    特定ユーザーによるロックを一括解除（管理者機能）
    """
    user_name = "staff_user"  # TODO: 認証システムから取得
    count = AssignmentService.bulk_unlock_by_user(db, user_name)
    return {"unlocked_count": count}

@router.get("/{assignment_id}/qr")
def get_assignment_qr(assignment_id: int, db: Session = Depends(get_db)):
    """
    アサイン情報の QR コードを生成
    ゲスト向けにベッド情報と滞在期間を提供
    """
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    # ベッド情報の取得
    bed = db.query(Bed).filter(Bed.id == assignment.bed_id).first()
    if not bed:
        raise HTTPException(status_code=404, detail="Bed not found")
    
    room = bed.room
    
    # QR コード生成
    qr_buffer = QRCodeService.generate_bed_qr(
        room_name=room.name,
        bed_number=bed.bed_number,
        check_in=assignment.check_in_date.strftime("%Y-%m-%d"),
        check_out=assignment.check_out_date.strftime("%Y-%m-%d")
    )
    
    return Response(
        content=qr_buffer.getvalue(),
        media_type="image/png",
        headers={"Content-Disposition": f"attachment; filename=assignment_{assignment_id}.png"}
    )