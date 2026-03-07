# Credit scoring service
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models import LoanModel, TransactionModel, CreditScoreModel, UserModel
import random
import uuid

class CreditService:
    """Credit scoring service"""
    
    BASE_SCORE = 650
    MIN_SCORE = 300
    MAX_SCORE = 850
    
    @staticmethod
    def calculate_credit_score(db: Session, user_id: str) -> int:
        """
        Calculate credit score based on user's financial history
        Uses multiple factors:
        - Payment history (30%)
        - Credit utilization (30%)
        - Account age (15%)
        - Credit mix (15%)
        - New credit (10%)
        """
        user = db.query(UserModel).filter(UserModel.id == user_id).first()
        if not user:
            return CreditService.BASE_SCORE
        
        score = CreditService.BASE_SCORE
        
        # Factor 1: Account age (0-15 points)
        account_age_days = (datetime.utcnow() - user.created_at).days
        if account_age_days > 365:
            score += 15
        elif account_age_days > 180:
            score += 10
        elif account_age_days > 90:
            score += 5
        
        # Factor 2: Transaction history (0-30 points)
        transactions = db.query(TransactionModel).filter(
            TransactionModel.user_id == user_id
        ).all()
        completed_transactions = [t for t in transactions if t.status == "completed"]
        if len(completed_transactions) > 20:
            score += 30
        elif len(completed_transactions) > 10:
            score += 20
        elif len(completed_transactions) > 5:
            score += 10
        
        # Factor 3: Loan payment behavior (0-25 points)
        loans = db.query(LoanModel).filter(LoanModel.user_id == user_id).all()
        if loans:
            active_loans = [l for l in loans if l.status == "active"]
            completed_loans = [l for l in loans if l.status == "completed"]
            total_loans = len(loans)
            
            if total_loans > 0:
                completion_rate = len(completed_loans) / total_loans
                score += int(completion_rate * 25)
        
        # Factor 4: Income stability (0-15 points)
        if user.income_type == "stable":
            score += 15
        else:
            score += 5
        
        # Factor 5: KYC verification (0-20 points)
        if user.kyc_verified:
            score += 20
        
        # Clamp score between MIN and MAX
        score = max(CreditService.MIN_SCORE, min(CreditService.MAX_SCORE, score))
        
        return score
    
    @staticmethod
    def assess_loan_eligibility(db: Session, user_id: str) -> dict:
        """Assess loan eligibility based on credit score and history"""
        score = CreditService.calculate_credit_score(db, user_id)
        
        # Determine eligibility tiers
        if score >= 750:
            max_amount = 50000
            min_rate = 3.5
            max_rate = 7.0
            max_duration = 60
            eligible = True
        elif score >= 650:
            max_amount = 25000
            min_rate = 7.0
            max_rate = 12.0
            max_duration = 48
            eligible = True
        elif score >= 550:
            max_amount = 10000
            min_rate = 12.0
            max_rate = 18.0
            max_duration = 36
            eligible = True
        else:
            max_amount = 0
            min_rate = 0
            max_rate = 0
            max_duration = 0
            eligible = False
        
        return {
            "eligible": eligible,
            "credit_score": score,
            "max_amount": max_amount,
            "min_rate": min_rate,
            "max_rate": max_rate,
            "max_duration": max_duration,
            "reason": f"Credit score: {score}/850" if eligible else f"Credit score {score} below minimum requirement of 550"
        }
    
    @staticmethod
    def save_credit_score(db: Session, user_id: str, score: int):
        """Save credit score to database"""
        credit_score = db.query(CreditScoreModel).filter(
            CreditScoreModel.user_id == user_id
        ).first()
        
        if credit_score:
            credit_score.score = score
            credit_score.last_updated = datetime.utcnow()
        else:
            credit_score = CreditScoreModel(
                id=str(uuid.uuid4()),
                user_id=user_id,
                score=score,
                last_updated=datetime.utcnow()
            )
            db.add(credit_score)
        
        db.commit()
        return credit_score
