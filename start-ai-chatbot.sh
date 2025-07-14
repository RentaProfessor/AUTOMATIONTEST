#!/bin/bash

# Start AI Chatbot with Cloudflare Tunnel
echo "🎬 Starting AI Chatbot with Cloudflare Tunnel..."
echo "================================================"

# Function to cleanup on exit
cleanup() {
    echo "🛑 Shutting down..."
    pkill -f "python.*app.py" 2>/dev/null || true
    pkill -f cloudflared 2>/dev/null || true
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "python.*app.py" 2>/dev/null || true
pkill -f cloudflared 2>/dev/null || true
sleep 2

# Start Flask app in background
echo "🚀 Starting Flask app..."
python3 app.py &
FLASK_PID=$!

# Wait for Flask to start
echo "⏳ Waiting for Flask app to start..."
sleep 10

# Check if Flask is running
if ! kill -0 $FLASK_PID 2>/dev/null; then
    echo "❌ Flask app failed to start"
    exit 1
fi

echo "✅ Flask app is running on http://localhost:5001"

# Start Cloudflare tunnel in background
echo "🌐 Starting Cloudflare tunnel..."
cloudflared tunnel run ai-chatbot &
TUNNEL_PID=$!

# Wait for tunnel to start
echo "⏳ Waiting for Cloudflare tunnel to start..."
sleep 5

# Check if tunnel is running
if ! kill -0 $TUNNEL_PID 2>/dev/null; then
    echo "❌ Cloudflare tunnel failed to start"
    kill $FLASK_PID 2>/dev/null || true
    exit 1
fi

echo "✅ Cloudflare tunnel is running"
echo "🌐 Your AI chatbot is available at: https://ai.yourdomain.com"
echo "📱 Local access: http://localhost:5001"
echo ""
echo "🛑 Press Ctrl+C to stop both services"

# Keep script running and monitor processes
while true; do
    if ! kill -0 $FLASK_PID 2>/dev/null; then
        echo "❌ Flask app stopped unexpectedly"
        cleanup
    fi
    
    if ! kill -0 $TUNNEL_PID 2>/dev/null; then
        echo "❌ Cloudflare tunnel stopped unexpectedly"
        cleanup
    fi
    
    sleep 5
done 