# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-08-19

### Added
- **Core Pomodoro Timer functionality**
  - 25-minute work sessions with automatic break suggestions
  - 50-minute deep work sessions for extended focus
  - 5-minute short breaks and 15-minute long breaks
  - Session counter to track daily progress

- **Fullscreen Focus Mode**
  - Automatic fullscreen activation when timer starts
  - Manual toggle with F11 key
  - Exit with ESC or by pausing/stopping timer
  - Immersive experience hiding all non-essential UI

- **Custom Sound Support**
  - Upload your own notification sounds (up to 5MB)
  - Local storage - sounds stored in browser, no server uploads
  - Custom sound management with preview and delete options
  - Enhanced sound selection with radio button interface

- **Audio & Notifications**
  - 6 built-in notification sound options
  - Adjustable volume control (0-100%)
  - Test sounds before saving settings
  - Browser notifications with permission handling
  - Visual notifications as fallback

- **User Interface**
  - Modern responsive design that works on all devices
  - Smooth animations and transitions
  - SVG progress ring showing timer countdown
  - Theme switching between work and break modes
  - Bootstrap 5 styling with custom CSS
  - Comprehensive About page with technique guide

- **Customization Features**
  - Adjustable timer durations for all session types
  - Persistent settings saved in localStorage
  - Keyboard shortcuts (Space, Ctrl+R, F11, ESC)
  - Auto-start breaks after work sessions

- **Technical Features**
  - Flask 3.0.0 backend with RESTful API
  - Vanilla JavaScript with ES6+ features
  - Web Audio API for sound generation
  - CSS Custom Properties for theming
  - Mobile-first responsive design

### Technical Details
- Python 3.7+ support
- Flask 3.0.0 web framework
- Bootstrap 5.1.3 UI framework
- Font Awesome 6 icons
- Web Audio API for sounds
- localStorage for data persistence

### Browser Support
- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers with Web Audio API support

---

## [Unreleased]

### Planned Features
- Progressive Web App (PWA) support
- Session history and statistics
- Export functionality for productivity reports
- Team collaboration features
- Additional theme options
- Pomodoro technique variations
