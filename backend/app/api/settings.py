from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.base import Setting, SheetSetting
from app.schemas.setting import SettingCreate, SettingResponse, SheetSettingCreate, SheetSettingResponse
from typing import List

router = APIRouter()

@router.get("/", response_model=List[SettingResponse])
def get_all_settings(db: Session = Depends(get_db)):
    settings = db.query(Setting).all()
    return settings

@router.post("/", response_model=SettingResponse)
def create_or_update_setting(setting_data: SettingCreate, db: Session = Depends(get_db)):
    setting = db.query(Setting).filter(Setting.key == setting_data.key).first()
    
    if setting:
        setting.value = setting_data.value
        if setting_data.description:
            setting.description = setting_data.description
    else:
        setting = Setting(
            key=setting_data.key,
            value=setting_data.value,
            description=setting_data.description
        )
        db.add(setting)
    
    db.commit()
    db.refresh(setting)
    return setting

@router.get("/{key}", response_model=SettingResponse)
def get_setting(key: str, db: Session = Depends(get_db)):
    setting = db.query(Setting).filter(Setting.key == key).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Setting not found")
    return setting

# シート設定用エンドポイント
@router.get("/sheet", response_model=SheetSettingResponse)
def get_sheet_setting(db: Session = Depends(get_db)):
    setting = db.query(SheetSetting).order_by(SheetSetting.id.desc()).first()
    if not setting:
        # デフォルト値を返す
        return SheetSettingResponse(
            id=0,
            spreadsheet_id="",
            sheet_name="Sheet1",
            mappings=[]
        )
    return setting

@router.post("/sheet", response_model=SheetSettingResponse)
def create_or_update_sheet_setting(setting_data: SheetSettingCreate, db: Session = Depends(get_db)):
    setting = db.query(SheetSetting).first()
    
    if setting:
        setting.spreadsheet_id = setting_data.spreadsheet_id
        setting.sheet_name = setting_data.sheet_name
        setting.mappings = [m.model_dump() for m in setting_data.mappings]
    else:
        setting = SheetSetting(
            spreadsheet_id=setting_data.spreadsheet_id,
            sheet_name=setting_data.sheet_name,
            mappings=[m.model_dump() for m in setting_data.mappings]
        )
        db.add(setting)
    
    db.commit()
    db.refresh(setting)
    return setting
