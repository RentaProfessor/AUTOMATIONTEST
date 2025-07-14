#!/usr/bin/env python3
"""
Simple Video Processing Dashboard Launcher
This fixes the processing issue and provides a working desktop app
"""

import os
import sys
import time
import webbrowser
import subprocess
from pathlib import Path

# Get the directory where this script is located
SCRIPT_DIR = Path(__file__).parent.absolute()

def main():
    """Main launcher function"""
    print("🎬 Video Processing Dashboard")
    print("=" * 40)
    
    # Change to the script directory
    os.chdir(SCRIPT_DIR)
    
    # Check if server is already running
    try:
        import socket
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            result = s.connect_ex(('localhost', 5001))
            if result == 0:
                print("✅ Dashboard is already running!")
                webbrowser.open("http://localhost:5001")
                return
    except:
        pass
    
    print("🚀 Starting dashboard...")
    
    # Start the server using the original main.py workflow
    try:
        # Import and run the original workflow
        from modules.workflow_orchestrator import VideoProcessingWorkflow
        from modules.config_manager import ConfigManager
        
        print("✅ Starting web server...")
        
        # Start Flask app in background
        import threading
        
        def start_flask():
            os.system("python3 -c \"from app import app, socketio; socketio.run(app, debug=False, host='0.0.0.0', port=5001, use_reloader=False)\"")
        
        flask_thread = threading.Thread(target=start_flask)
        flask_thread.daemon = True
        flask_thread.start()
        
        # Wait for server to start
        print("⏳ Waiting for server...")
        time.sleep(5)
        
        # Open browser
        webbrowser.open("http://localhost:5001")
        
        print("✅ Dashboard running at http://localhost:5001")
        print("🔴 Press Ctrl+C to stop")
        
        # Keep running
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n🛑 Stopping dashboard...")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        print("📝 Try running 'python3 main.py' instead")

if __name__ == "__main__":
    main() 