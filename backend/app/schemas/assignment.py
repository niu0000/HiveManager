from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from app.models.base import AssignmentStatus

class AssignmentCreate(BaseModel):
    reservation_id: int
    bed_id: int
    check_in_date: datetime
    check_out_date: datetime
    status: AssignmentStatus = AssignmentStatus.PENDING

class ManualAssignRequest(BaseModel):
    reservation_id: int
    bed_id: int
    force: bool = False
    lock: bool = False  # 手動確定ロックフラグ
    lock_reason: Optional[str] = None

class LockAssignmentRequest(BaseModel):
    """手動確定ロック用リクエスト"""
    lock: bool = True
    lock_reason: Optional[str] = None

class UnlockAssignmentRequest(BaseModel):
    """ロック解除用リクエスト"""
    pass

class AssignmentResponse(BaseModel):
    id: int
    reservation_id: int
    bed_id: int
    check_in_date: datetime
    check_out_date: datetime
    status: AssignmentStatus
    assigned_at: datetime
    is_locked: bool = False
    lock_reason: Optional[str] = None
    locked_by: Optional[str] = None
    assign_reason: Optional[str] = None
    
    class Config:
        from_attributes = True

class AssignFailureItem(BaseModel):
    reservation_id: int
    guest_name: str
    reason: str
    gender: Optional[str] = None
    is_family: bool = False
    adults: int = 1

class AssignRunResponse(BaseModel):
    success_count: int
    failure_count: int
    failures: List[AssignFailureItem]