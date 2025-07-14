# Setup Instructions for Mac

## Prerequisites
- macOS (tested on macOS 14+)
- Python 3.8+ (preferably 3.11)
- 16GB+ RAM recommended for local LLM models

## Step 1: Install System Dependencies

### Install Homebrew (if not already installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Install ffmpeg
```bash
brew install ffmpeg
```

### Install Python (if not already installed)
```bash
brew install python@3.11
```

## Step 2: Install Ollama for Local LLM

### Download and install Ollama
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### Pull the recommended models
```bash
# Install Llama 3 8B (recommended for M2 16GB)
ollama pull llama3:8b

# Alternative: Install Mistral 7B (lighter option)
ollama pull mistral:7b
```

### Verify Ollama is working
```bash
ollama list
```

## Step 3: Install Python Dependencies

### Create virtual environment (recommended)
```bash
cd "CLIP WORKFLOW"
python3 -m venv venv
source venv/bin/activate
```

### Install Python packages
```bash
pip install -r requirements.txt
```

## Step 4: Setup Assets

1. **Add your logo**: Place your logo as `assets/logo.png` (PNG with transparency recommended)
2. **Add outro video**: Place your outro video as `assets/outro.mp4` (9:16 aspect ratio, 3-5 seconds)

## Step 5: Test Installation

### Test Whisper
```bash
python3 -c "import whisper; print('Whisper installed successfully')"
```

### Test Ollama connection
```bash
curl http://localhost:11434/api/generate -d '{"model":"llama3:8b","prompt":"Hello","stream":false}'
```

### Test ffmpeg
```bash
ffmpeg -version
```

## Step 6: Configuration

1. Edit `config.json` to customize your settings (model choice, overlay preferences, etc.)
2. Place sample videos in `input_clips/` folder
3. Run the main script: `python3 main.py`

## Troubleshooting

### Common Issues:
- **"Model not found"**: Make sure you've pulled the correct model with `ollama pull`
- **Permission denied**: Ensure Ollama service is running: `ollama serve`
- **Memory issues**: Use smaller models like `mistral:7b` instead of `llama3:8b`
- **ffmpeg not found**: Reinstall with `brew reinstall ffmpeg`

### Performance Tips:
- Close other applications when processing videos
- Use quantized models for better performance
- Process one video at a time to avoid memory issues

## Model Recommendations by Hardware:
- **M1/M2 8GB**: `mistral:7b`
- **M1/M2 16GB**: `llama3:8b` or `mistral:7b`
- **M1/M2 32GB+**: `llama3:13b` or larger models

Ready to start! Drop a video in `input_clips/` and run `python3 main.py` 