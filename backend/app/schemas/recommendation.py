from pydantic import BaseModel
from typing import Optional, List

class RecommendationCreate(BaseModel):
    name_ja: str
    name_en: str
    name_zh: str
    name_ko: str
    category: str
    description_ja: Optional[str] = None
    description_en: Optional[str] = None
    description_zh: Optional[str] = None
    description_ko: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    hours: Optional[str] = None
    budget: Optional[str] = None

class RecommendationResponse(BaseModel):
    id: int
    name_ja: str
    name_en: str
    name_zh: str
    name_ko: str
    category: str
    description_ja: Optional[str] = None
    description_en: Optional[str] = None
    description_zh: Optional[str] = None
    description_ko: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    hours: Optional[str] = None
    budget: Optional[str] = None
    
    class Config:
        from_attributes = True

class RecommendationListResponse(BaseModel):
    items: List[RecommendationResponse]
    total: int