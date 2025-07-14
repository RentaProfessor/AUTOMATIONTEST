#!/usr/bin/env python3
"""
Video Processing Dashboard Launcher
Double-click this file to start the dashboard
"""

import subprocess
import sys
import os
import time
import webbrowser
import threading
from pathlib import Path
import requests

# Get the directory where this script is located
SCRIPT_DIR = Path(__file__).parent.absolute()

def check_dependencies():
    """Check if all required dependencies are installed"""
    required_packages = [
        'flask',
        'flask-socketio',
        'werkzeug',
        'requests'
    ]
    
    print("🔍 Checking dependencies...")
    
    missing_packages = []
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"❌ Missing packages: {', '.join(missing_packages)}")
        print("💡 Install them with: pip install " + " ".join(missing_packages))
        return False
    
    print("✅ All dependencies are installed!")
    return True

def kill_existing_processes():
    """Kill any existing Python processes to free up ports"""
    print("🔄 Cleaning up existing processes...")
    try:
        # Kill any Python processes related to our app
        subprocess.run(['pkill', '-f', 'python3.*app.py'], check=False)
        subprocess.run(['pkill', '-f', 'python3.*launch_dashboard'], check=False)
        time.sleep(1)
        print("✅ Existing processes cleaned up!")
    except Exception as e:
        print(f"⚠️  Could not clean up processes: {e}")

def start_dashboard():
    """Start the dashboard server"""
    print("🚀 Starting Video Processing Dashboard...")
    
    # Import and run the Flask app
    import app
    
    # Start server in a separate thread
    server_thread = threading.Thread(target=lambda: app.socketio.run(app.app, debug=False, host='0.0.0.0', port=5001))
    server_thread.daemon = True
    server_thread.start()
    
    # Wait for server to start
    print("⏳ Waiting for server to start...")
    
    # Wait for server to start
    max_wait = 30
    for i in range(max_wait):
        try:
            response = requests.get('http://localhost:5001/status', timeout=1)
            if response.status_code == 200:
                print("✅ Server is running!")
                break
        except:
            pass
            
        print(f"   Still waiting... ({i}/{max_wait}s)")
        time.sleep(1)
    else:
        print("❌ Server failed to start within 30 seconds")
        return False
            
    # Open browser
    dashboard_url = "http://localhost:5001"
    print(f"🌐 Opening dashboard at {dashboard_url}")
    webbrowser.open(dashboard_url)
    
    return True

def open_dashboard(port=5001):
    """Open the dashboard in the default web browser"""
    dashboard_url = f"http://localhost:{port}"
    print(f"🌐 Opening dashboard at {dashboard_url}")
    webbrowser.open(dashboard_url)

def show_status_window():
    """Show a simple status window using tkinter"""
    try:
        import tkinter as tk
        from tkinter import messagebox
        
        root = tk.Tk()
        root.withdraw()  # Hide the main window
        
        # Show status
        messagebox.showinfo("Video Processing Dashboard", 
                          "🎬 Video Processing Dashboard is running!\n\n"
                          "📱 Dashboard URL: http://localhost:5001\n"
                          "🌐 Your browser should open automatically\n\n"
                          "✅ Ready to process videos!")
        
        root.destroy()
    except ImportError:
        print("📱 Dashboard is running at http://localhost:5001")

def main():
    """Main function to launch the dashboard"""
    try:
        print("🎬 Video Processing Dashboard Launcher")
        print("=" * 50)
        
        # Kill existing processes first
        kill_existing_processes()
        
        # Check dependencies
        if not check_dependencies():
            return
        
        # Change to script directory
        os.chdir(SCRIPT_DIR)
        
        # Start the server
        server_success = start_dashboard()
        
        if not server_success:
            print("❌ Failed to start the dashboard")
            return
        
        # Show status window
        show_status_window()
        
        print("\n✅ Dashboard is running!")
        print("📱 Open your browser to: http://localhost:5001")
        print("🛑 Press Ctrl+C to stop the dashboard")
        
        # Keep the script running
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n🛑 Stopping dashboard...")
            print("✅ Dashboard stopped.")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main() 