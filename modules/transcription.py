"""
Transcription Module for Video Processing Workflow
Handles audio extraction and speech-to-text conversion using Whisper.
"""

import os
import subprocess
import tempfile
from typing import Optional, Tuple
import whisper
import logging
from pathlib import Path

class TranscriptionService:
    def __init__(self, config_manager):
        """
        Initialize the transcription service.
        
        Args:
            config_manager: Configuration manager instance
        """
        self.config = config_manager
        self.model = None
        self.temp_dir = self.config.get('folders', 'temp', 'temp')
        
        # Load Whisper model
        self._load_whisper_model()
        
    def _load_whisper_model(self) -> None:
        """Load the Whisper model for transcription."""
        try:
            model_name = self.config.get('transcription', 'whisper_model', 'base')
            print(f"🔄 Loading Whisper model: {model_name}")
            
            self.model = whisper.load_model(model_name)
            print(f"✅ Whisper model '{model_name}' loaded successfully")
            
        except Exception as e:
            print(f"❌ Error loading Whisper model: {e}")
            raise
            
    def extract_audio(self, video_path: str) -> str:
        """
        Extract audio from video file.
        
        Args:
            video_path: Path to input video file
            
        Returns:
            Path to extracted audio file
        """
        try:
            # Create unique temporary audio file
            video_name = Path(video_path).stem
            audio_path = os.path.join(self.temp_dir, f"{video_name}_audio.wav")
            
            # Extract audio using ffmpeg
            cmd = [
                'ffmpeg', '-i', video_path,
                '-ar', '16000',  # Sample rate for Whisper
                '-ac', '1',      # Mono audio
                '-c:a', 'pcm_s16le',  # Audio codec
                '-y',            # Overwrite output file
                audio_path
            ]
            
            print(f"🔄 Extracting audio from {os.path.basename(video_path)}")
            result = subprocess.run(
                cmd, 
                capture_output=True, 
                text=True, 
                check=True
            )
            
            if os.path.exists(audio_path):
                print(f"✅ Audio extracted to {os.path.basename(audio_path)}")
                return audio_path
            else:
                raise FileNotFoundError(f"Audio extraction failed for {video_path}")
                
        except subprocess.CalledProcessError as e:
            print(f"❌ FFmpeg error: {e.stderr}")
            raise
        except Exception as e:
            print(f"❌ Error extracting audio: {e}")
            raise
            
    def transcribe_audio(self, audio_path: str) -> str:
        """
        Transcribe audio file to text using Whisper.
        
        Args:
            audio_path: Path to audio file
            
        Returns:
            Transcribed text
        """
        try:
            print(f"🔄 Transcribing audio: {os.path.basename(audio_path)}")
            
            # Get transcription options from config
            language = self.config.get('transcription', 'language', 'en')
            verbose = self.config.get('transcription', 'verbose', False)
            
            # Transcribe audio
            result = self.model.transcribe(
                audio_path,
                language=language if language != 'auto' else None,
                verbose=verbose
            )
            
            transcript = result['text'].strip()
            
            if transcript:
                print(f"✅ Transcription completed ({len(transcript)} characters)")
                return transcript
            else:
                raise ValueError("Empty transcription result")
                
        except Exception as e:
            print(f"❌ Error transcribing audio: {e}")
            raise
            
    def save_transcript(self, transcript: str, video_path: str) -> str:
        """
        Save transcript to text file.
        
        Args:
            transcript: Transcribed text
            video_path: Original video path (for naming)
            
        Returns:
            Path to saved transcript file
        """
        try:
            video_name = Path(video_path).stem
            transcript_path = os.path.join(self.temp_dir, f"{video_name}_transcript.txt")
            
            with open(transcript_path, 'w', encoding='utf-8') as f:
                f.write(transcript)
                
            print(f"✅ Transcript saved to {os.path.basename(transcript_path)}")
            return transcript_path
            
        except Exception as e:
            print(f"❌ Error saving transcript: {e}")
            raise
            
    def process_video(self, video_path: str) -> Tuple[str, str]:
        """
        Complete transcription process for a video file.
        
        Args:
            video_path: Path to input video file
            
        Returns:
            Tuple of (transcript_text, transcript_file_path)
        """
        try:
            print(f"\n🎬 Starting transcription for: {os.path.basename(video_path)}")
            
            # Extract audio from video
            audio_path = self.extract_audio(video_path)
            
            try:
                # Transcribe audio to text
                transcript = self.transcribe_audio(audio_path)
                
                # Save transcript to file
                transcript_path = self.save_transcript(transcript, video_path)
                
                return transcript, transcript_path
                
            finally:
                # Clean up temporary audio file
                if os.path.exists(audio_path) and self.config.should_delete_temp_files():
                    os.remove(audio_path)
                    print(f"🗑️  Cleaned up temporary audio file")
                    
        except Exception as e:
            print(f"❌ Transcription failed for {video_path}: {e}")
            raise
            
    def get_transcript_summary(self, transcript: str) -> dict:
        """
        Get basic statistics about the transcript.
        
        Args:
            transcript: Transcribed text
            
        Returns:
            Dictionary with transcript statistics
        """
        words = transcript.split()
        sentences = transcript.split('.')
        
        return {
            'character_count': len(transcript),
            'word_count': len(words),
            'sentence_count': len([s for s in sentences if s.strip()]),
            'estimated_duration': len(words) / 150,  # Rough estimate: 150 words per minute
            'preview': transcript[:100] + '...' if len(transcript) > 100 else transcript
        }
        
    def cleanup_temp_files(self, video_path: str) -> None:
        """
        Clean up temporary files for a specific video.
        
        Args:
            video_path: Original video path
        """
        if not self.config.should_delete_temp_files():
            return
            
        video_name = Path(video_path).stem
        temp_patterns = [
            f"{video_name}_audio.wav",
            f"{video_name}_transcript.txt"
        ]
        
        for pattern in temp_patterns:
            temp_file = os.path.join(self.temp_dir, pattern)
            if os.path.exists(temp_file):
                os.remove(temp_file)
                print(f"🗑️  Cleaned up: {pattern}")
                
    def __del__(self):
        """Cleanup when object is destroyed."""
        # Clear model from memory
        if hasattr(self, 'model') and self.model is not None:
            del self.model 