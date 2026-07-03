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

class AssignmentResponse(BaseModel):
    id: int
    reservation_id: int
    bed_id: int
    check_in_date: datetime
    check_out_date: datetime
    status: AssignmentStatus
    assigned_at: datetime
    
    class Config:
        from_attributes = True

class AssignFailureItem(BaseModel):
    reservation_id: int
    guest_name: str
    reason: str

class AssignRunResponse(BaseModel):
    success_count: int
    failure_count: int
    failures: List[AssignFailureItem]