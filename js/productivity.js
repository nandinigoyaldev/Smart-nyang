/* ==========================================================================
   SmartNyang — Productivity & Wellness Suite
   ========================================================================== */

class ProductivityEngine {
  constructor() {
    this.timerInterval = null;
    this.timeLeft = 25 * 60; // 25 minutes default
    this.isRunning = false;
    this.mode = 'work'; // 'work', 'break'
    
    this.stretchTimer = null;
    this.waterTimer = null;
  }

  init() {
    this.startReminders();
    this.loadStickyNotes();
  }

  toggleTimer(onTick, onComplete) {
    if (this.isRunning) {
      this.pauseTimer();
    } else {
      this.startTimer(onTick, onComplete);
    }
    return this.isRunning;
  }

  startTimer(onTick, onComplete) {
    this.isRunning = true;
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (onTick) onTick(this.formatTime(this.timeLeft));

      if (this.timeLeft <= 0) {
        this.pauseTimer();
        if (this.mode === 'work') {
          this.mode = 'break';
          this.timeLeft = 5 * 60; // 5 min break
        } else {
          this.mode = 'work';
          this.timeLeft = 25 * 60;
        }
        if (onComplete) onComplete(this.mode);
      }
    }, 1000);
  }

  pauseTimer() {
    this.isRunning = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  resetTimer() {
    this.pauseTimer();
    this.mode = 'work';
    this.timeLeft = 25 * 60;
    return this.formatTime(this.timeLeft);
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  startReminders() {
    // 30 minute stretch nudge check loop
    setInterval(() => {
      const chkStretch = document.getElementById('chk-stretch');
      if (chkStretch && chkStretch.checked) {
        if (window.showCatSpeech) {
          window.showCatSpeech("🧘 Stretch Time! Roll your shoulders back and take a 1-minute break! 🐾", 8000);
          catAudio.playChime();
        }
      }
    }, 30 * 60 * 1000);

    // 45 minute hydration check loop
    setInterval(() => {
      const chkWater = document.getElementById('chk-water');
      if (chkWater && chkWater.checked) {
        if (window.showCatSpeech) {
          window.showCatSpeech("💧 Hydration Nudge! Drink a glass of fresh water to fuel your brain! 😸", 8000);
          catAudio.playMeow(1.2);
        }
      }
    }, 45 * 60 * 1000);
  }

  loadStickyNotes() {
    const textarea = document.getElementById('sticky-note-input');
    if (textarea) {
      textarea.value = localStorage.getItem('nyang_sticky_note') || '';
      textarea.addEventListener('input', (e) => {
        localStorage.setItem('nyang_sticky_note', e.target.value);
      });
    }
  }
}

// Global productivity engine instance
const productivity = new ProductivityEngine();
