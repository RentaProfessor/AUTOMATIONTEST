#!/bin/bash

# Start FutureClarity Chatbot with Named Cloudflare Tunnel
echo "🚀 Starting FutureClarity Chatbot..."
echo "=================================="

# Function to cleanup on exit
cleanup() {
    echo "🛑 Shutting down..."
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
sleep 2

# Start the chatbot app in background
echo "🤖 Starting chatbot app on port 3000..."
python3 chatbot_app.py &
CHATBOT_PID=$!

# Wait for the app to start
echo "⏳ Waiting for chatbot to start..."
sleep 10

# Check if chatbot is running
if ! kill -0 $CHATBOT_PID 2>/dev/null; then
    echo "❌ Chatbot failed to start. Check the logs above."
    exit 1
fi

# Test if the chatbot is responding
echo "🧪 Testing chatbot connection..."
if curl -s http://localhost:3000/api/health > /dev/null; then
    echo "✅ Chatbot is running on http://localhost:3000"
else
    echo "❌ Chatbot is not responding. Check the logs above."
    kill $CHATBOT_PID 2>/dev/null || true
    exit 1
fi

echo "🌐 Starting named tunnel 'ai-chatbot'..."
echo "💡 This will use your existing named tunnel"

# Start the named tunnel
echo "🚀 Starting tunnel..."
cloudflared tunnel run ai-chatbot &
TUNNEL_PID=$!

# Wait for tunnel to start
echo "⏳ Waiting for tunnel to connect..."
sleep 5

# Check if tunnel is running
if ! kill -0 $TUNNEL_PID 2>/dev/null; then
    echo "❌ Tunnel failed to start. Check your tunnel configuration."
    kill $CHATBOT_PID 2>/dev/null || true
    exit 1
fi

echo "✅ Setup complete!"
echo ""
echo "🎯 Your chatbot is now running with named tunnel!"
echo "🏠 Local access: http://localhost:3000"
echo "🔑 Tunnel name: ai-chatbot"
echo "🆔 Tunnel ID: 6b77187f-6ad1-4eaf-bd50-52f58e39ade7"
echo ""
echo "📝 Check the tunnel output above for your public URL"
echo "🔗 It should look like: https://ai-chatbot-xyz.trycloudflare.com"
echo ""
echo "🛑 Press Ctrl+C to stop both services"
echo ""

# Keep script running and monitor processes
while true; do
    if ! kill -0 $CHATBOT_PID 2>/dev/null; then
        echo "❌ Chatbot stopped unexpectedly"
        cleanup
    fi
    
    if ! kill -0 $TUNNEL_PID 2>/dev/null; then
        echo "❌ Tunnel stopped unexpectedly"
        cleanup
    fi
    
    sleep 5
done 