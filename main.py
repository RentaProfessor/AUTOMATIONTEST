#!/usr/bin/env python3
"""
Main entry point for the Automated Video Processing Workflow.
Provides command-line interface and file watching capabilities.
"""

import os
import sys
import argparse
import signal
from typing import Optional
from pathlib import Path

# Add modules directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'modules'))

from modules.workflow_orchestrator import VideoProcessingWorkflow
from modules.file_watcher import FileWatcher

class VideoProcessingApp:
    """Main application class for video processing workflow."""
    
    def __init__(self):
        """Initialize the application."""
        self.workflow: Optional[VideoProcessingWorkflow] = None
        self.file_watcher: Optional[FileWatcher] = None
        self.running = True
        
        # Setup signal handlers for graceful shutdown
        signal.signal(signal.SIGINT, self._signal_handler)
        signal.signal(signal.SIGTERM, self._signal_handler)
        
    def _signal_handler(self, signum, frame):
        """Handle shutdown signals."""
        print(f"\n🛑 Received signal {signum}, shutting down gracefully...")
        self.running = False
        if self.file_watcher:
            self.file_watcher.stop()
        sys.exit(0)
        
    def initialize_workflow(self, config_path: str = "config.json") -> bool:
        """
        Initialize the video processing workflow.
        
        Args:
            config_path: Path to configuration file
            
        Returns:
            True if initialization successful
        """
        try:
            print("🔧 Initializing Video Processing Workflow...")
            self.workflow = VideoProcessingWorkflow(config_path)
            
            # Validate setup
            validation = self.workflow.validate_setup()
            
            if not all(validation.values()):
                print("\n⚠️  Setup validation failed. Please check the issues above.")
                print("📖 Refer to SETUP_INSTRUCTIONS.md for help.")
                return False
                
            return True
            
        except Exception as e:
            print(f"❌ Failed to initialize workflow: {e}")
            print("📖 Check SETUP_INSTRUCTIONS.md for troubleshooting.")
            return False
            
    def watch_mode(self) -> None:
        """Run in file watching mode."""
        if not self.workflow:
            print("❌ Workflow not initialized")
            return
            
        try:
            print("\n👀 STARTING FILE WATCHER MODE")
            print("=" * 50)
            
            # Create file watcher with callback wrapper
            def process_callback(video_path: str) -> None:
                """Wrapper to match expected callback signature."""
                if self.workflow:
                    self.workflow.process_video(video_path)
                
            self.file_watcher = FileWatcher(
                self.workflow.config,
                process_callback
            )
            
            # Start watching
            self.file_watcher.start()
            
            # Wait for files or interruption
            self.file_watcher.wait()
            
        except KeyboardInterrupt:
            print("\n⚠️  Interrupted by user")
        except Exception as e:
            print(f"❌ File watcher error: {e}")
        finally:
            if self.file_watcher:
                self.file_watcher.stop()
                
    def process_single_file(self, file_path: str) -> bool:
        """
        Process a single video file.
        
        Args:
            file_path: Path to video file
            
        Returns:
            True if processing successful
        """
        if not self.workflow:
            print("❌ Workflow not initialized")
            return False
            
        if not os.path.exists(file_path):
            print(f"❌ File not found: {file_path}")
            return False
            
        try:
            result = self.workflow.process_video(file_path)
            return result is not None
            
        except Exception as e:
            print(f"❌ Processing failed: {e}")
            return False
            
    def process_batch(self, input_dir: str) -> None:
        """
        Process all videos in a directory.
        
        Args:
            input_dir: Directory containing video files
        """
        if not self.workflow:
            print("❌ Workflow not initialized")
            return
            
        if not os.path.exists(input_dir):
            print(f"❌ Directory not found: {input_dir}")
            return
            
        try:
            # Find all video files
            supported_formats = self.workflow.config.get_supported_formats()
            video_files = []
            
            for file_path in Path(input_dir).iterdir():
                if file_path.is_file() and file_path.suffix.lower() in supported_formats:
                    video_files.append(str(file_path))
                    
            if not video_files:
                print(f"📂 No video files found in {input_dir}")
                print(f"🎬 Supported formats: {', '.join(supported_formats)}")
                return
                
            print(f"📦 Found {len(video_files)} video files to process")
            
            # Process batch
            results = self.workflow.process_batch(video_files)
            
            # Summary
            successful = sum(1 for r in results.values() if r is not None)
            failed = len(results) - successful
            
            print(f"\n📊 BATCH SUMMARY:")
            print(f"✅ Successful: {successful}")
            print(f"❌ Failed: {failed}")
            print(f"📁 Output directory: {self.workflow.config.get('folders', 'output')}")
            
        except Exception as e:
            print(f"❌ Batch processing failed: {e}")
            
    def show_status(self) -> None:
        """Show system status and statistics."""
        if not self.workflow:
            print("❌ Workflow not initialized")
            return
            
        try:
            print("\n📊 SYSTEM STATUS")
            print("=" * 40)
            
            # System info
            info = self.workflow.get_system_info()
            print(f"🔧 Config: {info.get('config_path', 'Unknown')}")
            print(f"🤖 Model: {info.get('model_info', {}).get('name', 'Unknown')}")
            print(f"🎬 Formats: {', '.join(info.get('supported_formats', []))}")
            print(f"🔄 Auto mode: {'Enabled' if info.get('auto_mode') else 'Disabled'}")
            print(f"👁️  Review mode: {'Enabled' if info.get('review_enabled') else 'Disabled'}")
            
            # Processing stats
            stats = self.workflow.get_processing_stats()
            print(f"\n📈 PROCESSING STATS")
            print(f"📹 Videos processed: {stats.get('processed_count', 0)}")
            print(f"💾 Total output size: {stats.get('total_output_size_mb', 0):.1f} MB")
            
            recent = stats.get('recent_files', [])
            if recent:
                print(f"📁 Recent outputs:")
                for file in recent:
                    print(f"   - {file}")
                    
        except Exception as e:
            print(f"❌ Error getting status: {e}")
            
    def interactive_mode(self) -> None:
        """Run in interactive mode with menu."""
        if not self.workflow:
            print("❌ Workflow not initialized")
            return
            
        while self.running:
            try:
                print("\n" + "=" * 50)
                print("🎬 VIDEO PROCESSING WORKFLOW")
                print("=" * 50)
                print("1. 👀 Start file watcher (automatic mode)")
                print("2. 📁 Process single file")
                print("3. 📦 Process batch (directory)")
                print("4. 📊 Show status")
                print("5. 🔧 Validate setup")
                print("6. ❌ Exit")
                print("=" * 50)
                
                choice = input("Enter your choice (1-6): ").strip()
                
                if choice == '1':
                    self.watch_mode()
                elif choice == '2':
                    file_path = input("Enter video file path: ").strip()
                    if file_path:
                        self.process_single_file(file_path)
                elif choice == '3':
                    dir_path = input("Enter directory path: ").strip()
                    if dir_path:
                        self.process_batch(dir_path)
                elif choice == '4':
                    self.show_status()
                elif choice == '5':
                    if self.workflow:
                        self.workflow.validate_setup()
                elif choice == '6':
                    print("👋 Goodbye!")
                    break
                else:
                    print("❌ Invalid choice. Please enter 1-6.")
                    
            except KeyboardInterrupt:
                print("\n👋 Goodbye!")
                break
            except Exception as e:
                print(f"❌ Unexpected error: {e}")

def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Automated Video Processing Workflow",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python main.py                          # Interactive mode
  python main.py --watch                  # File watcher mode
  python main.py --file video.mp4         # Process single file
  python main.py --batch ./videos/        # Process directory
  python main.py --status                 # Show status
        """
    )
    
    parser.add_argument('--config', '-c', default='config.json',
                      help='Configuration file path (default: config.json)')
    parser.add_argument('--watch', '-w', action='store_true',
                      help='Start file watcher mode')
    parser.add_argument('--file', '-f', type=str,
                      help='Process a single video file')
    parser.add_argument('--batch', '-b', type=str,
                      help='Process all videos in a directory')
    parser.add_argument('--status', '-s', action='store_true',
                      help='Show system status and exit')
    parser.add_argument('--validate', action='store_true',
                      help='Validate setup and exit')
    
    args = parser.parse_args()
    
    # Create application
    app = VideoProcessingApp()
    
    # Initialize workflow
    if not app.initialize_workflow(args.config):
        sys.exit(1)
        
    # Execute based on arguments
    try:
        if args.status:
            app.show_status()
        elif args.validate:
            if app.workflow:
                app.workflow.validate_setup()
        elif args.file:
            success = app.process_single_file(args.file)
            sys.exit(0 if success else 1)
        elif args.batch:
            app.process_batch(args.batch)
        elif args.watch:
            app.watch_mode()
        else:
            # Default to interactive mode
            app.interactive_mode()
            
    except Exception as e:
        print(f"❌ Fatal error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 