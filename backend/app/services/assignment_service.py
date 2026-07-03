from sqlalchemy.orm import Session
from app.models.base import Reservation, Assignment, Bed, Room, AssignmentStatus
from app.services.csv_parser import parse_neppan_csv
from datetime import datetime, timedelta
from typing import List, Tuple

class AssignmentService:
    @staticmethod
    def import_csv(db: Session, file_path: str) -> int:
        reservations = parse_neppan_csv(file_path, db)
        count = 0
        for res in reservations:
            # 簡易重複チェック (名前 + チェックイン日)
            existing = db.query(Reservation).filter(
                Reservation.first_name == res.first_name,
                Reservation.last_name == res.last_name,
                Reservation.check_in_date == res.check_in_date
            ).first()
            
            if not existing:
                db.add(res)
                count += 1
        
        db.commit()
        return count

    @staticmethod
    def run_auto_assign(db: Session) -> Tuple[int, List[dict]]:
        # 未アサインの予約を取得
        # 簡易ロジック：全予約に対してアサインを試みる（実際は未アサインのみ）
        reservations = db.query(Reservation).filter(
            Reservation.check_in_date >= datetime.now()
        ).all()
        
        success_count = 0
        failures = []
        
        for res in reservations:
            # 既存アサイン確認
            existing = db.query(Assignment).filter(
                Assignment.reservation_id == res.id
            ).first()
            if existing:
                continue
            
            # 簡易アサインロジック：最初の空ベッドを割り当て
            beds = db.query(Bed).all()
            assigned = False
            for bed in beds:
                # 競合チェック（簡易）
                conflict = db.query(Assignment).filter(
                    Assignment.bed_id == bed.id,
                    Assignment.check_in_date <= res.check_out_date,
                    Assignment.check_out_date >= res.check_in_date
                ).first()
                
                if not conflict:
                    # アサイン作成
                    new_assign = Assignment(
                        reservation_id=res.id,
                        bed_id=bed.id,
                        check_in_date=res.check_in_date,
                        check_out_date=res.check_out_date,
                        status=AssignmentStatus.ASSIGNED
                    )
                    db.add(new_assign)
                    success_count += 1
                    assigned = True
                    break
            
            if not assigned:
                failures.append({
                    "reservation_id": res.id,
                    "guest_name": f"{res.last_name} {res.first_name}",
                    "reason": "No available beds found"
                })
        
        db.commit()
        return success_count, failures

    @staticmethod
    def manual_assign(db: Session, reservation_id: int, bed_id: int, force: bool = False) -> Assignment:
        res = db.query(Reservation).filter(Reservation.id == reservation_id).first()
        if not res:
            raise ValueError("Reservation not found")
        
        bed = db.query(Bed).filter(Bed.id == bed_id).first()
        if not bed:
            raise ValueError("Bed not found")
        
        if not force:
            # 競合チェック
            conflict = db.query(Assignment).filter(
                Assignment.bed_id == bed_id,
                Assignment.check_in_date <= res.check_out_date,
                Assignment.check_out_date >= res.check_in_date
            ).first()
            if conflict:
                raise ValueError("Bed is already occupied for this period")
        
        # 既存アサインがあれば更新、なければ作成
        existing = db.query(Assignment).filter(Assignment.reservation_id == reservation_id).first()
        if existing:
            existing.bed_id = bed_id
            existing.status = AssignmentStatus.ASSIGNED
        else:
            existing = Assignment(
                reservation_id=reservation_id,
                bed_id=bed_id,
                check_in_date=res.check_in_date,
                check_out_date=res.check_out_date,
                status=AssignmentStatus.ASSIGNED
            )
            db.add(existing)
        
        db.commit()
        return existing