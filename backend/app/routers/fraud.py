from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.utils.dependencies import get_current_user
from app.services.fraud_service import FraudService

router = APIRouter()

@router.post("/fraud/check", response_model=dict)
async def check_fraud(
    amount: float,
    recipient_id: str,
    description: str = "",
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Check if a transaction might be fraudulent"""
    fraud_check = FraudService.check_transaction_fraud(
        user_id,
        amount,
        recipient_id,
        description
    )
    
    risk_factors = FraudService.get_risk_factors(amount)
    
    return {
        "fraud_score": fraud_check.get('fraud_score', 0),
        "risk_level": fraud_check.get('risk_level', 'low'),
        "message": fraud_check.get('message', ''),
        "risk_factors": risk_factors,
        "approved": fraud_check.get('risk_level') == "low"
    }

@router.get("/fraud/alerts", response_model=dict)
async def get_fraud_alerts(
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get fraud alerts for current user"""
    from app.models import TransactionModel
    
    # Get high-risk transactions
    high_risk_transactions = db.query(TransactionModel).filter(
        TransactionModel.user_id == user_id,
        TransactionModel.fraud_score >= 0.7
    ).order_by(TransactionModel.created_at.desc()).limit(10).all()
    
    alerts = [
        {
            "id": t.id,
            "user_id": t.user_id,
            "risk_level": "high" if t.fraud_score >= 0.7 else "medium",
            "description": f"Transaction of {t.amount} flagged for fraud review",
            "timestamp": t.created_at
        }
        for t in high_risk_transactions
    ]
    
    return {
        "alerts": alerts,
        "count": len(alerts)
    }
