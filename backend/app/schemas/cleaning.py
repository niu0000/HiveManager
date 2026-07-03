from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.base import CleaningStatus

class CleaningCreate(BaseModel):
    bed_id: int
    status: CleaningStatus = CleaningStatus.PENDING
    staff_name: Optional[str] = None
    notes: Optional[str] = None

class CleaningUpdate(BaseModel):
    status: Optional[CleaningStatus] = None
    staff_name: Optional[str] = None
    notes: Optional[str] = None

class CleaningResponse(BaseModel):
    id: int
    bed_id: int
    status: CleaningStatus
    staff_name: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    notes: Optional[str] = None
    
    class Config:
        from_attributes = True