# Hero Video Assets

## Required Files

Place the following files in this directory:

### 1. `hero-loop.mp4`
- **Duration**: 8-12 seconds (seamless loop)
- **Resolution**: 1920x1080 (1080p, 16:9)
- **Codec**: H.264
- **Color**: Grayscale ONLY (black/white/gray)
- **Size**: <4MB (optimized for web)
- **Audio**: None (muted)

### 2. `hero-loop.webm`
- Same specs as MP4 but WebM format
- Use VP9 codec for better compression
- Size: <3MB target

### 3. Content Sequence (8-10 seconds)

**0:00 - 0:02** — Lab glass drop in slow motion  
**0:02 - 0:04** — Macro skin close-up dissolving to petri dish  
**0:04 - 0:07** — Motion graphics: data lines representing biological intelligence  
**0:07 - 0:09** — Clean product bottle/capsule beauty shot  
**0:09 - 0:10** — Fade to logo (or just fade to black)

### Important Notes

- **NO TEXT IN VIDEO**: All text (headline, CTAs) is rendered as HTML overlay for accessibility
- **Grayscale only**: Strict adherence to monochrome brand palette
- **Seamless loop**: First and last frames should blend smoothly
- **Optimized**: Use tools like HandBrake or FFmpeg to optimize file size without quality loss

### Example FFmpeg Commands

```bash
# Convert to optimized MP4
ffmpeg -i input.mov -c:v libx264 -crf 23 -preset slow -an -vf "scale=1920:1080,colorchannelm ixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3" hero-loop.mp4

# Convert to WebM
ffmpeg -i input.mov -c:v libvpx-vp9 -crf 30 -b:v 0 -an -vf "scale=1920:1080" hero-loop.webm
```

### Testing

Before committing, test that:
1. Video plays in all major browsers (Chrome, Safari, Firefox, Edge)
2. Loop is seamless (no visible "jump")
3. Loads quickly (<3 seconds on 4G connection)
4. Appears grayscale throughout

### Contact

Design Lead: [email]  
Video Production: [email]
