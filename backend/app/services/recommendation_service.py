from sqlalchemy.orm import Session
from app.models.base import Recommendation
from typing import List, Optional

class RecommendationService:
    @staticmethod
    def get_all(db: Session, category: Optional[str] = None, lang: str = "ja") -> List[Recommendation]:
        query = db.query(Recommendation)
        if category:
            query = query.filter(Recommendation.category == category)
        return query.all()

    @staticmethod
    def create(db: Session, data: dict) -> Recommendation:
        item = Recommendation(**data)
        db.add(item)
        db.commit()
        db.refresh(item)
        return item

    @staticmethod
    def update(db: Session, item_id: int, data: dict) -> Optional[Recommendation]:
        item = db.query(Recommendation).filter(Recommendation.id == item_id).first()
        if not item:
            return None
        for key, value in data.items():
            if hasattr(item, key):
                setattr(item, key, value)
        db.commit()
        db.refresh(item)
        return item

    @staticmethod
    def delete(db: Session, item_id: int) -> bool:
        item = db.query(Recommendation).filter(Recommendation.id == item_id).first()
        if not item:
            return False
        db.delete(item)
        db.commit()
        return True