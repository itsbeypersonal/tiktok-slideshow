#!/bin/bash

echo "Starting TikTok Slideshow Generator..."
echo

echo "[1/2] Starting Backend Server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

echo "[2/2] Starting Frontend Server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo
echo "Both servers are starting..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo

# Function to cleanup on script exit
cleanup() {
    echo
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "Servers stopped."
    exit 0
}

# Trap cleanup function on script exit
trap cleanup SIGINT SIGTERM

echo "Press Ctrl+C to stop both servers"
echo

# Wait for both processes
wait
