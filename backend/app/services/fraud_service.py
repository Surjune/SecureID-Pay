# Fraud detection service
import random
from typing import Dict

class FraudService:
    """Fraud detection service"""
    
    # Fraud detection thresholds
    LOW_RISK_THRESHOLD = 0.3
    MEDIUM_RISK_THRESHOLD = 0.7
    
    @staticmethod
    def check_transaction_fraud(
        user_id: str,
        amount: float,
        recipient_id: str,
        description: str = ""
    ) -> Dict:
        """
        Check if a transaction is fraudulent
        Returns: {"fraud_score": float, "risk_level": str, "message": str}
        """
        fraud_score = 0.0
        
        # Rule 1: Large transactions get higher score
        if amount > 10000:
            fraud_score += 0.2
            
        # Rule 2: Unusual amount patterns
        if amount > 5000:
            fraud_score += 0.15
        
        # Rule 3: Add randomness for MVP (should be replaced with ML model)
        fraud_score += random.uniform(0, 0.15)
        
        # Determine risk level
        if fraud_score < FraudService.LOW_RISK_THRESHOLD:
            risk_level = "low"
            message = "Transaction appears legitimate"
        elif fraud_score < FraudService.MEDIUM_RISK_THRESHOLD:
            risk_level = "medium"
            message = "Transaction requires verification"
        else:
            risk_level = "high"
            message = "Transaction flagged for suspicious activity"
        
        # Clamp score to 0-1
        fraud_score = min(1.0, fraud_score)
        
        return {
            "fraud_score": fraud_score,
            "risk_level": risk_level,
            "message": message
        }
    
    @staticmethod
    def get_risk_factors(amount: float) -> list:
        """Get list of risk factors for a transaction"""
        factors = []
        
        if amount > 10000:
            factors.append("Large transaction amount")
        if amount > 5000:
            factors.append("High transaction amount")
        if amount < 10:
            factors.append("Unusually small amount")
            
        return factors if factors else ["No risk factors detected"]
