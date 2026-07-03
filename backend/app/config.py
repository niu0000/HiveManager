from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    # Database
    database_url: str = "sqlite:///./data/sqlite/dormitory.db"
    
    # Google Sheets API
    google_service_account_file: str = "service_account.json"
    google_sheet_id: str = ""
    
    # JWT Settings
    jwt_secret_key: str = "change-this-secret-key-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Application Settings
    app_name: str = "Dormitory Manager"
    debug: bool = True
    host: str = "0.0.0.0"
    port: int = 8000
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
