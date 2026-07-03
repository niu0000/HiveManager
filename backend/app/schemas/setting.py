from pydantic import BaseModel
from typing import Optional

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