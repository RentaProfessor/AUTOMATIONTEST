#!/bin/bash

# FutureClarity Chatbot Status Checker
# This script checks the health of all services

echo "🔍 FutureClarity Chatbot Status Check"
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    local port=$1
    local service_name=$2
    
    if lsof -i :$port > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $service_name is running on port $port${NC}"
        return 0
    else
        echo -e "${RED}❌ $service_name is not running on port $port${NC}"
        return 1
    fi
}

# Function to check service health
check_service_health() {
    local url=$1
    local service_name=$2
    
    if curl -s "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $service_name is responding${NC}"
        return 0
    else
        echo -e "${RED}❌ $service_name is not responding${NC}"
        return 1
    fi
}

# Function to check tunnel status
check_tunnel() {
    echo -e "\n${BLUE}🌐 Tunnel Status:${NC}"
    
    # Check if cloudflared is running
    if pgrep -f cloudflared > /dev/null; then
        echo -e "${GREEN}✅ Cloudflare tunnel process is running${NC}"
        
        # Check tunnel log for recent activity
        if [ -f "tunnel.log" ]; then
            local last_activity=$(tail -1 tunnel.log 2>/dev/null | grep -o '2025-[0-9-]*T[0-9:]*Z' | tail -1)
            if [ -n "$last_activity" ]; then
                echo -e "${GREEN}✅ Last tunnel activity: $last_activity${NC}"
            else
                echo -e "${YELLOW}⚠️  No recent tunnel activity found${NC}"
            fi
        fi
        
        # Check current tunnel URL
        if [ -f "current_tunnel_url.txt" ]; then
            local tunnel_url=$(cat current_tunnel_url.txt)
            if [ -n "$tunnel_url" ]; then
                echo -e "${GREEN}✅ Current tunnel URL: $tunnel_url${NC}"
                
                # Test tunnel URL
                if curl -s -I "$tunnel_url/api/health" | grep -q "200\|405"; then
                    echo -e "${GREEN}✅ Tunnel URL is accessible${NC}"
                else
                    echo -e "${RED}❌ Tunnel URL is not accessible${NC}"
                fi
            else
                echo -e "${RED}❌ No tunnel URL found${NC}"
            fi
        else
            echo -e "${RED}❌ No tunnel URL file found${NC}"
        fi
    else
        echo -e "${RED}❌ Cloudflare tunnel process is not running${NC}"
    fi
}

# Function to check chatbot status
check_chatbot() {
    echo -e "\n${BLUE}🤖 Chatbot Status:${NC}"
    
    # Check if chatbot process is running
    if pgrep -f "python3.*chatbot_app.py" > /dev/null; then
        echo -e "${GREEN}✅ Chatbot process is running${NC}"
        
        # Check chatbot log for recent activity
        if [ -f "chatbot.log" ]; then
            local last_activity=$(tail -1 chatbot.log 2>/dev/null | grep -o '2025-[0-9-]* [0-9:]*' | tail -1)
            if [ -n "$last_activity" ]; then
                echo -e "${GREEN}✅ Last chatbot activity: $last_activity${NC}"
            else
                echo -e "${YELLOW}⚠️  No recent chatbot activity found${NC}"
            fi
        fi
    else
        echo -e "${RED}❌ Chatbot process is not running${NC}"
    fi
    
    # Check port 3000
    check_port 3000 "Chatbot"
    
    # Check health endpoint
    check_service_health "http://localhost:3000/api/health" "Chatbot API"
}

# Function to check HTML files
check_html_files() {
    echo -e "\n${BLUE}📄 HTML Files Status:${NC}"
    
    if [ -f "current_tunnel_url.txt" ]; then
        local tunnel_url=$(cat current_tunnel_url.txt)
        local embed_url="${tunnel_url}/embed"
        
        # Check main index.html
        if [ -f "index.html" ]; then
            if grep -q "$embed_url" index.html; then
                echo -e "${GREEN}✅ index.html has correct tunnel URL${NC}"
            else
                echo -e "${RED}❌ index.html has incorrect tunnel URL${NC}"
            fi
        else
            echo -e "${RED}❌ index.html not found${NC}"
        fi
        
        # Check website/index.html
        if [ -f "website/index.html" ]; then
            if grep -q "$embed_url" website/index.html; then
                echo -e "${GREEN}✅ website/index.html has correct tunnel URL${NC}"
            else
                echo -e "${RED}❌ website/index.html has incorrect tunnel URL${NC}"
            fi
        else
            echo -e "${RED}❌ website/index.html not found${NC}"
        fi
    else
        echo -e "${RED}❌ No tunnel URL file found${NC}"
    fi
}

# Function to check system resources
check_system() {
    echo -e "\n${BLUE}💻 System Status:${NC}"
    
    # Check disk space
    local disk_usage=$(df -h . | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ "$disk_usage" -lt 80 ]; then
        echo -e "${GREEN}✅ Disk usage: ${disk_usage}%${NC}"
    else
        echo -e "${YELLOW}⚠️  Disk usage: ${disk_usage}% (high)${NC}"
    fi
    
    # Check memory usage
    local mem_usage=$(top -l 1 | grep PhysMem | awk '{print $2}' | sed 's/[^0-9]//g')
    echo -e "${BLUE}📊 Memory usage: ${mem_usage}%${NC}"
    
    # Check if Ollama is running
    if pgrep -f ollama > /dev/null; then
        echo -e "${GREEN}✅ Ollama is running${NC}"
    else
        echo -e "${RED}❌ Ollama is not running${NC}"
    fi
}

# Main execution
echo "🕐 Check time: $(date)"
echo ""

# Check all services
check_chatbot
check_tunnel
check_html_files
check_system

echo ""
echo "📊 Summary:"
echo "==========="

# Count issues
issues=0

if ! pgrep -f "python3.*chatbot_app.py" > /dev/null; then
    ((issues++))
fi

if ! pgrep -f cloudflared > /dev/null; then
    ((issues++))
fi

if ! lsof -i :3000 > /dev/null 2>&1; then
    ((issues++))
fi

if [ $issues -eq 0 ]; then
    echo -e "${GREEN}🎉 All systems operational!${NC}"
    exit 0
elif [ $issues -eq 1 ]; then
    echo -e "${YELLOW}⚠️  $issues issue detected${NC}"
    exit 1
else
    echo -e "${RED}❌ $issues issues detected${NC}"
    exit 2
fi 