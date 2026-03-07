# Authentication dependencies
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.auth_service import AuthService

security = HTTPBearer(auto_error=False)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Dependency to get current authenticated user, with fallback to demo user"""
    if credentials:
        token = credentials.credentials
        user_id = AuthService.verify_token(token)
        if user_id:
            return user_id
            
    # Fallback for development/demo mode
    from app.services.mock_data import MockDataGenerator
    return MockDataGenerator.DEMO_USER["id"]
