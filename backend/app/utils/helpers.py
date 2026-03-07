# Utility functions

import uuid
from datetime import datetime

def generate_id(prefix: str = "") -> str:
    """Generate unique ID with optional prefix"""
    unique_id = str(uuid.uuid4())
    return f"{prefix}{unique_id}" if prefix else unique_id

def get_transaction_type(sender_id: str, current_user_id: str) -> str:
    """Determine transaction type from perspective of current user"""
    return "receive" if sender_id != current_user_id else "send"

def format_currency(amount: float) -> str:
    """Format amount as currency string"""
    return f"${amount:,.2f}"

def get_days_ago(date: datetime) -> int:
    """Get number of days ago a date was"""
    return (datetime.utcnow() - date).days

def validate_email(email: str) -> bool:
    """Validate email format"""
    import re
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return re.match(pattern, email) is not None

def validate_phone(phone: str) -> bool:
    """Validate phone number format"""
    import re
    pattern = r"^\+?1?\d{9,15}$"
    return re.match(pattern, phone.replace("-", "").replace(" ", "")) is not None
