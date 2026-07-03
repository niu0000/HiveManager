from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./data/dormitory.db"
    SECRET_KEY: str = "change-this-secret-key-in-production-please-use-long-random-string"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    GOOGLE_SCOPES: str = "https://www.googleapis.com/auth/spreadsheets"
    
    class Config:
        env_file = ".env"

settings = Settings()