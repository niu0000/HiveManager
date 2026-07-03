from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ReservationCreate(BaseModel):
    booking_date: Optional[datetime] = None
    nights: int = 1
    site: Optional[str] = None
    room_type_request: Optional[str] = None
    plan: Optional[str] = None
    rooms_count: int = 1
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    postal_code: Optional[str] = None
    address: Optional[str] = None
    email: Optional[str] = None
    adults: int = 1
    meal: Optional[str] = None
    total_price: float = 0.0
    company: Optional[str] = None
    adult_price: float = 0.0
    child_price: float = 0.0
    infant_price: float = 0.0
    adult_total: float = 0.0
    child_total: float = 0.0
    infant_total: float = 0.0
    other_fee: float = 0.0
    other_total: float = 0.0
    check_in_date: Optional[datetime] = None
    check_out_date: Optional[datetime] = None
    nationality: Optional[str] = None
    gender: Optional[str] = None

class ReservationResponse(BaseModel):
    id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    check_in_date: Optional[datetime] = None
    check_out_date: Optional[datetime] = None
    nationality: Optional[str] = None
    gender: Optional[str] = None
    site: Optional[str] = None
    
    class Config:
        from_attributes = True