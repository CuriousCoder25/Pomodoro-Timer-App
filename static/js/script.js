    class PomodoroTimer {
    constructor() {
        this.timeRemaining = 25 * 60;
        this.totalTime = 25 * 60;
        this.isRunning = false;
        this.isPaused = false;
        this.currentSession = 'work_25';
        this.timerInterval = null;
        this.workSessions = 0;
        this.breakSessions = 0;
        
        this.settings = {
            workDuration: 25,
            deepWorkDuration: 50,
            shortBreakDuration: 5,
            longBreakDuration: 15,
            autoStartBreaks: true,
            soundNotifications: true,
            notificationVolume: 50,
            notificationSound: 'chord',
            customSoundName: null
        };
        
        this.customSounds = new Map(); // Store custom audio files
        this.loadCustomSounds(); // Load custom sounds from IndexedDB
        this.isFullscreenMode = false; // Track fullscreen focus mode
        
        this.loadSettings();
        this.initializeElements();
        this.updateDisplay();
        this.updateProgressRing();
        this.loadSessionCounts();
    }
    
    initializeElements() {
        this.timeDisplay = document.getElementById('timeDisplay');
        this.sessionType = document.getElementById('sessionType');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.timeCircle = document.getElementById('timeCircle');
        this.progressCircle = document.getElementById('progressCircle');
        this.workSessionsDisplay = document.getElementById('workSessions');
        this.breakSessionsDisplay = document.getElementById('breakSessions');
        
        // const radius = 145;
        const radius = 130;
        this.circumference = 2 * Math.PI * radius;
        this.progressCircle.style.strokeDasharray = this.circumference;
        
        document.querySelectorAll('.setting-item').forEach(item => {
            item.addEventListener('click', () => this.switchSession(item));
        });
        
        this.requestNotificationPermission();
    }
    
    requestNotificationPermission() {
        if ('Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        this.showFlashMessage('Notifications enabled! 🔔');
                    } else {
                        this.showFlashMessage('Notifications disabled. You can enable them in browser settings.');
                    }
                });
            }
        } else {
            console.log('This browser does not support notifications');
        }
    }
    
    switchSession(element) {
        if (this.isRunning) {
            if (!confirm('Timer is running. Do you want to stop and switch sessions?')) {
                return;
            }
            this.stopTimer();
        }
        
        document.querySelectorAll('.setting-item').forEach(item => {
            item.classList.remove('active');
        });
        
        element.classList.add('active');
        
        this.currentSession = element.dataset.type;
        const duration = parseInt(element.dataset.duration);
        
        this.setTimer(duration);
        this.updateTheme();
    }
    
    setTimer(minutes) {
        this.timeRemaining = minutes * 60;
        this.totalTime = minutes * 60;
        this.updateDisplay();
        this.updateProgressRing();
        
        const sessionNames = {
            'work_25': 'Work Session',
            'work_50': 'Deep Work Session',
            'short_break': 'Short Break',
            'long_break': 'Long Break'
        };
        this.sessionType.textContent = sessionNames[this.currentSession];
    }
    
    updateTheme() {
        const body = document.body;
        const navbar = document.querySelector('.navbar');
        const timerCard = document.querySelector('.timer-card');
        
        if (this.currentSession === 'work_25' || this.currentSession === 'work_50') {
            body.classList.remove('break-mode');
            navbar.classList.remove('break-mode');
            timerCard.classList.remove('break-mode');
        } else {
            body.classList.add('break-mode');
            navbar.classList.add('break-mode');
            timerCard.classList.add('break-mode');
        }
    }
    
    startTimer() {
        this.isRunning = true;
        const wasResuming = this.isPaused;
        this.isPaused = false;
        
        this.startBtn.style.display = 'none';
        this.pauseBtn.style.display = 'inline-flex';
        this.timeCircle.classList.add('active');
        
        // Reset start button text if it was showing "Resume"
        this.startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
        
        // Add fullscreen focus mode button
        this.showFullscreenButton();
        
        // Automatically enter fullscreen focus mode when starting or resuming timer
        setTimeout(() => {
            this.enterFullscreenFocusMode();
        }, wasResuming ? 200 : 500); // Shorter delay for resume, longer for initial start
        
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateDisplay();
            this.updateProgressRing();
            
            if (this.timeRemaining <= 0) {
                this.completeTimer();
            }
        }, 1000);
        
        this.sendTimerEvent(wasResuming ? 'resume' : 'start');
    }
    
    pauseTimer() {
        this.isRunning = false;
        this.isPaused = true;
        
        clearInterval(this.timerInterval);
        
        this.startBtn.style.display = 'inline-flex';
        this.startBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
        this.pauseBtn.style.display = 'none';
        this.timeCircle.classList.remove('active');
        
        // Exit fullscreen mode when pausing
        if (this.isFullscreenMode) {
            this.exitFullscreenFocusMode();
        }
    }
    
    resetTimer() {
        this.stopTimer();
        
        const activeItem = document.querySelector('.setting-item.active');
        const duration = parseInt(activeItem.dataset.duration);
        this.setTimer(duration);
    }
    
    stopTimer() {
        this.isRunning = false;
        this.isPaused = false;
        
        clearInterval(this.timerInterval);
        
        this.startBtn.style.display = 'inline-flex';
        this.startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
        this.pauseBtn.style.display = 'none';
        this.timeCircle.classList.remove('active');
        
        // Exit fullscreen mode if active
        if (this.isFullscreenMode) {
            this.exitFullscreenFocusMode();
        }
        
        // Hide fullscreen button
        this.hideFullscreenButton();
    }
    
    completeTimer() {
        this.stopTimer();
        this.timeCircle.classList.add('timer-complete');
        
        if (this.settings.soundNotifications) {
            this.playNotificationSound();
        }
        
        this.showNotification();
        this.updateSessionCounts();
        
        setTimeout(() => {
            this.timeCircle.classList.remove('timer-complete');
            if (this.settings.autoStartBreaks) {
                this.autoSwitchSession();
            }
        }, 2000);
        
        this.sendTimerEvent('complete');
    }
    
    updateSessionCounts() {
        if (this.currentSession === 'work_25' || this.currentSession === 'work_50') {
            this.workSessions++;
        } else {
            this.breakSessions++;
        }
        
        this.workSessionsDisplay.textContent = `Work: ${this.workSessions}`;
        this.breakSessionsDisplay.textContent = `Breaks: ${this.breakSessions}`;
        
        localStorage.setItem('pomodoroWorkSessions', this.workSessions);
        localStorage.setItem('pomodoroBreakSessions', this.breakSessions);
    }
    
    loadSessionCounts() {
        this.workSessions = parseInt(localStorage.getItem('pomodoroWorkSessions')) || 0;
        this.breakSessions = parseInt(localStorage.getItem('pomodoroBreakSessions')) || 0;
        
        this.workSessionsDisplay.textContent = `Work: ${this.workSessions}`;
        this.breakSessionsDisplay.textContent = `Breaks: ${this.breakSessions}`;
    }
    
    autoSwitchSession() {
        let nextSession, nextDuration;
        
        if (this.currentSession === 'work_25' || this.currentSession === 'work_50') {
            if (this.workSessions % 4 === 0) {
                nextSession = 'long_break';
                nextDuration = this.settings.longBreakDuration;
            } else {
                nextSession = 'short_break';
                nextDuration = this.settings.shortBreakDuration;
            }
        } else {
            // After a break, default to regular 25-min work session
            nextSession = 'work_25';
            nextDuration = this.settings.workDuration;
        }
        
        document.querySelectorAll('.setting-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.type === nextSession) {
                item.classList.add('active');
            }
        });
        
        this.currentSession = nextSession;
        this.setTimer(nextDuration);
        this.updateTheme();
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        
        this.timeDisplay.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.title = `${this.timeDisplay.textContent} - Pomodoro Timer`;
    }
    
    updateProgressRing() {
        const progress = (this.totalTime - this.timeRemaining) / this.totalTime;
        const offset = this.circumference - (progress * this.circumference);
        this.progressCircle.style.strokeDashoffset = offset;
    }
    
    showNotification() {
        const messages = {
            'work_25': 'Work session completed! Time for a break! 🎉',
            'work_50': 'Deep work session completed! Great focus! Time for a well-deserved break! 🎉',
            'short_break': 'Break time is over! Ready to get back to work? 💪',
            'long_break': 'Long break finished! Let\'s start a fresh work session! 🚀'
        };
        
        const message = messages[this.currentSession];
        
        // Always show flash message
        this.showFlashMessage(message);
        
        // Show browser notification if enabled and permission granted
        if (this.settings.soundNotifications && 'Notification' in window && Notification.permission === 'granted') {
            try {
                const notification = new Notification('🍅 Pomodoro Timer', {
                    body: message,
                    icon: '/static/favicon.ico',
                    badge: '/static/favicon.ico',
                    tag: 'pomodoro-timer',
                    requireInteraction: true,
                    silent: false
                });
                
                // Auto-close notification after 10 seconds
                setTimeout(() => {
                    notification.close();
                }, 10000);
                
                // Handle notification click
                notification.onclick = () => {
                    window.focus();
                    notification.close();
                };
            } catch (error) {
                console.log('Could not show notification:', error);
            }
        } else if (this.settings.soundNotifications && Notification.permission !== 'granted') {
            // Show fallback visual notification
            this.showDesktopStyleNotification(message);
        }
    }
    
    playNotificationSound() {
        // Handle custom sounds first
        if (this.settings.notificationSound === 'custom' && this.settings.customSoundName) {
            if (this.customSounds.has(this.settings.customSoundName)) {
                const audioUrl = this.customSounds.get(this.settings.customSoundName);
                const audio = new Audio(audioUrl);
                audio.volume = (this.settings.notificationVolume || 50) / 100;
                audio.play().catch(error => {
                    console.error('Error playing custom sound:', error);
                    // Fallback to default sound
                    this.playDefaultNotificationSound();
                });
                return;
            } else {
                console.warn('Custom sound not found, falling back to default');
                // Reset to default if custom sound is missing
                this.settings.notificationSound = 'chord';
                this.settings.customSoundName = null;
            }
        }
        
        // Play default generated sounds
        this.playDefaultNotificationSound();
    }
    
    playDefaultNotificationSound() {
        try {
            // Create Web Audio API context
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const gainNode = audioContext.createGain();
            const volume = (this.settings.notificationVolume / 100) * 0.3; // Max volume of 0.3
            
            // Connect to destination
            gainNode.connect(audioContext.destination);
            
            // Set volume envelope
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.1);
            
            // Create different sound types based on setting
            switch (this.settings.notificationSound) {
                case 'chord':
                    this.playChordSound(audioContext, gainNode);
                    break;
                case 'bell':
                    this.playBellSound(audioContext, gainNode);
                    break;
                case 'chime':
                    this.playChimeSound(audioContext, gainNode);
                    break;
                case 'tone':
                    this.playToneSound(audioContext, gainNode);
                    break;
                case 'ding':
                    this.playDingSound(audioContext, gainNode);
                    break;
                case 'notification':
                    this.playNotificationTone(audioContext, gainNode);
                    break;
                default:
                    this.playChordSound(audioContext, gainNode);
            }
            
        } catch (error) {
            // Fallback to HTML5 audio with a simple beep
            console.log('Web Audio API not supported, using fallback');
            try {
                // Create a simple audio beep using HTML5 Audio
                const audio = new Audio();
                audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjyR2e/BdCMFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjyR2e/BdCMFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjyR2e/BdCMF';
                audio.volume = this.settings.notificationVolume / 100;
                audio.play().catch(e => {
                    console.log('Could not play notification sound:', e);
                    // Show visual feedback if audio fails
                    this.showFlashMessage('🔊 Audio notification ready (sound may be muted)');
                });
            } catch (e2) {
                console.log('All audio methods failed:', e2);
                this.showFlashMessage('🔇 Audio not available on this device');
            }
        }
    }
    
    playChordSound(audioContext, gainNode) {
        // Harmony chord (C and E notes) - original sound
        const oscillator1 = audioContext.createOscillator();
        const oscillator2 = audioContext.createOscillator();
        
        oscillator1.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator2.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5
        oscillator1.type = 'sine';
        oscillator2.type = 'sine';
        
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
        
        oscillator1.start(audioContext.currentTime);
        oscillator2.start(audioContext.currentTime);
        oscillator1.stop(audioContext.currentTime + 0.8);
        oscillator2.stop(audioContext.currentTime + 0.8);
    }
    
    playBellSound(audioContext, gainNode) {
        // Gentle bell sound with harmonics
        const fundamental = 800; // Hz
        const oscillators = [];
        
        // Create bell harmonics
        [1, 2.4, 3.8, 5.6].forEach((ratio, index) => {
            const osc = audioContext.createOscillator();
            osc.frequency.setValueAtTime(fundamental * ratio, audioContext.currentTime);
            osc.type = 'sine';
            
            const oscGain = audioContext.createGain();
            oscGain.gain.setValueAtTime(1 / (index + 1), audioContext.currentTime);
            oscGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
            
            osc.connect(oscGain);
            oscGain.connect(gainNode);
            
            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + 1.5);
            oscillators.push(osc);
        });
    }
    
    playChimeSound(audioContext, gainNode) {
        // Wind chime effect with multiple tones
        const frequencies = [523.25, 659.25, 783.99, 1046.5]; // C, E, G, C octave
        const startTime = audioContext.currentTime;
        
        frequencies.forEach((freq, index) => {
            const osc = audioContext.createOscillator();
            osc.frequency.setValueAtTime(freq, startTime + index * 0.2);
            osc.type = 'triangle';
            
            const oscGain = audioContext.createGain();
            oscGain.gain.setValueAtTime(0, startTime + index * 0.2);
            oscGain.gain.linearRampToValueAtTime(0.3, startTime + index * 0.2 + 0.1);
            oscGain.gain.exponentialRampToValueAtTime(0.01, startTime + index * 0.2 + 1.0);
            
            osc.connect(oscGain);
            oscGain.connect(gainNode);
            
            osc.start(startTime + index * 0.2);
            osc.stop(startTime + index * 0.2 + 1.0);
        });
    }
    
    playToneSound(audioContext, gainNode) {
        // Simple clean tone
        const osc = audioContext.createOscillator();
        osc.frequency.setValueAtTime(880, audioContext.currentTime); // A5
        osc.type = 'sine';
        
        osc.connect(gainNode);
        
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        osc.start(audioContext.currentTime);
        osc.stop(audioContext.currentTime + 0.5);
    }
    
    playDingSound(audioContext, gainNode) {
        // Digital ding with quick attack
        const osc = audioContext.createOscillator();
        osc.frequency.setValueAtTime(1760, audioContext.currentTime); // A6
        osc.type = 'square';
        
        // Quick filter for digital sound
        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, audioContext.currentTime);
        
        osc.connect(filter);
        filter.connect(gainNode);
        
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        osc.start(audioContext.currentTime);
        osc.stop(audioContext.currentTime + 0.3);
    }
    
    playNotificationTone(audioContext, gainNode) {
        // System notification style - two quick beeps
        const freq1 = 800;
        const freq2 = 1000;
        
        // First beep
        const osc1 = audioContext.createOscillator();
        osc1.frequency.setValueAtTime(freq1, audioContext.currentTime);
        osc1.type = 'square';
        osc1.connect(gainNode);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0, audioContext.currentTime + 0.1);
        
        osc1.start(audioContext.currentTime);
        osc1.stop(audioContext.currentTime + 0.1);
        
        // Second beep
        const osc2 = audioContext.createOscillator();
        osc2.frequency.setValueAtTime(freq2, audioContext.currentTime + 0.15);
        osc2.type = 'square';
        osc2.connect(gainNode);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + 0.15);
        gainNode.gain.setValueAtTime(0, audioContext.currentTime + 0.25);
        
        osc2.start(audioContext.currentTime + 0.15);
        osc2.stop(audioContext.currentTime + 0.25);
    }
    
    showDesktopStyleNotification(message) {
        // Create a desktop-style notification overlay
        const notificationEl = document.createElement('div');
        notificationEl.className = 'desktop-notification';
        notificationEl.innerHTML = `
            <div class="notification-content">
                <div class="notification-header">
                    <span class="notification-icon">🍅</span>
                    <span class="notification-title">Pomodoro Timer</span>
                    <button class="notification-close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
                </div>
                <div class="notification-body">${message}</div>
            </div>
        `;
        
        document.body.appendChild(notificationEl);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (notificationEl.parentNode) {
                notificationEl.remove();
            }
        }, 10000);
        
        // Add click to focus and close
        notificationEl.addEventListener('click', () => {
            window.focus();
            notificationEl.remove();
        });
    }

    showFlashMessage(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed';
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
    
    sendTimerEvent(action) {
        fetch(`/api/timer/${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: this.currentSession,
                duration: Math.floor(this.totalTime / 60)
            })
        }).catch(error => {
            console.log('Error sending timer event:', error);
        });
    }
    
    saveSettings() {
        this.settings.workDuration = parseInt(document.getElementById('workDuration').value);
        this.settings.deepWorkDuration = parseInt(document.getElementById('deepWorkDuration').value);
        this.settings.shortBreakDuration = parseInt(document.getElementById('shortBreakDuration').value);
        this.settings.longBreakDuration = parseInt(document.getElementById('longBreakDuration').value);
        this.settings.autoStartBreaks = document.getElementById('autoStartBreaks').checked;
        this.settings.soundNotifications = document.getElementById('soundNotifications').checked;
        this.settings.notificationVolume = parseInt(document.getElementById('notificationVolume').value);
        
        // Handle sound selection from radio buttons
        const selectedSoundRadio = document.querySelector('input[name="notificationSound"]:checked');
        if (selectedSoundRadio) {
            this.settings.notificationSound = selectedSoundRadio.value;
            
            // Handle custom sound selection
            if (selectedSoundRadio.value === 'custom') {
                this.settings.customSoundName = selectedSoundRadio.dataset.customSound;
            } else {
                this.settings.customSoundName = null;
            }
        }
        
        document.querySelector('[data-type="work_25"]').dataset.duration = this.settings.workDuration;
        document.querySelector('[data-type="work_50"]').dataset.duration = this.settings.deepWorkDuration;
        document.querySelector('[data-type="short_break"]').dataset.duration = this.settings.shortBreakDuration;
        document.querySelector('[data-type="long_break"]').dataset.duration = this.settings.longBreakDuration;
        
        document.querySelector('[data-type="work_25"] .setting-time').textContent = `${this.settings.workDuration} min`;
        document.querySelector('[data-type="work_50"] .setting-time').textContent = `${this.settings.deepWorkDuration} min`;
        document.querySelector('[data-type="short_break"] .setting-time').textContent = `${this.settings.shortBreakDuration} min`;
        document.querySelector('[data-type="long_break"] .setting-time').textContent = `${this.settings.longBreakDuration} min`;
        
        if (!this.isRunning) {
            const activeItem = document.querySelector('.setting-item.active');
            const duration = parseInt(activeItem.dataset.duration);
            this.setTimer(duration);
        }
        
        localStorage.setItem('pomodoroSettings', JSON.stringify(this.settings));
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('settingsModal'));
        modal.hide();
        
        this.showFlashMessage('Settings saved successfully! ⚙️');
    }
    
    loadSettings() {
        const saved = localStorage.getItem('pomodoroSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
        
        document.addEventListener('DOMContentLoaded', () => {
            document.getElementById('workDuration').value = this.settings.workDuration;
            document.getElementById('deepWorkDuration').value = this.settings.deepWorkDuration;
            document.getElementById('shortBreakDuration').value = this.settings.shortBreakDuration;
            document.getElementById('longBreakDuration').value = this.settings.longBreakDuration;
            document.getElementById('autoStartBreaks').checked = this.settings.autoStartBreaks;
            document.getElementById('soundNotifications').checked = this.settings.soundNotifications;
            document.getElementById('notificationVolume').value = this.settings.notificationVolume;
            document.getElementById('volumeDisplay').textContent = this.settings.notificationVolume;
            
            // Handle notification sound selection with radio buttons
            setTimeout(() => {
                // Update custom sounds UI first
                this.updateCustomSoundsUI();
                
                // Set the selected sound
                if (this.settings.notificationSound === 'custom' && this.settings.customSoundName) {
                    // Find and select the custom sound radio button
                    const customRadio = document.querySelector(`input[name="notificationSound"][data-custom-sound="${this.settings.customSoundName}"]`);
                    if (customRadio) {
                        customRadio.checked = true;
                    } else {
                        // If custom sound not found, fallback to default
                        this.settings.notificationSound = 'chord';
                        this.settings.customSoundName = null;
                        document.getElementById('sound-chord').checked = true;
                    }
                } else {
                    // Select built-in sound
                    const builtinRadio = document.getElementById(`sound-${this.settings.notificationSound}`);
                    if (builtinRadio) {
                        builtinRadio.checked = true;
                    } else {
                        // Fallback to default
                        document.getElementById('sound-chord').checked = true;
                    }
                }
            }, 100); // Small delay to ensure custom sounds are loaded
            
            // Add volume slider event listener
            document.getElementById('notificationVolume').addEventListener('input', (e) => {
                document.getElementById('volumeDisplay').textContent = e.target.value;
            });
        });
    }
    
    // Custom Sound Handling Methods
    async loadCustomSounds() {
        try {
            const customSounds = localStorage.getItem('pomodoroCustomSounds');
            if (customSounds) {
                const soundData = JSON.parse(customSounds);
                for (const [name, base64Data] of Object.entries(soundData)) {
                    const audioBlob = this.base64ToBlob(base64Data, 'audio');
                    const audioUrl = URL.createObjectURL(audioBlob);
                    this.customSounds.set(name, audioUrl);
                }
                this.updateCustomSoundDropdown();
            }
        } catch (error) {
            console.error('Error loading custom sounds:', error);
        }
    }
    
    async saveCustomSound(file) {
        try {
            // Validate file type
            if (!file.type.startsWith('audio/')) {
                throw new Error('Please select an audio file');
            }
            
            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                throw new Error('File size must be less than 5MB');
            }
            
            // Convert to base64
            const base64Data = await this.fileToBase64(file);
            
            // Create unique name
            const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
            const timestamp = Date.now();
            const customSoundName = `${fileName}_${timestamp}`;
            
            // Store in localStorage
            const existingCustomSounds = localStorage.getItem('pomodoroCustomSounds');
            const customSounds = existingCustomSounds ? JSON.parse(existingCustomSounds) : {};
            customSounds[customSoundName] = base64Data;
            localStorage.setItem('pomodoroCustomSounds', JSON.stringify(customSounds));
            
            // Create audio URL for playback
            const audioBlob = this.base64ToBlob(base64Data, file.type);
            const audioUrl = URL.createObjectURL(audioBlob);
            this.customSounds.set(customSoundName, audioUrl);
            
            // Update UI and select the new sound
            this.updateCustomSoundsUI();
            this.settings.notificationSound = 'custom';
            this.settings.customSoundName = customSoundName;
            
            // Select the new custom sound radio button
            setTimeout(() => {
                const newCustomRadio = document.getElementById(`sound-custom-${customSoundName}`);
                if (newCustomRadio) {
                    newCustomRadio.checked = true;
                }
            }, 100);
            
            this.showUploadSuccess(fileName);
            
            return customSoundName;
        } catch (error) {
            this.showUploadError(error.message);
            throw error;
        }
    }
    
    removeCustomSound(soundName) {
        try {
            // Remove from memory
            if (this.customSounds.has(soundName)) {
                URL.revokeObjectURL(this.customSounds.get(soundName));
                this.customSounds.delete(soundName);
            }
            
            // Remove from localStorage
            const existingCustomSounds = localStorage.getItem('pomodoroCustomSounds');
            if (existingCustomSounds) {
                const customSounds = JSON.parse(existingCustomSounds);
                delete customSounds[soundName];
                localStorage.setItem('pomodoroCustomSounds', JSON.stringify(customSounds));
            }
            
            // Update UI
            this.updateCustomSoundsUI();
            
            // Reset to default if this was the selected sound
            if (this.settings.customSoundName === soundName) {
                this.settings.notificationSound = 'chord';
                this.settings.customSoundName = null;
                const chordRadio = document.getElementById('sound-chord');
                if (chordRadio) {
                    chordRadio.checked = true;
                }
            }
            
            this.showFlashMessage('Custom sound removed successfully! 🗑️');
        } catch (error) {
            console.error('Error removing custom sound:', error);
            this.showUploadError('Failed to remove custom sound');
        }
    }
    
    updateCustomSoundsUI() {
        const customSoundsGrid = document.getElementById('customSoundsGrid');
        const customSoundsEmpty = document.getElementById('customSoundsEmpty');
        
        if (!customSoundsGrid || !customSoundsEmpty) return;
        
        // Clear existing custom sound options
        customSoundsGrid.innerHTML = '';
        
        if (this.customSounds.size === 0) {
            customSoundsEmpty.style.display = 'block';
            return;
        }
        
        customSoundsEmpty.style.display = 'none';
        
        // Add custom sound cards
        for (const soundName of this.customSounds.keys()) {
            const soundCard = document.createElement('div');
            soundCard.className = 'col-6 col-md-4';
            
            const displayName = soundName.replace(/_\d+$/, ''); // Remove timestamp
            const truncatedName = displayName.length > 12 ? displayName.substring(0, 12) + '...' : displayName;
            
            soundCard.innerHTML = `
                <div class="sound-option custom-sound-card" data-sound="custom" data-type="custom">
                    <input type="radio" name="notificationSound" id="sound-custom-${soundName}" value="custom" data-custom-sound="${soundName}" class="sound-radio">
                    <label for="sound-custom-${soundName}" class="sound-label">
                        <i class="fas fa-music"></i>
                        <span>${truncatedName}</span>
                        <small>Custom</small>
                    </label>
                    <button type="button" class="sound-test-btn" onclick="timer.playCustomSound('${soundName}')" title="Test sound">
                        <i class="fas fa-play"></i>
                    </button>
                    <button type="button" class="custom-sound-delete" onclick="timer.removeCustomSound('${soundName}')" title="Delete sound">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </div>
            `;
            
            customSoundsGrid.appendChild(soundCard);
        }
    }
    
    playCustomSound(soundName) {
        try {
            if (this.customSounds.has(soundName)) {
                const audioUrl = this.customSounds.get(soundName);
                const audio = new Audio(audioUrl);
                const volume = (this.settings.notificationVolume || 50) / 100;
                audio.volume = volume;
                audio.play().catch(error => {
                    console.error('Error playing custom sound:', error);
                });
            }
        } catch (error) {
            console.error('Error playing custom sound:', error);
        }
    }
    
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }
    
    base64ToBlob(base64Data, mimeType) {
        const byteCharacters = atob(base64Data.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    }
    
    showUploadSuccess(fileName) {
        const messageEl = document.getElementById('uploadMessage');
        messageEl.className = 'alert alert-success';
        messageEl.innerHTML = `<i class="fas fa-check-circle"></i> Custom sound "${fileName}" uploaded successfully!`;
        messageEl.style.display = 'block';
        
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 5000);
    }
    
    showUploadError(message) {
        const messageEl = document.getElementById('uploadMessage');
        messageEl.className = 'alert alert-danger';
        messageEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        messageEl.style.display = 'block';
        
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 5000);
    }
    
    // Fullscreen Focus Mode Methods
    enterFullscreenFocusMode() {
        if (!this.isRunning) return;
        
        this.isFullscreenMode = true;
        
        // Request fullscreen
        const element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
        
        // Add fullscreen class to body
        document.body.classList.add('fullscreen-focus-mode');
        
        // Hide unnecessary elements
        this.hideNonEssentialElements();
        
        // Add exit fullscreen button
        this.showExitFullscreenButton();
        
        // Listen for fullscreen changes
        document.addEventListener('fullscreenchange', this.handleFullscreenChange.bind(this));
        document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange.bind(this));
        document.addEventListener('msfullscreenchange', this.handleFullscreenChange.bind(this));
    }
    
    exitFullscreenFocusMode() {
        this.isFullscreenMode = false;
        
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        
        // Remove fullscreen class
        document.body.classList.remove('fullscreen-focus-mode');
        
        // Show all elements
        this.showNonEssentialElements();
        
        // Remove exit button
        this.removeExitFullscreenButton();
    }
    
    handleFullscreenChange() {
        const isCurrentlyFullscreen = !!(document.fullscreenElement || 
                                        document.webkitFullscreenElement || 
                                        document.msFullscreenElement);
        
        if (!isCurrentlyFullscreen && this.isFullscreenMode) {
            // User exited fullscreen manually (ESC key)
            this.exitFullscreenFocusMode();
        }
    }
    
    hideNonEssentialElements() {
        // Hide navbar
        const navbar = document.querySelector('.navbar');
        if (navbar) navbar.style.display = 'none';
        
        // Hide timer header (title and subtitle)
        const timerHeader = document.querySelector('.timer-header');
        if (timerHeader) timerHeader.style.display = 'none';
        
        // Hide session settings
        const sessionSettings = document.querySelector('.session-settings');
        if (sessionSettings) sessionSettings.style.display = 'none';
        
        // Hide session counter
        const sessionCounter = document.querySelector('.session-counter');
        if (sessionCounter) sessionCounter.style.display = 'none';
        
        // Hide settings button
        const settingsBtn = document.querySelector('.settings-btn');
        if (settingsBtn) settingsBtn.style.display = 'none';
        
        // Hide container margins/padding for full utilization
        const pomodoroContainer = document.querySelector('.pomodoro-container');
        if (pomodoroContainer) {
            pomodoroContainer.style.height = '100vh';
            pomodoroContainer.style.display = 'flex';
            pomodoroContainer.style.alignItems = 'center';
            pomodoroContainer.style.justifyContent = 'center';
        }
        
        // Center the timer card
        const timerCard = document.querySelector('.timer-card');
        if (timerCard) {
            timerCard.style.background = 'transparent';
            timerCard.style.border = 'none';
            timerCard.style.boxShadow = 'none';
        }
    }
    
    showNonEssentialElements() {
        // Show navbar
        const navbar = document.querySelector('.navbar');
        if (navbar) navbar.style.display = '';
        
        // Show timer header
        const timerHeader = document.querySelector('.timer-header');
        if (timerHeader) timerHeader.style.display = '';
        
        // Show session settings
        const sessionSettings = document.querySelector('.session-settings');
        if (sessionSettings) sessionSettings.style.display = '';
        
        // Show session counter
        const sessionCounter = document.querySelector('.session-counter');
        if (sessionCounter) sessionCounter.style.display = '';
        
        // Show settings button
        const settingsBtn = document.querySelector('.settings-btn');
        if (settingsBtn) settingsBtn.style.display = '';
        
        // Reset container styles
        const pomodoroContainer = document.querySelector('.pomodoro-container');
        if (pomodoroContainer) {
            pomodoroContainer.style.height = '';
            pomodoroContainer.style.display = '';
            pomodoroContainer.style.alignItems = '';
            pomodoroContainer.style.justifyContent = '';
        }
        
        // Reset timer card styles
        const timerCard = document.querySelector('.timer-card');
        if (timerCard) {
            timerCard.style.background = '';
            timerCard.style.border = '';
            timerCard.style.boxShadow = '';
        }
    }
    
    showExitFullscreenButton() {
        const exitBtn = document.createElement('button');
        exitBtn.id = 'exitFullscreenBtn';
        exitBtn.className = 'exit-fullscreen-btn';
        exitBtn.innerHTML = '<i class="fas fa-times"></i> Exit Focus Mode (ESC)';
        exitBtn.onclick = () => this.exitFullscreenFocusMode();
        
        document.body.appendChild(exitBtn);
    }
    
    removeExitFullscreenButton() {
        const exitBtn = document.getElementById('exitFullscreenBtn');
        if (exitBtn) {
            exitBtn.remove();
        }
    }
    
    showFullscreenButton() {
        // Add fullscreen button to timer controls if not already present
        const timerControls = document.querySelector('.timer-controls');
        let fullscreenBtn = document.getElementById('fullscreenBtn');
        
        if (!fullscreenBtn && timerControls) {
            fullscreenBtn = document.createElement('button');
            fullscreenBtn.id = 'fullscreenBtn';
            fullscreenBtn.className = 'btn btn-outline-info btn-lg';
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i> Focus Mode (F11)';
            fullscreenBtn.onclick = () => this.enterFullscreenFocusMode();
            fullscreenBtn.style.marginLeft = '10px';
            
            timerControls.appendChild(fullscreenBtn);
        }
    }
    
    hideFullscreenButton() {
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            fullscreenBtn.remove();
        }
    }
}

let timer;

function startTimer() {
    timer.startTimer();
}

function pauseTimer() {
    timer.pauseTimer();
}

function resetTimer() {
    timer.resetTimer();
}

function saveSettings() {
    timer.saveSettings();
}

function testNotificationSound() {
    // Check if sound notifications are enabled
    if (!timer.settings.soundNotifications) {
        timer.showFlashMessage('⚠️ Sound notifications are disabled. Enable them first!');
        return;
    }
    
    // Get the currently selected sound from radio buttons
    const selectedSoundRadio = document.querySelector('input[name="notificationSound"]:checked');
    const selectedVolume = parseInt(document.getElementById('notificationVolume').value);
    
    if (!selectedSoundRadio) {
        timer.showFlashMessage('⚠️ No sound selected!');
        return;
    }
    
    const selectedSound = selectedSoundRadio.value;
    
    // Handle custom sound testing
    if (selectedSound === 'custom') {
        const customSoundName = selectedSoundRadio.dataset.customSound;
        
        if (customSoundName && timer.customSounds.has(customSoundName)) {
            // Temporarily store current settings
            const originalSound = timer.settings.notificationSound;
            const originalCustomName = timer.settings.customSoundName;
            const originalVolume = timer.settings.notificationVolume;
            
            // Use selected values for testing
            timer.settings.notificationSound = 'custom';
            timer.settings.customSoundName = customSoundName;
            timer.settings.notificationVolume = selectedVolume;
            
            // Play the test sound
            timer.playNotificationSound();
            
            // Restore original settings
            timer.settings.notificationSound = originalSound;
            timer.settings.customSoundName = originalCustomName;
            timer.settings.notificationVolume = originalVolume;
            
            timer.showFlashMessage(`🔊 Testing custom sound "${customSoundName.replace(/_\d+$/, '')}" at ${selectedVolume}% volume!`);
        } else {
            timer.showFlashMessage('⚠️ Custom sound not found!');
        }
        return;
    }
    
    // Temporarily store current settings
    const originalSound = timer.settings.notificationSound;
    const originalVolume = timer.settings.notificationVolume;
    
    // Use selected values for testing
    timer.settings.notificationSound = selectedSound;
    timer.settings.notificationVolume = selectedVolume;
    
    // Play the test sound
    timer.playNotificationSound();
    
    // Restore original settings (don't save the test values)
    timer.settings.notificationSound = originalSound;
    timer.settings.notificationVolume = originalVolume;
    
    timer.showFlashMessage(`🔊 Testing "${selectedSound}" sound at ${selectedVolume}% volume!`);
}

document.addEventListener('DOMContentLoaded', function() {
    timer = new PomodoroTimer();
    
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space' && !event.target.matches('input, textarea')) {
            event.preventDefault();
            if (timer.isRunning) {
                timer.pauseTimer();
            } else {
                timer.startTimer();
            }
        } else if (event.code === 'KeyR' && event.ctrlKey) {
            event.preventDefault();
            timer.resetTimer();
        } else if (event.code === 'F11') {
            event.preventDefault();
            if (timer.isRunning) {
                if (timer.isFullscreenMode) {
                    timer.exitFullscreenFocusMode();
                } else {
                    timer.enterFullscreenFocusMode();
                }
            }
        } else if (event.code === 'Escape' && timer.isFullscreenMode) {
            event.preventDefault();
            timer.exitFullscreenFocusMode();
        }
    });
    
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && timer.isRunning) {
            console.log('Timer running in background');
        } else if (!document.hidden && timer.isRunning) {
            console.log('Timer synced on page focus');
        }
    });
    
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(function(alert) {
        setTimeout(function() {
            if (alert.parentNode) {
                alert.style.transition = 'opacity 0.5s';
                alert.style.opacity = '0';
                setTimeout(function() {
                    if (alert.parentNode) {
                        alert.remove();
                    }
                }, 500);
            }
        }, 5000);
    });
    
    // Custom sound file upload handling
    const customSoundInput = document.getElementById('customSoundFile');
    if (customSoundInput) {
        customSoundInput.addEventListener('change', async function(event) {
            const file = event.target.files[0];
            if (file) {
                try {
                    await timer.saveCustomSound(file);
                    // Clear the input for future uploads
                    event.target.value = '';
                } catch (error) {
                    console.error('Error uploading custom sound:', error);
                }
            }
        });
    }
});
