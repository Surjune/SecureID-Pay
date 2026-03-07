# SecureID-Pay - Fintech MVP

A complete full-stack fintech platform for secure digital payments, fraud detection, and inclusive lending.

## Overview

SecureID-Pay is designed to make payments and lending smarter, safer, and more accessible for:
- Stable income workers
- Freelancers
- Delivery drivers
- Daily wage workers
- Micro business owners

### Key Features

✅ **Secure Digital Payments** - Fast, secure peer-to-peer payments
✅ **Fraud Detection** - AI-powered fraud detection and prevention
✅ **Smart Lending** - Credit scoring and loan eligibility assessment
✅ **Spending Insights** - AI-powered spending analytics and categorization
✅ **Inclusive** - Designed for workers with variable income
✅ **KYC Verification** - Complete identity verification system

## Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **React Router** - Navigation
- **Axios** - HTTP client
- **CSS3** - Responsive styling

### Backend
- **Python 3.10+**
- **FastAPI** - Modern API framework
- **SQLAlchemy** - ORM
- **SQLite** (PostgreSQL ready) - Database
- **JWT** - Authentication
- **Pydantic** - Data validation

## Project Structure

```
SecureID-Pay/
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API integration
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Helper functions
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── README.md
│
├── backend/
│   ├── app/
│   │   ├── routers/         # API endpoints
│   │   ├── models/          # Database models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utilities
│   │   └── main.py          # FastAPI app
│   ├── database/            # DB configuration
│   ├── requirements.txt
│   └── README.md
│
├── .gitignore
└── README.md
```

## Quick Start

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python -m app.main
```

API will be available at `http://localhost:8000`
Interactive API docs: `http://localhost:8000/docs`

## Frontend Pages

1. **Dashboard** - Overview of account, balance, loans, and spending
2. **Payments** - Send payments and view transaction history
3. **Lending** - Apply for loans, check eligibility, manage active loans
4. **Insights** - Spending analytics, category breakdown, financial health
5. **Profile** - User profile, security settings, account management

## Backend API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Authenticate user
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - Logout

### Payments
- `POST /api/payment/send` - Send payment
- `GET /api/transactions` - Get transaction history
- `GET /api/transactions/{id}` - Get transaction details

### Lending
- `POST /api/loan/apply` - Apply for loan
- `GET /api/loan/eligibility` - Check loan eligibility
- `GET /api/loans` - Get user loans
- `GET /api/loans/{id}` - Get loan details

### Fraud Detection
- `POST /api/fraud/check` - Check transaction for fraud
- `GET /api/fraud/alerts` - Get fraud alerts

### Insights & Analytics
- `GET /api/insights/spending` - Get spending insights
- `GET /api/insights/categories` - Get category breakdown

### Dashboard
- `GET /api/dashboard` - Complete dashboard data
- `GET /api/dashboard/balance` - Account balance
- `GET /api/dashboard/credit-score` - Credit score

## Features

### Components
- Responsive Sidebar Navigation
- Top Navigation Bar with Notifications
- Dashboard Cards for Key Metrics
- Transaction List with Status Indicators
- Payment Form with Validation
- Loan Application Form
- Fraud Alert Banner
- Spending Insights Widget
- Category Breakdown Chart

### Services & Logic
- User authentication with JWT
- Fraud detection scoring
- Credit score calculation
- Loan eligibility assessment
- Spending analytics with categorization
- Responsive design for mobile, tablet, desktop

## Database Schema

### Users Table
- id (UUID)
- email, password_hash
- first_name, last_name, phone
- income_type (stable/variable)
- kyc_verified
- account_balance
- created_at, updated_at

### Transactions Table
- id (UUID)
- user_id, sender_id, recipient_id
- amount, currency
- type (send/receive)
- status (pending/completed/failed)
- fraud_score
- created_at

### Loans Table
- id (UUID)
- user_id
- amount, interest_rate, duration_months
- status (pending/approved/rejected/active/completed)
- purpose
- created_at, approved_at

### Credit Scores Table
- id (UUID)
- user_id
- score (300-850)
- last_updated

## Security Features

- Password hashing with PBKDF2
- JWT-based authentication
- HTTPBearer token scheme
- CORS protection (configured for localhost)
- Input validation with Pydantic
- Fraud detection scoring
- KYC verification tracking

## Future Enhancements

- [ ] Two-factor authentication
- [ ] Biometric authentication
- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Advanced ML fraud detection
- [ ] Cryptocurrency integration
- [ ] Bill payment integration
- [ ] Savings goals tracking
- [ ] Investment products
- [ ] Admin dashboard
- [ ] Analytics & reporting

## Development Workflow

1. Create feature branches for new features
2. Frontend changes in `/frontend` directory
3. Backend changes in `/backend` directory
4. Test locally before committing
5. Follow code structure conventions

## Environment Variables

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=SecureID-Pay
```

### Backend (.env)
```
DATABASE_URL=sqlite:///./secureid_pay.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
```

## License

MIT License

## Contributors

- Project initialized: March 7, 2026
- Team: FinTech Development Team

## Support

For issues, questions, or contributions, please open an issue on the repository.

---

**SecureID-Pay** - Making fintech accessible to everyone 💳🔒
