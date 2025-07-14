# 🎨 PUT YOUR BRANDING ASSETS HERE!

## This folder contains your logo and outro video

### Required Files:

#### 📷 **logo.png** 
- **What**: Your brand logo/watermark
- **Format**: PNG with transparent background
- **Size**: 200x200 pixels minimum (square works best)
- **Where it appears**: Corner of every processed video
- **Example names**: `logo.png`, `brand_mark.png`, `watermark.png`

#### 🎬 **outro.mp4**
- **What**: Short video with call-to-action 
- **Format**: MP4 video file
- **Dimensions**: 1080x1920 (9:16 vertical format)
- **Duration**: 3-5 seconds recommended
- **Content**: "Follow for more!", "DM for custom budget", etc.
- **Where it appears**: Automatically added to end of every video

---

## 📂 Required File Structure:
```
assets/
├── logo.png          ← YOUR LOGO HERE
└── outro.mp4         ← YOUR OUTRO VIDEO HERE
```

---

## 🛠️ Quick Creation Tips:

### Create Logo:
1. Use **Canva** or **Figma**
2. Make it **200x200 pixels**
3. Use **white text with black outline** (shows on any background)
4. Export as **PNG with transparency**
5. Save as `logo.png` in this folder

### Create Outro:
1. Use any video editor (**DaVinci Resolve**, **Canva**, etc.)
2. Create **1080x1920 project** (vertical)
3. Add text: **"Follow for more tips!"** or **"DM 'BUDGET' for help"**
4. Keep it **3-5 seconds**
5. Export as **MP4**
6. Save as `outro.mp4` in this folder

---

## ✅ Test Your Assets:

Run this to check if your assets are properly set up:
```bash
python main.py --validate
```

The system will tell you if your logo and outro are correctly configured!

---

**💡 Tip**: You can enable/disable logo and outro in `config.json` if needed, but having both gives the most professional results! 