# Backend - Python FastAPI

## Setup

```bash
cd backend
pip install -r requirements.txt
python -m app.main
```

The API will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

## Project Structure

- `app/main.py` - FastAPI application setup
- `app/routers/` - API endpoint routers
  - `auth.py` - Authentication endpoints
  - `payments.py` - Payment endpoints
  - `lending.py` - Lending endpoints
  - `fraud.py` - Fraud detection endpoints
  - `insights.py` - Insights endpoints
  - `dashboard.py` - Dashboard endpoints
- `app/models/` - Database models
- `app/schemas/` - Request/Response schemas
- `app/services/` - Business logic services
  - `auth_service.py` - Authentication logic
  - `fraud_service.py` - Fraud detection logic
  - `credit_service.py` - Credit scoring logic
  - `insights_service.py` - Analytics logic
- `app/utils/` - Utility functions
- `database/` - Database configuration

## Database

By default uses SQLite (`secureid_pay.db`). Can be switched to PostgreSQL by modifying database URL in `database/database.py`.

## Available Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Payments
- `POST /api/payment/send` - Send payment
- `GET /api/transactions` - Get transaction history
- `GET /api/transactions/{id}` - Get transaction details

### Lending
- `POST /api/loan/apply` - Apply for loan
- `GET /api/loan/eligibility` - Check loan eligibility
- `GET /api/loans` - Get user's loans
- `GET /api/loans/{id}` - Get loan details

### Fraud Detection
- `POST /api/fraud/check` - Check transaction for fraud
- `GET /api/fraud/alerts` - Get fraud alerts

### Insights
- `GET /api/insights/spending` - Get spending insights
- `GET /api/insights/categories` - Get category breakdown

### Dashboard
- `GET /api/dashboard` - Get complete dashboard
- `GET /api/dashboard/balance` - Get account balance
- `GET /api/dashboard/credit-score` - Get credit score
