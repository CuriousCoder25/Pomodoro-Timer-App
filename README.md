# 🍅 Pomodoro Timer App

A modern, responsive web-based Pomodoro Timer application built with Flask and JavaScript. Features multiple notification sounds, customizable timer durations, fullscreen focus mode, custom sound uploads, and a beautiful responsive design.

![Pomodoro Timer](https://img.shields.io/badge/Version-1.0.0-green.svg)
![Flask](https://img.shields.io/badge/Flask-3.0.0-blue.svg)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.1.3-purple.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## 📸 Screenshots

### Main Timer Interface
![Main Timer](https://raw.githubusercontent.com/CuriousCoder25/Pomodoro-Timer-App/refs/heads/fullscreen-focus-mode/screenshots_for_readme/home.png)
![](https://raw.githubusercontent.com/CuriousCoder25/Pomodoro-Timer-App/refs/heads/fullscreen-focus-mode/screenshots_for_readme/image.png)
![](https://raw.githubusercontent.com/CuriousCoder25/Pomodoro-Timer-App/refs/heads/fullscreen-focus-mode/screenshots_for_readme/break.png)
*Clean, modern timer interface with progress ring and session controls*

### Fullscreen Focus Mode
![Fullscreen Mode](https://raw.githubusercontent.com/CuriousCoder25/Pomodoro-Timer-App/refs/heads/fullscreen-focus-mode/screenshots_for_readme/image%20copy%202.png)
*Immersive fullscreen experience for distraction-free productivity*

### Settings & Customization
![Settings Modal](https://raw.githubusercontent.com/CuriousCoder25/Pomodoro-Timer-App/refs/heads/fullscreen-focus-mode/screenshots_for_readme/image%20copy.png)
*Comprehensive settings for timer durations, sounds, and preferences*

### Custom Sound Management
![Custom Sounds](https://raw.githubusercontent.com/CuriousCoder25/Pomodoro-Timer-App/refs/heads/fullscreen-focus-mode/screenshots_for_readme/image%20copy%203.png)
*Upload and manage your own notification sounds*

<!-- ### Mobile Responsive Design
![Mobile View](https://via.placeholder.com/400x800/2D5A27/FFFFFF?text=Mobile+Responsive) -->
*Fully responsive design works perfectly on all devices*

## ✨ Features

### ✨ New Features

#### 🖥️ Fullscreen Focus Mode
- **Automatic fullscreen activation** when timer starts
- **Immersive experience** hiding all non-essential UI elements
- **Manual toggle** with F11 key
- **Exit with ESC** or by pausing/stopping timer
- **Distraction-free environment** for maximum concentration

#### 🎵 Custom Sound Support
- **Upload your own notification sounds** (audio files up to 5MB)
- **Local storage** - sounds stored in your browser, no server uploads
- **Custom sound management** with preview and delete options
- **Enhanced sound selection** with radio button interface

### 🎯 Core Functionality
- **25-minute work sessions** with automatic break suggestions
- **50-minute deep work sessions** for extended focus
- **Short breaks (5 min)** and **long breaks (15 min)**
- **Auto-start breaks** after work sessions (configurable)
- **Session counter** to track completed work and break sessions

### 🎵 Audio & Notifications
- **6 notification sound options**:
  - Harmony Chord (default)
  - Gentle Bell
  - Wind Chime
  - Simple Tone
  - Digital Ding
  - System Notification
- **Adjustable volume control** (0-100%)
- **Test sounds** before saving settings
- **Browser notifications** with permission handling
- **Visual notifications** as fallback

### 🎨 User Interface
- **Modern responsive design** that works on all devices
- **Smooth animations** and transitions
- **Progress ring** showing timer countdown
- **Theme switching** between work and break modes
- **Creamy progress ring** with customizable radius
- **Bootstrap 5** styling with custom CSS
- **Comprehensive About page** with technique guide, benefits, and tips

### ⚙️ Customization
- **Adjustable timer durations** for all session types
- **Persistent settings** saved in localStorage
- **Real-time settings preview** without saving
- **Keyboard shortcuts** (Space to start/pause, Ctrl+R to reset)
- **Background timer** continues when tab is not active
- **Educational content** in About page with Pomodoro technique explanation

## 🎬 Live Demo


🔗 **[Try the Live Demo](https://your-app-name.herokuapp.com)** *(Coming Soon)*

*Experience the full Pomodoro Timer with all features in your browser!*

## 🚀 Quick Start

### Prerequisites
- Python 3.7 or higher
- pip (Python package installer)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Pomodoro Timer App"
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment**
   
   **Windows:**
   ```bash
   venv\Scripts\activate
   ```
   
   **macOS/Linux:**
   ```bash
   source venv/bin/activate
   ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run the application**
   ```bash
   python app.py
   ```

6. **Open in browser**
   ```
   http://localhost:5000
   ```

## 🛠️ Project Structure

```
Pomodoro Timer App/
├── app.py                 # Main Flask application
├── config.py             # Configuration settings
├── requirements.txt      # Python dependencies
├── requirements-dev.txt  # Development dependencies  
├── requirements-prod.txt # Production dependencies
├── README.md            # Project documentation
├── LICENSE              # MIT License file
├── CHANGELOG.md         # Version history and changes
├── CONTRIBUTING.md      # Contribution guidelines
├── .gitignore           # Git ignore rules
├── static/
│   ├── css/
│   │   └── style.css    # Custom styling
│   ├── js/
│   │   └── script.js    # Timer functionality
│   └── audio/
│       └── README.txt   # Audio assets info
└── templates/
    ├── base.html        # Base template with responsive navbar
    ├── pomodoro.html    # Main timer page with fullscreen focus mode
    └── about.html       # Comprehensive About page with technique guide
```

## 📱 Responsive Design

The application is fully responsive and optimized for:

- **Desktop** (1200px+): Full-featured experience
- **Laptop** (992-1199px): Optimized layout
- **Tablet** (768-991px): Touch-friendly interface
- **Mobile Large** (576-767px): Compact design
- **Mobile Small** (up to 575px): Minimal but functional
- **Very Small** (up to 375px): Ultra-compact layout

## 🎮 Keyboard Shortcuts

- **Spacebar**: Start/Pause timer
- **Ctrl + R**: Reset timer (when not running)
- **F11**: Toggle fullscreen focus mode
- **Escape**: Exit fullscreen focus mode

## ⚡ Technical Features

### Frontend
- **Vanilla JavaScript** with ES6+ features
- **Web Audio API** for sound generation
- **CSS Custom Properties** for theming
- **CSS Grid & Flexbox** for responsive layout
- **CSS Clamp()** for fluid typography
- **SVG Progress Ring** with smooth animations

### Backend
- **Flask 3.0.0** web framework
- **RESTful API** endpoints for timer events
- **Template inheritance** with Jinja2
- **Static file serving** optimized for production

### Browser Support
- **Chrome/Edge** 88+
- **Firefox** 85+
- **Safari** 14+
- **Mobile browsers** with Web Audio API support

## 🔧 Configuration

### Timer Settings
All timer settings can be customized through the settings modal:

- **Work Duration**: 1-60 minutes (default: 25)
- **Deep Work Duration**: 1-120 minutes (default: 50)
- **Short Break**: 1-30 minutes (default: 5)
- **Long Break**: 1-60 minutes (default: 15)

### Audio Settings
- **Sound Notifications**: Enable/disable
- **Notification Sound**: Choose from 6 options
- **Volume**: 0-100% adjustable

### Advanced Settings
- **Auto-start Breaks**: Automatically start breaks after work sessions
- **Browser Notifications**: Request permission for system notifications

## 🚀 Deployment

### Development
```bash
python app.py
```
Runs on `http://localhost:5000` with debug mode enabled.

### Production
For production deployment, consider using:

1. **Gunicorn** (included in requirements):
   ```bash
   gunicorn -w 4 -b 0.0.0.0:8000 app:app
   ```

2. **Docker** (create Dockerfile):
   ```dockerfile
   FROM python:3.9-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   EXPOSE 5000
   CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
   ```

3. **Cloud Platforms**:
   - Heroku
   - Vercel
   - Railway
   - PythonAnywhere

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

**Quick Start:**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

For detailed information about development setup, code style, and contribution process, please read [CONTRIBUTING.md](CONTRIBUTING.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Pomodoro Technique** by Francesco Cirillo
- **Bootstrap** for responsive framework
- **Font Awesome** for beautiful icons
- **Web Audio API** for sound generation
- **Flask** community for excellent documentation

## 📞 Support

If you encounter any issues or have questions:

1. Create a new issue with detailed information
2. Include your browser version and operating system
3. Contact me at **gauravkathayat12@gmail.com**

## 🔄 Version History

- **v1.0.0** (Current) - [View Release Notes](CHANGELOG.md)
  - Initial release
  - Core Pomodoro functionality
  - Fullscreen focus mode
  - Custom sound support
  - Multiple notification sounds
  - Responsive design
  - Settings persistence
  - Browser notifications

For detailed changelog, see [CHANGELOG.md](CHANGELOG.md)

---

**Happy Focusing! 🍅✨**
