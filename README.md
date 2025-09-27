# 🎬 Automated Video Processing Workflow

A fully automated, local video processing pipeline that transforms finance-related video clips into branded vertical content for Instagram Reels, TikTok, and YouTube Shorts.

## ✨ Features

- **🎯 100% Free & Local**: No paid APIs, subscriptions, or cloud services
- **🤖 AI-Powered Analysis**: Local LLM analyzes content and generates overlay text
- **🔄 Fully Automated**: Drop videos in folder → get branded output automatically
- **📱 Vertical Optimization**: Auto-crops to 9:16 aspect ratio for social platforms
- **🎨 Branding Integration**: Automatic logo overlay and outro video attachment
- **⚡ Fast Processing**: ~2 minutes per 30-second clip on modern hardware

## 🏗️ Architecture

```
📁 Input Video → 🎤 Whisper Transcription → 🤖 Local LLM Analysis → 🎬 FFmpeg Processing → 📱 Branded Output
```

### Core Components:
- **Transcription**: OpenAI Whisper (local) for speech-to-text
- **AI Analysis**: Ollama (Llama 3 or Mistral) for content analysis
- **Video Processing**: FFmpeg for editing, overlays, and formatting
- **Automation**: Python watchdog for file monitoring

## 🚀 Quick Start

### 1. Clone and Setup
```bash
git clone <your-repo>
cd "CLIP WORKFLOW"
```

### 2. Install Dependencies
```bash
# Install system dependencies (macOS)
brew install ffmpeg
curl -fsSL https://ollama.ai/install.sh | sh

# Install Python dependencies
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Install AI model
ollama pull llama3:8b
```

### 3. Add Your Assets
```bash
# Add your logo (PNG with transparency)
cp your-logo.png assets/logo.png

<<<<<<< HEAD
# Add your outro video (9:16 vertical MP4)
cp your-outro.mp4 assets/outro.mp4
=======
### For Different Clients

1. **Company Information**: Update the system prompt in `generate_response()`
2. **Styling**: Modify CSS colors and branding
3. **Documents**: Upload client-specific knowledge base
4. **Model**: Choose appropriate model for client needs

### Example Customizations

**Legal Firm**: Use `llama2:7b` with legal documents
**Healthcare**: Use `mistral:7b` with medical policies
**E-commerce**: Use `phi3:mini` with product catalogs

## 🚀 Deployment

### Local Development
- Run on localhost:8000 for testing

### Production Deployment

#### Docker Deployment
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["python", "chatbot_app.py"]
>>>>>>> 0b2d5f7 (Remove ngrok, add Cloudflare Tunnel instructions, update chatbot iframe for Cloudflare embed)
```

### 4. Start Processing
```bash
# Auto mode - watches for new files
python main.py --watch

<<<<<<< HEAD
# Or interactive mode
python main.py
```

### 5. Drop Videos and Go!
Simply drop video files into the `input_clips/` folder and watch the magic happen!

## 📖 Detailed Setup

For complete setup instructions, see **[SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)**

## 📂 Project Structure

```
CLIP WORKFLOW/
├── 📁 input_clips/          # Drop your raw videos here
├── 📁 output_clips/         # Processed videos appear here
├── 📁 assets/               # Your logo and outro video
├── 📁 logs/                 # Processing logs
├── 📁 temp/                 # Temporary files (auto-cleaned)
├── 📁 modules/              # Core processing modules
├── 📄 main.py               # Main application entry point
├── 📄 config.json           # Configuration settings
└── 📄 requirements.txt      # Python dependencies
```

## 🎮 Usage Modes

### 1. File Watcher Mode (Recommended)
```bash
python main.py --watch
```
Continuously monitors `input_clips/` and processes new videos automatically.

### 2. Single File Processing
```bash
python main.py --file path/to/video.mp4
```

### 3. Batch Processing
```bash
python main.py --batch path/to/video/folder/
```

### 4. Interactive Mode
```bash
python main.py
```
Menu-driven interface for all operations.

## ⚙️ Configuration

Edit `config.json` to customize:

### AI Settings
```json
{
  "ai": {
    "model": "llama3:8b",
    "temperature": 0.7
  }
}
```

### Video Settings
```json
{
  "video": {
    "output_resolution": "1080x1920",
    "bitrate": "2M"
  }
}
```

### Overlay Settings
```json
{
  "overlays": {
    "font_size": 48,
    "font_color": "white",
    "duration": 3.0
  }
}
```

## 🎯 How It Works

### Step 1: Transcription 🎤
- Extracts audio using FFmpeg
- Transcribes speech using Whisper
- Generates plain text transcript

### Step 2: AI Analysis 🤖
- Sends transcript to local LLM (Llama 3/Mistral)
- AI identifies key financial concepts and moments
- Generates JSON with overlay instructions and timestamps

### Step 3: Video Processing 🎬
- Crops video to 9:16 aspect ratio
- Adds text overlays at AI-specified timestamps
- Overlays logo in corner
- Appends outro video
- Outputs optimized MP4

### Step 4: Cleanup 🗑️
- Removes temporary files
- Logs processing results
- Moves to output folder

## 📊 Example Output

**Input**: `financial_tip_raw.mp4` (landscape, 60 seconds)

**AI Analysis**:
```json
{
  "overlays": [
    {"timestamp": 3.5, "text": "💰 Start budgeting today!", "duration": 3.0},
    {"timestamp": 15.2, "text": "📊 Track every expense", "duration": 3.0},
    {"timestamp": 32.8, "text": "🎯 DM 'BUDGET' for tips", "duration": 3.0}
  ]
}
```

**Output**: `financial_tip_raw_processed_20241201_143022.mp4`
- ✅ 9:16 vertical format (1080x1920)
- ✅ 3 AI-generated overlay texts
- ✅ Logo in top-right corner
- ✅ 5-second outro with CTA
- ✅ Optimized for Instagram Reels

## 🛠️ Troubleshooting

### Common Issues

**"Model not found"**
```bash
ollama pull llama3:8b
ollama serve
```

**"FFmpeg not found"**
```bash
brew install ffmpeg
```

**"Whisper fails"**
```bash
pip install --upgrade openai-whisper
```

**"Processing too slow"**
- Use smaller model: `mistral:7b`
- Close other applications
- Reduce video resolution in config

### Performance Tips

- **M1/M2 8GB**: Use `mistral:7b` model
- **M1/M2 16GB+**: Use `llama3:8b` model
- **Processing Time**: ~2 minutes per 30-second video
- **Memory Usage**: ~4-8GB during processing

## 🔧 Advanced Usage

### Custom Prompts
Edit the `analysis_prompt` in `config.json` to customize AI behavior:

```json
{
  "prompts": {
    "analysis_prompt": "Your custom prompt for analyzing finance content..."
  }
}
```

### Batch Configuration Updates
```bash
# Update model
python -c "
from modules.config_manager import ConfigManager
config = ConfigManager()
config.update('ai', 'model', 'mistral:7b')
config.save()
"
```

### Custom Assets
- **Logo**: Any PNG with transparency
- **Outro**: Any MP4 in 9:16 format
- **Fonts**: System fonts available via FFmpeg

## 📈 Performance Benchmarks

| Hardware | Model | Processing Time (30s video) |
|----------|-------|----------------------------|
| M2 16GB | llama3:8b | ~90 seconds |
| M2 16GB | mistral:7b | ~60 seconds |
| M1 8GB | mistral:7b | ~120 seconds |

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make improvements
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - Feel free to use for personal and commercial projects.

## 🆘 Support

- **Setup Issues**: Check `SETUP_INSTRUCTIONS.md`
- **Assets Help**: See `assets/README_ASSETS.md`
- **Config Questions**: Review `config.json` comments
- **Logs**: Check `logs/video_processing.log`

## 🎯 Roadmap

- [ ] GPU acceleration support
- [ ] Web interface for remote processing
- [ ] Additional AI models (Claude, GPT-4)
- [ ] Multi-language transcription
- [ ] Custom transition effects
- [ ] Thumbnail generation

---

**Made with ❤️ for content creators who want to automate their workflow without breaking the bank!**

Drop a video, get a branded reel. It's that simple. 🚀 
=======
## Exposing Locally Hosted App to the Internet

- Use Cloudflare Tunnel for secure, reliable public access:

```sh
cloudflared tunnel --url http://localhost:8000
```

- Follow Cloudflare's documentation to set up a tunnel and connect it to your domain if desired: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/

## 🔍 API Documentation

### Chat Endpoint
```
>>>>>>> 0b2d5f7 (Remove ngrok, add Cloudflare Tunnel instructions, update chatbot iframe for Cloudflare embed)
