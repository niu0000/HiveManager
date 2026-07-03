from pydantic import BaseModel
from typing import Optional, Dict, Any

class SyncStatusResponse(BaseModel):
    last_sync: Optional[str] = None
    sheet_id: Optional[str] = None
    status: str

class SyncResultResponse(BaseModel):
    success: bool
    message: str
    details: Optional[Dict[str, Any]] = None