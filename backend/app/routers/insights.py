from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.utils.dependencies import get_current_user
from app.services.insights_service import InsightsService

router = APIRouter()

@router.get("/insights/spending", response_model=dict)
async def get_spending_insights(
    days: int = 30,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get spending insights for the user"""
    insights = InsightsService.get_spending_insights(db, user_id, days)
    
    return {
        "total_spending": insights["total_spending"],
        "average_daily_spend": insights["average_daily_spend"],
        "trend": insights["trend"],
        "category_breakdown": insights["category_breakdown"],
        "period_days": insights["days"],
        "transaction_count": insights["transaction_count"]
    }

@router.get("/insights/categories", response_model=dict)
async def get_category_breakdown(
    days: int = 30,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get spending breakdown by category"""
    categories = InsightsService.get_spending_by_category(db, user_id, days)
    
    return {
        "categories": categories,
        "period_days": days
    }
