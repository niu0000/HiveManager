from sqlalchemy.orm import Session
from app.models.base import Setting
import json

class SettingsService:
    _cache = {}

    @classmethod
    def get(cls, db: Session, key: str, default: str = None):
        if key in cls._cache:
            return cls._cache[key]
        
        setting = db.query(Setting).filter(Setting.key == key).first()
        if setting:
            cls._cache[key] = setting.value
            return setting.value
        return default

    @classmethod
    def set(cls, db: Session, key: str, value: str, description: str = None):
        setting = db.query(Setting).filter(Setting.key == key).first()
        if setting:
            setting.value = value
            if description:
                setting.description = description
        else:
            setting = Setting(key=key, value=value, description=description)
            db.add(setting)
        db.commit()
        cls._cache[key] = value
        return setting

    @classmethod
    def get_json(cls, db: Session, key: str, default: dict = None):
        val = cls.get(db, key)
        if val:
            try:
                return json.loads(val)
            except:
                return default
        return default