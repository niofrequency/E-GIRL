# E-GIRL Overlay

A transparent, always-on-top desktop overlay player for videos with alpha channels (or any video). Perfect for floating dancing e-girl animations over your browser, games, or desktop.

## Features

- Fully transparent window (supports WebM with alpha)
- Always on top
- Frameless and borderless
- Drag to move (hover to show controls)
- Resize freely
- Opacity slider
- Click-through mode (mouse clicks pass through)
- Remembers last video and window position
- Drag & drop video files
- Keyboard shortcuts

## Usage

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run:
   ```bash
   npm start
   ```

3. Click **Open** or drag a video onto the window.

### Recommended video formats
- **WebM (VP9 with alpha)** — best transparency support
- GIF with transparency
- MP4 / MOV (opaque backgrounds will show black)

### Keyboard shortcuts
- `Ctrl + Shift + T` — Toggle click-through
- `Esc` — Quit

## Building

```bash
npm run build
```

Outputs portable/executable in the `dist/` folder.

## Notes

- For true transparent backgrounds, use a video with an alpha channel (WebM VP9 alpha is ideal).
- Click-through mode is useful so the overlay doesn't block mouse interaction with apps underneath.
- The control bar appears when you hover over the window.

Made by niofrequency
