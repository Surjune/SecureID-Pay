#!/bin/bash
# Development environment setup for SecureID-Pay

echo "Setting up SecureID-Pay development environment..."

# Backend setup
echo "Setting up backend..."
cd backend
if [ ! -d "venv" ]; then
    python -m venv venv
    echo "Created virtual environment"
fi

# Activate virtual environment
source venv/bin/activate 2>/dev/null || . venv/Scripts/activate 2>/dev/null

pip install -r requirements.txt
echo "Backend dependencies installed"

cd ..

# Frontend setup
echo "Setting up frontend..."
cd frontend
npm install
echo "Frontend dependencies installed"

cd ..

echo ""
echo "Setup complete!"
echo ""
echo "To start the development servers:"
echo "  Backend:  cd backend && python run.py"
echo "  Frontend: cd frontend && npm run dev"
