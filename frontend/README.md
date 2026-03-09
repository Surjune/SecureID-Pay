# Frontend - React + TypeScript

## Setup

```bash
npm install
npm run dev
```

## Environment Variables

### Local Development

Create a `.env.local` file in the frontend directory:

```
VITE_API_URL=http://localhost:8000
```

This must point to your local backend server (default is `localhost:8000`).

### Production (Vercel)

Set the environment variable on Vercel:

1. Go to **Vercel Project Settings** → **Environment Variables**
2. Add the following variable:

```
Name: VITE_API_URL
Value: https://secureid-pay.onrender.com
```

The environment variable is automatically picked up by Vite during the build process.

## Build

```bash
npm run build
```

## Project Structure

- `src/components/` - Reusable UI components
- `src/pages/` - Page components
- `src/services/` - API integration
- `src/types/` - TypeScript type definitions
- `src/utils/` - Helper functions

## Features

- Dashboard with real-time financial overview
- Payment functionality with transaction history
- Lending application and loan management
- Spending insights and analytics
- User profile management
- Fraud detection alerts
- Responsive design for mobile and desktop
