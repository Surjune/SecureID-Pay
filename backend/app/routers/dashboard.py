from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.utils.dependencies import get_current_user
from app.models import UserModel, TransactionModel, LoanModel, CreditScoreModel
from app.services.credit_service import CreditService
from app.services.insights_service import InsightsService
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/dashboard", response_model=dict)
async def get_dashboard(
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get complete dashboard data for authenticated user"""
    # Get user
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get recent transactions (last 5)
    recent_transactions = db.query(TransactionModel).filter(
        TransactionModel.user_id == user_id
    ).order_by(TransactionModel.created_at.desc()).limit(5).all()
    
    # Get active loans
    active_loans = db.query(LoanModel).filter(
        LoanModel.user_id == user_id,
        LoanModel.status.in_(["active", "pending", "approved"])
    ).all()
    
    # Get credit score
    credit_score = CreditService.calculate_credit_score(db, user_id)
    credit_score_obj = db.query(CreditScoreModel).filter(
        CreditScoreModel.user_id == user_id
    ).first()
    
    # Get fraud alerts
    high_risk_transactions = db.query(TransactionModel).filter(
        TransactionModel.user_id == user_id,
        TransactionModel.fraud_score >= 0.7
    ).limit(3).all()
    
    fraud_alerts = [
        {
            "id": t.id,
            "user_id": t.user_id,
            "risk_level": "high",
            "description": f"High-risk transaction detected: {t.amount} to {t.recipient_id}",
            "timestamp": t.created_at
        }
        for t in high_risk_transactions
    ]
    
    # Get spending insights
    spending_insights = InsightsService.get_spending_insights(db, user_id, days=30)
    
    return {
        "user": {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone": user.phone,
            "income_type": user.income_type,
            "kyc_verified": user.kyc_verified,
            "created_at": user.created_at
        },
        "balance": user.account_balance,
        "recent_transactions": [
            {
                "id": t.id,
                "type": t.transaction_type,
                "amount": t.amount,
                "currency": t.currency,
                "recipient_id": t.recipient_id,
                "description": t.description,
                "status": t.status,
                "timestamp": t.created_at
            }
            for t in recent_transactions
        ],
        "active_loans": [
            {
                "id": l.id,
                "amount": l.amount,
                "interest_rate": l.interest_rate,
                "duration": l.duration_months,
                "status": l.status,
                "purpose": l.purpose,
                "created_at": l.created_at
            }
            for l in active_loans
        ],
        "credit_score": {
            "score": credit_score,
            "last_updated": credit_score_obj.last_updated if credit_score_obj else datetime.utcnow()
        },
        "fraud_alerts": fraud_alerts,
        "spending_insights": {
            "total_spending": spending_insights["total_spending"],
            "average_daily_spend": spending_insights["average_daily_spend"],
            "trend": spending_insights["trend"],
            "category_breakdown": spending_insights["category_breakdown"]
        }
    }

@router.get("/dashboard/balance", response_model=dict)
async def get_balance(
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's account balance"""
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {
        "user_id": user.id,
        "balance": user.account_balance,
        "currency": "USD",
        "updated_at": datetime.utcnow()
    }

@router.get("/dashboard/credit-score", response_model=dict)
async def get_credit_score(
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's credit score"""
    score = CreditService.calculate_credit_score(db, user_id)
    
    return {
        "user_id": user_id,
        "score": score,
        "max_score": 850,
        "min_score": 300,
        "updated_at": datetime.utcnow()
    }
