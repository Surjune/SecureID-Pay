from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.schemas import UserCreate, UserResponse
from app.services.auth_service import AuthService
from app.models import UserModel
from app.utils.dependencies import get_current_user
from app.database import get_db
from app.services.mock_data import MockDataGenerator
from typing import Dict
from datetime import datetime

router = APIRouter()


@router.post("/register", response_model=Dict)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    try:
        existing_user = db.query(UserModel).filter(
            UserModel.email == user_data.email
        ).first()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        user = AuthService.create_user(db, user_data)
        access_token = AuthService.create_access_token(user.id)

        return {
            "message": "User registered successfully",
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            },
            "access_token": access_token,
            "token_type": "bearer"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/login", response_model=Dict)
async def login(email: str = None, password: str = None, db: Session = Depends(get_db)):
    """Authenticate user and return access token"""
    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email and password are required"
        )

    user = AuthService.authenticate_user(db, email, password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = AuthService.create_access_token(user.id)

    return {
        "message": "Login successful",
        "user": {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
        },
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get("/me", response_model=Dict)
async def get_current_user_endpoint():
    """Get current authenticated user — returns realistic mock profile data for demo"""
    demo = MockDataGenerator.DEMO_USER.copy()
    return demo



@router.post("/logout")
async def logout():
    """Logout user"""
    return {"message": "Logout successful"}
