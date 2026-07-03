from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.base import Assignment, Bed, AssignmentStatus
from app.schemas.assignment import AssignmentResponse, ManualAssignRequest, AssignRunResponse, AssignFailureItem
from app.services.assignment_service import AssignmentService

router = APIRouter()

@router.get("/status")
def get_status(db: Session = Depends(get_db)):
    assignments = db.query(Assignment).all()
    beds = db.query(Bed).all()
    return {"assignments": len(assignments), "total_beds": len(beds)}

@router.post("/run", response_model=AssignRunResponse)
def run_auto_assign(db: Session = Depends(get_db)):
    success, failures = AssignmentService.run_auto_assign(db)
    failure_items = [AssignFailureItem(**f) for f in failures]
    return AssignRunResponse(success_count=success, failure_count=len(failures), failures=failure_items)

@router.post("/manual", response_model=AssignmentResponse)
def manual_assign(req: ManualAssignRequest, db: Session = Depends(get_db)):
    try:
        assignment = AssignmentService.manual_assign(db, req.reservation_id, req.bed_id, req.force)
        return assignment
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))