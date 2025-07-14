# FutureClarity Chatbot - Reliable Setup Guide

## 🎯 Overview

This guide provides instructions for setting up a **permanently reliable** FutureClarity chatbot system that automatically restarts on failures and boots with your Mac.

## 🚀 Quick Start

### 1. Start the Reliable System

```bash
./start_chatbot_reliable.sh
```

This script will:
- ✅ Start the chatbot with automatic restart on failure
- ✅ Create a new Cloudflare tunnel with automatic URL updates
- ✅ Monitor all services and restart them if they fail
- ✅ Update HTML files automatically with new tunnel URLs

### 2. Check System Status

```bash
./check_status.sh
```

This will show you the health of all services.

## 🔧 Permanent Setup (Auto-start on Boot)

### Option 1: Using LaunchAgent (Recommended)

1. **Install the LaunchAgent:**
   ```bash
   cp com.futureclarity.chatbot.plist ~/Library/LaunchAgents/
   launchctl load ~/Library/LaunchAgents/com.futureclarity.chatbot.plist
   ```

2. **Start the service:**
   ```bash
   launchctl start com.futureclarity.chatbot
   ```

3. **Check if it's running:**
   ```bash
   launchctl list | grep futureclarity
   ```

### Option 2: Manual Startup

Add this to your shell profile (`~/.zshrc` or `~/.bash_profile`):
```bash
# Start FutureClarity Chatbot on login
if [ ! -f /tmp/chatbot_started ]; then
    cd "/Users/brettchiate/Desktop/CHATBOT WORKFLOW"
    nohup ./start_chatbot_reliable.sh > /dev/null 2>&1 &
    touch /tmp/chatbot_started
fi
```

## 📊 Monitoring and Maintenance

### Check System Status
```bash
./check_status.sh
```

### View Logs
```bash
# Chatbot logs
tail -f chatbot.log

# Tunnel logs
tail -f tunnel.log

# LaunchAgent logs
tail -f launchd.log
tail -f launchd_error.log
```

### Manual Restart
```bash
# Stop all services
pkill -f "python3.*chatbot_app.py"
pkill -f cloudflared

# Start reliable system
./start_chatbot_reliable.sh
```

## 🔄 Automatic Recovery Features

The reliable system includes:

1. **Service Monitoring**: Checks every 30 seconds if services are running
2. **Automatic Restart**: Restarts failed services automatically
3. **Tunnel Recovery**: Creates new tunnels if the current one fails
4. **URL Updates**: Automatically updates HTML files with new tunnel URLs
5. **Health Checks**: Validates service health before considering them "ready"

## 🌐 Access Points

Once running, you can access:

- **Local Admin**: http://localhost:3000
- **Public URL**: Check `current_tunnel_url.txt` for the latest tunnel URL
- **Embed URL**: `{tunnel_url}/embed`

## 🛠️ Troubleshooting

### Common Issues

1. **"Address already in use"**
   ```bash
   pkill -f "python3.*chatbot_app.py"
   pkill -f cloudflared
   sleep 3
   ./start_chatbot_reliable.sh
   ```

2. **Tunnel not connecting**
   ```bash
   # Check if tunnel credentials are valid
   cloudflared tunnel list
   
   # Try quick tunnel as backup
   cloudflared tunnel --url http://localhost:3000
   ```

3. **Chatbot not responding**
   ```bash
   # Check if Ollama is running
   ollama list
   
   # Restart Ollama if needed
   brew services restart ollama
   ```

### Reset Everything
```bash
# Stop all services
pkill -f "python3.*chatbot_app.py"
pkill -f cloudflared

# Clear logs
rm -f chatbot.log tunnel.log launchd.log launchd_error.log

# Start fresh
./start_chatbot_reliable.sh
```

## 📁 File Structure

```
CHATBOT WORKFLOW/
├── start_chatbot_reliable.sh    # Main reliable startup script
├── check_status.sh              # Status monitoring script
├── com.futureclarity.chatbot.plist  # LaunchAgent configuration
├── cloudflare-tunnel-reliable.yml   # Enhanced tunnel config
├── chatbot.log                  # Chatbot logs
├── tunnel.log                   # Tunnel logs
├── current_tunnel_url.txt       # Current public URL
└── launchd.log                  # LaunchAgent logs
```

## 🔒 Security Notes

- The system runs locally on your machine
- Cloudflare tunnels provide secure public access
- No sensitive data is stored in logs
- All communication is encrypted via HTTPS

## 📞 Support

If you encounter issues:

1. Run `./check_status.sh` to diagnose problems
2. Check the logs in `chatbot.log` and `tunnel.log`
3. Restart with `./start_chatbot_reliable.sh`

## 🎉 Success Indicators

Your system is working correctly when:

- ✅ `./check_status.sh` shows all green checkmarks
- ✅ You can access the chatbot at the tunnel URL
- ✅ The embed iframe loads on your website
- ✅ Services restart automatically after failures

---

**Last Updated**: July 14, 2025
**Version**: 2.0 (Reliable) 