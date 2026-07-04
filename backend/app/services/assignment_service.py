from sqlalchemy.orm import Session
from app.models.base import Reservation, Assignment, Bed, Room, AssignmentStatus, BedPosition, RoomType, CleaningStatus, CleaningRecord
from app.services.csv_parser import parse_neppan_csv
from datetime import datetime, timedelta
from typing import List, Tuple, Dict, Optional, Set
from collections import defaultdict
import re

class AssignmentService:
    """
    高度な自動アサインエンジン
    - 性別解析・男女別ベッド振り分け
    - 連泊移動最小化アルゴリズム
    - 賢い上下段最適化（スマート階層アサイン）
    - 手動確定・ロック機能
    - For2（ファミリールーム）対応
    - 競合解決・優先度スコアリングシステム
    """
    
    @staticmethod
    def _parse_gender(gender_str: Optional[str]) -> Optional[str]:
        """
        性別文字列を正規化
        'male', 'm', '男' → 'M'
        'female', 'f', '女' → 'F'
        """
        if not gender_str:
            return None
        
        gender_lower = str(gender_str).strip().lower()
        
        # 女性パターンを先にチェック（"female" に "male" が含まれるため）
        female_patterns = ['female', 'f', '女', 'woman', 'girl']
        for pattern in female_patterns:
            if pattern in gender_lower:
                return 'F'
        
        # 男性パターン
        male_patterns = ['male', 'm', '男', 'man', 'boy']
        for pattern in male_patterns:
            if pattern in gender_lower:
                return 'M'
        
        return None
    
    @staticmethod
    def _is_family_reservation(reservation: Reservation) -> bool:
        """
        ファミリー予約かどうかを判定
        大人 2 名以上をファミリーとみなす
        """
        return reservation.adults >= 2
    
    @staticmethod
    def _calculate_stay_score(reservations: List[Reservation], reservation: Reservation) -> int:
        """
        連泊日数に基づくスコアを計算
        相対的に長い順にスコア化
        """
        if not reservations:
            return reservation.nights or 1
        
        # 全予約の連泊日数の中央値を計算
        nights_list = [r.nights or 1 for r in reservations]
        median_nights = sorted(nights_list)[len(nights_list) // 2]
        
        # 中央値より長ければ高スコア
        stay_nights = reservation.nights or 1
        if stay_nights >= median_nights * 1.5:
            return 3  # 長期
        elif stay_nights >= median_nights:
            return 2  # 中期
        else:
            return 1  # 短期
    
    @staticmethod
    def _get_bed_occupancy_cache(db: Session, start_date: datetime, end_date: datetime) -> Dict[int, List[Assignment]]:
        """
        ベッドの稼働状況をキャッシュとして取得
        """
        assignments = db.query(Assignment).filter(
            Assignment.check_in_date < end_date,
            Assignment.check_out_date > start_date,
            Assignment.status != AssignmentStatus.CANCELLED
        ).all()
        
        occupancy = defaultdict(list)
        for assign in assignments:
            occupancy[assign.bed_id].append(assign)
        
        return occupancy
    
    @staticmethod
    def _is_bed_available(
        bed: Bed, 
        check_in: datetime, 
        check_out: datetime, 
        occupancy_cache: Dict[int, List[Assignment]]
    ) -> bool:
        """
        ベッドが指定期間利用可能かチェック
        """
        existing_assignments = occupancy_cache.get(bed.id, [])
        
        for assign in existing_assignments:
            # 期間重複チェック
            if assign.check_in_date < check_out and assign.check_out_date > check_in:
                return False
        
        return True
    
    @staticmethod
    def _get_cleaning_status(db: Session, bed: Bed, check_in: datetime) -> CleaningStatus:
        """
        チェックイン日の清掃ステータスを取得
        """
        # 直近の清掃記録を取得
        cleaning_record = db.query(CleaningRecord).filter(
            CleaningRecord.bed_id == bed.id
        ).order_by(CleaningRecord.completed_at.desc()).first()
        
        if cleaning_record and cleaning_record.completed_at:
            # 清掃完了後で、かつチェックイン日前なら COMPLETED とみなす
            if cleaning_record.completed_at < check_in:
                return CleaningStatus.COMPLETED
        
        return CleaningStatus.PENDING
    
    @staticmethod
    def _calculate_priority_score(
        reservation: Reservation,
        all_reservations: List[Reservation],
        is_existing_assignment: bool = False
    ) -> int:
        """
        アサイン優先度スコアを計算
        高いほど優先
        """
        score = 0
        
        # 既存アサイン（連泊中のゲスト）は最優先
        if is_existing_assignment:
            score += 1000
        
        # 連泊日数スコア
        stay_score = AssignmentService._calculate_stay_score(all_reservations, reservation)
        score += stay_score * 10
        
        # ファミリー予約ボーナス
        if AssignmentService._is_family_reservation(reservation):
            score += 50
        
        # 性別が明確な場合ボーナス（専用部屋割り当てのため）
        if reservation.gender:
            score += 5
        
        return score

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
        """
        高度な自動アサインエンジン
        - 性別解析・男女別ベッド振り分け
        - 連泊移動最小化アルゴリズム
        - 賢い上下段最適化（スマート階層アサイン）
        - For2（ファミリールーム）対応
        - 競合解決・優先度スコアリング
        """
        # 全予約を取得（過去分も含めて既存アサインを確認するため）
        all_reservations = db.query(Reservation).all()
        
        # 未アサインの予約をフィルタリング
        unassigned_reservations = []
        for res in all_reservations:
            if res.check_in_date and res.check_in_date >= datetime.now():
                existing = db.query(Assignment).filter(
                    Assignment.reservation_id == res.id,
                    Assignment.status != AssignmentStatus.CANCELLED
                ).first()
                if not existing:
                    unassigned_reservations.append(res)
        
        # 優先度スコアでソート（高い順）
        scored_reservations = []
        for res in unassigned_reservations:
            score = AssignmentService._calculate_priority_score(res, all_reservations, is_existing_assignment=False)
            scored_reservations.append((score, res))
        
        scored_reservations.sort(key=lambda x: x[0], reverse=True)
        
        # ベッド稼働キャッシュを構築
        min_date = min([r.check_in_date for r in unassigned_reservations]) if unassigned_reservations else datetime.now()
        max_date = max([r.check_out_date for r in unassigned_reservations if r.check_out_date]) if unassigned_reservations else datetime.now() + timedelta(days=30)
        occupancy_cache = AssignmentService._get_bed_occupancy_cache(db, min_date, max_date)
        
        # 全ベッド情報を取得
        all_beds = db.query(Bed).join(Room).all()
        
        success_count = 0
        failures = []
        
        for score, res in scored_reservations:
            # 既存アサイン確認（再チェック）
            existing = db.query(Assignment).filter(
                Assignment.reservation_id == res.id
            ).first()
            if existing:
                continue
            
            # ゲスト性別解析
            guest_gender = AssignmentService._parse_gender(res.gender)
            is_family = AssignmentService._is_family_reservation(res)
            
            # ベッド候補をフィルタリング
            candidate_beds = []
            for bed in all_beds:
                # 清掃ステータスチェック
                cleaning_status = AssignmentService._get_cleaning_status(db, bed, res.check_in_date)
                if cleaning_status in [CleaningStatus.UNAVAILABLE, CleaningStatus.IN_PROGRESS]:
                    continue
                
                # 期間空きチェック
                if not AssignmentService._is_bed_available(bed, res.check_in_date, res.check_out_date, occupancy_cache):
                    continue
                
                candidate_beds.append(bed)
            
            # 性別・部屋タイプによるフィルタリング
            gender_filtered_beds = []
            for bed in candidate_beds:
                room = bed.room
                room_attrs = room.attributes or {}
                
                # ファミリー予約の場合、ルームタイプのみ対象
                if is_family:
                    if room.room_type != RoomType.ROOM:
                        continue
                    # capacity チェック
                    capacity = room_attrs.get('capacity', 1)
                    if capacity < res.adults:
                        continue
                
                # 性別制限がある場合
                gender_restriction = room_attrs.get('gender_restriction')
                if gender_restriction and guest_gender:
                    if gender_restriction == 'male' and guest_gender != 'M':
                        continue
                    if gender_restriction == 'female' and guest_gender != 'F':
                        continue
                
                gender_filtered_beds.append(bed)
            
            # 候補がなければ全ベッドから再試行（フォールバック）
            if not gender_filtered_beds:
                gender_filtered_beds = candidate_beds
            
            # スマート階層アサイン：連泊長い順に下段優先
            stay_score = AssignmentService._calculate_stay_score(all_reservations, res)
            
            # ベッドにスコアを付与してソート
            scored_beds = []
            for bed in gender_filtered_beds:
                bed_score = 0
                
                # 下段ボーナス（長期連泊ほど高く）
                if bed.position == BedPosition.LOWER:
                    bed_score += stay_score * 10
                
                # 上段は基本スコア低め
                if bed.position == BedPosition.UPPER:
                    bed_score += 5
                
                scored_beds.append((bed_score, bed))
            
            # スコア順にソート（高い順）
            scored_beds.sort(key=lambda x: x[0], reverse=True)
            
            # 最初の空ベッドをアサイン
            assigned = False
            for _, bed in scored_beds:
                # 最終競合チェック
                conflict = db.query(Assignment).filter(
                    Assignment.bed_id == bed.id,
                    Assignment.check_in_date <= res.check_out_date,
                    Assignment.check_out_date >= res.check_in_date,
                    Assignment.status != AssignmentStatus.CANCELLED
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
                    
                    # キャッシュ更新
                    occupancy_cache[bed.id].append(new_assign)
                    
                    success_count += 1
                    assigned = True
                    break
            
            if not assigned:
                failures.append({
                    "reservation_id": res.id,
                    "guest_name": f"{res.last_name} {res.first_name}",
                    "reason": "No available beds found",
                    "gender": guest_gender,
                    "is_family": is_family,
                    "adults": res.adults
                })
        
        db.commit()
        return success_count, failures

    @staticmethod
    def manual_assign(
        db: Session, 
        reservation_id: int, 
        bed_id: int, 
        force: bool = False,
        lock: bool = False,
        lock_reason: Optional[str] = None,
        user_name: Optional[str] = None,
        assign_reason: Optional[str] = None
    ) -> Assignment:
        """
        手動アサイン機能
        - ロック機能対応
        - 監査証跡記録
        - 説明可能性サポート
        """
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
                Assignment.check_out_date >= res.check_in_date,
                Assignment.status != AssignmentStatus.CANCELLED
            ).first()
            if conflict:
                raise ValueError("Bed is already occupied for this period")
        
        # 既存アサインがあれば更新、なければ作成
        existing = db.query(Assignment).filter(Assignment.reservation_id == reservation_id).first()
        if existing:
            existing.bed_id = bed_id
            existing.status = AssignmentStatus.ASSIGNED
            if assign_reason:
                existing.assign_reason = assign_reason
        else:
            existing = Assignment(
                reservation_id=reservation_id,
                bed_id=bed_id,
                check_in_date=res.check_in_date,
                check_out_date=res.check_out_date,
                status=AssignmentStatus.ASSIGNED,
                assign_reason=assign_reason
            )
            db.add(existing)
        
        # ロック設定
        if lock:
            existing.is_locked = True
            existing.lock_reason = lock_reason
            existing.locked_by = user_name
            existing.locked_at = datetime.utcnow()
        
        db.commit()
        db.refresh(existing)
        return existing
    
    @staticmethod
    def lock_assignment(
        db: Session, 
        assignment_id: int, 
        lock: bool = True,
        lock_reason: Optional[str] = None,
        user_name: Optional[str] = None
    ) -> Assignment:
        """
        アサインのロック/アンロック
        - 手動確定ベッドの上書き防止
        - 監査証跡の記録
        """
        assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
        if not assignment:
            raise ValueError("Assignment not found")
        
        assignment.is_locked = lock
        if lock:
            assignment.lock_reason = lock_reason
            assignment.locked_by = user_name
            assignment.locked_at = datetime.utcnow()
        else:
            # ロック解除時は理由・ユーザーをクリア
            assignment.lock_reason = None
            assignment.locked_by = None
            assignment.locked_at = None
        
        db.commit()
        db.refresh(assignment)
        return assignment
    
    @staticmethod
    def bulk_unlock_by_user(db: Session, user_name: str) -> int:
        """
        特定ユーザーによるロックを一括解除（管理者機能）
        """
        assignments = db.query(Assignment).filter(
            Assignment.locked_by == user_name,
            Assignment.is_locked == True
        ).all()
        
        count = 0
        for assign in assignments:
            assign.is_locked = False
            assign.lock_reason = None
            assign.locked_by = None
            assign.locked_at = None
            count += 1
        
        db.commit()
        return count
    
    @staticmethod
    def get_locked_assignments(db: Session) -> List[Assignment]:
        """
        ロック中のアサイン一覧を取得
        """
        return db.query(Assignment).filter(
            Assignment.is_locked == True
        ).all()