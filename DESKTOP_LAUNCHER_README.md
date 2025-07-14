# 🎬 Video Processing Dashboard - Desktop Launcher

## Quick Start

### Option 1: Double-Click Launch (Easiest)
1. **Double-click** `Video Processing Dashboard.command`
2. The dashboard will automatically start and open in your browser
3. A control window will appear to manage the dashboard

### Option 2: Python Script Launch
1. **Double-click** `launch_dashboard.py`
2. Or run in Terminal: `python3 launch_dashboard.py`

## What Happens When You Launch

1. ✅ **Dependency Check** - Automatically installs missing packages
2. 🚀 **Server Start** - Starts the web dashboard on port 5001
3. 🌐 **Browser Opens** - Automatically opens http://localhost:5001
4. 📱 **Control Window** - Shows status and control buttons

## Using the Dashboard

### Upload Videos
- Drag & drop videos into the upload area
- Or click "Choose File" to browse
- Supports: MP4, AVI, MOV, MKV

### Process Videos
- Click the "Process" button next to any input video
- Watch real-time progress with live logs
- Processing includes:
  - 🎤 **Audio Transcription** (Whisper AI)
  - 🤖 **Content Analysis** (Ollama AI)
  - 🎬 **Video Enhancement** (FFmpeg)
  - 🎯 **Logo Overlay** (Your branding)
  - 🎭 **Outro Addition** (Professional ending)

### Download Results
- View processed videos in the "Processed Videos" section
- Click "View" to watch in browser
- Click "Download" to save to your computer

## Features

### Real-Time Processing
- Live progress bars and status updates
- Real-time log streaming
- Processing stage indicators

### File Management
- Browse input and output files
- Delete unwanted files
- View file sizes and dates

### Configuration
- Click "Settings" to view current configuration
- Modify AI prompts, video settings, and more

## Troubleshooting

### Port Already in Use
The launcher automatically uses port 5001 to avoid conflicts with macOS AirPlay.

### Missing Dependencies
The launcher automatically installs missing packages from `requirements.txt`.

### Python Not Found
Make sure Python 3 is installed and accessible from Terminal:
```bash
python3 --version
```

### Permission Issues
If the .command file won't open:
```bash
chmod +x "Video Processing Dashboard.command"
```

## System Requirements

- macOS 10.14+ (tested on macOS 14.4+)
- Python 3.9+
- 4GB+ RAM (for AI processing)
- 2GB+ free disk space

## What's Included

- **Web Dashboard** - Modern, responsive interface
- **Real-time Updates** - WebSocket-powered live updates
- **AI Integration** - Whisper + Ollama AI analysis
- **Video Processing** - Professional ffmpeg pipeline
- **Auto-launcher** - One-click desktop application

## Tips

1. **Keep the control window open** - Closing it stops the dashboard
2. **Processing takes time** - AI analysis can take several minutes
3. **Check output quality** - Preview videos before downloading
4. **Multiple files** - Process multiple videos sequentially

---

**Need Help?** The dashboard shows real-time logs and error messages to help troubleshoot any issues. 