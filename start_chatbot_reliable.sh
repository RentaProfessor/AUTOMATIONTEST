#!/bin/bash

# FutureClarity Chatbot - Reliable Startup Script
# This script ensures the chatbot and tunnel stay running with automatic restarts

echo "🚀 Starting FutureClarity Chatbot (Reliable Mode)..."
echo "=================================================="

# Function to check if a port is in use
check_port() {
    local port=$1
    lsof -i :$port > /dev/null 2>&1
}

# Function to wait for a service to be ready
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

# Function to start chatbot with retry logic
start_chatbot() {
    echo "🤖 Starting chatbot app on port 3000..."
    
    # Kill any existing chatbot processes
    pkill -f "python3.*chatbot_app.py" 2>/dev/null
    sleep 2
    
    # Start chatbot in background
    nohup python3 chatbot_app.py > chatbot.log 2>&1 &
    local chatbot_pid=$!
    
    # Wait for chatbot to start
    if wait_for_service "http://localhost:3000/api/health"; then
        echo "✅ Chatbot started successfully (PID: $chatbot_pid)"
        return 0
    else
        echo "❌ Chatbot failed to start"
        return 1
    fi
}

# Function to start tunnel with retry logic
start_tunnel() {
    echo "🌐 Starting Cloudflare tunnel..."
    
    # Kill any existing tunnel processes
    pkill -f cloudflared 2>/dev/null
    sleep 2
    
    # Start quick tunnel in background
    nohup cloudflared tunnel --url http://localhost:3000 > tunnel.log 2>&1 &
    local tunnel_pid=$!
    
    # Wait for tunnel to start and get URL
    sleep 10
    
    # Extract tunnel URL from log
    local tunnel_url=$(grep "https://.*trycloudflare.com" tunnel.log | head -1 | grep -o 'https://[^[:space:]]*')
    
    if [ -n "$tunnel_url" ]; then
        echo "✅ Tunnel started successfully (PID: $tunnel_pid)"
        echo "🌐 Tunnel URL: $tunnel_url"
        
        # Update HTML files with new tunnel URL
        update_html_files "$tunnel_url"
        
        # Update current tunnel URL file
        echo "$tunnel_url" > current_tunnel_url.txt
        
        return 0
    else
        echo "❌ Tunnel failed to start or get URL"
        return 1
    fi
}

# Function to update HTML files with new tunnel URL
update_html_files() {
    local new_url=$1
    local embed_url="${new_url}/embed"
    
    echo "📝 Updating HTML files with new tunnel URL..."
    
    # Update main index.html
    if [ -f "index.html" ]; then
        sed -i.bak "s|https://[^/]*trycloudflare.com/embed|$embed_url|g" index.html
        echo "✅ Updated index.html"
    fi
    
    # Update website/index.html
    if [ -f "website/index.html" ]; then
        sed -i.bak "s|https://[^/]*trycloudflare.com/embed|$embed_url|g" website/index.html
        echo "✅ Updated website/index.html"
    fi
}

# Function to monitor and restart services
monitor_services() {
    echo "🔍 Starting service monitor..."
    
    while true; do
        # Check chatbot
        if ! check_port 3000; then
            echo "⚠️  Chatbot not responding, restarting..."
            start_chatbot
        fi
        
        # Check tunnel
        if ! pgrep -f cloudflared > /dev/null; then
            echo "⚠️  Tunnel not running, restarting..."
            start_tunnel
        fi
        
        # Wait before next check
        sleep 30
    done
}

# Main execution
echo "🧹 Cleaning up existing processes..."
pkill -f "python3.*chatbot_app.py" 2>/dev/null
pkill -f cloudflared 2>/dev/null
sleep 3

# Start chatbot
if ! start_chatbot; then
    echo "❌ Failed to start chatbot. Exiting."
    exit 1
fi

# Start tunnel
if ! start_tunnel; then
    echo "❌ Failed to start tunnel. Exiting."
    exit 1
fi

echo ""
echo "🎉 All services started successfully!"
echo "====================================="
echo "📱 Chatbot: http://localhost:3000"
echo "🌐 Public URL: $(cat current_tunnel_url.txt)"
echo "📊 Monitor logs:"
echo "   - Chatbot: tail -f chatbot.log"
echo "   - Tunnel: tail -f tunnel.log"
echo ""
echo "🔄 Services will automatically restart if they fail"
echo "⏹️  Press Ctrl+C to stop all services"
echo ""

# Start monitoring in background
monitor_services &
monitor_pid=$!

# Wait for interrupt signal
trap 'echo ""; echo "🛑 Shutting down services..."; pkill -f "python3.*chatbot_app.py"; pkill -f cloudflared; kill $monitor_pid 2>/dev/null; echo "✅ All services stopped"; exit 0' INT

# Keep script running
wait 