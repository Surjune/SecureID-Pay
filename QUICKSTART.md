# SecureID-Pay Quick Start Guide

## System Requirements

- **Windows 10+**, macOS 10.14+, or Linux (Ubuntu 18.04+)
- **Python 3.10 or higher**
- **Node.js 16.x or higher**
- **npm 7.x or higher**
- At least 2GB free disk space

## Step 1: Backend Setup (Python)

### 1.1 Navigate to Backend Directory
```bash
cd backend
```

### 1.2 Create Virtual Environment (Recommended)

**On Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 1.3 Install Dependencies
```bash
pip install -r requirements.txt
```

Expected packages:
- fastapi==0.104.1
- uvicorn==0.24.0
- sqlalchemy==2.0.23
- pydantic==2.4.2
- python-jose==3.3.0
- passlib==1.7.4
- python-multipart==0.0.6
- email-validator==2.1.0

### 1.4 Verify Installation
```bash
python -m pip list | grep -E "fastapi|sqlalchemy|pydantic"
```

### 1.5 Start Backend Server
```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

✅ Backend is running at: **http://localhost:8000**
✅ API Docs available at: **http://localhost:8000/docs**

---

## Step 2: Frontend Setup (Node.js/React)

### 2.1 Open New Terminal/PowerShell

Keep the backend terminal running in the background!

### 2.2 Navigate to Frontend Directory
```bash
cd frontend
```

### 2.3 Install Dependencies
```bash
npm install
```

This may take 2-5 minutes depending on internet speed.

### 2.4 Start Development Server
```bash
npm run dev
```

**Expected Output:**
```
  VITE v4.2.0  ready in 123 ms
  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

✅ Frontend is running at: **http://localhost:5173**

---

## Step 3: Test the Application

### 3.1 Open Browser
- **Frontend**: http://localhost:5173
- **Backend Docs**: http://localhost:8000/docs

### 3.2 First Time Setup

The backend automatically creates the SQLite database on startup. No additional setup needed!

### 3.3 Test API (Using Swagger UI)

1. Go to http://localhost:8000/docs
2. Click on **POST /api/auth/register**
3. Click **Try it out**
4. Enter test data:
```json
{
  "email": "test@example.com",
  "password": "Test123!",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "1234567890",
  "income_type": "stable"
}
```
5. Click **Execute**
6. Note the `access_token` from the response

### 3.4 Test Login
1. Click on **POST /api/auth/login**
2. Enter email and password as query parameters:
   - email: test@example.com
   - password: Test123!
3. Click **Execute**

---

## Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```
Then update frontend API URL in `frontend/src/services/api.ts`

**Missing dependencies:**
```bash
pip install -r requirements.txt --upgrade
```

**Database issues:**
```bash
# Delete the database file and restart
rm secureid_pay.db
python -m uvicorn app.main:app --reload
```

**Import errors:**
Ensure you're in the backend directory:
```bash
cd backend
python -m uvicorn app.main:app --reload
```

### Frontend Issues

**Port 5173 already in use:**
```bash
npm run dev -- --port 5174
```

**Module not found errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Blank page on localhost:5173:**
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Ensure backend is running (http://localhost:8000/docs loads)

**CORS errors:**
These are normal during development. The backend CORS middleware is configured to allow both ports.

---

## Development Workflow

### Backend Development

1. Keep terminal running with `--reload` flag
2. Make changes to Python files
3. Save file - server will automatically reload
4. Test using Swagger UI at http://localhost:8000/docs

### Frontend Development

1. Keep terminal running with `npm run dev`
2. Make changes to React/TypeScript files
3. Save file - page will hot-reload automatically
4. Test in browser at http://localhost:5173

---

## Key Files to Know

### Backend
- `app/main.py` - FastAPI application initialization
- `app/routers/` - API route handlers
- `app/models/__init__.py` - Database models
- `app/services/` - Business logic
- `requirements.txt` - Python dependencies
- `secureid_pay.db` - SQLite database (auto-created)

### Frontend
- `src/App.tsx` - Main React component
- `src/pages/` - Page components
- `src/components/` - Reusable components
- `src/services/api.ts` - API client
- `vite.config.ts` - Vite configuration
- `package.json` - Node.js dependencies

---

## Building for Production

### Frontend Build
```bash
cd frontend
npm run build
```

Output in `frontend/dist/` - ready to deploy to static hosting

### Backend Deployment
The FastAPI application can be deployed using:
- Docker (recommended)
- Heroku
- AWS Lambda
- Traditional servers with Gunicorn

Example with Gunicorn:
```bash
pip install gunicorn
gunicorn app.main:app --workers 4 --timeout 60
```

---

## Environment Variables

### Backend (.env file)
```
DATABASE_URL=sqlite:///./secureid_pay.db
JWT_SECRET=your-secret-key
ENVIRONMENT=development
```

### Frontend (.env file)
```
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=SecureID-Pay
```

---

## API Documentation

Full API documentation is available at:
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json

---

## Features Overview

✅ User Registration & Authentication
✅ Secure Payments with Fraud Detection
✅ Loan Applications & Eligibility
✅ Credit Scoring
✅ Spending Insights & Analytics
✅ Mobile-Responsive Design
✅ Transaction History
✅ Profile Management

---

## Support & Help

### Check Backend Status
```bash
curl http://localhost:8000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "SecureID-Pay API"
}
```

### View API Routes
Visit: http://localhost:8000/docs

All endpoints with documentation and test interface available there.

---

## Next Steps

1. ✅ Complete user registration flow
2. ✅ Test payment functionality
3. ✅ Try loan application process
4. ✅ Check fraud detection
5. ✅ Verify responsive design on mobile
6. ✅ Deploy to production

---

**Happy Development! 🚀**
