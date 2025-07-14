# 📂 FOLDER GUIDE - Where Everything Goes!

## 🎯 The Two Folders You Need to Know:

### 📹 **input_clips/** ← DROP RAW VIDEOS HERE
```
📁 input_clips/
├── finance_tip.mp4     ← Your raw video files
├── budget_advice.mov   ← iPhone videos work great!
└── investment_talk.mp4 ← Any landscape/square video
```
**What to put**: Your unprocessed video files (.mp4, .mov, .avi, .mkv)

---

### 🎨 **assets/** ← PUT YOUR BRANDING HERE  
```
📁 assets/
├── logo.png     ← Your brand logo (PNG with transparency)
└── outro.mp4    ← Your outro video (9:16 vertical format)
```
**What to put**: Your logo and outro video for branding

---

### 📱 **output_clips/** ← YOUR FINISHED VIDEOS APPEAR HERE
```
📁 output_clips/
├── finance_tip_processed_20241201_143022.mp4    ← Ready for Instagram!
├── budget_advice_processed_20241201_150145.mp4  ← Ready for TikTok!
└── investment_talk_processed_20241201_162830.mp4 ← Ready for YouTube!
```
**What appears**: Fully processed, branded vertical videos ready to upload

---

## 🔄 The Complete Workflow:

```
📹 Drop video in input_clips/
        ↓
🤖 AI processes automatically  
        ↓
📱 Branded video appears in output_clips/
        ↓
🚀 Upload to social media!
```

---

## 🚀 Quick Start Commands:

### Start Automatic Processing:
```bash
python main.py --watch
```
*(Watches input_clips/ and processes new videos automatically)*

### Check Everything is Set Up:
```bash
python test_setup.py
```
*(Validates all dependencies and configuration)*

### Process One Video:
```bash
python main.py --file input_clips/your_video.mp4
```

---

## 📋 Setup Checklist:

- [ ] ✅ Install dependencies (see SETUP_INSTRUCTIONS.md)
- [ ] 📷 Add logo.png to assets/ folder
- [ ] 🎬 Add outro.mp4 to assets/ folder  
- [ ] 📹 Drop a test video in input_clips/
- [ ] 🚀 Run: `python main.py --watch`
- [ ] 📱 Check output_clips/ for your branded video!

---

**🎉 That's it! Drop videos, get branded content. It's that simple!** 