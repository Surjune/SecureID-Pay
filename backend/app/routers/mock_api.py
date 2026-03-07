from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional
from app.services.mock_data import MockData
import random
import uuid
from datetime import datetime, timedelta

router = APIRouter()

# Initialize mock data
mock_data = MockData()


@router.get("/api/users")
async def get_users():
    """Get all users"""
    return {
        "users": mock_data.users,
        "total": len(mock_data.users)
    }


@router.get("/api/users/{user_id}")
async def get_user(user_id: str):
    """Get specific user"""
    user = mock_data.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user


@router.get("/api/transactions")
async def get_transactions(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    user_id: Optional[str] = None,
    status_filter: Optional[str] = None
):
    """Get transactions with optional filtering"""
    transactions = mock_data.transactions
    
    # Filter by user
    if user_id:
        transactions = [
            t for t in transactions
            if t["sender_id"] == user_id or t["recipient_id"] == user_id
        ]
    
    # Filter by status
    if status_filter:
        transactions = [t for t in transactions if t["status"] == status_filter]
    
    total = len(transactions)
    transactions = transactions[skip:skip + limit]
    
    return {
        "transactions": transactions,
        "total": total,
        "skip": skip,
        "limit": limit
    }


@router.get("/api/transactions/{transaction_id}")
async def get_transaction(transaction_id: str):
    """Get specific transaction"""
    for transaction in mock_data.transactions:
        if transaction["id"] == transaction_id:
            return transaction
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Transaction not found"
    )


@router.get("/api/fraud-alerts")
async def get_fraud_alerts(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=50)
):
    """Get fraud alerts"""
    total = len(mock_data.fraud_alerts)
    alerts = mock_data.fraud_alerts[skip:skip + limit]
    unread_count = len([a for a in mock_data.fraud_alerts if a.get("status") == "pending"])

    return {
        "alerts": alerts,
        "total": total,
        "unread_count": unread_count,
        "skip": skip,
        "limit": limit
    }



@router.get("/api/fraud-alerts/{alert_id}")
async def get_fraud_alert(alert_id: str):
    """Get specific fraud alert"""
    for alert in mock_data.fraud_alerts:
        if alert["id"] == alert_id:
            return alert
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Fraud alert not found"
    )


@router.put("/api/fraud-alerts/{alert_id}")
async def update_fraud_alert(alert_id: str, status: str):
    """Update fraud alert status"""
    for alert in mock_data.fraud_alerts:
        if alert["id"] == alert_id:
            alert["status"] = status
            alert["updated_at"] = datetime.now().isoformat()
            return alert
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Fraud alert not found"
    )


@router.get("/api/credit-scores")
async def get_credit_scores():
    """Get all credit scores"""
    return {
        "credit_scores": mock_data.credit_scores,
        "total": len(mock_data.credit_scores)
    }


@router.get("/api/credit-scores/{user_id}")
async def get_credit_score(user_id: str):
    """Get credit score for user"""
    for score in mock_data.credit_scores:
        if score["user_id"] == user_id:
            return score
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Credit score not found"
    )


@router.get("/api/notifications")
async def get_notifications(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=50),
    unread_only: bool = False,
    user_id: Optional[str] = None
):
    """Get notifications"""
    sample_notifications = [
        {
            "id": 1,
            "type": "fraud",
            "message": "High-risk transaction detected from a new device.",
            "time": "2 minutes ago",
            "status": "unread"
        },
        {
            "id": 2,
            "type": "payment",
            "message": "Payment of $450 successfully sent.",
            "time": "10 minutes ago",
            "status": "unread"
        },
        {
            "id": 3,
            "type": "security",
            "message": "New login detected from Chrome on Windows.",
            "time": "1 hour ago",
            "status": "read"
        },
        {
            "id": 4,
            "type": "system",
            "message": "Fraud monitoring system flagged suspicious activity.",
            "time": "Today",
            "status": "read"
        }
    ]
    
    notifications = sample_notifications
    if unread_only:
        notifications = [n for n in notifications if n["status"] == "unread"]
        
    unread_count = len([n for n in sample_notifications if n["status"] == "unread"])
    
    # We still return the object structure expected by the frontend hook
    return {
        "notifications": notifications,
        "total": len(sample_notifications),
        "unread_count": unread_count,
        "skip": skip,
        "limit": limit
    }


@router.put("/api/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: str):
    """Mark notification as read"""
    success = mock_data.mark_notification_read(notification_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    
    return {"status": "success", "notification_id": notification_id}


@router.put("/api/notifications/read-all")
async def mark_all_notifications_read(user_id: Optional[str] = None):
    """Mark all notifications as read"""
    count = 0
    for notification in mock_data.notifications:
        if user_id and notification.get("user_id") != user_id:
            continue
        if not notification.get("read", False):
            notification["read"] = True
            count += 1
    
    return {"status": "success", "marked_read": count}


@router.get("/api/dashboard-stats")
async def get_dashboard_stats():
    """Get dashboard statistics"""
    return mock_data.dashboard_stats


@router.get("/api/dashboard/summary")
async def get_dashboard_summary():
    """Get dashboard summary"""
    stats = mock_data.dashboard_stats
    
    return {
        "total_transactions": stats["key_metrics"]["total_transactions"],
        "total_volume": stats["key_metrics"]["total_volume"],
        "fraud_alerts": stats["key_metrics"]["fraud_alerts_count"],
        "success_rate": stats["key_metrics"]["success_rate"],
        "blocked_transactions": stats["key_metrics"]["blocked_transactions"],
        "trends": {
            "daily_volume": stats["trends"]["daily_volume"][-7:],  # Last 7 days
            "fraud_detection": stats["trends"]["fraud_detection"][-7:]
        }
    }


# Simulated real-time endpoints

@router.post("/api/simulate/new-transaction")
async def simulate_new_transaction():
    """Simulate a new transaction"""
    from app.services.mock_data import MockDataGenerator
    
    users = mock_data.users
    sender = random.choice(users)
    recipient = random.choice([u for u in users if u["id"] != sender["id"]])
    
    timestamp = datetime.now()
    amount = round(random.uniform(10, 5000), 2)
    status = random.choices(["completed", "pending", "failed"], weights=[70, 20, 10])[0]
    
    fraud_score = random.uniform(0, 1)
    if amount > 2000:
        fraud_score += random.uniform(0.1, 0.3)
    fraud_score = min(1.0, fraud_score)
    
    transaction = {
        "id": str(uuid.uuid4()),
        "sender_id": sender["id"],
        "sender_name": f"{sender['first_name']} {sender['last_name']}",
        "sender_avatar": sender["avatar"],
        "recipient_id": recipient["id"],
        "recipient_name": f"{recipient['first_name']} {recipient['last_name']}",
        "recipient_avatar": recipient["avatar"],
        "amount": amount,
        "currency": "USD",
        "description": random.choice(MockDataGenerator.PAYMENT_DESCRIPTIONS),
        "status": status,
        "fraud_score": round(fraud_score, 2),
        "risk_level": "critical" if fraud_score >= 0.8 else "high" if fraud_score >= 0.6 else "medium" if fraud_score >= 0.3 else "low",
        "timestamp": timestamp.isoformat(),
        "created_at": timestamp.isoformat()
    }
    
    mock_data.add_transaction(transaction)
    
    # Add notification
    notification = {
        "id": str(uuid.uuid4()),
        "type": "payment",
        "title": "New Transaction",
        "message": f"${transaction['amount']} transaction from {transaction['sender_name']}",
        "timestamp": timestamp.isoformat(),
        "read": False,
        "user_id": recipient["id"],
        "data": {"transaction_id": transaction["id"]}
    }
    mock_data.add_notification(notification)
    
    return {
        "transaction": transaction,
        "notification": notification
    }


@router.post("/api/simulate/fraud-alert")
async def simulate_fraud_alert():
    """Simulate a fraud alert"""
    risky_transactions = [t for t in mock_data.transactions if t["fraud_score"] >= 0.6]
    
    if not risky_transactions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No risky transactions available"
        )
    
    transaction = risky_transactions[0]
    alert = {
        "id": str(uuid.uuid4()),
        "transaction_id": transaction["id"],
        "user_id": transaction["sender_id"],
        "user_name": transaction["sender_name"],
        "amount": transaction["amount"],
        "risk_level": transaction["risk_level"],
        "fraud_score": transaction["fraud_score"],
        "reason": random.choice([
            "Unusual transaction amount",
            "Unusual location",
            "Multiple transactions in short time",
            "Recipient not in contact list",
            "High velocity transaction"
        ]),
        "timestamp": datetime.now().isoformat(),
        "status": "pending",
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }
    
    mock_data.add_fraud_alert(alert)
    
    return {"alert": alert}


@router.post("/api/simulate/notification")
async def simulate_notification(notification_type: str = "payment"):
    """Simulate a notification"""
    user = random.choice(mock_data.users)
    
    if notification_type == "payment":
        message = f"Payment of ${random.randint(100, 5000)} received"
        title = "Payment Received"
    elif notification_type == "fraud":
        message = "Suspicious activity detected on your account"
        title = "Fraud Alert"
    else:
        message = "Your credit score has been updated"
        title = "Credit Score Update"
    
    notification = {
        "id": str(uuid.uuid4()),
        "type": notification_type,
        "title": title,
        "message": message,
        "timestamp": datetime.now().isoformat(),
        "read": False,
        "user_id": user["id"]
    }
    
    mock_data.add_notification(notification)
    
    return {"notification": notification}


@router.post("/api/simulate/batch-update")
async def simulate_batch_update():
    """Simulate multiple updates at once"""
    from app.services.mock_data import MockDataGenerator
    
    updates = {
        "new_transactions": 0,
        "new_fraud_alerts": 0,
        "new_notifications": 0
    }
    
    # Add 2-5 new transactions
    num_transactions = random.randint(2, 5)
    for _ in range(num_transactions):
        users = mock_data.users
        sender = random.choice(users)
        recipient = random.choice([u for u in users if u["id"] != sender["id"]])
        
        timestamp = datetime.now() - timedelta(seconds=random.randint(1, 300))
        amount = round(random.uniform(10, 5000), 2)
        
        fraud_score = random.uniform(0, 1)
        if amount > 2000:
            fraud_score += random.uniform(0.1, 0.3)
        fraud_score = min(1.0, fraud_score)
        
        transaction = {
            "id": str(uuid.uuid4()),
            "sender_id": sender["id"],
            "sender_name": f"{sender['first_name']} {sender['last_name']}",
            "sender_avatar": sender["avatar"],
            "recipient_id": recipient["id"],
            "recipient_name": f"{recipient['first_name']} {recipient['last_name']}",
            "recipient_avatar": recipient["avatar"],
            "amount": amount,
            "currency": "USD",
            "description": random.choice(MockDataGenerator.PAYMENT_DESCRIPTIONS),
            "status": random.choices(["completed", "pending", "failed"], weights=[70, 20, 10])[0],
            "fraud_score": round(fraud_score, 2),
            "risk_level": "critical" if fraud_score >= 0.8 else "high" if fraud_score >= 0.6 else "medium" if fraud_score >= 0.3 else "low",
            "timestamp": timestamp.isoformat(),
            "created_at": timestamp.isoformat()
        }
        
        mock_data.add_transaction(transaction)
        updates["new_transactions"] += 1
    
    # Add 0-2 fraud alerts
    if random.random() > 0.5:
        alert = {
            "id": str(uuid.uuid4()),
            "transaction_id": str(uuid.uuid4()),
            "user_id": random.choice(mock_data.users)["id"],
            "amount": round(random.uniform(1000, 10000), 2),
            "risk_level": random.choice(["medium", "high"]),
            "fraud_score": random.uniform(0.6, 1.0),
            "reason": random.choice(["Unusual amount", "Location mismatch", "High velocity"]),
            "timestamp": datetime.now().isoformat(),
            "status": "pending",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        mock_data.add_fraud_alert(alert)
        updates["new_fraud_alerts"] += 1
    
    # Add 1-3 notifications
    num_notifications = random.randint(1, 3)
    for _ in range(num_notifications):
        notification = {
            "id": str(uuid.uuid4()),
            "type": random.choice(["payment", "fraud", "credit"]),
            "title": random.choice(["Payment Received", "Alert", "Update"]),
            "message": f"New activity on your account",
            "timestamp": datetime.now().isoformat(),
            "read": False,
            "user_id": random.choice(mock_data.users)["id"]
        }
        mock_data.add_notification(notification)
        updates["new_notifications"] += 1
    
    return {
        "status": "success",
        "updates": updates,
        "timestamp": datetime.now().isoformat()
    }
