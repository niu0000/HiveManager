from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from app.database import engine, get_db
from app.models.base import Base
from app.api import auth, rooms, reservations, assignments, sheets, cleaning, recommendations
from app.config import settings

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
)

# CORS middleware (LAN 内利用を想定)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # LAN 内のため全て許可
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Dormitory Manager API", "version": "1.0.0"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(rooms.router, prefix="/api/rooms", tags=["Rooms"])
app.include_router(reservations.router, prefix="/api/reservations", tags=["Reservations"])
app.include_router(assignments.router, prefix="/api/assignments", tags=["Assignments"])
app.include_router(sheets.router, prefix="/api/sheets", tags=["Google Sheets"])
app.include_router(cleaning.router, prefix="/api/cleaning", tags=["Cleaning"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["Recommendations"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.host, port=settings.port)
