from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.base import Room, Bed
from app.schemas.room import RoomCreate, RoomResponse, BedCreate, BedResponse

router = APIRouter()

@router.get("/", response_model=List[RoomResponse])
def get_rooms(db: Session = Depends(get_db)):
    return db.query(Room).all()

@router.post("/", response_model=RoomResponse)
def create_room(room: RoomCreate, db: Session = Depends(get_db)):
    db_room = Room(**room.model_dump())
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room

@router.get("/{room_id}/beds", response_model=List[BedResponse])
def get_beds(room_id: int, db: Session = Depends(get_db)):
    return db.query(Bed).filter(Bed.room_id == room_id).all()