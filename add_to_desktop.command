#!/bin/bash
#
# Add Video Processing Dashboard to Desktop
# Run this once to add the launcher to your desktop
#

# Get the current directory
CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Desktop path
DESKTOP="$HOME/Desktop"

echo "🎬 Adding Video Processing Dashboard to Desktop"
echo "=============================================="
echo ""

# Check if Desktop directory exists
if [ ! -d "$DESKTOP" ]; then
    echo "❌ Desktop directory not found at: $DESKTOP"
    echo "📁 Please manually copy 'Video Processing Dashboard.command' to your Desktop"
    read -p "Press Enter to close..."
    exit 1
fi

# Copy the launcher to desktop
LAUNCHER_SOURCE="$CURRENT_DIR/Video Processing Dashboard.command"
LAUNCHER_DEST="$DESKTOP/Video Processing Dashboard.command"

if [ -f "$LAUNCHER_SOURCE" ]; then
    cp "$LAUNCHER_SOURCE" "$LAUNCHER_DEST"
    chmod +x "$LAUNCHER_DEST"
    echo "✅ Dashboard launcher added to Desktop!"
    echo "📱 You can now double-click 'Video Processing Dashboard.command' on your Desktop"
else
    echo "❌ Launcher file not found: $LAUNCHER_SOURCE"
    echo "📁 Make sure you're running this from the CLIP WORKFLOW directory"
    read -p "Press Enter to close..."
    exit 1
fi

# Also copy the README for reference
README_SOURCE="$CURRENT_DIR/DESKTOP_LAUNCHER_README.md"
README_DEST="$DESKTOP/Video Dashboard README.md"

if [ -f "$README_SOURCE" ]; then
    cp "$README_SOURCE" "$README_DEST"
    echo "📚 README copied to Desktop for reference"
fi

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "Next Steps:"
echo "1. Go to your Desktop"
echo "2. Double-click 'Video Processing Dashboard.command'"
echo "3. Your browser will open with the dashboard"
echo "4. Upload videos and start processing!"
echo ""
read -p "Press Enter to close..." 