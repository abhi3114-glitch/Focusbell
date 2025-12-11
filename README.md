# FocusBell

FocusBell is a minimalist, distraction-free focus timer designed to nudge your attention with subtle chimes and gentle visuals. It is built to run entirely in your browser without requiring account creation or server-side data storage.

## Features

### Core Functionality
- **Timer Modes**: Micro (10m), Pomodoro (25/5m), and Custom duration support (1-120m).
- **Audio Experience**: 
  - Synthesized completion sounds (Chimes).
  - Integrated Brown, Pink, and White noise generator for ambient focus.
  - Optional mechanical, digital, or heartbeat ticking sounds.
  - Independent volume mixing for all audio channels.
- **Deep Focus Tools**:
  - **Zen Mode**: Automatically fades out interface controls during active sessions.
  - **Focus Intent**: Input field to declare session goals.
  - **Auto DND**: Integration with browser Notification API.

### Productivity Tracking
- **Daily Goals**: Visual progress tracking against daily minute targets.
- **Streaks**: Tracks consecutive days of activity.
- **History**: Comprehensive session logging with intent tracking.
- **Weekly Chart**: Visual bar chart displaying activity over the last 7 days.
- **Data Export**: Full support for exporting history as JSON or CSV.

### Personalization & Experience
- **Visual Themes**: Includes Midnight, Forest, Ember, and Cyberpunk presets.
- **Custom Theme**: Support for user-defined HEX color themes.
- **Progress Ring**: Smooth SVG visualizations for timer progress.
- **Breathing Guide**: Visual 4-4-4-4 breathing rhythm guide active during breaks.
- **Picture-in-Picture**: Floating timer overlay support.
- **Keyboard Shortcuts**: Comprehensive keyboard control support.

### Power User Features
- **Session Tasks**: Integrated mini-todo list for breaking down active sessions.
- **Custom Audio**: Support for uploading custom .mp3/.wav files for completion chimes.
- **Smart Alerts**: Non-intrusive toast notifications for app feedback.
- **Auto-Start**: Options to automatically chain timer phases.
- **Smart Long Break**: Automated prompts for longer breaks after 4 sessions.
- **Confetti**: Visual celebrations upon reaching daily goals.
- **Quote Widget**: integrated motivational quotes.
- **Global Reset**: "Danger Zone" options to clear all application data.

## Keyboard Shortcuts

- **Space**: Start / Pause
- **Esc**: Reset Timer
- **?**: Toggle Shortcuts Help

## Technology Stack

- **React 19**: Core UI library.
- **Vite**: Build tool and development server.
- **Tailwind CSS**: Utility-first styling framework.
- **Web Audio API**: Real-time audio synthesis for chimes and noise.
- **LocalStorage**: Client-side data persistence.

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## License

MIT
