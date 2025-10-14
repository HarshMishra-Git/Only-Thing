# Mobile Video Implementation

## Overview
Updated the HeroVideo component to support separate video sources for mobile and desktop devices, ensuring optimal video playback on all screen sizes.

## Changes Made

### 1. HeroVideo Component (`apps/frontend/src/components/hero/HeroVideo.tsx`)

#### Props Interface
- Added `mobileVideoSrc?: string` prop to support optional mobile video

#### Styled Components
- Split `VideoElement` into two variants:
  - `DesktopVideo`: Hidden on mobile (below md breakpoint)
  - `MobileVideo`: Hidden on desktop (above md breakpoint)

#### Video Management
- Added `mobileVideoRef` for mobile video element
- Updated `useEffect` to handle both desktop and mobile video playback
- Properly initializes and plays both videos when loaded
- Falls back to poster image if no mobile video is provided

### 2. AdvancedHomePage Component (`apps/frontend/src/components/home/AdvancedHomePage.tsx`)

#### Hero Section
- Added `mobileVideoSrc="/videos/mobile.mp4"` prop to HeroVideo component
- Desktop continues to use `/videos/hero.mp4`

## Video File Structure

```
apps/frontend/public/videos/
├── hero.mp4    (Desktop video)
└── mobile.mp4  (Mobile video - newly added)
```

## How It Works

1. **Desktop View (≥768px)**:
   - Displays `hero.mp4` video
   - Mobile video is hidden via CSS media query

2. **Mobile View (<768px)**:
   - Displays `mobile.mp4` video (if provided)
   - Desktop video is hidden via CSS media query
   - Falls back to poster image if `mobileVideoSrc` is not provided

3. **Video Attributes**:
   - Both videos use: `autoPlay`, `muted`, `loop`, `playsInline`
   - Grayscale filter applied for monochrome brand aesthetic
   - Videos cover the full hero section (100vh)

## Benefits

✅ **Optimized Performance**: Mobile users get a video optimized for their device
✅ **Better UX**: Properly formatted video for each screen size
✅ **Bandwidth Efficiency**: Can use smaller file sizes for mobile
✅ **Flexible**: Falls back gracefully if mobile video isn't provided
✅ **Accessibility**: Maintains all ARIA labels and semantic HTML

## Testing

To test the implementation:

1. **Desktop**: Open the site in a desktop browser - should see `hero.mp4`
2. **Mobile**: Open in mobile browser or use DevTools responsive mode - should see `mobile.mp4`
3. **Video Playback**: Both videos should autoplay, loop, and maintain grayscale filter
4. **Fallback**: If mobile video is removed, poster image should appear on mobile

## Browser Support

- Modern browsers with HTML5 video support
- Graceful degradation for browsers that don't support autoplay
- Console warnings if autoplay fails (user interaction may be required)
