# User Schemas
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    phone: Optional[str] = None
    income_type: str = "stable"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    kyc_verified: bool
    account_balance: float
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None

# Transaction Schemas
class TransactionBase(BaseModel):
    recipient_id: str
    amount: float
    description: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionResponse(BaseModel):
    id: str
    sender_id: str
    recipient_id: str
    amount: float
    currency: str
    transaction_type: str
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Loan Schemas
class LoanApplicationCreate(BaseModel):
    amount: float
    duration: int  # in months
    purpose: str
    income_proof: Optional[str] = None

class LoanResponse(BaseModel):
    id: str
    amount: float
    interest_rate: float
    duration_months: int
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class LoanEligibilityResponse(BaseModel):
    eligible: bool
    max_amount: float
    min_rate: float
    max_rate: float
    max_duration: int
    reason: Optional[str] = None

# Credit Score Schemas
class CreditScoreResponse(BaseModel):
    user_id: str
    score: int
    last_updated: datetime
    
    class Config:
        from_attributes = True

# Fraud Detection Schemas
class FraudCheckRequest(BaseModel):
    amount: float
    recipient_id: str
    description: Optional[str] = None

class FraudCheckResponse(BaseModel):
    risk_level: str  # low, medium, high
    fraud_score: float
    message: str

class FraudAlertResponse(BaseModel):
    id: str
    user_id: str
    risk_level: str
    description: str
    timestamp: datetime

# Insights Schemas
class SpendingInsightsResponse(BaseModel):
    total_spending: float
    average_daily_spend: float
    trend: str  # increasing, stable, decreasing
    category_breakdown: dict

# Dashboard Schemas
class DashboardResponse(BaseModel):
    balance: float
    recent_transactions: List[TransactionResponse]
    active_loans: List[LoanResponse]
    credit_score: CreditScoreResponse
    spending_insights: SpendingInsightsResponse
