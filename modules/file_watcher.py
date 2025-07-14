"""
File Watcher Module for Video Processing Workflow
Monitors input folder for new video files and triggers processing workflow.
"""

import os
import time
from typing import Callable, Set
from pathlib import Path
import threading
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class VideoFileHandler(FileSystemEventHandler):
    """Handler for video file events."""
    
    def __init__(self, config_manager, process_callback: Callable[[str], None]):
        """
        Initialize the file handler.
        
        Args:
            config_manager: Configuration manager instance
            process_callback: Function to call when a new video is detected
        """
        self.config = config_manager
        self.process_callback = process_callback
        self.supported_formats = set(self.config.get_supported_formats())
        self.processing_files: Set[str] = set()
        self.processed_files: Set[str] = set()
        
        # Load already processed files to avoid reprocessing
        self._load_processed_files()
        
    def _load_processed_files(self) -> None:
        """Load list of already processed files to avoid reprocessing."""
        try:
            output_dir = self.config.get('folders', 'output', 'output_clips')
            if os.path.exists(output_dir):
                # Look for processed files based on naming pattern
                for filename in os.listdir(output_dir):
                    if filename.endswith('.mp4') and '_processed_' in filename:
                        # Extract original filename from processed filename
                        original_name = filename.split('_processed_')[0]
                        self.processed_files.add(original_name)
                        
            print(f"📋 Found {len(self.processed_files)} previously processed files")
            
        except Exception as e:
            print(f"⚠️  Could not load processed files list: {e}")
            
    def _is_video_file(self, file_path: str) -> bool:
        """Check if file is a supported video format."""
        file_ext = Path(file_path).suffix.lower()
        return file_ext in self.supported_formats
        
    def _is_file_ready(self, file_path: str, timeout: int = 10) -> bool:
        """
        Check if file is completely written and ready for processing.
        
        Args:
            file_path: Path to the file
            timeout: Maximum time to wait for file to be ready
            
        Returns:
            True if file is ready, False otherwise
        """
        if not os.path.exists(file_path):
            return False
            
        # Wait for file size to stabilize
        previous_size = -1
        stable_count = 0
        max_checks = timeout * 2  # Check every 0.5 seconds
        
        for _ in range(max_checks):
            try:
                current_size = os.path.getsize(file_path)
                
                if current_size == previous_size and current_size > 0:
                    stable_count += 1
                    if stable_count >= 4:  # 2 seconds of stability
                        return True
                else:
                    stable_count = 0
                    
                previous_size = current_size
                time.sleep(0.5)
                
            except OSError:
                # File might still be being written
                time.sleep(0.5)
                continue
                
        return False
        
    def _should_process_file(self, file_path: str) -> bool:
        """
        Check if file should be processed.
        
        Args:
            file_path: Path to the file
            
        Returns:
            True if file should be processed
        """
        file_name = Path(file_path).stem
        
        # Skip if already processing
        if file_path in self.processing_files:
            return False
            
        # Skip if already processed
        if file_name in self.processed_files:
            print(f"⏭️  Skipping already processed file: {os.path.basename(file_path)}")
            return False
            
        # Skip if not a video file
        if not self._is_video_file(file_path):
            return False
            
        # Skip temporary files
        if file_name.startswith('.') or file_name.startswith('~'):
            return False
            
        return True
        
    def on_created(self, event):
        """Handle file creation events."""
        if event.is_directory:
            return
            
        file_path = event.src_path
        
        if not self._should_process_file(file_path):
            return
            
        print(f"\n📁 New file detected: {os.path.basename(file_path)}")
        
        # Add to processing set to prevent duplicate processing
        self.processing_files.add(file_path)
        
        # Start processing in a separate thread
        thread = threading.Thread(
            target=self._process_file_when_ready,
            args=(file_path,),
            daemon=True
        )
        thread.start()
        
    def on_moved(self, event):
        """Handle file move events (like drag and drop)."""
        if event.is_directory:
            return
            
        # Treat move as creation of new file
        self.on_created(type('Event', (), {'src_path': event.dest_path, 'is_directory': False})())
        
    def _process_file_when_ready(self, file_path: str) -> None:
        """
        Wait for file to be ready and then process it.
        
        Args:
            file_path: Path to the file to process
        """
        try:
            print(f"⏳ Waiting for file to be ready: {os.path.basename(file_path)}")
            
            # Wait for file to be completely written
            if not self._is_file_ready(file_path, timeout=30):
                print(f"❌ File not ready after 30 seconds: {os.path.basename(file_path)}")
                return
                
            print(f"✅ File ready for processing: {os.path.basename(file_path)}")
            
            # Add to processed list to prevent reprocessing
            file_name = Path(file_path).stem
            self.processed_files.add(file_name)
            
            # Call the processing callback
            self.process_callback(file_path)
            
        except Exception as e:
            print(f"❌ Error in file processing thread: {e}")
            
        finally:
            # Remove from processing set
            self.processing_files.discard(file_path)

class FileWatcher:
    """File watcher for monitoring video input folder."""
    
    def __init__(self, config_manager, process_callback: Callable[[str], None]):
        """
        Initialize the file watcher.
        
        Args:
            config_manager: Configuration manager instance
            process_callback: Function to call when a new video is detected
        """
        self.config = config_manager
        self.process_callback = process_callback
        self.input_dir = self.config.get('folders', 'input', 'input_clips')
        self.observer = None
        self.is_running = False
        
        # Validate input directory
        if not os.path.exists(self.input_dir):
            os.makedirs(self.input_dir, exist_ok=True)
            print(f"📁 Created input directory: {self.input_dir}")
            
    def start(self) -> None:
        """Start monitoring the input directory."""
        try:
            print(f"\n👀 Starting file watcher...")
            print(f"📁 Monitoring directory: {os.path.abspath(self.input_dir)}")
            print(f"🎬 Supported formats: {', '.join(self.config.get_supported_formats())}")
            
            # Create event handler
            event_handler = VideoFileHandler(self.config, self.process_callback)
            
            # Create observer
            self.observer = Observer()
            self.observer.schedule(event_handler, self.input_dir, recursive=False)
            
            # Start observer
            self.observer.start()
            self.is_running = True
            
            print(f"✅ File watcher started successfully")
            print(f"💡 Drop video files into '{self.input_dir}' to start processing")
            
            # Process any existing files
            self._process_existing_files(event_handler)
            
        except Exception as e:
            print(f"❌ Error starting file watcher: {e}")
            raise
            
    def _process_existing_files(self, event_handler: VideoFileHandler) -> None:
        """Process any video files that already exist in the input directory."""
        try:
            existing_files = []
            for filename in os.listdir(self.input_dir):
                file_path = os.path.join(self.input_dir, filename)
                if os.path.isfile(file_path) and event_handler._should_process_file(file_path):
                    existing_files.append(file_path)
                    
            if existing_files:
                print(f"\n📂 Found {len(existing_files)} existing files to process:")
                for file_path in existing_files:
                    print(f"   - {os.path.basename(file_path)}")
                    
                # Process each file
                for file_path in existing_files:
                    event_handler._process_file_when_ready(file_path)
                    
        except Exception as e:
            print(f"⚠️  Error processing existing files: {e}")
            
    def stop(self) -> None:
        """Stop monitoring the input directory."""
        if self.observer and self.is_running:
            print("\n🛑 Stopping file watcher...")
            self.observer.stop()
            self.observer.join()
            self.is_running = False
            print("✅ File watcher stopped")
            
    def wait(self) -> None:
        """Wait for the file watcher to finish (blocks until stopped)."""
        if self.observer and self.is_running:
            try:
                print("\n🔄 File watcher is running. Press Ctrl+C to stop.")
                while self.is_running:
                    time.sleep(1)
            except KeyboardInterrupt:
                print("\n⚠️  Keyboard interrupt received")
                self.stop()
                
    def get_status(self) -> dict:
        """Get current status of the file watcher."""
        return {
            'is_running': self.is_running,
            'input_directory': self.input_dir,
            'supported_formats': self.config.get_supported_formats(),
            'observer_alive': self.observer.is_alive() if self.observer else False
        }
        
    def manual_trigger(self, file_path: str) -> None:
        """
        Manually trigger processing of a specific file.
        
        Args:
            file_path: Path to the file to process
        """
        if not os.path.exists(file_path):
            print(f"❌ File not found: {file_path}")
            return
            
        event_handler = VideoFileHandler(self.config, self.process_callback)
        
        if event_handler._should_process_file(file_path):
            print(f"🔄 Manually triggering processing for: {os.path.basename(file_path)}")
            event_handler._process_file_when_ready(file_path)
        else:
            print(f"⏭️  File not eligible for processing: {os.path.basename(file_path)}")
            
    def __enter__(self):
        """Context manager entry."""
        self.start()
        return self
        
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit."""
        self.stop()
        
    def __str__(self) -> str:
        """String representation of the file watcher."""
        status = "running" if self.is_running else "stopped"
        return f"FileWatcher(directory='{self.input_dir}', status='{status}')" 