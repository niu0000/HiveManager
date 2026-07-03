from sqlalchemy.orm import Session
from app.services.google_sheets_service import GoogleSheetsService
from app.services.settings_service import SettingsService
from app.utils.color_resolver import ColorResolver
from app.models.base import Assignment, Reservation, Bed, AssignmentStatus
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class SyncService:
    def __init__(self, db: Session):
        self.db = db
        self.sheets_service = GoogleSheetsService()
        self.settings_service = SettingsService()

    def pull_from_sheet(self) -> dict:
        sheet_id = self.settings_service.get(self.db, "google_sheet_id")
        if not sheet_id:
            raise Exception("Google Sheet ID not configured")
        
        # データ取得
        values = self.sheets_service.get_sheet_data(sheet_id)
        colors = self.sheets_service.get_background_colors(sheet_id)
        
        # 簡易同期ロジック：シートのデータを見て DB を更新
        # 実際は行と予約のマッチングロジックが必要
        return {"status": "success", "rows_processed": len(values)}

    def push_to_sheet(self) -> dict:
        sheet_id = self.settings_service.get(self.db, "google_sheet_id")
        if not sheet_id:
            raise Exception("Google Sheet ID not configured")
        
        # アサイン情報をシートに反映
        assignments = self.db.query(Assignment).filter(Assignment.status == AssignmentStatus.ASSIGNED).all()
        
        updates = []
        for assign in assignments:
            res = assign.reservation
            bed = assign.bed
            # シートのどのセルを更新するかはマッピング定義が必要
            # 簡易例：A 列に名前、B 列に日付
            updates.append([f"{res.last_name} {res.first_name}", str(assign.check_in_date.date())])
        
        if updates:
            self.sheets_service.update_sheet_data(sheet_id, "Sheet1!A1", updates)
        
        return {"status": "success", "updated_count": len(updates)}

    def full_sync(self) -> dict:
        pull_res = self.pull_from_sheet()
        push_res = self.push_to_sheet()
        return {
            "status": "completed",
            "pull": pull_res,
            "push": push_res
        }