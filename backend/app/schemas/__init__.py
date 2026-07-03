from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class RoomType(str, Enum):
    CAPSULE = "capsule"
    ROOM = "room"


class GenderType(str, Enum):
    MALE = "male"
    FEMALE = "female"
    MIXED = "mixed"


# Room Schemas
class RoomBase(BaseModel):
    room_number: str
    room_type: RoomType
    gender_type: GenderType
    capacity: int = 1
    floor: Optional[int] = None
    attributes: Optional[dict] = None


class RoomCreate(RoomBase):
    pass


class RoomUpdate(BaseModel):
    room_number: Optional[str] = None
    room_type: Optional[RoomType] = None
    gender_type: Optional[GenderType] = None
    capacity: Optional[int] = None
    floor: Optional[int] = None
    attributes: Optional[dict] = None
    is_active: Optional[bool] = None


class RoomResponse(RoomBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Bed Schemas
class BedBase(BaseModel):
    bed_number: str
    bed_position: Optional[int] = None
    attributes: Optional[dict] = None


class BedCreate(BedBase):
    room_id: int


class BedUpdate(BaseModel):
    bed_number: Optional[str] = None
    bed_position: Optional[int] = None
    attributes: Optional[dict] = None
    is_active: Optional[bool] = None


class BedResponse(BedBase):
    id: int
    room_id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Reservation Schemas
class ReservationStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    CHECKED_IN = "checked_in"
    CHECKED_OUT = "checked_out"


class ReservationBase(BaseModel):
    booking_date: datetime
    nights: int
    check_in_date: datetime
    check_out_date: datetime
    booking_site: Optional[str] = None
    room_type_requested: Optional[str] = None
    plan_name: Optional[str] = None
    number_of_rooms: int = 1
    first_name: str
    last_name: str
    phone: Optional[str] = None
    postal_code: Optional[str] = None
    address: Optional[str] = None
    email: Optional[str] = None
    nationality: Optional[str] = None
    adults: int = 1
    children: int = 0
    infants: int = 0
    meal_plan: Optional[str] = None
    total_amount: Optional[float] = None
    corporate_info: Optional[str] = None
    adult_unit_price: Optional[float] = None
    child_unit_price: Optional[float] = None
    infant_unit_price: Optional[float] = None
    adult_charge: Optional[float] = None
    child_charge: Optional[float] = None
    infant_charge: Optional[float] = None
    other_charges: Optional[float] = None
    other_charge_total: Optional[float] = None


class ReservationCreate(ReservationBase):
    pass


class ReservationUpdate(BaseModel):
    status: Optional[ReservationStatus] = None
    sheet_row_id: Optional[str] = None


class ReservationResponse(ReservationBase):
    id: int
    status: ReservationStatus
    sheet_row_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Assignment Schemas
class AssignmentBase(BaseModel):
    reservation_id: int
    room_id: int
    bed_id: Optional[int] = None
    check_in_date: datetime
    check_out_date: datetime
    status: str = "assigned"
    sheet_color: Optional[str] = None
    resolved_status: Optional[str] = None


class AssignmentCreate(AssignmentBase):
    pass


class AssignmentUpdate(BaseModel):
    status: Optional[str] = None
    sheet_color: Optional[str] = None
    resolved_status: Optional[str] = None


class AssignmentResponse(AssignmentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Cleaning Schemas
class CleaningStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    INSPECTED = "inspected"


class CleaningRecordBase(BaseModel):
    bed_id: int
    cleaning_date: datetime
    status: CleaningStatus = CleaningStatus.PENDING
    staff_id: Optional[int] = None
    notes: Optional[str] = None


class CleaningRecordCreate(CleaningRecordBase):
    pass


class CleaningRecordUpdate(BaseModel):
    status: Optional[CleaningStatus] = None
    staff_id: Optional[int] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    inspected_by: Optional[int] = None
    inspected_at: Optional[datetime] = None
    notes: Optional[str] = None


class CleaningRecordResponse(CleaningRecordBase):
    id: int
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    inspected_by: Optional[int] = None
    inspected_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Recommendation Schemas
class RecommendationBase(BaseModel):
    name_ja: str
    name_en: Optional[str] = None
    name_zh: Optional[str] = None
    name_ko: Optional[str] = None
    description_ja: Optional[str] = None
    description_en: Optional[str] = None
    description_zh: Optional[str] = None
    description_ko: Optional[str] = None
    category: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    url: Optional[str] = None
    image_url: Optional[str] = None
    display_order: int = 0


class RecommendationCreate(RecommendationBase):
    pass


class RecommendationUpdate(BaseModel):
    name_ja: Optional[str] = None
    name_en: Optional[str] = None
    name_zh: Optional[str] = None
    name_ko: Optional[str] = None
    description_ja: Optional[str] = None
    description_en: Optional[str] = None
    description_zh: Optional[str] = None
    description_ko: Optional[str] = None
    category: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    url: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None


class RecommendationResponse(RecommendationBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Setting Schemas
class SettingKey(str, Enum):
    GOOGLE_SHEET_ID = "google_sheet_id"
    SHEET_COLOR_MAPPING = "sheet_color_mapping"
    STATUS_MAPPING = "status_mapping"
    ASSIGNMENT_RULES = "assignment_rules"


class SettingBase(BaseModel):
    key: SettingKey
    value: dict
    description: Optional[str] = None


class SettingCreate(SettingBase):
    pass


class SettingUpdate(BaseModel):
    value: Optional[dict] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


class SettingResponse(SettingBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None


class UserCreate(BaseModel):
    username: str
    password: str
    role: str = "staff"


class UserLogin(BaseModel):
    username: str
    password: str
