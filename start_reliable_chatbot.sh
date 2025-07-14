#!/bin/bash

# FutureClarity Chatbot - Reliable Startup Script
echo "🚀 Starting FutureClarity Chatbot (Reliable Mode)..."
echo "=============================================="

# Function to cleanup on exit
cleanup() {
    echo "🛑 Shutting down services..."
    pkill -f "python3.*chatbot_app.py" 2>/dev/null || true
    pkill -f "cloudflared.*tunnel.*ai-chatbot" 2>/dev/null || true
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "python3.*chatbot_app.py" 2>/dev/null || true
pkill -f "cloudflared.*tunnel.*ai-chatbot" 2>/dev/null || true
sleep 3

# Start the chatbot app
echo "🤖 Starting chatbot app on port 3000..."
python3 chatbot_app.py &
CHATBOT_PID=$!

# Wait for the app to start
echo "⏳ Waiting for chatbot to start..."
sleep 15

# Test chatbot connection
echo "🧪 Testing chatbot connection..."
for i in {1..5}; do
    if curl -s http://localhost:3000/api/health > /dev/null; then
        echo "✅ Chatbot is running successfully!"
        break
    fi
    if [ $i -eq 5 ]; then
        echo "❌ Chatbot failed to start after 5 attempts"
        cleanup
    fi
    echo "⏳ Attempt $i failed, retrying in 3 seconds..."
    sleep 3
done

# Start the tunnel
echo "🌐 Starting Cloudflare tunnel..."
nohup cloudflared tunnel --config cloudflare-tunnel.yml run ai-chatbot > tunnel.log 2>&1 &
TUNNEL_PID=$!

# Wait for tunnel to establish
echo "⏳ Waiting for tunnel to establish connections..."
sleep 10

# Test tunnel connection
echo "🧪 Testing tunnel connection..."
for i in {1..3}; do
    if ps -p $TUNNEL_PID > /dev/null; then
        echo "✅ Tunnel process is running!"
        break
    fi
    if [ $i -eq 3 ]; then
        echo "❌ Tunnel failed to start"
        cleanup
    fi
    echo "⏳ Tunnel attempt $i failed, retrying..."
    sleep 5
done

echo ""
echo "🎯 FutureClarity Chatbot is now running!"
echo "=============================================="
echo "🏠 Local chatbot: http://localhost:3000"
echo "🌍 Public URL: https://ai-chatbot.yourdomain.com.futureclarityautomation.com"
echo "🔧 Embed URL: https://ai-chatbot.yourdomain.com.futureclarityautomation.com/embed"
echo "📊 Health check: https://ai-chatbot.yourdomain.com.futureclarityautomation.com/api/health"
echo ""
echo "🆔 Tunnel ID: 6b77187f-6ad1-4eaf-bd50-52f58e39ade7"
echo "🔗 Connector ID: 76cdbf91-8678-4fdb-87de-8f1b254227e4"
echo ""
echo "🛑 Press Ctrl+C to stop all services"
echo "📝 Monitor logs with: tail -f tunnel.log"
echo ""

# Monitor processes and restart if needed
while true; do
    # Check chatbot process
    if ! ps -p $CHATBOT_PID > /dev/null; then
        echo "❌ Chatbot process died, restarting..."
        python3 chatbot_app.py &
        CHATBOT_PID=$!
        sleep 10
    fi
    
    # Check tunnel process
    if ! ps -p $TUNNEL_PID > /dev/null; then
        echo "❌ Tunnel process died, restarting..."
        nohup cloudflared tunnel --config cloudflare-tunnel.yml run ai-chatbot > tunnel.log 2>&1 &
        TUNNEL_PID=$!
        sleep 10
    fi
    
    sleep 30
done 