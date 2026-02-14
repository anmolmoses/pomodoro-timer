# Pomodoro Timer

A beautiful glassmorphic Pomodoro timer built with React, TypeScript, Framer Motion, and Tailwind CSS.

## Architecture

**Single provider pattern** — `PomodoroProvider` is the only context provider. There is no separate `SettingsProvider`, `TimerProvider`, or `Layout.tsx`. All components consume `usePomodoroContext()` directly.

### File Structure

```
src/
├── types/index.ts          # Shared foundation types (DO NOT MODIFY)
├── utils/index.ts           # Shared utilities (DO NOT MODIFY)
├── styles/glass.css         # Glassmorphic CSS classes
├── index.css                # Tailwind + global styles
├── reducer/timerReducer.ts  # Timer state reducer
├── context/PomodoroContext.tsx  # Single context provider
├── components/
│   ├── TimerRing.tsx        # SVG progress ring
│   ├── Controls.tsx         # Play/pause/reset/skip buttons
│   ├── SessionTracker.tsx   # Session completion dots
│   └── SettingsModal.tsx    # Settings configuration modal
├── hooks/useKeyboard.ts     # Keyboard shortcuts
├── App.tsx                  # Root component (mounts PomodoroProvider)
└── main.tsx                 # Entry point
```

## Features

- ⏱️ Configurable focus/break durations
- 🔄 Auto-transitions between phases
- 🎵 Audio chime on phase completion
- 🔔 Browser notifications
- ⌨️ Keyboard shortcuts (Space, R, S)
- ♿ Accessible (ARIA progressbar, live regions, focus rings)
- 🎨 Dark glassmorphism design with animated mesh background
- 📱 Responsive (mobile sheet pattern for settings)
- 🎬 Smooth Framer Motion animations
- ⚡ Timestamp-based timing (no setInterval drift)

## Getting Started

```bash
npm install
npm run dev
```

## Keyboard Shortcuts

| Key   | Action            |
|-------|-------------------|
| Space | Start/Pause/Resume|
| R     | Reset             |
| S     | Skip phase        |
