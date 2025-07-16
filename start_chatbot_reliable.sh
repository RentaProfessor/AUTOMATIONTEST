#!/bin/bash

# FutureClarity Chatbot - Reliable Startup Script (Named Tunnel Version)
# This script ensures the chatbot and tunnel stay running with automatic restarts

PERMANENT_DOMAIN="https://ai-chatbot.futureclarityautomation.com"
EMBED_URL="$PERMANENT_DOMAIN/embed"
TUNNEL_CONFIG="cloudflare-tunnel.yml"
TUNNEL_NAME="ai-chatbot"

update_html_files() {
    echo "📝 Updating HTML files with permanent tunnel URL..."
    # Update main index.html
    if [ -f "index.html" ]; then
        sed -i.bak "s|https://[^"]*trycloudflare.com/embed|$EMBED_URL|g" index.html
        sed -i.bak "s|https://[^"]*futureclarityautomation.com/embed|$EMBED_URL|g" index.html
        echo "✅ Updated index.html"
    fi
    # Update website/index.html
    if [ -f "website/index.html" ]; then
        sed -i.bak "s|https://[^"]*trycloudflare.com/embed|$EMBED_URL|g" website/index.html
        sed -i.bak "s|https://[^"]*futureclarityautomation.com/embed|$EMBED_URL|g" website/index.html
        echo "✅ Updated website/index.html"
    fi
    # Update current tunnel URL file
    echo "$PERMANENT_DOMAIN" > current_tunnel_url.txt
}

check_port() {
    local port=$1
    lsof -i :$port > /dev/null 2>&1
}

wait_for_service() {
    local url=$1
    local max_attempts=30
    local attempt=1
    echo "⏳ Waiting for service at $url..."
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            echo "✅ Service is ready!"
            return 0
        fi
        echo "   Attempt $attempt/$max_attempts..."
        sleep 2
        ((attempt++))
    done
    echo "❌ Service failed to start within expected time"
    return 1
}

start_chatbot() {
    echo "🤖 Starting chatbot app on port 3000..."
    pkill -f "python3.*chatbot_app.py" 2>/dev/null
    sleep 2
    nohup python3 chatbot_app.py > chatbot.log 2>&1 &
    local chatbot_pid=$!
    if wait_for_service "http://localhost:3000/api/health"; then
        echo "✅ Chatbot started successfully (PID: $chatbot_pid)"
        return 0
    else
        echo "❌ Chatbot failed to start"
        return 1
    fi
}

start_tunnel() {
    echo "🌐 Starting Cloudflare named tunnel..."
    pkill -f cloudflared 2>/dev/null
    sleep 2
    nohup cloudflared tunnel --config $TUNNEL_CONFIG run $TUNNEL_NAME > tunnel.log 2>&1 &
    local tunnel_pid=$!
    sleep 10
    # Check if tunnel is running
    if pgrep -f "cloudflared tunnel --config $TUNNEL_CONFIG run $TUNNEL_NAME" > /dev/null; then
        echo "✅ Named tunnel started (PID: $tunnel_pid)"
        return 0
    else
        echo "❌ Named tunnel failed to start"
        return 1
    fi
}

monitor_services() {
    echo "🔍 Starting service monitor..."
    while true; do
        if ! check_port 3000; then
            echo "⚠️  Chatbot not responding, restarting..."
            start_chatbot
        fi
        if ! pgrep -f "cloudflared tunnel --config $TUNNEL_CONFIG run $TUNNEL_NAME" > /dev/null; then
            echo "⚠️  Tunnel not running, restarting..."
            start_tunnel
        fi
        sleep 30
    done
}

echo "🚀 Starting FutureClarity Chatbot (Reliable Mode, Named Tunnel)..."
echo "=================================================="
echo "🧹 Cleaning up existing processes..."
pkill -f "python3.*chatbot_app.py" 2>/dev/null
pkill -f cloudflared 2>/dev/null
sleep 3

update_html_files

if ! start_chatbot; then
    echo "❌ Failed to start chatbot. Exiting."
    exit 1
fi
if ! start_tunnel; then
    echo "❌ Failed to start tunnel. Exiting."
    exit 1
fi

echo ""
echo "🎉 All services started successfully!"
echo "====================================="
echo "📱 Chatbot: http://localhost:3000"
echo "🌐 Public URL: $PERMANENT_DOMAIN"
echo "📊 Monitor logs:"
echo "   - Chatbot: tail -f chatbot.log"
echo "   - Tunnel: tail -f tunnel.log"
echo ""
echo "🔄 Services will automatically restart if they fail"
echo "⏹️  Press Ctrl+C to stop all services"
echo ""

monitor_services &
monitor_pid=$!
trap 'echo ""; echo "🛑 Shutting down services..."; pkill -f "python3.*chatbot_app.py"; pkill -f cloudflared; kill $monitor_pid 2>/dev/null; echo "✅ All services stopped"; exit 0' INT
wait 