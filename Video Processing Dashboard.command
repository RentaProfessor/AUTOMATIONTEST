#!/bin/bash

# Video Processing Dashboard Launcher
# This script launches the video processing dashboard

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Change to the script directory
cd "$SCRIPT_DIR"

echo "🎬 Video Processing Dashboard Launcher"
echo "=================================================="

# Kill any existing processes
echo "🔄 Cleaning up existing processes..."
pkill -f "python3.*app.py" 2>/dev/null || true
pkill -f "python3.*launch_dashboard" 2>/dev/null || true
sleep 1

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed or not in PATH"
    echo "Please install Python 3 and try again"
    read -p "Press Enter to close..."
    exit 1
fi

# Launch the dashboard
echo "🚀 Starting Video Processing Dashboard..."
python3 launch_dashboard.py

echo "✅ Dashboard stopped."
read -p "Press Enter to close..." 