# Assets Setup Guide

This folder contains the branding assets used in your video processing workflow.

## Required Assets

### 1. Logo (logo.png)
- **Format**: PNG with transparency
- **Recommended size**: 200x200 pixels minimum
- **Aspect ratio**: Square (1:1) works best
- **Background**: Transparent
- **Usage**: Overlaid on videos in the corner

#### Tips for Logo:
- Use high contrast colors (white text on dark background or vice versa)
- Keep it simple and readable at small sizes
- Test visibility on different video backgrounds

### 2. Outro Video (outro.mp4)
- **Format**: MP4
- **Aspect ratio**: 9:16 (vertical)
- **Resolution**: 1080x1920 pixels
- **Duration**: 3-5 seconds recommended
- **Content**: Call-to-action, subscribe prompt, contact info

#### Tips for Outro:
- Keep it short and engaging
- Include clear call-to-action text
- Use consistent branding with your main content
- Ensure audio levels match your main videos

## Creating Sample Assets

### Quick Logo Creation:
1. Use Canva, Figma, or similar tools
2. Create 200x200px canvas
3. Add your brand name with clear, bold font
4. Export as PNG with transparent background

### Quick Outro Creation:
1. Use any video editor (DaVinci Resolve, Canva, etc.)
2. Create 1080x1920 project
3. Add text: "Follow for more tips!", "DM for questions", etc.
4. Add your logo/branding
5. Export as MP4

## File Placement

```
assets/
├── logo.png          # Your brand logo (transparent PNG)
├── outro.mp4         # Your outro video (9:16 MP4)
└── README_ASSETS.md  # This file
```

## Configuration

Update `config.json` to enable/disable assets:

```json
{
  "logo": {
    "enabled": true,
    "path": "assets/logo.png",
    "position": "top-right",
    "size": "15%"
  },
  "outro": {
    "enabled": true,
    "path": "assets/outro.mp4"
  }
}
```

## Testing Assets

Run the validator to check if your assets are properly configured:

```bash
python main.py --validate
```

The system will tell you if assets are missing or have issues.

## Troubleshooting

### Logo not appearing:
- Check file exists at `assets/logo.png`
- Verify PNG has transparency
- Try different position in config
- Check logo size isn't too small

### Outro not working:
- Verify MP4 format and 9:16 aspect ratio
- Check file isn't corrupted
- Ensure video duration is reasonable (3-10 seconds)

### Performance issues:
- Use smaller logo file sizes
- Compress outro video
- Consider shorter outro duration 