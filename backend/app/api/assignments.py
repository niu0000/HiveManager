from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.base import Assignment, Room, Bed, Reservation
from app.schemas import AssignmentCreate, AssignmentResponse, AssignmentUpdate

router = APIRouter()


@router.get("/", response_model=List[AssignmentResponse])
def get_assignments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    assignments = db.query(Assignment).offset(skip).limit(limit).all()
    return assignments


@router.get("/{assignment_id}", response_model=AssignmentResponse)
def get_assignment(assignment_id: int, db: Session = Depends(get_db)):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return assignment


@router.post("/", response_model=AssignmentResponse)
def create_assignment(assignment: AssignmentCreate, db: Session = Depends(get_db)):
    # Verify reservation and room exist
    reservation = db.query(Reservation).filter(Reservation.id == assignment.reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    
    room = db.query(Room).filter(Room.id == assignment.room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    db_assignment = Assignment(**assignment.model_dump())
    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)
    return db_assignment


@router.put("/{assignment_id}", response_model=AssignmentResponse)
def update_assignment(assignment_id: int, assignment_update: AssignmentUpdate, db: Session = Depends(get_db)):
    db_assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not db_assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    update_data = assignment_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_assignment, key, value)
    
    db.commit()
    db.refresh(db_assignment)
    return db_assignment


@router.delete("/{assignment_id}")
def delete_assignment(assignment_id: int, db: Session = Depends(get_db)):
    db_assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not db_assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    db.delete(db_assignment)
    db.commit()
    return {"message": "Assignment deleted successfully"}


@router.post("/auto-assign", response_model=dict)
def auto_assign_all(db: Session = Depends(get_db)):
    """
    未アサインの予約を自動的にベッドに割り当てる
    TODO: assigner.py の実装が必要
    """
    return {
        "message": "Auto-assignment not yet implemented",
        "status": "pending"
    }
