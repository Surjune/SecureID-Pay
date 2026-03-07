from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
from app.routers import auth, payments, lending, fraud, insights, dashboard, mock_api
from app.database import init_db

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="SecureID-Pay API",
    description="Secure digital payments and lending platform",
    version="0.1.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
@app.on_event("startup")
async def startup():
    logger.info("Initializing database...")
    init_db()

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(payments.router, prefix="/api", tags=["Payments"])
app.include_router(lending.router, prefix="/api", tags=["Lending"])
app.include_router(fraud.router, prefix="/api", tags=["Fraud Detection"])
app.include_router(insights.router, prefix="/api", tags=["Insights"])
app.include_router(dashboard.router, prefix="/api", tags=["Dashboard"])
app.include_router(mock_api.router, tags=["Mock Data"])

# Root endpoint
@app.get("/", tags=["Health"])
async def read_root():
    return {
        "message": "SecureID-Pay API",
        "version": "0.1.0",
        "status": "operational"
    }

# Health checks
@app.get("/health", tags=["Health"])
@app.get("/healthz", tags=["Health"])
async def health():
    return {"status": "ok"}

@app.get("/api/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": "SecureID-Pay API"
    }

# Error handlers
@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"message": "Internal server error"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
