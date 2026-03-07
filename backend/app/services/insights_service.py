# Spending insights service
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models import TransactionModel
from collections import defaultdict

class InsightsService:
    """Service for generating spending insights and analytics"""
    
    @staticmethod
    def get_spending_insights(db: Session, user_id: str, days: int = 30) -> dict:
        """Get spending insights for the last N days"""
        from_date = datetime.utcnow() - timedelta(days=days)
        
        # Get all user transactions
        transactions = db.query(TransactionModel).filter(
            TransactionModel.user_id == user_id,
            TransactionModel.created_at >= from_date,
            TransactionModel.status == "completed"
        ).all()
        
        if not transactions:
            return {
                "total_spending": 0.0,
                "average_daily_spend": 0.0,
                "trend": "stable",
                "category_breakdown": {}
            }
        
        # Calculate total spending
        total_spending = sum(
            t.amount for t in transactions if t.transaction_type == "send"
        )
        
        # Calculate daily average
        daily_average = total_spending / days if days > 0 else 0
        
        # Determine trend (simplified - just randomized for MVP)
        # In production, use actual historical data
        if total_spending > 5000:
            trend = "increasing"
        elif total_spending > 2000:
            trend = "stable"
        else:
            trend = "decreasing"
        
        # Category breakdown (placeholder categories)
        category_breakdown = InsightsService._get_category_breakdown(transactions)
        
        return {
            "total_spending": total_spending,
            "average_daily_spend": daily_average,
            "trend": trend,
            "category_breakdown": category_breakdown,
            "days": days,
            "transaction_count": len(transactions)
        }
    
    @staticmethod
    def _get_category_breakdown(transactions: list) -> dict:
        """Get spending breakdown by category"""
        # Placeholder implementation - categorizes by description keywords
        categories = defaultdict(float)
        
        for transaction in transactions:
            if transaction.transaction_type != "send":
                continue
            
            # Simple categorization based on description keywords
            description = (transaction.description or "").lower()
            
            if any(word in description for word in ["food", "restaurant", "grocery", "cafe"]):
                categories["Food & Dining"] += transaction.amount
            elif any(word in description for word in ["gas", "fuel", "car", "taxi", "transport"]):
                categories["Transportation"] += transaction.amount
            elif any(word in description for word in ["entertainment", "movie", "game", "spotify"]):
                categories["Entertainment"] += transaction.amount
            elif any(word in description for word in ["shopping", "clothes", "amazon"]):
                categories["Shopping"] += transaction.amount
            elif any(word in description for word in ["electricity", "water", "utility", "bill"]):
                categories["Utilities"] += transaction.amount
            else:
                categories["Other"] += transaction.amount
        
        # Ensure categories dict is not empty
        if not categories:
            categories["Other"] = 0.0
        
        return dict(categories)
    
    @staticmethod
    def get_spending_by_category(db: Session, user_id: str, days: int = 30) -> dict:
        """Get detailed breakdown of spending by category"""
        insights = InsightsService.get_spending_insights(db, user_id, days)
        return insights["category_breakdown"]
