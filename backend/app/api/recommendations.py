from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.base import Recommendation
from app.schemas import RecommendationCreate, RecommendationResponse, RecommendationUpdate

router = APIRouter()


@router.get("/", response_model=List[RecommendationResponse])
def get_recommendations(
    language: str = "ja",
    category: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """おすすめ場所を取得（言語別）"""
    query = db.query(Recommendation).filter(Recommendation.is_active == True)
    
    if category:
        query = query.filter(Recommendation.category == category)
    
    # 言語に応じたソート（表示順）
    query = query.order_by(Recommendation.display_order)
    
    recommendations = query.offset(skip).limit(limit).all()
    return recommendations


@router.get("/{recommendation_id}", response_model=RecommendationResponse)
def get_recommendation(recommendation_id: int, db: Session = Depends(get_db)):
    recommendation = db.query(Recommendation).filter(Recommendation.id == recommendation_id).first()
    if not recommendation:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    return recommendation


@router.post("/", response_model=RecommendationResponse)
def create_recommendation(recommendation: RecommendationCreate, db: Session = Depends(get_db)):
    db_recommendation = Recommendation(**recommendation.model_dump())
    db.add(db_recommendation)
    db.commit()
    db.refresh(db_recommendation)
    return db_recommendation


@router.put("/{recommendation_id}", response_model=RecommendationResponse)
def update_recommendation(recommendation_id: int, recommendation_update: RecommendationUpdate, db: Session = Depends(get_db)):
    db_recommendation = db.query(Recommendation).filter(Recommendation.id == recommendation_id).first()
    if not db_recommendation:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    
    update_data = recommendation_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_recommendation, key, value)
    
    db.commit()
    db.refresh(db_recommendation)
    return db_recommendation


@router.delete("/{recommendation_id}")
def delete_recommendation(recommendation_id: int, db: Session = Depends(get_db)):
    db_recommendation = db.query(Recommendation).filter(Recommendation.id == recommendation_id).first()
    if not db_recommendation:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    
    db_recommendation.is_active = False
    db.commit()
    return {"message": "Recommendation deleted successfully"}


@router.get("/categories", response_model=List[str])
def get_categories(db: Session = Depends(get_db)):
    """カテゴリ一覧を取得"""
    categories = db.query(Recommendation.category).filter(
        Recommendation.category != None,
        Recommendation.is_active == True
    ).distinct().all()
    
    return [cat[0] for cat in categories if cat[0]]
