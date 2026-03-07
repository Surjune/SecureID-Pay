from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class UserModel(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    income_type = Column(String, default="stable")  # 'stable' or 'variable'
    kyc_verified = Column(Boolean, default=False)
    account_balance = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    transactions = relationship("TransactionModel", back_populates="user")
    loans = relationship("LoanModel", back_populates="user")
    credit_scores = relationship("CreditScoreModel", back_populates="user")

class TransactionModel(Base):
    __tablename__ = "transactions"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    sender_id = Column(String, nullable=False)
    recipient_id = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="USD")
    transaction_type = Column(String)  # 'send' or 'receive'
    description = Column(String, nullable=True)
    status = Column(String, default="pending")  # pending, completed, failed
    fraud_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("UserModel", back_populates="transactions")

class LoanModel(Base):
    __tablename__ = "loans"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    interest_rate = Column(Float, nullable=False)
    duration_months = Column(Integer, nullable=False)
    status = Column(String, default="pending")  # pending, approved, rejected, active, completed
    purpose = Column(String, nullable=True)
    approved_amount = Column(Float, nullable=True)
    remaining_balance = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    approved_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("UserModel", back_populates="loans")

class CreditScoreModel(Base):
    __tablename__ = "credit_scores"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    score = Column(Integer, default=300)  # Score between 300-850
    score_factors = Column(String, nullable=True)  # JSON string of factors
    last_updated = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("UserModel", back_populates="credit_scores")
