from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.models.base import RoomType, BedPosition

class RoomCreate(BaseModel):
    name: str
    room_type: RoomType
    attributes: Optional[Dict[str, Any]] = {}

class RoomResponse(BaseModel):
    id: int
    name: str
    room_type: RoomType
    attributes: Optional[Dict[str, Any]] = {}
    
    class Config:
        from_attributes = True

class BedCreate(BaseModel):
    room_id: int
    bed_number: str
    position: Optional[BedPosition] = None

class BedResponse(BaseModel):
    id: int
    room_id: int
    bed_number: str
    position: Optional[BedPosition] = None
    room: Optional[RoomResponse] = None
    
    class Config:
        from_attributes = True