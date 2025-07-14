#!/bin/bash

# FutureClarity Chatbot Status Check
echo "🔍 Checking FutureClarity Chatbot Status..."
echo "==========================================="

# Check if chatbot process is running
if ps aux | grep "python3.*chatbot_app.py" | grep -v grep > /dev/null; then
    echo "✅ Chatbot process is running"
    CHATBOT_PID=$(ps aux | grep "python3.*chatbot_app.py" | grep -v grep | awk '{print $2}')
    echo "   PID: $CHATBOT_PID"
else
    echo "❌ Chatbot process is not running"
fi

# Check if tunnel process is running
if ps aux | grep "cloudflared.*tunnel.*ai-chatbot" | grep -v grep > /dev/null; then
    echo "✅ Tunnel process is running"
    TUNNEL_PID=$(ps aux | grep "cloudflared.*tunnel.*ai-chatbot" | grep -v grep | awk '{print $2}')
    echo "   PID: $TUNNEL_PID"
else
    echo "❌ Tunnel process is not running"
fi

# Check if chatbot is responding locally
echo ""
echo "🧪 Testing local chatbot connection..."
if curl -s -m 5 http://localhost:3000/api/health > /dev/null; then
    echo "✅ Local chatbot is responding on port 3000"
    HEALTH_RESPONSE=$(curl -s -m 5 http://localhost:3000/api/health)
    echo "   Health: $HEALTH_RESPONSE"
else
    echo "❌ Local chatbot is not responding"
fi

# Check if embed endpoint is working
echo ""
echo "🧪 Testing embed endpoint..."
if curl -s -m 5 http://localhost:3000/embed | head -1 | grep -q "DOCTYPE html"; then
    echo "✅ Embed endpoint is working"
else
    echo "❌ Embed endpoint is not responding"
fi

# Check tunnel connection (basic test)
echo ""
echo "🧪 Testing tunnel connection..."
if curl -s -m 10 https://ai-chatbot.yourdomain.com.futureclarityautomation.com/api/health > /dev/null 2>&1; then
    echo "✅ Tunnel connection is working"
    echo "   Public URL: https://ai-chatbot.yourdomain.com.futureclarityautomation.com"
else
    echo "⚠️  Tunnel connection test failed (this may be normal during startup)"
    echo "   Public URL: https://ai-chatbot.yourdomain.com.futureclarityautomation.com"
fi

echo ""
echo "📊 System Information:"
echo "====================="
echo "🏠 Local chatbot: http://localhost:3000"
echo "🌍 Public URL: https://ai-chatbot.yourdomain.com.futureclarityautomation.com"
echo "🔧 Embed URL: https://ai-chatbot.yourdomain.com.futureclarityautomation.com/embed"
echo "📊 Health check: https://ai-chatbot.yourdomain.com.futureclarityautomation.com/api/health"
echo ""
echo "🆔 Tunnel ID: 6b77187f-6ad1-4eaf-bd50-52f58e39ade7"
echo "🔗 Connector ID: $(grep "Generated Connector ID" tunnel.log 2>/dev/null | tail -1 | awk '{print $NF}' || echo "Check tunnel.log")"
echo ""
echo "📝 To view logs: tail -f tunnel.log"
echo "🚀 To start services: ./start_reliable_chatbot.sh" 