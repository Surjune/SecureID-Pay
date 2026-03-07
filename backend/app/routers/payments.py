from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas import TransactionCreate
from app.utils.dependencies import get_current_user
from app.services.mock_data import MockData, MockDataGenerator
from datetime import datetime
import uuid
import random

router = APIRouter()
mock_data = MockData()

@router.post("/payment/send", response_model=dict)
async def send_payment(
    payment: TransactionCreate,
    user_id: str = Depends(get_current_user)
):
    """Send a payment using in-memory mock data storage"""
    # Get sender (from mock data)
    sender = mock_data.get_user_by_id(user_id)
    if not sender:
        sender = mock_data.get_user_by_id(MockDataGenerator.DEMO_USER["id"])

    # Simulate fake recipient from mock list if not provided accurately
    recipient = mock_data.get_user_by_id(payment.recipient_id)
    if not recipient:
        users = [u for u in mock_data.users if u["id"] != sender["id"]]
        recipient = random.choice(users) if users else sender
    
    amount = float(payment.amount)
    
    # Check bounds or fake fraud check
    fraud_score = random.uniform(0, 0.2)
    if amount > 5000:
        fraud_score += 0.5
        
    risk_level = "low"
    if fraud_score > 0.6:
        risk_level = "high"
    elif fraud_score > 0.3:
        risk_level = "medium"

    timestamp = datetime.now()
    
    transaction = {
        "id": str(uuid.uuid4()),
        "sender_id": sender["id"],
        "sender_name": f"{sender.get('first_name', '')} {sender.get('last_name', '')}".strip() or sender.get('firstName', ''),
        "sender_avatar": sender.get("avatar", ""),
        "recipient_id": recipient["id"],
        "recipient_name": f"{recipient.get('first_name', '')} {recipient.get('last_name', '')}".strip() or recipient.get('firstName', ''),
        "recipient_avatar": recipient.get("avatar", ""),
        "amount": amount,
        "currency": "USD",
        "description": payment.description or "Payment sent",
        "status": "completed" if risk_level == "low" else "pending",
        "transaction_type": "send",
        "fraud_score": round(fraud_score, 2),
        "risk_level": risk_level,
        "timestamp": timestamp.isoformat(),
        "created_at": timestamp.isoformat(),
    }
    
    mock_data.add_transaction(transaction)
    
    # Create notification for recipient
    notification = {
        "id": str(uuid.uuid4()),
        "type": "payment",
        "title": "Payment Received",
        "message": f"Payment of ${amount:.2f} received from {transaction['sender_name']}",
        "timestamp": timestamp.isoformat(),
        "read": False,
        "user_id": recipient["id"],
        "data": {"transaction_id": transaction["id"]}
    }
    mock_data.add_notification(notification)
    
    return {
        "status": "success",
        "message": "Payment processed successfully",
        "transaction_id": transaction["id"]
    }

