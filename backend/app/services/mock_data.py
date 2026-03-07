# Mock Data Service for SecureID-Pay
import random
import json
from datetime import datetime, timedelta
from typing import List, Dict, Any
import uuid


class MockDataGenerator:
    """Generate realistic mock data for fintech dashboard"""

    FIRST_NAMES = ["Alex", "Sarah", "Michael", "Emma", "David", "Jessica", "Robert", "Lisa", "James", "Emily",
                   "John", "Priya", "Carlos", "Aisha", "Daniel", "Sophia", "Kevin", "Mia", "Chris", "Zoe"]
    LAST_NAMES = ["Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
                  "Lee", "Chen", "Patel", "Thompson", "White", "Harris", "Clark", "Lewis", "Robinson", "Walker", "Hall"]
    COMPANIES = ["Tech Corp", "Finance Inc", "StartUp Labs", "Digital Solutions", "Cloud Services",
                 "Mobile Apps", "Web Design Co", "Consulting Partners", "Marketing Plus", "Trading House",
                 "DataFlow Analytics", "SecureNet Systems", "PayGlobal Ltd", "AlphaFund Capital", "OmniBank"]
    PAYMENT_DESCRIPTIONS = [
        "Salary payment", "Invoice #INV-2847", "Freelance design work", "Consulting fee — Q1",
        "Project milestone payment", "Monthly retainer", "SaaS subscription", "Commission payout",
        "Refund — Order #ORD-9921", "Performance bonus", "Travel & accommodation reimbursement",
        "Equipment procurement", "Software license renewal", "Vendor payment", "Client settlement",
        "Security deposit refund", "Medical reimbursement", "Rent payment", "Insurance premium", "Tax refund"
    ]

    STATUS_OPTIONS = ["completed", "pending", "failed", "cancelled"]
    RISK_LEVELS = ["low", "medium", "high", "critical"]

    FRAUD_REASONS = [
        "Unusual transaction amount",
        "Location mismatch — new country detected",
        "Multiple transactions in short time window",
        "Recipient not in trusted contact list",
        "High-velocity transaction pattern",
        "Unusual time pattern — 2AM transaction",
        "New device login followed by large transfer",
        "IP address flagged in fraud database",
        "Exceeds daily transfer limit",
        "Card used in two different cities simultaneously"
    ]

    NOTIFICATION_TEMPLATES = [
        {"type": "fraud_alert",  "title": "🚨 High-Risk Transaction Detected",
         "messages": [
             "A high-risk transaction of ${amount} was flagged from a new device.",
             "Suspicious activity detected: ${amount} transfer — location mismatch.",
             "Your account had an unusual login attempt followed by a ${amount} transfer.",
             "Transaction flagged: ${amount} to an unrecognized recipient."
         ]},
        {"type": "payment",  "title": "✅ Payment Successful",
         "messages": [
             "Payment of ${amount} to {name} was completed successfully.",
             "Your transfer of ${amount} has been processed.",
             "Payment of ${amount} received from {name}.",
             "${amount} added to your account from {name}."
         ]},
        {"type": "security",  "title": "🔒 Security Alert",
         "messages": [
             "New login detected from Chrome on Windows — New York, USA.",
             "Your password was changed successfully.",
             "Two-factor authentication was enabled on your account.",
             "A new device was linked to your account."
         ]},
        {"type": "credit",  "title": "📈 Credit Score Update",
         "messages": [
             "Your credit score improved by 12 points to 742.",
             "Credit report updated: new positive factor detected.",
             "Loan eligibility increased — check your new limit.",
             "Your credit utilization improved this month."
         ]},
        {"type": "system",  "title": "ℹ️ System Update",
         "messages": [
             "Fraud monitoring system updated successfully.",
             "New security policies applied to your account.",
             "Scheduled maintenance completed — all systems operational.",
             "Your account statement for March is now available."
         ]},
        {"type": "loan",  "title": "🏦 Loan Update",
         "messages": [
             "Your loan application of ${amount} is under review.",
             "Congratulations! Your loan of ${amount} has been approved.",
             "Monthly EMI of ${amount} deducted successfully.",
             "Loan repayment reminder: payment due in 3 days."
         ]},
    ]

    # Fixed demo user for the profile page
    DEMO_USER = {
        "id": "demo-user-101",
        "email": "alex.johnson@secureid.com",
        "firstName": "Alex",
        "lastName": "Johnson",
        "first_name": "Alex",
        "last_name": "Johnson",
        "phone": "+1 555 482 9912",
        "incomeType": "stable",
        "income_type": "stable",
        "kyc_verified": True,
        "account_balance": 24750.80,
        "role": "Financial Analyst",
        "account_status": "Active",
        "joined_date": "2023-05-12",
        "location": "New York, USA",
        "created_at": "2023-05-12T09:15:00",
        "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=AlexJohnson"
    }

    @staticmethod
    def generate_users(count: int = 10) -> List[Dict[str, Any]]:
        """Generate mock user data — always includes DEMO_USER as first user"""
        users = [MockDataGenerator.DEMO_USER.copy()]

        for i in range(1, count):
            user_id = str(uuid.uuid4())
            first_name = random.choice(MockDataGenerator.FIRST_NAMES)
            last_name = random.choice(MockDataGenerator.LAST_NAMES)

            users.append({
                "id": user_id,
                "email": f"{first_name.lower()}.{last_name.lower()}{i}@example.com",
                "firstName": first_name,
                "lastName": last_name,
                "first_name": first_name,
                "last_name": last_name,
                "phone": f"+1 {random.randint(200, 999)} {random.randint(100, 999)} {random.randint(1000, 9999)}",
                "account_balance": round(random.uniform(500, 75000), 2),
                "kyc_verified": random.choices([True, False], weights=[80, 20])[0],
                "income_type": random.choice(["stable", "variable"]),
                "incomeType": random.choice(["stable", "variable"]),
                "created_at": (datetime.now() - timedelta(days=random.randint(30, 730))).isoformat(),
                "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={first_name}{last_name}{i}",
                "company": random.choice(MockDataGenerator.COMPANIES),
                "role": random.choice(["Financial Analyst", "Account Manager", "Business Owner",
                                       "Freelancer", "Software Engineer", "Consultant"])
            })
        return users

    @staticmethod
    def generate_transactions(users: List[Dict], count: int = 60) -> List[Dict[str, Any]]:
        """Generate mock transaction data"""
        transactions = []

        for i in range(count):
            sender = random.choice(users)
            recipient = random.choice([u for u in users if u["id"] != sender["id"]])

            # Spread over last 30 days
            timestamp = datetime.now() - timedelta(
                days=random.randint(0, 30),
                hours=random.randint(0, 23),
                minutes=random.randint(0, 59)
            )
            amount = round(random.uniform(10, 5000), 2)
            tx_status = random.choices(
                MockDataGenerator.STATUS_OPTIONS,
                weights=[70, 20, 8, 2]
            )[0]

            fraud_score = random.uniform(0, 0.7)
            if amount > 2000:
                fraud_score += random.uniform(0.05, 0.25)
            if amount > 4000:
                fraud_score += random.uniform(0.1, 0.3)
            fraud_score = min(1.0, fraud_score)

            risk_level = (
                "critical" if fraud_score >= 0.8 else
                "high" if fraud_score >= 0.6 else
                "medium" if fraud_score >= 0.3 else
                "low"
            )

            transactions.append({
                "id": str(uuid.uuid4()),
                "sender_id": sender["id"],
                "sender_name": f"{sender['first_name']} {sender['last_name']}",
                "sender_avatar": sender.get("avatar", ""),
                "recipient_id": recipient["id"],
                "recipient_name": f"{recipient['first_name']} {recipient['last_name']}",
                "recipient_avatar": recipient.get("avatar", ""),
                "amount": amount,
                "currency": "USD",
                "description": random.choice(MockDataGenerator.PAYMENT_DESCRIPTIONS),
                "status": tx_status,
                "transaction_type": random.choice(["send", "receive"]),
                "fraud_score": round(fraud_score, 2),
                "risk_level": risk_level,
                "timestamp": timestamp.isoformat(),
                "created_at": timestamp.isoformat(),
            })

        transactions.sort(key=lambda x: x["timestamp"], reverse=True)
        return transactions

    @staticmethod
    def generate_fraud_alerts(transactions: List[Dict], count: int = 10) -> List[Dict[str, Any]]:
        """Generate fraud alerts based on risky transactions"""
        fraud_alerts = []
        risky_transactions = [t for t in transactions if t["fraud_score"] >= 0.5]

        # Ensure we always have some alerts even if few risky transactions
        if len(risky_transactions) < count:
            extra_needed = count - len(risky_transactions)
            for _ in range(extra_needed):
                t = random.choice(transactions)
                t = dict(t)  # copy
                t["fraud_score"] = round(random.uniform(0.55, 0.95), 2)
                t["risk_level"] = "high" if t["fraud_score"] >= 0.6 else "medium"
                risky_transactions.append(t)

        for alert_tx in risky_transactions[:count]:
            alert_id = str(uuid.uuid4())
            alert_time = datetime.fromisoformat(alert_tx["timestamp"])

            fraud_alerts.append({
                "id": alert_id,
                "transaction_id": alert_tx["id"],
                "user_id": alert_tx["sender_id"],
                "user_name": alert_tx["sender_name"],
                "amount": alert_tx["amount"],
                "risk_level": alert_tx["risk_level"],
                "fraud_score": alert_tx["fraud_score"],
                "reason": random.choice(MockDataGenerator.FRAUD_REASONS),
                "timestamp": alert_tx["timestamp"],
                "status": random.choices(
                    ["pending", "reviewed", "approved", "blocked"],
                    weights=[50, 25, 15, 10]
                )[0],
                "created_at": alert_time.isoformat(),
                "updated_at": (alert_time + timedelta(hours=random.randint(1, 12))).isoformat(),
            })

        return fraud_alerts

    @staticmethod
    def generate_credit_scores(users: List[Dict]) -> List[Dict[str, Any]]:
        """Generate credit score data for users"""
        credit_scores = []

        for user in users:
            base_score = random.randint(550, 820)

            if user.get("kyc_verified"):
                base_score = min(850, base_score + random.randint(10, 40))

            credit_scores.append({
                "user_id": user["id"],
                "score": base_score,
                "score_range": (
                    "Exceptional" if base_score >= 800 else
                    "Very Good" if base_score >= 740 else
                    "Good" if base_score >= 670 else
                    "Fair" if base_score >= 580 else
                    "Poor"
                ),
                "factors": {
                    "payment_history": random.randint(60, 100),
                    "credit_utilization": random.randint(10, 70),
                    "account_age": random.randint(40, 100),
                    "credit_mix": random.randint(30, 100),
                    "new_credit": random.randint(20, 100)
                },
                "loan_eligibility": {
                    "eligible": base_score >= 580,
                    "max_amount": (
                        75000 if base_score >= 800 else
                        50000 if base_score >= 740 else
                        25000 if base_score >= 670 else
                        10000 if base_score >= 580 else 0
                    ),
                    "interest_rate_range": (
                        "3.5% - 6.5%" if base_score >= 800 else
                        "5% - 9%" if base_score >= 740 else
                        "8% - 13%" if base_score >= 670 else
                        "12% - 18%"
                    )
                },
                "last_updated": (datetime.now() - timedelta(days=random.randint(1, 14))).isoformat()
            })

        return credit_scores

    @staticmethod
    def generate_notifications(transactions: List[Dict], fraud_alerts: List[Dict]) -> List[Dict[str, Any]]:
        """Generate realistic notifications"""
        notifications = []
        now = datetime.now()
        user_ids = list({t["sender_id"] for t in transactions})

        # ── Fixed high-quality notifications always present ──────────────────
        fixed = [
            {
                "id": str(uuid.uuid4()),
                "type": "fraud_alert",
                "title": "🚨 High-Risk Transaction Detected",
                "message": "A high-risk transaction of $4,892 was flagged from a new device in a new location.",
                "timestamp": (now - timedelta(minutes=2)).isoformat(),
                "read": False,
                "user_id": user_ids[0] if user_ids else "demo",
                "severity": "high"
            },
            {
                "id": str(uuid.uuid4()),
                "type": "payment",
                "title": "✅ Payment Successful",
                "message": "Payment of $245.00 to Michael Williams completed successfully.",
                "timestamp": (now - timedelta(minutes=10)).isoformat(),
                "read": False,
                "user_id": user_ids[0] if user_ids else "demo",
            },
            {
                "id": str(uuid.uuid4()),
                "type": "security",
                "title": "🔒 New Login Detected",
                "message": "New login detected from Chrome on Windows — New York, USA.",
                "timestamp": (now - timedelta(hours=1)).isoformat(),
                "read": False,
                "user_id": user_ids[0] if user_ids else "demo",
            },
            {
                "id": str(uuid.uuid4()),
                "type": "loan",
                "title": "🏦 Loan Application Update",
                "message": "Your loan application of $10,000 has been approved! Funds will be deposited within 24 hours.",
                "timestamp": (now - timedelta(hours=3)).isoformat(),
                "read": False,
                "user_id": user_ids[0] if user_ids else "demo",
            },
            {
                "id": str(uuid.uuid4()),
                "type": "credit",
                "title": "📈 Credit Score Improved",
                "message": "Your credit score improved by 12 points to 742 — Excellent rating.",
                "timestamp": (now - timedelta(hours=6)).isoformat(),
                "read": True,
                "user_id": user_ids[0] if user_ids else "demo",
            },
            {
                "id": str(uuid.uuid4()),
                "type": "system",
                "title": "ℹ️ System Update",
                "message": "Fraud monitoring system updated successfully. Enhanced ML model now active.",
                "timestamp": (now - timedelta(days=1)).isoformat(),
                "read": True,
                "user_id": user_ids[0] if user_ids else "demo",
            },
            {
                "id": str(uuid.uuid4()),
                "type": "fraud_alert",
                "title": "⚠️ Suspicious Login Attempt",
                "message": "An unauthorized login attempt was blocked from an unknown device in Berlin, Germany.",
                "timestamp": (now - timedelta(days=1, hours=2)).isoformat(),
                "read": True,
                "user_id": user_ids[0] if user_ids else "demo",
                "severity": "medium"
            },
            {
                "id": str(uuid.uuid4()),
                "type": "payment",
                "title": "💸 Payment Received",
                "message": "You received $1,320.00 from Sarah Garcia — Invoice #INV-2847.",
                "timestamp": (now - timedelta(days=2)).isoformat(),
                "read": True,
                "user_id": user_ids[0] if user_ids else "demo",
            },
        ]
        notifications.extend(fixed)

        # ── Dynamic notifications from completed transactions ──────────────
        completed = [t for t in transactions if t["status"] == "completed"][:5]
        for tx in completed:
            tx_time = datetime.fromisoformat(tx["timestamp"])
            elapsed_minutes = int((now - tx_time).total_seconds() / 60)
            if elapsed_minutes < 60:
                time_str = f"{elapsed_minutes} minutes ago"
            elif elapsed_minutes < 1440:
                time_str = f"{elapsed_minutes // 60} hours ago"
            else:
                time_str = f"{elapsed_minutes // 1440} days ago"

            notifications.append({
                "id": str(uuid.uuid4()),
                "type": "payment",
                "title": "✅ Transaction Completed",
                "message": f"${tx['amount']:.2f} payment to {tx['recipient_name']} — {tx['description']}",
                "time": time_str,
                "timestamp": tx["timestamp"],
                "read": random.choice([True, False]),
                "user_id": tx["sender_id"],
                "data": {"transaction_id": tx["id"]}
            })

        # ── Dynamic fraud alert notifications ─────────────────────────────
        for alert in fraud_alerts[:3]:
            notifications.append({
                "id": str(uuid.uuid4()),
                "type": "fraud_alert",
                "title": "🚨 Fraud Alert",
                "message": f"Suspicious ${alert['amount']:.2f} transaction flagged — {alert['reason']}",
                "timestamp": alert["timestamp"],
                "read": False,
                "user_id": alert["user_id"],
                "severity": alert["risk_level"],
                "data": {"alert_id": alert["id"]}
            })

        # Sort newest first
        notifications.sort(key=lambda x: x["timestamp"], reverse=True)
        return notifications

    @staticmethod
    def generate_dashboard_stats(transactions: List[Dict], fraud_alerts: List[Dict]) -> Dict[str, Any]:
        """Generate dashboard statistics with flat field names matching the frontend"""
        completed = [t for t in transactions if t["status"] == "completed"]
        pending = [t for t in transactions if t["status"] == "pending"]
        failed = [t for t in transactions if t["status"] == "failed"]
        risky = [t for t in transactions if t["fraud_score"] >= 0.6]

        total_volume = sum(t["amount"] for t in completed)
        avg_tx = round(total_volume / len(completed), 2) if completed else 0.0

        # Recent transactions for dashboard display (last 8)
        recent_transactions = transactions[:8]

        return {
            # Flat fields consumed directly by Dashboard.tsx
            "total_volume": round(total_volume, 2),
            "transaction_count": len(transactions),
            "fraud_alerts_count": len(fraud_alerts),
            "success_rate": round(len(completed) / len(transactions) * 100, 2) if transactions else 0,
            "average_transaction": avg_tx,
            "recent_transactions": recent_transactions,

            # Nested for advanced charts/summary
            "key_metrics": {
                "total_transactions": len(transactions),
                "completed_transactions": len(completed),
                "total_volume": round(total_volume, 2),
                "average_transaction": avg_tx,
                "fraud_alerts_count": len(fraud_alerts),
                "blocked_transactions": len([t for t in transactions if t["status"] == "cancelled"]),
                "success_rate": round(len(completed) / len(transactions) * 100, 2) if transactions else 0,
            },
            "risk_distribution": {
                "low": len([t for t in transactions if t["fraud_score"] < 0.3]),
                "medium": len([t for t in transactions if 0.3 <= t["fraud_score"] < 0.6]),
                "high": len([t for t in transactions if 0.6 <= t["fraud_score"] < 0.8]),
                "critical": len([t for t in transactions if t["fraud_score"] >= 0.8]),
            },
            "transaction_status": {
                "completed": len(completed),
                "pending": len(pending),
                "failed": len(failed),
                "cancelled": len([t for t in transactions if t["status"] == "cancelled"])
            },
            "trends": {
                "daily_volume": MockDataGenerator._generate_trend_data(30),
                "fraud_detection": MockDataGenerator._generate_fraud_trend(30),
            },
            "top_senders": MockDataGenerator._get_top_users(transactions, "sender", 5),
            "top_recipients": MockDataGenerator._get_top_users(transactions, "recipient", 5),
        }

    @staticmethod
    def _generate_trend_data(days: int = 30) -> List[Dict[str, Any]]:
        """Generate trend data for charts"""
        trend = []
        base = random.uniform(20000, 35000)
        for i in range(days):
            date = (datetime.now() - timedelta(days=days - i)).date()
            volume = max(0, base + random.uniform(-5000, 8000))
            base = volume  # slight drift
            trend.append({
                "date": date.isoformat(),
                "volume": round(volume, 2),
                "transaction_count": random.randint(15, 120)
            })
        return trend

    @staticmethod
    def _generate_fraud_trend(days: int = 30) -> List[Dict[str, Any]]:
        """Generate fraud detection trend"""
        trend = []
        for i in range(days):
            date = (datetime.now() - timedelta(days=days - i)).date()
            trend.append({
                "date": date.isoformat(),
                "detected": random.randint(0, 8),
                "blocked": random.randint(0, 5),
                "false_positive_rate": round(random.uniform(0.2, 3.5), 2)
            })
        return trend

    @staticmethod
    def _get_top_users(transactions: List[Dict], user_type: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Get top users by transaction volume"""
        key = f"{user_type}_name"
        key_id = f"{user_type}_id"
        key_avatar = f"{user_type}_avatar"

        user_volumes: Dict[str, Any] = {}
        for t in transactions:
            user_name = t[key]
            if user_name not in user_volumes:
                user_volumes[user_name] = {
                    "name": user_name,
                    "id": t[key_id],
                    "avatar": t.get(key_avatar, ""),
                    "volume": 0,
                    "count": 0
                }
            user_volumes[user_name]["volume"] += t["amount"]
            user_volumes[user_name]["count"] += 1

        sorted_users = sorted(user_volumes.values(), key=lambda x: x["volume"], reverse=True)
        for u in sorted_users:
            u["volume"] = round(u["volume"], 2)
        return sorted_users[:limit]


# ── Data singleton ───────────────────────────────────────────────────────────
class MockData:
    """Singleton for mock data — initialised once per server lifecycle"""
    _instance = None
    _initialized = False

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        if not self._initialized:
            self.users = MockDataGenerator.generate_users(12)
            self.transactions = MockDataGenerator.generate_transactions(self.users, 60)
            self.fraud_alerts = MockDataGenerator.generate_fraud_alerts(self.transactions, 10)
            self.credit_scores = MockDataGenerator.generate_credit_scores(self.users)
            self.notifications = MockDataGenerator.generate_notifications(self.transactions, self.fraud_alerts)
            self.dashboard_stats = MockDataGenerator.generate_dashboard_stats(self.transactions, self.fraud_alerts)
            MockData._initialized = True

    def add_transaction(self, transaction: Dict[str, Any]):
        """Add a new transaction and refresh stats"""
        self.transactions.insert(0, transaction)
        self.transactions = self.transactions[:60]
        self.dashboard_stats = MockDataGenerator.generate_dashboard_stats(self.transactions, self.fraud_alerts)

    def add_fraud_alert(self, alert: Dict[str, Any]):
        """Add a new fraud alert"""
        self.fraud_alerts.insert(0, alert)
        self.fraud_alerts = self.fraud_alerts[:15]

    def add_notification(self, notification: Dict[str, Any]):
        """Add a new notification"""
        self.notifications.insert(0, notification)
        self.notifications = self.notifications[:30]

    def get_user_by_id(self, user_id: str):
        """Get user by ID"""
        for user in self.users:
            if user["id"] == user_id:
                return user
        return None

    def get_user_transactions(self, user_id: str, limit: int = 20):
        """Get transactions for a specific user"""
        user_transactions = [
            t for t in self.transactions
            if t["sender_id"] == user_id or t["recipient_id"] == user_id
        ]
        return user_transactions[:limit]

    def get_user_notifications(self, user_id: str, limit: int = 20):
        """Get notifications for a specific user"""
        user_notifications = [
            n for n in self.notifications
            if n.get("user_id") == user_id
        ]
        return user_notifications[:limit]

    def mark_notification_read(self, notification_id: str):
        """Mark notification as read"""
        for notification in self.notifications:
            if notification["id"] == notification_id:
                notification["read"] = True
                return True
        return False
