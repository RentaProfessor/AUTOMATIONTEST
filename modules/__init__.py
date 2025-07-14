"""
Video Processing Workflow Modules
A collection of modules for automated video processing and AI analysis.
"""

__version__ = "1.0.0"
__author__ = "Video Processing Workflow"
__description__ = "Automated video processing pipeline with AI analysis"

# Module exports for easier imports
from .config_manager import ConfigManager
from .transcription import TranscriptionService
from .llm_analyzer import LLMAnalyzer
from .video_processor import VideoProcessor
from .file_watcher import FileWatcher
from .workflow_orchestrator import VideoProcessingWorkflow

__all__ = [
    'ConfigManager',
    'TranscriptionService', 
    'LLMAnalyzer',
    'VideoProcessor',
    'FileWatcher',
    'VideoProcessingWorkflow'
] 