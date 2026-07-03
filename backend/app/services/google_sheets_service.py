from google.oauth2 import service_account
from googleapiclient.discovery import build
from app.config import settings
import os
import logging

logger = logging.getLogger(__name__)

class GoogleSheetsService:
    def __init__(self, credentials_path: str = "service_account.json"):
        self.credentials_path = credentials_path
        self.service = None
        self._init_service()

    def _init_service(self):
        if not os.path.exists(self.credentials_path):
            logger.warning(f"Credentials file not found: {self.credentials_path}")
            return
        
        try:
            creds = service_account.Credentials.from_service_account_file(
                self.credentials_path, scopes=settings.GOOGLE_SCOPES
            )
            self.service = build('sheets', 'v4', credentials=creds)
            logger.info("Google Sheets service initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Google Sheets service: {e}")
            self.service = None

    def get_sheet_data(self, spreadsheet_id: str, range_name: str = "Sheet1!A1:Z1000"):
        if not self.service:
            raise Exception("Google Sheets service not initialized")
        
        try:
            sheet = self.service.spreadsheets()
            result = sheet.values().get(spreadsheetId=spreadsheet_id, range=range_name).execute()
            return result.get('values', [])
        except Exception as e:
            raise Exception(f"Failed to get sheet data: {str(e)}")

    def update_sheet_data(self, spreadsheet_id: str, range_name: str, values: list):
        if not self.service:
            raise Exception("Google Sheets service not initialized")
        
        try:
            body = {'values': values}
            sheet = self.service.spreadsheets()
            result = sheet.values().update(
                spreadsheetId=spreadsheet_id,
                range=range_name,
                valueInputOption='RAW',
                body=body
            ).execute()
            return result
        except Exception as e:
            raise Exception(f"Failed to update sheet data: {str(e)}")

    def get_background_colors(self, spreadsheet_id: str, range_name: str = "Sheet1!A1:Z1000"):
        if not self.service:
            raise Exception("Google Sheets service not initialized")
        
        try:
            sheet = self.service.spreadsheets()
            # 背景色を取得するには conditionalFormatting や cellFormat を取得する必要がある
            # 簡易版：まずはデータ取得のみ実装
            # 完全実装には spreadsheets.get を使用して formattedValues を取得
            grid = sheet.get(spreadsheetId=spreadsheet_id, ranges=[range_name], includeGridData=True).execute()
            
            colors = []
            sheets_data = grid.get('sheets', [])
            if sheets_data:
                data = sheets_data[0].get('data', [])
                if data:
                    row_data = data[0].get('rowData', [])
                    for row in row_data:
                        row_colors = []
                        values = row.get('values', [])
                        for val in values:
                            fmt = val.get('effectiveFormat', {})
                            bg = fmt.get('backgroundColor', {})
                            r = bg.get('red', 0) * 255
                            g = bg.get('green', 0) * 255
                            b = bg.get('blue', 0) * 255
                            row_colors.append((int(r), int(g), int(b)))
                        colors.append(row_colors)
            return colors
        except Exception as e:
            raise Exception(f"Failed to get background colors: {str(e)}")