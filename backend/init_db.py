from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models.base import Room, Bed, RoomType, BedPosition, Setting, Recommendation
import json

def init():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    try:
        # 部屋作成
        if db.query(Room).count() == 0:
            r1 = Room(name="101", room_type=RoomType.CAPSULE, attributes={"floor": 1})
            r2 = Room(name="102", room_type=RoomType.CAPSULE, attributes={"floor": 1})
            r3 = Room(name="201", room_type=RoomType.ROOM, attributes={"floor": 2, "size": "4人部屋"})
            db.add_all([r1, r2, r3])
            db.commit()
            db.refresh(r1); db.refresh(r2); db.refresh(r3)
            
            # ベッド作成
            beds = [
                Bed(room_id=r1.id, bed_number="101A", position=BedPosition.LOWER),
                Bed(room_id=r1.id, bed_number="101B", position=BedPosition.UPPER),
                Bed(room_id=r2.id, bed_number="102A", position=BedPosition.LOWER),
                Bed(room_id=r2.id, bed_number="102B", position=BedPosition.UPPER),
                Bed(room_id=r3.id, bed_number="201-1", position=None),
                Bed(room_id=r3.id, bed_number="201-2", position=None),
            ]
            db.add_all(beds)
            db.commit()
        
        # 設定作成
        if db.query(Setting).filter(Setting.key == "google_sheet_id").count() == 0:
            settings = [
                Setting(key="google_sheet_id", value="YOUR_SPREADSHEET_ID_HERE", description="対象スプレッドシート ID"),
                Setting(key="sheet_color_mapping", value=json.dumps({"blue": "reserved", "green": "confirmed"}), description="色マッピング"),
            ]
            db.add_all(settings)
            db.commit()
            
        # おすすめ場所作成
        if db.query(Recommendation).count() == 0:
            recs = [
                Recommendation(
                    name_ja="清水寺", name_en="Kiyomizu-dera", name_zh="清水寺", name_ko="기요미즈데라",
                    category="sightseeing",
                    description_ja="京都の有名な寺院", description_en="Famous temple in Kyoto",
                    description_zh="京都著名的寺庙", description_ko="교토의 유명한 사찰",
                    latitude=34.9949, longitude=135.7850
                ),
                Recommendation(
                    name_ja="コンビニ", name_en="Convenience Store", name_zh="便利店", name_ko="편의점",
                    category="convenience",
                    description_ja="24 時間営業", description_en="Open 24 hours",
                    description_zh="24 小时营业", description_ko="24 시간 영업",
                    latitude=34.9870, longitude=135.7600
                )
            ]
            db.add_all(recs)
            db.commit()
            
        print("Database initialized successfully!")
    finally:
        db.close()

if __name__ == "__main__":
    init()