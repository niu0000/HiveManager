from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.base import Recommendation
from app.schemas.recommendation import RecommendationResponse, RecommendationCreate
from app.services.recommendation_service import RecommendationService
from app.services.qr_service import QRCodeService

router = APIRouter()

@router.get("/", response_model=List[RecommendationResponse])
def get_recommendations(category: Optional[str] = None, db: Session = Depends(get_db)):
    return RecommendationService.get_all(db, category)

@router.post("/", response_model=RecommendationResponse)
def create_recommendation(data: RecommendationCreate, db: Session = Depends(get_db)):
    return RecommendationService.create(db, data.dict())

@router.get("/{item_id}/qr")
def get_recommendation_qr(item_id: int, db: Session = Depends(get_db)):
    """おすすめ情報の QR コードを生成"""
    item = db.query(Recommendation).filter(Recommendation.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    
    qr_buffer = QRCodeService.generate_recommendation_qr(
        recommendation_id=item_id,
        name=item.name_ja
    )
    
    from fastapi.responses import Response
    return Response(
        content=qr_buffer.getvalue(),
        media_type="image/png",
        headers={"Content-Disposition": f"attachment; filename=recommendation_{item_id}.png"}
    )