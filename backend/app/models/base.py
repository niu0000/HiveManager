from sqlalchemy import Column, Integer, String, DateTime, Boolean, JSON, ForeignKey, Enum as SQLEnum, Float, Text
from sqlalchemy.orm import relationship
from app.database import Base
import enum
from datetime import datetime

class RoomType(str, enum.Enum):
    CAPSULE = "capsule"
    ROOM = "room"

class BedPosition(str, enum.Enum):
    LOWER = "lower"
    UPPER = "upper"

class AssignmentStatus(str, enum.Enum):
    PENDING = "pending"
    ASSIGNED = "assigned"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"

class CleaningStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    INSPECTING = "inspecting"
    UNAVAILABLE = "unavailable"

class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    room_type = Column(SQLEnum(RoomType), nullable=False)
    attributes = Column(JSON, default={})  # エリア、設備など
    beds = relationship("Bed", back_populates="room", cascade="all, delete-orphan")

class Bed(Base):
    __tablename__ = "beds"
    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    bed_number = Column(String, nullable=False)
    position = Column(SQLEnum(BedPosition), nullable=True)  # ルームタイプは None
    room = relationship("Room", back_populates="beds")
    assignments = relationship("Assignment", back_populates="bed")
    cleaning_records = relationship("CleaningRecord", back_populates="bed")

class Reservation(Base):
    __tablename__ = "reservations"
    id = Column(Integer, primary_key=True, index=True)
    booking_date = Column(DateTime, nullable=True)
    nights = Column(Integer, default=1)
    site = Column(String, nullable=True)
    room_type_request = Column(String, nullable=True)
    plan = Column(String, nullable=True)
    rooms_count = Column(Integer, default=1)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    postal_code = Column(String, nullable=True)
    address = Column(String, nullable=True)
    email = Column(String, nullable=True)
    adults = Column(Integer, default=1)
    meal = Column(String, nullable=True)
    total_price = Column(Float, default=0.0)
    company = Column(String, nullable=True)
    adult_price = Column(Float, default=0.0)
    child_price = Column(Float, default=0.0)
    infant_price = Column(Float, default=0.0)
    adult_total = Column(Float, default=0.0)
    child_total = Column(Float, default=0.0)
    infant_total = Column(Float, default=0.0)
    other_fee = Column(Float, default=0.0)
    other_total = Column(Float, default=0.0)
    check_in_date = Column(DateTime, nullable=True)
    check_out_date = Column(DateTime, nullable=True)
    nationality = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    assignments = relationship("Assignment", back_populates="reservation", cascade="all, delete-orphan")

class Assignment(Base):
    __tablename__ = "assignments"
    id = Column(Integer, primary_key=True, index=True)
    reservation_id = Column(Integer, ForeignKey("reservations.id"), nullable=False)
    bed_id = Column(Integer, ForeignKey("beds.id"), nullable=False)
    check_in_date = Column(DateTime, nullable=False)
    check_out_date = Column(DateTime, nullable=False)
    status = Column(SQLEnum(AssignmentStatus), default=AssignmentStatus.PENDING)
    assigned_at = Column(DateTime, default=datetime.utcnow)
    is_locked = Column(Boolean, default=False)  # 手動確定ロックフラグ
    lock_reason = Column(String, nullable=True)  # ロック理由
    locked_by = Column(String, nullable=True)  # ロックしたユーザー
    locked_at = Column(DateTime, nullable=True)  # ロック日時
    assign_reason = Column(String, nullable=True)  # アサイン理由（説明可能性）
    reservation = relationship("Reservation", back_populates="assignments")
    bed = relationship("Bed", back_populates="assignments")

class CleaningRecord(Base):
    __tablename__ = "cleaning_records"
    id = Column(Integer, primary_key=True, index=True)
    bed_id = Column(Integer, ForeignKey("beds.id"), nullable=False)
    status = Column(SQLEnum(CleaningStatus), default=CleaningStatus.PENDING)
    staff_name = Column(String, nullable=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    bed = relationship("Bed", back_populates="cleaning_records")

class Recommendation(Base):
    __tablename__ = "recommendations"
    id = Column(Integer, primary_key=True, index=True)
    name_ja = Column(String, nullable=False)
    name_en = Column(String, nullable=False)
    name_zh = Column(String, nullable=False)
    name_ko = Column(String, nullable=False)
    category = Column(String, nullable=False)
    description_ja = Column(Text, nullable=True)
    description_en = Column(Text, nullable=True)
    description_zh = Column(Text, nullable=True)
    description_ko = Column(Text, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    hours = Column(String, nullable=True)
    budget = Column(String, nullable=True)

class Setting(Base):
    __tablename__ = "settings"
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True, nullable=False)
    value = Column(Text, nullable=False)
    description = Column(String, nullable=True)

class SheetSetting(Base):
    __tablename__ = "sheet_settings"
    id = Column(Integer, primary_key=True, index=True)
    spreadsheet_id = Column(String, nullable=False)
    sheet_name = Column(String, default="Sheet1")
    mappings = Column(JSON, default=[])  # [{spreadsheetColumn: "", systemField: ""}]
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)