#!/usr/bin/env python3
"""
Test script to verify the video processing workflow works correctly
"""

import os
import sys
import time
from pathlib import Path

# Add the current directory to the path so we can import modules
sys.path.append(str(Path(__file__).parent))

def test_processing():
    """Test the video processing workflow"""
    print("🧪 Testing Video Processing Workflow")
    print("=" * 50)
    
    try:
        # Import the workflow
        from modules.workflow_orchestrator import VideoProcessingWorkflow
        
        print("✅ Successfully imported VideoProcessingWorkflow")
        
        # Initialize the workflow
        workflow = VideoProcessingWorkflow('config.json')
        print("✅ Successfully initialized workflow")
        
        # Check for test video
        input_dir = Path('input_clips')
        test_videos = list(input_dir.glob('*.mp4'))
        
        if not test_videos:
            print("❌ No test videos found in input_clips/")
            print("📁 Please add a test video file to input_clips/ and try again")
            return False
            
        test_video = test_videos[0]
        print(f"🎬 Found test video: {test_video.name}")
        
        # Test the processing
        print(f"🚀 Starting test processing...")
        start_time = time.time()
        
        result = workflow.process_video(str(test_video))
        
        end_time = time.time()
        
        if result:
            print(f"✅ Processing successful!")
            print(f"📁 Output: {result}")
            print(f"⏱️  Time: {end_time - start_time:.1f} seconds")
            
            # Check if output file exists
            if os.path.exists(result):
                file_size = os.path.getsize(result) / (1024 * 1024)
                print(f"📊 Output file size: {file_size:.1f} MB")
            else:
                print("❌ Output file not found!")
                return False
                
        else:
            print("❌ Processing failed!")
            return False
            
        return True
        
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_flask_integration():
    """Test the Flask app processing integration"""
    print("\n🌐 Testing Flask Integration")
    print("=" * 50)
    
    try:
        # Import Flask components
        from app import process_video_background, processing_status
        
        print("✅ Successfully imported Flask components")
        
        # Check for test video
        input_dir = Path('input_clips')
        test_videos = list(input_dir.glob('*.mp4'))
        
        if not test_videos:
            print("❌ No test videos found in input_clips/")
            return False
            
        test_video = test_videos[0]
        print(f"🎬 Using test video: {test_video.name}")
        
        # Test the background processing function
        print("🚀 Testing background processing...")
        
        # Reset processing status
        processing_status.update({
            'is_processing': False,
            'current_file': None,
            'progress': 0,
            'stage': 'Idle',
            'start_time': None,
            'logs': []
        })
        
        # Run the background processing
        process_video_background(str(test_video), test_video.name)
        
        print(f"📊 Final status: {processing_status}")
        
        if processing_status['stage'] == 'Complete!':
            print("✅ Flask integration test successful!")
            return True
        else:
            print("❌ Flask integration test failed!")
            return False
            
    except Exception as e:
        print(f"❌ Flask integration test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("🔬 Video Processing Test Suite")
    print("=" * 60)
    
    # Test 1: Basic workflow
    workflow_success = test_processing()
    
    # Test 2: Flask integration
    flask_success = test_flask_integration()
    
    # Summary
    print("\n📊 TEST RESULTS")
    print("=" * 60)
    print(f"Workflow Test: {'✅ PASS' if workflow_success else '❌ FAIL'}")
    print(f"Flask Test: {'✅ PASS' if flask_success else '❌ FAIL'}")
    
    if workflow_success and flask_success:
        print("\n🎉 All tests passed! The processing should work in the dashboard.")
    else:
        print("\n⚠️  Some tests failed. Check the errors above for details.")
        
    print("\n💡 To test the web dashboard:")
    print("1. Run: python3 app.py")
    print("2. Open: http://localhost:5001")
    print("3. Upload a video and click Process") 