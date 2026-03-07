#!/usr/bin/env python3
"""
SecureID-Pay Development Server

Usage:
    python run.py          # Run development server
    python run.py --host 0.0.0.0  # Bind to all interfaces
    python run.py --port 8001     # Use different port
"""

import uvicorn
import sys
import argparse

def main():
    parser = argparse.ArgumentParser(description="SecureID-Pay Development Server")
    parser.add_argument("--host", default="127.0.0.1", help="Host to bind to")
    parser.add_argument("--port", type=int, default=8000, help="Port to bind to")
    parser.add_argument("--reload", action="store_true", default=True, help="Enable auto-reload")
    parser.add_argument("--workers", type=int, default=1, help="Number of workers")
    
    args = parser.parse_args()
    
    print(f"Starting SecureID-Pay API on {args.host}:{args.port}")
    print(f"Interactive docs: http://{args.host}:{args.port}/docs")
    print(f"ReDoc: http://{args.host}:{args.port}/redoc")
    
    uvicorn.run(
        "app.main:app",
        host=args.host,
        port=args.port,
        reload=args.reload,
        workers=args.workers,
    )

if __name__ == "__main__":
    main()
