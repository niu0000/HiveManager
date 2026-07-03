from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text, Float, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
import json

from app.database import Base


class RoomType(str, enum.Enum):
    CAPSULE = "capsule"
    ROOM = "room"


class GenderType(str, enum.Enum):
    MALE = "male"
    FEMALE = "female"
    MIXED = "mixed"


class Room(Base):
    """部屋マスタテーブル"""
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    room_number = Column(String(50), unique=True, nullable=False, index=True)  # 部屋番号
    room_type = Column(SQLEnum(RoomType), nullable=False)  # カプセル or ルーム
    gender_type = Column(SQLEnum(GenderType), nullable=False)  # 性別区分
    capacity = Column(Integer, nullable=False, default=1)  # 収容人数
    floor = Column(Integer, nullable=True)  # 階数
    attributes = Column(Text, nullable=True)  # JSON 形式の属性（設備情報など）
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    beds = relationship("Bed", back_populates="room", cascade="all, delete-orphan")
    assignments = relationship("Assignment", back_populates="room")


class Bed(Base):
    """ベッドマスタテーブル"""
    __tablename__ = "beds"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    bed_number = Column(String(50), nullable=False)  # ベッド番号（例：A-01, B-02）
    bed_position = Column(Integer, nullable=True)  # ベッドの位置番号
    attributes = Column(Text, nullable=True)  # JSON 形式の属性（コンセント有無、窓側など）
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    room = relationship("Room", back_populates="beds")
    assignments = relationship("Assignment", back_populates="bed")
    cleaning_records = relationship("CleaningRecord", back_populates="bed")


class ReservationStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    CHECKED_IN = "checked_in"
    CHECKED_OUT = "checked_out"


class Reservation(Base):
    """予約データテーブル"""
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    booking_date = Column(DateTime, nullable=False)  # 申込日
    nights = Column(Integer, nullable=False)  # 泊数
    check_in_date = Column(DateTime, nullable=False)  # チェックイン日
    check_out_date = Column(DateTime, nullable=False)  # チェックアウト日
    booking_site = Column(String(100), nullable=True)  # 予約サイト
    room_type_requested = Column(String(100), nullable=True)  # 希望部屋タイプ
    plan_name = Column(String(200), nullable=True)  # 商品プラン
    number_of_rooms = Column(Integer, default=1)  # 室数
    
    # Guest info
    first_name = Column(String(100), nullable=False)  # 名
    last_name = Column(String(100), nullable=False)  # 姓
    phone = Column(String(50), nullable=True)
    postal_code = Column(String(20), nullable=True)
    address = Column(Text, nullable=True)
    email = Column(String(200), nullable=True)
    nationality = Column(String(100), nullable=True)  # 国籍
    
    # Party info
    adults = Column(Integer, default=1)
    children = Column(Integer, default=0)
    infants = Column(Integer, default=0)
    
    # Payment info
    meal_plan = Column(String(100), nullable=True)  # 食事
    total_amount = Column(Float, nullable=True)  # 料金合計
    corporate_info = Column(String(200), nullable=True)  # 法人情報
    adult_unit_price = Column(Float, nullable=True)
    child_unit_price = Column(Float, nullable=True)
    infant_unit_price = Column(Float, nullable=True)
    adult_charge = Column(Float, nullable=True)
    child_charge = Column(Float, nullable=True)
    infant_charge = Column(Float, nullable=True)
    other_charges = Column(Float, nullable=True)
    other_charge_total = Column(Float, nullable=True)
    
    # Status
    status = Column(SQLEnum(ReservationStatus), default=ReservationStatus.PENDING)
    sheet_row_id = Column(String(100), nullable=True)  # Google Sheets の行 ID
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    assignments = relationship("Assignment", back_populates="reservation")


class Assignment(Base):
    """アサイン結果テーブル"""
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    reservation_id = Column(Integer, ForeignKey("reservations.id"), nullable=False)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    bed_id = Column(Integer, ForeignKey("beds.id"), nullable=True)  # ベッド指定がない場合もあり
    
    check_in_date = Column(DateTime, nullable=False)
    check_out_date = Column(DateTime, nullable=False)
    
    status = Column(String(50), default="assigned")  # assigned, checked_in, checked_out
    sheet_color = Column(String(20), nullable=True)  # シートの背景色
    resolved_status = Column(String(50), nullable=True)  # 解決済みステータス
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    reservation = relationship("Reservation", back_populates="assignments")
    room = relationship("Room", back_populates="assignments")
    bed = relationship("Bed", back_populates="assignments")


class CleaningStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    INSPECTED = "inspected"


class CleaningRecord(Base):
    """清掃管理テーブル"""
    __tablename__ = "cleaning_records"

    id = Column(Integer, primary_key=True, index=True)
    bed_id = Column(Integer, ForeignKey("beds.id"), nullable=False)
    cleaning_date = Column(DateTime, nullable=False)
    status = Column(SQLEnum(CleaningStatus), default=CleaningStatus.PENDING)
    
    staff_id = Column(Integer, nullable=True)  # 担当スタッフ
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    inspected_by = Column(Integer, nullable=True)
    inspected_at = Column(DateTime, nullable=True)
    
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    bed = relationship("Bed", back_populates="cleaning_records")


class RecommendationLanguage(str, enum.Enum):
    JA = "ja"
    EN = "en"
    ZH = "zh"
    KO = "ko"


class Recommendation(Base):
    """おすすめ場所テーブル"""
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    name_ja = Column(String(200), nullable=False)
    name_en = Column(String(200), nullable=True)
    name_zh = Column(String(200), nullable=True)
    name_ko = Column(String(200), nullable=True)
    
    description_ja = Column(Text, nullable=True)
    description_en = Column(Text, nullable=True)
    description_zh = Column(Text, nullable=True)
    description_ko = Column(Text, nullable=True)
    
    category = Column(String(100), nullable=True)  # レストラン，観光，ショッピング等
    address = Column(Text, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    url = Column(String(500), nullable=True)
    image_url = Column(String(500), nullable=True)
    
    is_active = Column(Boolean, default=True)
    display_order = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class SettingKey(str, enum.Enum):
    GOOGLE_SHEET_ID = "google_sheet_id"
    SHEET_COLOR_MAPPING = "sheet_color_mapping"
    STATUS_MAPPING = "status_mapping"
    ASSIGNMENT_RULES = "assignment_rules"


class Setting(Base):
    """設定マスタテーブル"""
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(SQLEnum(SettingKey), unique=True, nullable=False)
    value = Column(Text, nullable=False)  # JSON 形式で値を保存
    description = Column(String(500), nullable=True)
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def get_value(self) -> dict:
        """JSON 文字列を dict に変換して返す"""
        import json
        return json.loads(self.value)
    
    def set_value(self, data: dict):
        """dict を JSON 文字列として保存"""
        import json
        self.value = json.dumps(data, ensure_ascii=False)
