"""
Video Processing Module for Video Processing Workflow
Handles video editing operations using ffmpeg: cropping, overlays, logo, outro.
"""

import os
import subprocess
from typing import Dict, List, Any, Optional, Tuple
from pathlib import Path
import json
import time
from datetime import datetime

class VideoProcessor:
    def __init__(self, config_manager):
        """
        Initialize the video processor.
        
        Args:
            config_manager: Configuration manager instance
        """
        self.config = config_manager
        self.temp_dir = self.config.get('folders', 'temp', 'temp')
        self.output_dir = self.config.get('folders', 'output', 'output_clips')
        
        # Store the base directory for asset resolution
        self.base_dir = os.path.dirname(os.path.abspath(config_manager.config_path))
        
        # Test ffmpeg availability
        self._test_ffmpeg()
        
    def _resolve_asset_path(self, relative_path: str) -> str:
        """
        Resolve asset path relative to the config file location.
        
        Args:
            relative_path: Relative path from config
            
        Returns:
            Absolute path to the asset
        """
        if os.path.isabs(relative_path):
            return relative_path
        return os.path.join(self.base_dir, relative_path)
        
    def _test_ffmpeg(self) -> None:
        """Test if ffmpeg is available."""
        try:
            result = subprocess.run(['ffmpeg', '-version'], 
                                  capture_output=True, text=True, check=True)
            print("✅ FFmpeg is available")
        except subprocess.CalledProcessError:
            print("❌ FFmpeg test failed")
            raise
        except FileNotFoundError:
            print("❌ FFmpeg not found. Install with: brew install ffmpeg")
            raise
            
    def _get_video_info(self, video_path: str) -> Dict[str, Any]:
        """
        Get video information using ffprobe.
        
        Args:
            video_path: Path to video file
            
        Returns:
            Dictionary with video information
        """
        try:
            cmd = [
                'ffprobe', '-v', 'quiet', '-print_format', 'json',
                '-show_format', '-show_streams', video_path
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            info = json.loads(result.stdout)
            
            # Extract video stream info
            video_stream = None
            for stream in info['streams']:
                if stream['codec_type'] == 'video':
                    video_stream = stream
                    break
                    
            if not video_stream:
                raise ValueError("No video stream found")
                
            return {
                'width': int(video_stream['width']),
                'height': int(video_stream['height']),
                'duration': float(video_stream.get('duration', info['format']['duration'])),
                'fps': eval(video_stream['r_frame_rate']),  # Convert fraction to float
                'codec': video_stream['codec_name']
            }
            
        except Exception as e:
            print(f"❌ Error getting video info: {e}")
            raise
            
    def _calculate_crop_params(self, width: int, height: int) -> Tuple[int, int, int, int]:
        """
        Calculate crop parameters for 9:16 aspect ratio.
        
        Args:
            width: Original video width
            height: Original video height
            
        Returns:
            Tuple of (crop_width, crop_height, x_offset, y_offset)
        """
        target_ratio = 9 / 16  # 0.5625
        current_ratio = width / height
        
        if current_ratio > target_ratio:
            # Video is too wide, crop sides
            crop_height = height
            crop_width = int(height * target_ratio)
            x_offset = (width - crop_width) // 2
            y_offset = 0
        else:
            # Video is too tall, crop top/bottom
            crop_width = width
            crop_height = int(width / target_ratio)
            x_offset = 0
            y_offset = (height - crop_height) // 2
            
        return crop_width, crop_height, x_offset, y_offset
        
    def _wrap_text_for_vertical_video(self, text: str, max_chars_per_line: int = 20) -> str:
        """
        Wrap text to fit better in vertical video format.
        
        Args:
            text: Original text
            max_chars_per_line: Maximum characters per line for 9:16 format
            
        Returns:
            Text with proper line breaks for FFmpeg
        """
        # Remove emoji for length calculation but keep them in output
        import re
        emoji_pattern = r'[\U0001F600-\U0001F64F\U0001F300-\U0001F5FF\U0001F680-\U0001F6FF\U0001F1E0-\U0001F1FF\U00002702-\U000027B0\U000024C2-\U0001F251]+'
        
        # Split text into words while preserving emojis
        words = text.split()
        lines = []
        current_line = ""
        
        for word in words:
            # Count actual text length (excluding emojis)
            word_text_only = re.sub(emoji_pattern, '', word)
            current_line_text_only = re.sub(emoji_pattern, '', current_line)
            
            # Check if adding this word would exceed the limit
            if current_line:
                potential_length = len(current_line_text_only) + 1 + len(word_text_only)  # +1 for space
            else:
                potential_length = len(word_text_only)
                
            if potential_length <= max_chars_per_line:
                current_line = current_line + (" " if current_line else "") + word
            else:
                # Start a new line
                if current_line:
                    lines.append(current_line)
                current_line = word
                
        # Add the last line
        if current_line:
            lines.append(current_line)
            
        # Limit to 2 lines for better readability on vertical video
        if len(lines) > 2:
            lines = lines[:2]
            # Trim last line if it would be too long with ellipsis
            if len(re.sub(emoji_pattern, '', lines[-1])) > max_chars_per_line - 3:
                words_in_last_line = lines[-1].split()
                while len(re.sub(emoji_pattern, '', ' '.join(words_in_last_line))) > max_chars_per_line - 3:
                    words_in_last_line.pop()
                lines[-1] = ' '.join(words_in_last_line) + "..."
            else:
                lines[-1] = lines[-1] + "..."
            
        # Join with actual newline characters that FFmpeg can handle
        return '\n'.join(lines)

    def _create_overlay_filter(self, overlays: List[Dict[str, Any]], video_duration: float) -> str:
        """
        Create ffmpeg filter for text overlays.
        
        Args:
            overlays: List of overlay instructions
            video_duration: Total video duration in seconds
            
        Returns:
            FFmpeg filter string
        """
        if not overlays:
            return ""
            
        # Get overlay configuration
        font_size = self.config.get('overlays', 'font_size', 48)
        font_color = self.config.get('overlays', 'font_color', 'white')
        outline_color = self.config.get('overlays', 'outline_color', 'black')
        outline_width = self.config.get('overlays', 'outline_width', 2)
        fade_duration = self.config.get('overlays', 'fade_duration', 0.5)
        max_width = self.config.get('overlays', 'max_width', 90)
        
        filters = []
        
        for i, overlay in enumerate(overlays):
            timestamp = overlay['timestamp']
            text = overlay['text']
            duration = overlay['duration']
            
            # Skip overlays that would extend beyond video duration
            if timestamp >= video_duration:
                continue
                
            # Adjust duration if it would exceed video length
            if timestamp + duration > video_duration:
                duration = video_duration - timestamp
                
            # Wrap text for vertical format
            wrapped_text = self._wrap_text_for_vertical_video(text)
            
            # Check if text was wrapped (contains newlines)
            is_multiline = '\n' in wrapped_text
            
            # Adjust font size for multi-line text
            actual_font_size = font_size
            if is_multiline:
                actual_font_size = int(font_size * 0.85)  # Reduce by 15% for multi-line
            
            # Escape special characters for FFmpeg (handle newlines properly)
            escaped_text = wrapped_text.replace(':', '\\:').replace("'", "\\'").replace('"', '\\"').replace('\n', '\\n')
            
            # Calculate timing
            start_time = max(0, timestamp)
            end_time = start_time + duration
            
            # Create drawtext filter with proper syntax for multi-line support
            filter_str = f"drawtext=text='{escaped_text}'"
            filter_str += f":fontsize={actual_font_size}"
            filter_str += f":fontcolor={font_color}"
            filter_str += f":borderw={outline_width}"
            filter_str += f":bordercolor={outline_color}"
            filter_str += ":x=(w-text_w)/2"  # Center horizontally
            
            # Adjust vertical positioning for multi-line text
            if is_multiline:
                filter_str += ":y=(h-text_h)*0.65"  # Position slightly higher for multi-line
            else:
                filter_str += ":y=(h-text_h)*0.7"  # Original position for single line
                
            filter_str += f":box=1:boxcolor=black@0.4:boxborderw=8"  # Slightly more prominent background for readability
            filter_str += f":enable='between(t,{start_time:.1f},{end_time:.1f})'"
            
            # Add fade effects with proper float formatting
            if fade_duration > 0:
                fade_in_end = start_time + fade_duration
                fade_out_start = end_time - fade_duration
                filter_str += f":alpha='if(lt(t,{fade_in_end:.1f}),(t-{start_time:.1f})/{fade_duration:.1f},1)*if(gt(t,{fade_out_start:.1f}),({end_time:.1f}-t)/{fade_duration:.1f},1)'"
            
            filters.append(filter_str)
            
        return ",".join(filters)
        
    def _create_logo_filter(self, video_width: int, video_height: int) -> str:
        """
        Create ffmpeg filter for logo overlay.
        
        Args:
            video_width: Video width
            video_height: Video height
            
        Returns:
            FFmpeg filter string or empty string if logo disabled
        """
        if not self.config.get('logo', 'enabled', True):
            return ""
            
        logo_path = self._resolve_asset_path(self.config.get('logo', 'path', 'assets/logo.png'))
            
        if not os.path.exists(logo_path):
            print(f"⚠️  Logo file not found at: {logo_path}")
            print("   Please check the logo path in config.json")
            return ""
            
        position = self.config.get('logo', 'position', 'top-right')
        size_percent = float(self.config.get('logo', 'size', '15').rstrip('%'))
        margin = self.config.get('logo', 'margin', 20)
        
        # Calculate logo size
        logo_size = int(min(video_width, video_height) * size_percent / 100)
        
        # Calculate position
        positions = {
            'top-left': f"{margin}:{margin}",
            'top-right': f"{video_width - logo_size - margin}:{margin}",
            'bottom-left': f"{margin}:{video_height - logo_size - margin}",
            'bottom-right': f"{video_width - logo_size - margin}:{video_height - logo_size - margin}",
            'center': f"{(video_width - logo_size) // 2}:{(video_height - logo_size) // 2}"
        }
        
        pos = positions.get(position, positions['top-right'])
        
        return f"[0:v][1:v]overlay={pos}"
        
    def process_video(self, video_path: str, overlay_data: Dict[str, Any]) -> str:
        """
        Process video with all effects: crop, overlays, logo, outro.
        
        Args:
            video_path: Path to input video
            overlay_data: Overlay instructions from LLM
            
        Returns:
            Path to processed video
        """
        try:
            print(f"\n🎬 Starting video processing for: {os.path.basename(video_path)}")
            start_time = time.time()
            
            # Get video information
            video_info = self._get_video_info(video_path)
            print(f"📹 Video: {video_info['width']}x{video_info['height']}, {video_info['duration']:.1f}s")
            
            # Calculate crop parameters
            crop_w, crop_h, crop_x, crop_y = self._calculate_crop_params(
                video_info['width'], video_info['height']
            )
            
            # Generate output filename
            video_name = Path(video_path).stem
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_filename = f"{video_name}_processed_{timestamp}.mp4"
            output_path = os.path.join(self.output_dir, output_filename)
            
            # Build ffmpeg command
            cmd = ['ffmpeg', '-y']  # -y to overwrite output
            
            # Input video
            cmd.extend(['-i', video_path])
            
            # Add logo as second input if enabled
            logo_filter = ""
            if self.config.get('logo', 'enabled', True):
                logo_path = self._resolve_asset_path(self.config.get('logo', 'path', 'assets/logo.png'))
                    
                if os.path.exists(logo_path):
                    cmd.extend(['-i', logo_path])
                    logo_filter = self._create_logo_filter(crop_w, crop_h)
            
            # Build filter complex
            filters = []
            
            # Crop to 9:16
            crop_filter = f"[0:v]crop={crop_w}:{crop_h}:{crop_x}:{crop_y}"
            
            # Scale to 1080x1920 if needed
            target_width = self.config.get('video', 'output_resolution', '1080x1920').split('x')[0]
            target_height = self.config.get('video', 'output_resolution', '1080x1920').split('x')[1]
            
            if crop_w != int(target_width) or crop_h != int(target_height):
                scale_filter = f",scale={target_width}:{target_height}"
            else:
                scale_filter = ""
                
            # Combine crop and scale
            base_filter = crop_filter + scale_filter
            
            # Add logo overlay if enabled
            if logo_filter:
                filters.append(f"{base_filter}[cropped]")
                filters.append(logo_filter.replace('[0:v]', '[cropped]') + "[with_logo]")
                video_output = "[with_logo]"
            else:
                filters.append(f"{base_filter}[processed]")
                video_output = "[processed]"
            
            # Add text overlays
            overlay_filter = self._create_overlay_filter(
                overlay_data.get('overlays', []), 
                video_info['duration']
            )
            
            if overlay_filter:
                # Apply drawtext filters to the video stream
                final_filter = f"{video_output}{overlay_filter}[final]"
                filters.append(final_filter)
                video_output = "[final]"
            
            # Add filter complex to command
            if filters:
                cmd.extend(['-filter_complex', ';'.join(filters)])
                cmd.extend(['-map', video_output])
                cmd.extend(['-map', '0:a'])  # Map original audio
            else:
                # No filters, just copy
                cmd.extend(['-c:v', 'copy', '-c:a', 'copy'])
            
            # Output parameters
            cmd.extend([
                '-c:v', self.config.get('video', 'video_codec', 'libx264'),
                '-c:a', self.config.get('video', 'audio_codec', 'aac'),
                '-b:v', self.config.get('video', 'bitrate', '2M'),
                '-crf', str(self.config.get('video', 'crf', 23)),
                '-r', str(self.config.get('video', 'output_fps', 30)),
                '-movflags', '+faststart',  # Optimize for streaming
                output_path
            ])
            
            # Execute ffmpeg command
            print(f"🔄 Processing video with ffmpeg...")
            print(f"   Cropping to {crop_w}x{crop_h}")
            print(f"   Adding {len(overlay_data.get('overlays', []))} text overlays")
            if logo_filter:
                print(f"   Adding logo overlay")
            
            result = subprocess.run(
                cmd, 
                capture_output=True, 
                text=True, 
                check=True
            )
            
            processing_time = time.time() - start_time
            print(f"✅ Video processing completed in {processing_time:.1f} seconds")
            print(f"📁 Output saved to: {output_filename}")
            
            # Add outro if enabled
            if self.config.get('outro', 'enabled', True):
                output_path = self._add_outro(output_path)
            
            return output_path
            
        except subprocess.CalledProcessError as e:
            print(f"❌ FFmpeg error: {e.stderr}")
            raise
        except Exception as e:
            print(f"❌ Video processing error: {e}")
            raise
            
    def _add_outro(self, video_path: str) -> str:
        """
        Add outro video to the processed video.
        
        Args:
            video_path: Path to processed video
            
        Returns:
            Path to video with outro
        """
        outro_path = self._resolve_asset_path(self.config.get('outro', 'path', 'assets/outro.mp4'))
            
        if not os.path.exists(outro_path):
            print(f"⚠️  Outro video not found at: {outro_path}")
            print("   Please check the outro path in config.json")
            return video_path
            
        try:
            print("🔄 Adding outro...")
            
            # Create output path for video with outro
            base_name = Path(video_path).stem
            output_dir = Path(video_path).parent
            final_path = output_dir / f"{base_name}_with_outro.mp4"
            
            # Get video info to ensure format compatibility
            main_video_info = self._get_video_info(video_path)
            
            # First, create a compatible outro video
            temp_outro = os.path.join(self.temp_dir, f"temp_outro_{base_name}.mp4")
            
            # Get outro video info to compare dimensions
            outro_info = self._get_video_info(outro_path)
            
            # Build video filter - outro video is now pre-positioned correctly
            video_filters = []
            
            # Only apply format and SAR fixes (no scaling needed)
            video_filters.extend(['format=yuv420p', 'setsar=1:1'])
            
            # Create outro command that ensures format compatibility
            outro_cmd = [
                'ffmpeg', '-y',
                '-i', outro_path,
                '-f', 'lavfi',
                '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000',
                '-vf', ','.join(video_filters),
                '-r', str(main_video_info["fps"]),
                '-c:v', 'libx264',
                '-c:a', 'aac',
                '-ar', '48000',
                '-ac', '2',
                '-b:a', '128k',
                '-pix_fmt', 'yuv420p',
                '-profile:v', 'high',
                '-level', '4.0',
                '-map', '0:v:0',  # Map video from outro
                '-map', '1:a:0',  # Map audio from silent source
                '-shortest',
                '-t', str(outro_info["duration"]),
                temp_outro
            ]
            
            print("🔄 Converting outro video format...")
            result = subprocess.run(outro_cmd, capture_output=True, text=True, check=True)
            
            # Use filter_complex for more reliable concatenation with scaling
            print("🔄 Concatenating videos...")
            concat_cmd = [
                'ffmpeg', '-y',
                '-i', video_path,
                '-i', temp_outro,
                '-filter_complex', '[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[outv][outa]',
                '-map', '[outv]',
                '-map', '[outa]',
                '-c:v', 'libx264',
                '-c:a', 'aac',
                '-b:v', self.config.get('video', 'bitrate', '2M'),
                '-crf', str(self.config.get('video', 'crf', 23)),
                '-movflags', '+faststart',
                str(final_path)
            ]
            
            result = subprocess.run(concat_cmd, capture_output=True, text=True, check=True)
            
            # Clean up temp files
            if os.path.exists(temp_outro):
                os.remove(temp_outro)
            
            # Clean up original file
            if self.config.should_delete_temp_files():
                os.remove(video_path)
            
            print("✅ Outro added successfully")
            return str(final_path)
            
        except subprocess.CalledProcessError as e:
            print(f"❌ FFmpeg error adding outro: {e.stderr}")
            return video_path
        except Exception as e:
            print(f"❌ Error adding outro: {e}")
            return video_path
            
    def _has_audio_stream(self, video_path: str) -> bool:
        """Check if video has an audio stream."""
        try:
            cmd = [
                'ffprobe', '-v', 'quiet', '-print_format', 'json',
                '-show_streams', video_path
            ]
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            info = json.loads(result.stdout)
            
            for stream in info['streams']:
                if stream['codec_type'] == 'audio':
                    return True
            return False
        except:
            return False
            
    def cleanup_temp_files(self, video_path: str) -> None:
        """Clean up temporary files for a video."""
        if not self.config.should_delete_temp_files():
            return
            
        video_name = Path(video_path).stem
        temp_patterns = [
            f"{video_name}_*.json",
            f"{video_name}_*.txt",
            "concat_list.txt"
        ]
        
        import glob
        for pattern in temp_patterns:
            for temp_file in glob.glob(os.path.join(self.temp_dir, pattern)):
                try:
                    os.remove(temp_file)
                    print(f"🗑️  Cleaned up: {os.path.basename(temp_file)}")
                except OSError:
                    pass
                    
    def get_output_stats(self, output_path: str) -> Dict[str, Any]:
        """Get statistics about the output video."""
        try:
            stats = os.stat(output_path)
            video_info = self._get_video_info(output_path)
            
            return {
                'file_size_mb': stats.st_size / (1024 * 1024),
                'duration': video_info['duration'],
                'resolution': f"{video_info['width']}x{video_info['height']}",
                'fps': video_info['fps'],
                'codec': video_info['codec']
            }
        except Exception as e:
            return {'error': str(e)}
            
    def __str__(self) -> str:
        """String representation of the processor."""
        return f"VideoProcessor(output_dir='{self.output_dir}')" 