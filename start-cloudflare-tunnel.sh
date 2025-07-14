#!/bin/bash

# Start Cloudflare Tunnel for AI Chatbot
echo "🚀 Starting Cloudflare Tunnel for AI Chatbot..."

# Kill any existing cloudflared processes
pkill -f cloudflared || true

# Start the tunnel
cloudflared tunnel run ai-chatbot

echo "✅ Cloudflare Tunnel is running!"
echo "🌐 Your chatbot is available at: https://ai.yourdomain.com"
echo "🛑 Press Ctrl+C to stop the tunnel" 