#!/bin/bash

# Auto-update tunnel URL script
echo "🔄 Updating Tunnel URL..."

# Kill existing tunnels
pkill -f "cloudflared.*tunnel.*--url" 2>/dev/null || true
sleep 2

# Start new tunnel and capture URL
echo "🚀 Starting new tunnel..."
cloudflared tunnel --url http://localhost:3000 > tunnel_temp.log 2>&1 &
TUNNEL_PID=$!

# Wait for tunnel to establish
sleep 10

# Extract the URL
TUNNEL_URL=$(grep "https://" tunnel_temp.log | grep "trycloudflare.com" | head -1 | sed 's/.*|\s*//' | sed 's/\s*|.*//' | tr -d ' ')

if [ -z "$TUNNEL_URL" ]; then
    echo "❌ Failed to get tunnel URL"
    exit 1
fi

echo "✅ New tunnel URL: $TUNNEL_URL"

# Update HTML files
echo "📝 Updating HTML files..."
sed -i.bak "s|https://[^/]*\.trycloudflare\.com|$TUNNEL_URL|g" website/index.html
sed -i.bak "s|https://[^/]*\.trycloudflare\.com|$TUNNEL_URL|g" index.html

echo "✅ Updated HTML files with new URL: $TUNNEL_URL"
echo "🔗 Chatbot URL: $TUNNEL_URL"
echo "🔗 Embed URL: $TUNNEL_URL/embed"

# Save URL for reference
echo "$TUNNEL_URL" > current_tunnel_url.txt

# Clean up temp files
rm -f tunnel_temp.log
mv tunnel_temp.log tunnel_quick.log 2>/dev/null || true

echo "🎯 Tunnel update complete!" 