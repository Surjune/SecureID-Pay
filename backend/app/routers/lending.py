from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas import LoanApplicationCreate
from app.utils.dependencies import get_current_user
from app.services.mock_data import MockData, MockDataGenerator
from datetime import datetime
import uuid

router = APIRouter()
mock_data = MockData()

# In-memory storage for loans during demo
mock_loans = []

@router.post("/loan/apply", response_model=dict)
async def apply_for_loan(
    loan_app: LoanApplicationCreate,
    user_id: str = Depends(get_current_user)
):
    """Apply for a loan using mock data"""
    user = mock_data.get_user_by_id(user_id)
    if not user:
        user = mock_data.get_user_by_id(MockDataGenerator.DEMO_USER["id"])
    
    # Check eligibility based on mock credit scores
    credit_score = next((cs for cs in mock_data.credit_scores if cs["user_id"] == user["id"]), None)
    
    if not credit_score:
        credit_score = {
            "score": 700,
            "loan_eligibility": {
                "eligible": True,
                "max_amount": 25000,
                "interest_rate_range": "5% - 9%"
            }
        }
        
    eligibility = credit_score.get("loan_eligibility", {})
    
    if not eligibility.get("eligible", True):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not eligible for loan"
        )
    
    max_amount = eligibility.get("max_amount", 50000)
    if loan_app.amount > max_amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Loan amount exceeds maximum allowed: ${max_amount}"
        )
    
    loan_id = str(uuid.uuid4())
    rate_str = eligibility.get("interest_rate_range", "5%").split("%")[0]
    interest_rate = float(rate_str) if rate_str.replace('.','',1).isdigit() else 5.5
    
    loan = {
        "id": loan_id,
        "user_id": user["id"],
        "amount": loan_app.amount,
        "interest_rate": interest_rate,
        "duration_months": loan_app.duration,
        "status": "approved",
        "purpose": loan_app.purpose,
        "created_at": datetime.utcnow().isoformat()
    }
    
    mock_loans.append(loan)
    
    # Send a notification
    notification = {
        "id": str(uuid.uuid4()),
        "type": "loan",
        "title": "Loan Application Approved",
        "message": f"Your loan application for ${loan_app.amount:.2f} has been approved.",
        "timestamp": datetime.now().isoformat(),
        "read": False,
        "user_id": user["id"]
    }
    mock_data.add_notification(notification)
    
    return {
        "status": "approved",
        "message": "Loan application processed successfully",
        "loan_id": loan_id,
        "eligible_amount": loan_app.amount,
        "interest_rate": interest_rate,
        "loan": loan
    }

@router.get("/loan/eligibility", response_model=dict)
async def check_loan_eligibility(
    user_id: str = Depends(get_current_user)
):
    """Check loan eligibility for current user"""
    user = mock_data.get_user_by_id(user_id) or mock_data.get_user_by_id(MockDataGenerator.DEMO_USER["id"])
    credit_score = next((cs for cs in mock_data.credit_scores if cs["user_id"] == user["id"]), None)
    
    if credit_score and "loan_eligibility" in credit_score:
        el = credit_score["loan_eligibility"]
        rate_str = el.get("interest_rate_range", "5%").split("%")[0]
        min_rate = float(rate_str) if rate_str.replace('.','',1).isdigit() else 5.5
        return {
            "eligible": el.get("eligible", True),
            "max_amount": el.get("max_amount", 25000),
            "min_rate": min_rate,
            "max_rate": min_rate + 4.0,
            "max_duration": 60,
            "reason": "Your credit score qualifies you for loans." if el.get("eligible") else "Improve your credit score to qualify."
        }
        
    return {
        "eligible": True,
        "max_amount": 15000,
        "min_rate": 6.5,
        "max_rate": 10.5,
        "max_duration": 48,
        "reason": "Default eligibility profile."
    }

@router.get("/loans", response_model=dict)
async def get_user_loans(
    user_id: str = Depends(get_current_user)
):
    """Get all loans for current user"""
    user = mock_data.get_user_by_id(user_id) or mock_data.get_user_by_id(MockDataGenerator.DEMO_USER["id"])
    user_loans = [l for l in mock_loans if l["user_id"] == user["id"]]
    
    return {
        "loans": user_loans,
        "count": len(user_loans)
    }

@router.get("/loans/{loan_id}", response_model=dict)
async def get_loan_details(
    loan_id: str,
    user_id: str = Depends(get_current_user)
):
    """Get specific loan details"""
    user = mock_data.get_user_by_id(user_id) or mock_data.get_user_by_id(MockDataGenerator.DEMO_USER["id"])
    loan = next((l for l in mock_loans if l["id"] == loan_id and l["user_id"] == user["id"]), None)
    
    if not loan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Loan not found"
        )
    
    return loan
