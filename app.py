from flask import Flask, render_template, request, jsonify, send_from_directory, flash, redirect, url_for
from flask_socketio import SocketIO, emit
import os
import json
import threading
import time
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename
from modules.workflow_orchestrator import VideoProcessingWorkflow
from modules.config_manager import ConfigManager

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024  # 500MB max file size

socketio = SocketIO(app, cors_allowed_origins="*")

# Initialize workflow
config_manager = ConfigManager()
workflow = VideoProcessingWorkflow('config.json')

# Global variables for tracking processing
processing_status = {
    'is_processing': False,
    'current_file': None,
    'progress': 0,
    'stage': 'Idle',
    'start_time': None,
    'logs': []
}

def serialize_for_json(obj):
    """Convert datetime and timedelta objects to strings for JSON serialization"""
    if isinstance(obj, dict):
        return {key: serialize_for_json(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [serialize_for_json(item) for item in obj]
    elif isinstance(obj, datetime):
        return obj.strftime('%Y-%m-%d %H:%M:%S')
    elif isinstance(obj, timedelta):
        return str(obj)
    else:
        return obj

class ProgressLogger:
    """Custom logger to capture progress and emit to web interface"""
    def __init__(self):
        self.logs = []
    
    def log(self, message, level='info'):
        timestamp = datetime.now().strftime('%H:%M:%S')
        log_entry = {'timestamp': timestamp, 'message': message, 'level': level}
        self.logs.append(log_entry)
        processing_status['logs'] = self.logs[-50:]  # Keep last 50 logs
        socketio.emit('progress_update', {
            'logs': self.logs[-1:],
            'status': serialize_for_json(processing_status)
        })

progress_logger = ProgressLogger()

@app.route('/')
def dashboard():
    """Main dashboard route"""
    try:
        # Get input files
        input_files = []
        if os.path.exists('input_clips'):
            input_files = [f for f in os.listdir('input_clips') 
                          if f.lower().endswith(('.mp4', '.avi', '.mov', '.mkv'))]
        
        # Get output files
        output_files = []
        if os.path.exists('output_clips'):
            output_files = [f for f in os.listdir('output_clips') 
                           if f.lower().endswith(('.mp4', '.avi', '.mov', '.mkv'))]
        
        # Get caption files
        caption_files = []
        if os.path.exists('captions'):
            caption_files = [f for f in os.listdir('captions') 
                           if f.lower().endswith('_caption.txt')]
        
        return render_template('dashboard.html', 
                             input_files=input_files, 
                             output_files=output_files,
                             caption_files=caption_files,
                             processing_status=serialize_for_json(processing_status),
                             config=config_manager.config)
    except Exception as e:
        return f"Error loading dashboard: {str(e)}", 500

@app.route('/upload', methods=['POST'])
def upload_file():
    """Handle file upload"""
    if 'file' not in request.files:
        flash('No file selected')
        return redirect(url_for('dashboard'))
    
    file = request.files['file']
    if file.filename == '' or file.filename is None:
        flash('No file selected')
        return redirect(url_for('dashboard'))
    
    if file and file.filename and file.filename.lower().endswith(('.mp4', '.avi', '.mov', '.mkv')):
        filename = secure_filename(file.filename)
        filepath = os.path.join('input_clips', filename)
        file.save(filepath)
        flash(f'File {filename} uploaded successfully!')
    else:
        flash('Invalid file type. Please upload MP4, AVI, MOV, or MKV files.')
    
    return redirect(url_for('dashboard'))

@app.route('/process/<filename>')
def process_video(filename):
    """Process a single video file"""
    if processing_status['is_processing']:
        return jsonify({'error': 'Another video is currently being processed'})
    
    input_path = os.path.join('input_clips', filename)
    if not os.path.exists(input_path):
        return jsonify({'error': 'File not found'})
    
    # Start processing in background thread
    thread = threading.Thread(target=process_video_background, args=(input_path, filename))
    thread.daemon = True
    thread.start()
    
    return jsonify({'success': True, 'message': f'Started processing {filename}'})

def process_video_background(input_path, filename):
    """Background video processing with real progress updates"""
    global processing_status
    
    def update_progress(progress, stage):
        processing_status['progress'] = progress
        processing_status['stage'] = stage
        progress_logger.log(stage)
        socketio.emit('progress_update', {
            'logs': [{'timestamp': datetime.now().strftime('%H:%M:%S'), 'message': stage, 'level': 'info'}],
            'status': serialize_for_json(processing_status)
        })
        print(f"Progress: {progress}% - {stage}")  # Debug logging
    
    try:
        processing_status.update({
            'is_processing': True,
            'current_file': filename,
            'progress': 0,
            'stage': 'Starting...',
            'start_time': datetime.now(),
            'logs': []
        })
        
        progress_logger.logs = []
        progress_logger.log(f"🚀 Starting processing for {filename}")
        
        # Create a custom workflow that captures progress
        class ProgressCapturingWorkflow:
            def __init__(self, base_workflow):
                self.workflow = base_workflow
                
            def process_video(self, video_path):
                try:
                    update_progress(5, "📝 Initializing workflow...")
                    
                    # Step 1: Transcription
                    update_progress(15, "🎤 Extracting audio...")
                    transcript, transcript_path = self.workflow.transcription.process_video(video_path)
                    
                    update_progress(35, "🎤 Transcribing with Whisper AI...")
                    # Transcription already done above, just update progress
                    
                    update_progress(50, "🤖 Analyzing content with AI...")
                    # Step 2: AI Analysis
                    overlay_data = self.workflow.llm_analyzer.analyze_transcript(transcript, video_path)
                    
                    update_progress(60, "✍️  Generating social media caption...")
                    # Step 2.5: Caption Generation
                    caption = self.workflow.llm_analyzer.generate_caption(transcript, video_path)
                    caption_path = self.workflow.llm_analyzer.save_caption(caption, video_path)
                    
                    update_progress(70, "🎬 Processing video...")
                    # Step 3: Video Processing (includes logo and outro)
                    output_path = self.workflow.video_processor.process_video(video_path, overlay_data)
                    
                    update_progress(90, "🎯 Finalizing output...")
                    
                    # Cleanup
                    if self.workflow.config.should_delete_temp_files():
                        self.workflow.transcription.cleanup_temp_files(video_path)
                        self.workflow.video_processor.cleanup_temp_files(video_path)
                    
                    update_progress(100, "✅ Processing complete!")
                    
                    return output_path
                    
                except Exception as e:
                    update_progress(0, f"❌ Error: {str(e)}")
                    raise e
        
        # Use the progress-capturing workflow
        progress_workflow = ProgressCapturingWorkflow(workflow)
        result = progress_workflow.process_video(input_path)
        
        if result:
            processing_status['progress'] = 100
            processing_status['stage'] = 'Complete!'
            progress_logger.log(f"✅ Processing completed: {os.path.basename(result)}", 'success')
        else:
            processing_status['stage'] = 'Failed'
            progress_logger.log("❌ Processing failed", 'error')
            
    except Exception as e:
        processing_status['stage'] = 'Error'
        error_msg = f"❌ Error: {str(e)}"
        progress_logger.log(error_msg, 'error')
        print(f"Processing error: {e}")  # Debug logging
        import traceback
        traceback.print_exc()  # Full error details
    
    finally:
        processing_status['is_processing'] = False
        socketio.emit('processing_complete', serialize_for_json(processing_status))

@app.route('/download/<filename>')
def download_file(filename):
    """Download output file"""
    return send_from_directory('output_clips', filename, as_attachment=True)

@app.route('/view/<path:filename>')
def view_file(filename):
    """View output file in browser"""
    return send_from_directory('output_clips', filename)

@app.route('/view_caption/<filename>')
def view_caption(filename):
    """View generated caption file"""
    caption_path = os.path.join('captions', filename)
    if os.path.exists(caption_path):
        try:
            with open(caption_path, 'r', encoding='utf-8') as f:
                caption_content = f.read()
            return jsonify({
                'success': True,
                'caption': caption_content,
                'filename': filename
            })
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500
    else:
        return jsonify({'success': False, 'error': 'Caption file not found'}), 404

@app.route('/delete/<file_type>/<filename>')
def delete_file(file_type, filename):
    """Delete a file from input or output directory"""
    try:
        if file_type == 'input':
            file_path = os.path.join('input_clips', filename)
        elif file_type == 'output':
            file_path = os.path.join('output_clips', filename)
        elif file_type == 'caption':
            file_path = os.path.join('captions', filename)
        else:
            flash('Invalid file type')
            return redirect(url_for('dashboard'))
        
        if os.path.exists(file_path):
            os.remove(file_path)
            flash(f'File {filename} deleted successfully')
        else:
            flash(f'File {filename} not found')
            
    except Exception as e:
        flash(f'Error deleting file: {str(e)}')
    
    return redirect(url_for('dashboard'))

@app.route('/config')
def view_config():
    """View current configuration"""
    return jsonify(config_manager.config)

@app.route('/config', methods=['POST'])
def update_config():
    """Update configuration"""
    try:
        new_config = request.json
        if new_config is None:
            return jsonify({'error': 'No configuration data provided'})
        config_manager.config.update(new_config)
        config_manager.save()
        flash('Configuration updated successfully')
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/status')
def get_status():
    """Get current processing status"""
    return jsonify(processing_status)

@app.route('/debug')
def debug_dashboard():
    """Debug dashboard to see exact error"""
    try:
        # Get input files
        input_files = []
        if os.path.exists('input_clips'):
            input_files = [f for f in os.listdir('input_clips') 
                          if f.lower().endswith(('.mp4', '.avi', '.mov', '.mkv'))]
        
        # Get output files
        output_files = []
        if os.path.exists('output_clips'):
            output_files = [f for f in os.listdir('output_clips') 
                           if f.lower().endswith(('.mp4', '.avi', '.mov', '.mkv'))]
        
        # Get caption files
        caption_files = []
        if os.path.exists('captions'):
            caption_files = [f for f in os.listdir('captions') 
                           if f.lower().endswith('_caption.txt')]
        
        # Test serialization
        serialized_status = serialize_for_json(processing_status)
        
        return jsonify({
            'success': True,
            'input_files': input_files,
            'output_files': output_files,
            'caption_files': caption_files,
            'processing_status': serialized_status,
            'config': config_manager.config
        })
    except Exception as e:
        import traceback
        return jsonify({
            'success': False,
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500

@socketio.on('connect')
def handle_connect(auth):
    """Handle client connection"""
    emit('status_update', serialize_for_json(processing_status))

if __name__ == '__main__':
    # Create directories if they don't exist
    os.makedirs('input_clips', exist_ok=True)
    os.makedirs('output_clips', exist_ok=True)
    os.makedirs('templates', exist_ok=True)
    os.makedirs('static', exist_ok=True)
    os.makedirs('captions', exist_ok=True)
    os.makedirs('temp', exist_ok=True)
    
    # Reset processing status to clean state
    processing_status.update({
        'is_processing': False,
        'current_file': None,
        'progress': 0,
        'stage': 'Ready',
        'start_time': None,
        'logs': []
    })
    
    print("🚀 Starting Video Processing Dashboard...")
    print("📱 Open your browser to: http://localhost:5001")
    
    socketio.run(app, debug=False, host='0.0.0.0', port=5001) 