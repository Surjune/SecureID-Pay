# Database configuration and connection
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Use SQLite for MVP (can be switched to PostgreSQL later)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./secureid_pay.db")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    """Initialize database by creating all tables"""
    # Import Base here to avoid circular imports
    from app.models import Base
    try:
        Base.metadata.create_all(bind=engine)
        print("Database initialized successfully")
    except Exception as e:
        print(f"Error initializing database: {e}")
        raise

def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
