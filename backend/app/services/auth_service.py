import os
import hashlib
import secrets
import uuid
import jwt
from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from app.models import UserModel
from app.schemas import UserCreate

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = 7 * 24 * 60  # 7 days

class AuthService:
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash password with salt"""
        salt = secrets.token_hex(32)
        pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
        return f"{salt}${pwd_hash.hex()}"
    
    @staticmethod
    def verify_password(password: str, hash: str) -> bool:
        """Verify password against hash"""
        try:
            salt, pwd_hash = hash.split('$')
            new_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
            return new_hash.hex() == pwd_hash
        except:
            return False
    
    @staticmethod
    def create_access_token(user_id: str) -> str:
        """Create JWT access token"""
        payload = {
            "sub": user_id,
            "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
            "iat": datetime.utcnow()
        }
        return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    
    @staticmethod
    def verify_token(token: str) -> Optional[str]:
        """Verify JWT token and return user_id"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload.get("sub")
        except:
            return None
    
    @staticmethod
    def create_user(db: Session, user_create: UserCreate) -> UserModel:
        """Create new user"""
        user_id = str(uuid.uuid4())
        
        user = UserModel(
            id=user_id,
            email=user_create.email,
            first_name=user_create.first_name,
            last_name=user_create.last_name,
            phone=user_create.phone,
            income_type=user_create.income_type,
            password_hash=AuthService.hash_password(user_create.password)
        )
        
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> Optional[UserModel]:
        """Authenticate user and return user object"""
        user = db.query(UserModel).filter(UserModel.email == email).first()
        if not user:
            return None
        if not AuthService.verify_password(password, user.password_hash):
            return None
        return user
