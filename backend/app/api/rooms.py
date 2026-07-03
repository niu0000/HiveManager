from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.base import Room, Bed, RoomType, GenderType
from app.schemas import RoomCreate, RoomResponse, RoomUpdate, BedCreate, BedResponse, BedUpdate

router = APIRouter()


@router.get("/", response_model=List[RoomResponse])
def get_rooms(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    rooms = db.query(Room).filter(Room.is_active == True).offset(skip).limit(limit).all()
    return rooms


@router.get("/{room_id}", response_model=RoomResponse)
def get_room(room_id: int, db: Session = Depends(get_db)):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return room


@router.post("/", response_model=RoomResponse)
def create_room(room: RoomCreate, db: Session = Depends(get_db)):
    # Check if room number already exists
    existing = db.query(Room).filter(Room.room_number == room.room_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Room number already exists")
    
    db_room = Room(**room.model_dump())
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room


@router.put("/{room_id}", response_model=RoomResponse)
def update_room(room_id: int, room_update: RoomUpdate, db: Session = Depends(get_db)):
    db_room = db.query(Room).filter(Room.id == room_id).first()
    if not db_room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    update_data = room_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_room, key, value)
    
    db.commit()
    db.refresh(db_room)
    return db_room


@router.delete("/{room_id}")
def delete_room(room_id: int, db: Session = Depends(get_db)):
    db_room = db.query(Room).filter(Room.id == room_id).first()
    if not db_room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    db_room.is_active = False
    db.commit()
    return {"message": "Room deleted successfully"}


# Bed endpoints
@router.get("/{room_id}/beds", response_model=List[BedResponse])
def get_beds(room_id: int, db: Session = Depends(get_db)):
    beds = db.query(Bed).filter(Bed.room_id == room_id, Bed.is_active == True).all()
    return beds


@router.post("/{room_id}/beds", response_model=BedResponse)
def create_bed(room_id: int, bed: BedCreate, db: Session = Depends(get_db)):
    # Verify room exists
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    # Check if bed number already exists in this room
    existing = db.query(Bed).filter(Bed.room_id == room_id, Bed.bed_number == bed.bed_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Bed number already exists in this room")
    
    db_bed = Bed(**bed.model_dump())
    db.add(db_bed)
    db.commit()
    db.refresh(db_bed)
    return db_bed
