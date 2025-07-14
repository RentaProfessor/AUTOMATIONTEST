"""
Workflow Orchestrator for Video Processing Pipeline
Coordinates all modules to process videos from input to final output.
"""

import os
import time
import logging
from typing import Dict, Any, Optional
from pathlib import Path
from datetime import datetime

from .config_manager import ConfigManager
from .transcription import TranscriptionService
from .llm_analyzer import LLMAnalyzer
from .video_processor import VideoProcessor

class VideoProcessingWorkflow:
    """Main workflow orchestrator for video processing."""
    
    def __init__(self, config_path: str = "config.json"):
        """
        Initialize the workflow orchestrator.
        
        Args:
            config_path: Path to configuration file
        """
        try:
            # Load configuration
            self.config = ConfigManager(config_path)
            
            # Initialize services
            print("🔧 Initializing services...")
            self.transcription = TranscriptionService(self.config)
            self.llm_analyzer = LLMAnalyzer(self.config)
            self.video_processor = VideoProcessor(self.config)
            
            # Setup logging
            self._setup_logging()
            
            print("✅ Workflow orchestrator initialized successfully")
            
        except Exception as e:
            print(f"❌ Failed to initialize workflow: {e}")
            raise
            
    def _setup_logging(self) -> None:
        """Setup logging for the workflow."""
        try:
            log_dir = self.config.get('folders', 'logs', 'logs')
            log_file = os.path.join(log_dir, 'video_processing.log')
            
            logging.basicConfig(
                level=getattr(logging, self.config.get('general', 'log_level', 'INFO')),
                format='%(asctime)s - %(levelname)s - %(message)s',
                handlers=[
                    logging.FileHandler(log_file),
                    logging.StreamHandler()
                ]
            )
            
            self.logger = logging.getLogger(__name__)
            self.logger.info("Logging initialized")
            
        except Exception as e:
            print(f"⚠️  Failed to setup logging: {e}")
            self.logger = logging.getLogger(__name__)
            
    def process_video(self, video_path: str) -> Optional[str]:
        """
        Process a single video through the complete pipeline.
        
        Args:
            video_path: Path to the input video file
            
        Returns:
            Path to the processed output video, or None if processing failed
        """
        start_time = time.time()
        video_name = os.path.basename(video_path)
        
        try:
            print(f"\n{'='*60}")
            print(f"🚀 STARTING VIDEO PROCESSING PIPELINE")
            print(f"📄 Video: {video_name}")
            print(f"⏰ Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            print(f"{'='*60}")
            
            self.logger.info(f"Starting processing for: {video_path}")
            
            # Step 1: Transcription
            print(f"\n📝 STEP 1: TRANSCRIPTION")
            transcript, transcript_path = self.transcription.process_video(video_path)
            
            # Log transcript summary
            summary = self.transcription.get_transcript_summary(transcript)
            print(f"📊 Transcript: {summary['word_count']} words, ~{summary['estimated_duration']:.1f} min")
            self.logger.info(f"Transcription completed: {summary}")
            
            # Step 2: AI Analysis
            print(f"\n🤖 STEP 2: AI ANALYSIS")
            overlay_data = self.llm_analyzer.analyze_transcript(transcript, video_path)
            
            # Optional: Review AI output
            if self.config.should_review_ai_output():
                overlay_data = self.llm_analyzer.review_overlays(overlay_data)
                
            # Save overlay instructions
            overlay_path = self.llm_analyzer.save_overlay_instructions(overlay_data, video_path)
            self.logger.info(f"AI analysis completed: {len(overlay_data['overlays'])} overlays generated")
            
            # Step 2.5: Caption Generation
            print(f"\n✍️  STEP 2.5: CAPTION GENERATION")
            caption = self.llm_analyzer.generate_caption(transcript, video_path)
            caption_path = self.llm_analyzer.save_caption(caption, video_path)
            self.logger.info(f"Caption generated: {len(caption)} characters")
            
            # Step 3: Video Processing
            print(f"\n🎬 STEP 3: VIDEO PROCESSING")
            output_path = self.video_processor.process_video(video_path, overlay_data)
            
            # Get output statistics
            stats = self.video_processor.get_output_stats(output_path)
            print(f"📊 Output: {stats.get('file_size_mb', 0):.1f}MB, {stats.get('resolution', 'unknown')}")
            self.logger.info(f"Video processing completed: {stats}")
            
            # Step 4: Cleanup
            if self.config.should_delete_temp_files():
                print(f"\n🗑️  STEP 4: CLEANUP")
                self.transcription.cleanup_temp_files(video_path)
                self.video_processor.cleanup_temp_files(video_path)
                print("✅ Temporary files cleaned up")
            
            # Final summary
            total_time = time.time() - start_time
            print(f"\n🎉 PROCESSING COMPLETE!")
            print(f"⏱️  Total time: {total_time:.1f} seconds")
            print(f"📁 Output: {os.path.basename(output_path)}")
            print(f"{'='*60}")
            
            self.logger.info(f"Processing completed successfully in {total_time:.1f}s: {output_path}")
            
            return output_path
            
        except Exception as e:
            error_msg = f"Processing failed for {video_name}: {e}"
            print(f"\n❌ {error_msg}")
            self.logger.error(error_msg, exc_info=True)
            
            # Try to cleanup on error
            try:
                if hasattr(self, 'transcription'):
                    self.transcription.cleanup_temp_files(video_path)
                if hasattr(self, 'video_processor'):
                    self.video_processor.cleanup_temp_files(video_path)
            except:
                pass
                
            return None
            
    def process_batch(self, video_paths: list) -> Dict[str, Optional[str]]:
        """
        Process multiple videos in sequence.
        
        Args:
            video_paths: List of paths to video files
            
        Returns:
            Dictionary mapping input paths to output paths (None if failed)
        """
        print(f"\n📦 BATCH PROCESSING: {len(video_paths)} videos")
        
        results = {}
        successful = 0
        failed = 0
        
        for i, video_path in enumerate(video_paths, 1):
            print(f"\n🔄 Processing video {i}/{len(video_paths)}")
            
            result = self.process_video(video_path)
            results[video_path] = result
            
            if result:
                successful += 1
            else:
                failed += 1
                
        print(f"\n📊 BATCH COMPLETE: {successful} successful, {failed} failed")
        self.logger.info(f"Batch processing completed: {successful}/{len(video_paths)} successful")
        
        return results
        
    def validate_setup(self) -> Dict[str, bool]:
        """
        Validate that all components are properly configured.
        
        Returns:
            Dictionary with validation results
        """
        print("\n🔍 VALIDATING SETUP...")
        
        results = {
            'config_loaded': True,
            'folders_exist': True,
            'whisper_available': True,
            'ollama_available': True,
            'ffmpeg_available': True,
            'assets_available': True
        }
        
        try:
            # Check folders
            folders = self.config.get_folders()
            for name, path in folders.items():
                if not os.path.exists(path):
                    print(f"❌ Missing folder: {name} ({path})")
                    results['folders_exist'] = False
                else:
                    print(f"✅ Folder exists: {name}")
                    
            # Check assets
            if self.config.get('logo', 'enabled', True):
                logo_path = self.config.get('logo', 'path')
                if not os.path.exists(logo_path):
                    print(f"⚠️  Logo not found: {logo_path}")
                    results['assets_available'] = False
                else:
                    print(f"✅ Logo found: {logo_path}")
                    
            if self.config.get('outro', 'enabled', True):
                outro_path = self.config.get('outro', 'path')
                if not os.path.exists(outro_path):
                    print(f"⚠️  Outro not found: {outro_path}")
                    results['assets_available'] = False
                else:
                    print(f"✅ Outro found: {outro_path}")
                    
            # Services are already initialized, so they're available
            print("✅ Whisper service initialized")
            print("✅ Ollama service initialized")
            print("✅ FFmpeg service initialized")
            
        except Exception as e:
            print(f"❌ Validation error: {e}")
            results['config_loaded'] = False
            
        all_good = all(results.values())
        status = "✅ READY" if all_good else "⚠️  ISSUES FOUND"
        print(f"\n{status} - Setup validation complete")
        
        return results
        
    def get_system_info(self) -> Dict[str, Any]:
        """Get system information and status."""
        try:
            return {
                'config_path': self.config.config_path,
                'model_info': self.llm_analyzer.get_model_info(),
                'folders': self.config.get_folders(),
                'supported_formats': self.config.get_supported_formats(),
                'auto_mode': self.config.is_auto_mode(),
                'review_enabled': self.config.should_review_ai_output(),
                'cleanup_enabled': self.config.should_delete_temp_files()
            }
        except Exception as e:
            return {'error': str(e)}
            
    def update_config(self, section: str, key: str, value: Any) -> None:
        """
        Update configuration setting.
        
        Args:
            section: Configuration section
            key: Setting key
            value: New value
        """
        try:
            self.config.update(section, key, value)
            self.config.save()
            print(f"✅ Updated {section}.{key} = {value}")
            self.logger.info(f"Configuration updated: {section}.{key} = {value}")
        except Exception as e:
            print(f"❌ Failed to update config: {e}")
            self.logger.error(f"Config update failed: {e}")
            
    def get_processing_stats(self) -> Dict[str, Any]:
        """Get processing statistics from logs."""
        try:
            output_dir = self.config.get('folders', 'output', 'output_clips')
            if not os.path.exists(output_dir):
                return {'processed_count': 0}
                
            processed_files = [f for f in os.listdir(output_dir) 
                             if f.endswith('.mp4') and '_processed_' in f]
            
            total_size = sum(os.path.getsize(os.path.join(output_dir, f)) 
                           for f in processed_files)
            
            return {
                'processed_count': len(processed_files),
                'total_output_size_mb': total_size / (1024 * 1024),
                'output_directory': output_dir,
                'recent_files': processed_files[-5:] if processed_files else []
            }
            
        except Exception as e:
            return {'error': str(e)}
            
    def __str__(self) -> str:
        """String representation of the workflow."""
        return f"VideoProcessingWorkflow(config='{self.config.config_path}')" 