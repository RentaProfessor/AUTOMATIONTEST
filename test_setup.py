#!/usr/bin/env python3
"""
Setup Test Script for Video Processing Workflow
Validates that all dependencies and components are properly installed.
"""

import sys
import os
import subprocess
import importlib.util

def test_python_version():
    """Test Python version compatibility."""
    print("🐍 Testing Python version...")
    version = sys.version_info
    if version.major == 3 and version.minor >= 8:
        print(f"✅ Python {version.major}.{version.minor}.{version.micro} - Compatible")
        return True
    else:
        print(f"❌ Python {version.major}.{version.minor}.{version.micro} - Requires Python 3.8+")
        return False

def test_dependency(module_name, install_hint=None):
    """Test if a Python module can be imported."""
    try:
        spec = importlib.util.find_spec(module_name)
        if spec is not None:
            print(f"✅ {module_name} - Available")
            return True
        else:
            print(f"❌ {module_name} - Not found")
            if install_hint:
                print(f"   Install with: {install_hint}")
            return False
    except Exception as e:
        print(f"❌ {module_name} - Error: {e}")
        return False

def test_system_command(command, install_hint=None):
    """Test if a system command is available."""
    try:
        result = subprocess.run([command, '--version'], 
                              capture_output=True, text=True, timeout=5)
        if result.returncode == 0:
            version = result.stdout.split('\n')[0]
            print(f"✅ {command} - {version}")
            return True
        else:
            print(f"❌ {command} - Command failed")
            if install_hint:
                print(f"   Install with: {install_hint}")
            return False
    except FileNotFoundError:
        print(f"❌ {command} - Not found")
        if install_hint:
            print(f"   Install with: {install_hint}")
        return False
    except subprocess.TimeoutExpired:
        print(f"❌ {command} - Timeout")
        return False
    except Exception as e:
        print(f"❌ {command} - Error: {e}")
        return False

def test_ollama_connection():
    """Test connection to Ollama service."""
    try:
        import requests
        response = requests.get("http://localhost:11434/api/tags", timeout=5)
        if response.status_code == 200:
            models = response.json().get('models', [])
            print(f"✅ Ollama - Connected ({len(models)} models available)")
            
            # Check for recommended models
            model_names = [model['name'] for model in models]
            recommended = ['llama3:8b', 'mistral:7b']
            
            for model in recommended:
                if model in model_names:
                    print(f"   ✅ {model} - Available")
                else:
                    print(f"   ⚠️  {model} - Not installed (run: ollama pull {model})")
            
            return True
        else:
            print(f"❌ Ollama - HTTP {response.status_code}")
            return False
    except ImportError:
        print("❌ Ollama - requests module not available")
        return False
    except Exception as e:
        print(f"❌ Ollama - Connection failed: {e}")
        print("   Make sure Ollama is running: ollama serve")
        return False

def test_config_file():
    """Test if config file exists and is valid."""
    try:
        if os.path.exists('config.json'):
            import json
            with open('config.json', 'r') as f:
                config = json.load(f)
                
            required_sections = ['general', 'ai', 'video', 'folders']
            missing = [s for s in required_sections if s not in config]
            
            if missing:
                print(f"❌ config.json - Missing sections: {missing}")
                return False
            else:
                print("✅ config.json - Valid structure")
                return True
        else:
            print("❌ config.json - File not found")
            return False
    except json.JSONDecodeError as e:
        print(f"❌ config.json - Invalid JSON: {e}")
        return False
    except Exception as e:
        print(f"❌ config.json - Error: {e}")
        return False

def test_folders():
    """Test if required folders exist."""
    folders = ['input_clips', 'output_clips', 'assets', 'logs', 'temp', 'modules']
    results = []
    
    for folder in folders:
        if os.path.exists(folder):
            print(f"✅ {folder}/ - Exists")
            results.append(True)
        else:
            print(f"⚠️  {folder}/ - Missing (will be created)")
            results.append(False)
    
    return any(results)  # At least some folders should exist

def test_workflow_import():
    """Test importing the main workflow module."""
    try:
        sys.path.append('modules')
        from workflow_orchestrator import VideoProcessingWorkflow
        print("✅ Workflow modules - Import successful")
        return True
    except ImportError as e:
        print(f"❌ Workflow modules - Import failed: {e}")
        return False
    except Exception as e:
        print(f"❌ Workflow modules - Error: {e}")
        return False

def main():
    """Run all tests."""
    print("🔍 SETUP VALIDATION")
    print("=" * 40)
    
    tests = [
        ("Python Version", test_python_version),
        ("Config File", test_config_file),
        ("Folder Structure", test_folders),
        ("System Commands", lambda: all([
            test_system_command("ffmpeg", "brew install ffmpeg"),
            test_system_command("python3", "brew install python@3.11")
        ])),
        ("Python Dependencies", lambda: all([
            test_dependency("whisper", "pip install openai-whisper"),
            test_dependency("watchdog", "pip install watchdog"),
            test_dependency("requests", "pip install requests"),
            test_dependency("numpy", "pip install numpy"),
            test_dependency("PIL", "pip install Pillow")
        ])),
        ("Ollama Service", test_ollama_connection),
        ("Workflow Import", test_workflow_import)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n📋 {test_name}")
        try:
            result = test_func()
            results.append(result)
        except Exception as e:
            print(f"❌ {test_name} - Unexpected error: {e}")
            results.append(False)
    
    # Summary
    passed = sum(results)
    total = len(results)
    
    print(f"\n{'='*40}")
    print(f"📊 SUMMARY: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Your setup is ready.")
        print("\n🚀 Next steps:")
        print("1. Add your logo: assets/logo.png")
        print("2. Add your outro: assets/outro.mp4")
        print("3. Run: python main.py --watch")
    else:
        print("⚠️  Some tests failed. Check the issues above.")
        print("\n📖 For help, see:")
        print("- SETUP_INSTRUCTIONS.md")
        print("- README.md")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 