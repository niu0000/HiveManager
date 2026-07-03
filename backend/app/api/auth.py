from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from app.database import get_db
from app.config import settings

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password, hashed_password):
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=1440))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

@router.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # 簡易認証：ハードコードされた管理者アカウント
    # 開発用として平文 "admin" も許容する
    username_ok = form_data.username == "admin"
    password_ok = False
    
    if form_data.password == "admin":
        password_ok = True
    else:
        # ハッシュ済みのパスワードと比較 (必要であれば)
        # 初期ハッシュ: get_password_hash("admin")
        hashed_admin = "$2b$12$Lq... (省略)" 
        if verify_password(form_data.password, hashed_admin):
            password_ok = True

    if username_ok and password_ok:
        access_token = create_access_token(data={"sub": form_data.username, "role": "admin"})
        return {
            "access_token": access_token, 
            "token_type": "bearer",
            "username": form_data.username,
            "role": "admin"
        }
    
    raise HTTPException(status_code=400, detail="ユーザー名またはパスワードが正しくありません")