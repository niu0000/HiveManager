from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.base import Recommendation
from app.schemas.recommendation import RecommendationResponse
from app.services.recommendation_service import RecommendationService

router = APIRouter()

@router.get("/", response_model=List[RecommendationResponse])
def get_recommendations(category: Optional[str] = None, db: Session = Depends(get_db)):
    return RecommendationService.get_all(db, category)