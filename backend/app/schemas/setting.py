from pydantic import BaseModel
from typing import Optional, List, Dict

class SettingCreate(BaseModel):
    key: str
    value: str
    description: Optional[str] = None

class SettingResponse(BaseModel):
    id: int
    key: str
    value: str
    description: Optional[str] = None
    
    class Config:
        from_attributes = True

class ColumnMapping(BaseModel):
    spreadsheetColumn: str
    systemField: str

class SheetSettingCreate(BaseModel):
    spreadsheet_id: str
    sheet_name: Optional[str] = "Sheet1"
    mappings: List[ColumnMapping] = []

class SheetSettingResponse(BaseModel):
    id: int
    spreadsheet_id: str
    sheet_name: str
    mappings: List[ColumnMapping]
    
    class Config:
        from_attributes = True