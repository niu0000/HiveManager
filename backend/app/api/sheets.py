from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.base import Setting, SettingKey
from app.schemas import SettingResponse, SettingUpdate

router = APIRouter()


@router.get("/settings", response_model=List[SettingResponse])
def get_sheet_settings(db: Session = Depends(get_db)):
    """Google Sheets 関連の設定を取得"""
    settings = db.query(Setting).filter(
        Setting.key.in_([
            SettingKey.GOOGLE_SHEET_ID,
            SettingKey.SHEET_COLOR_MAPPING,
            SettingKey.STATUS_MAPPING
        ])
    ).all()
    return settings


@router.get("/sheet-id", response_model=dict)
def get_sheet_id(db: Session = Depends(get_db)):
    """スプレッドシート ID を取得"""
    setting = db.query(Setting).filter(Setting.key == SettingKey.GOOGLE_SHEET_ID).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Sheet ID not configured")
    
    value = setting.get_value()
    return {"sheet_id": value.get('sheet_id', '')}


@router.put("/sheet-id", response_model=dict)
def update_sheet_id(sheet_id: str, db: Session = Depends(get_db)):
    """スプレッドシート ID を更新"""
    setting = db.query(Setting).filter(Setting.key == SettingKey.GOOGLE_SHEET_ID).first()
    
    if not setting:
        setting = Setting(
            key=SettingKey.GOOGLE_SHEET_ID,
            description='Google スプレッドシート ID'
        )
        db.add(setting)
    
    setting.set_value({'sheet_id': sheet_id})
    db.commit()
    db.refresh(setting)
    
    return {"message": "Sheet ID updated successfully", "sheet_id": sheet_id}


@router.get("/color-mapping", response_model=dict)
def get_color_mapping(db: Session = Depends(get_db)):
    """背景色とステータスのマッピングを取得"""
    setting = db.query(Setting).filter(Setting.key == SettingKey.SHEET_COLOR_MAPPING).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Color mapping not configured")
    
    return setting.get_value()


@router.put("/color-mapping", response_model=dict)
def update_color_mapping(mapping: dict, db: Session = Depends(get_db)):
    """背景色とステータスのマッピングを更新"""
    setting = db.query(Setting).filter(Setting.key == SettingKey.SHEET_COLOR_MAPPING).first()
    
    if not setting:
        setting = Setting(
            key=SettingKey.SHEET_COLOR_MAPPING,
            description='シートの背景色とステータスのマッピング'
        )
        db.add(setting)
    
    setting.set_value(mapping)
    db.commit()
    db.refresh(setting)
    
    return {"message": "Color mapping updated successfully", "mapping": mapping}


@router.post("/sync", response_model=dict)
def sync_with_sheets(db: Session = Depends(get_db)):
    """
    Google スプレッドシートと同期する
    TODO: sheets_sync.py の実装が必要
    """
    return {
        "message": "Sync not yet implemented",
        "status": "pending"
    }
