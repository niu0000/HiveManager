from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, init_db
from app.api import auth, rooms, reservations, assignments, sheets, cleaning, recommendations, sync, dashboard, settings
from app.models.base import Base

# DB テーブル作成
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hive Manager API", version="1.0.0")

# CORS 設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 本番では制限する
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ルーター登録
app.include_router(auth, prefix="/api/auth", tags=["Authentication"])
app.include_router(rooms, prefix="/api/rooms", tags=["Rooms"])
app.include_router(reservations, prefix="/api/reservations", tags=["Reservations"])
app.include_router(assignments, prefix="/api/assignments", tags=["Assignments"])
app.include_router(sheets, prefix="/api/sheets", tags=["Google Sheets"])
app.include_router(cleaning, prefix="/api/cleaning", tags=["Cleaning"])
app.include_router(recommendations, prefix="/api/recommendations", tags=["Recommendations"])
app.include_router(sync, prefix="/api/sync", tags=["Sync"])
app.include_router(dashboard, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(settings, prefix="/api/settings", tags=["Settings"])

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Hive Manager API is running"}