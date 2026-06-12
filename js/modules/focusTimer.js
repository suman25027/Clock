/**
 * Focus Timer Module - Pomodoro-style timer with visual progress
 * Designed for ADHD-friendly time blindness support
 */

const FocusTimer = {
  duration: 25 * 60, // seconds
  remaining: 25 * 60,
  interval: null,
  isRunning: false,
  currentMode: 'focus',

  display: null,
  progressRing: null,
  startBtn: null,
  pauseBtn: null,
  resetBtn: null,
  sessionBtns: null,
  totalTodaySpan: null,
  sessionsCompletedSpan: null,

  init() {
    this.display = document.getElementById('focusTimerDisplay');
    this.progressRing = document.getElementById('focusProgressRing');
    this.startBtn = document.getElementById('focusStartBtn');
    this.pauseBtn = document.getElementById('focusPauseBtn');
    this.resetBtn = document.getElementById('focusResetBtn');
    this.sessionBtns = document.querySelectorAll('.session-btn');
    this.manualTimerMinutesInput = document.getElementById('manualTimerMinutesInput');
    this.manualTimerSecondsInput = document.getElementById('manualTimerSecondsInput');
    this.manualTimerBtn = document.getElementById('setManualTimerBtn');
    this.totalTodaySpan = document.getElementById('focusTotalToday');
    this.sessionsCompletedSpan = document.getElementById('sessionsCompleted');

    if (!this.startBtn) return; // Not on timer page

    this.startBtn.addEventListener('click', () => this.start());
    this.pauseBtn.addEventListener('click', () => this.pause());
    this.resetBtn.addEventListener('click', () => this.reset());

    this.toastElem = document.getElementById('focusToast');

    this.sessionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mins = parseInt(btn.getAttribute('data-session'));
        this.setDuration(mins * 60);
        this.sessionBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentMode = mins === 5 ? 'break' : 'focus';
        const badge = document.getElementById('focusModeBadge');
        if (badge) badge.textContent = this.currentMode === 'focus' ? '🎯 Focus' : '☕ Break';
        this.reset();
      });
    });

    if (this.manualTimerBtn) {
      this.manualTimerBtn.addEventListener('click', () => this.applyManualTimer());
    }

    if (this.manualTimerMinutesInput) {
      this.manualTimerMinutesInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.applyManualTimer();
      });
    }
    if (this.manualTimerSecondsInput) {
      this.manualTimerSecondsInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.applyManualTimer();
      });
    }

    this.updateDisplay();
    this.updateStats();
  },

  setDuration(seconds) {
    this.duration = seconds;
    this.remaining = seconds;
    this.updateDisplay();
  },

  applyManualTimer() {
    if (!this.manualTimerMinutesInput || !this.manualTimerSecondsInput) return;

    const minutes = parseInt(this.manualTimerMinutesInput.value, 10);
    const seconds = parseInt(this.manualTimerSecondsInput.value, 10);
    const validMinutes = Number.isFinite(minutes) && minutes >= 0;
    const validSeconds = Number.isFinite(seconds) && seconds >= 0 && seconds < 60;
    const totalSeconds = (validMinutes ? minutes : 0) * 60 + (validSeconds ? seconds : 0);

    if (totalSeconds <= 0) {
      alert('Enter valid minutes and/or seconds for a custom timer.');
      return;
    }

    this.setDuration(totalSeconds);
    this.sessionBtns.forEach(b => b.classList.remove('active'));
    this.currentMode = 'focus';
    const badge = document.getElementById('focusModeBadge');
    if (badge) badge.textContent = '🎯 Focus';
    this.reset();
    this.manualTimerMinutesInput.value = '';
    this.manualTimerSecondsInput.value = '';
  },

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    if (this.display) this.display.classList.add('running');
    const ringContainer = this.progressRing?.closest('.focus-progress-ring');
    if (ringContainer) ringContainer.classList.add('running');
    this.interval = setInterval(() => this.tick(), 1000);
  },

  pause() {
    this.isRunning = false;
    if (this.interval) clearInterval(this.interval);
    if (this.display) this.display.classList.remove('running');
    const ringContainer = this.progressRing?.closest('.focus-progress-ring');
    if (ringContainer) ringContainer.classList.remove('running');
  },

  reset() {
    this.pause();
    this.remaining = this.duration;
    this.updateDisplay();
    this.updateProgressRing(1);
  },

  tick() {
    if (this.remaining <= 0) {
      this.complete();
      return;
    }
    this.remaining--;
    this.updateDisplay();
    const progress = this.remaining / this.duration;
    this.updateProgressRing(progress);
  },

  complete() {
    this.pause();
    const minutesCompleted = this.duration / 60;
    if (this.currentMode === 'focus') {
      AppState.saveFocusSession({
        duration: minutesCompleted,
        timestamp: Date.now()
      });
      this.updateStats();
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🎉 Focus session complete!', {
          body: 'Take a break!'
        });
      }
    }
    const message = `${this.currentMode === 'focus' ? '🎯 Focus' : '☕ Break'} session complete!`;
    this.showToast(message);
    this.reset();
  },

  updateDisplay() {
    if (!this.display) return;
    const mins = Math.floor(this.remaining / 60);
    const secs = this.remaining % 60;
    this.display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },

  showToast(message) {
    if (!this.toastElem) return;
    this.toastElem.textContent = message;
    this.toastElem.classList.remove('hidden');
    this.toastElem.classList.add('visible');
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      if (this.toastElem) {
        this.toastElem.classList.remove('visible');
        this.toastElem.classList.add('hidden');
      }
    }, 4000);
  },

  updateProgressRing(percent) {
    if (!this.progressRing) return;
    const ring = this.progressRing.querySelector('circle:last-of-type');
    if (ring) {
      const circumference = 565.48;
      const offset = circumference * (1 - percent);
      ring.style.strokeDashoffset = offset;
    }
  },

  updateStats() {
    if (!this.totalTodaySpan || !this.sessionsCompletedSpan) return;

    const today = new Date().toDateString();
    const todayTotal = AppState.focusSessions
      .filter(s => new Date(s.timestamp).toDateString() === today)
      .reduce((sum, s) => sum + s.duration, 0);

    this.totalTodaySpan.textContent = `${Math.round(todayTotal)} min`;
    this.sessionsCompletedSpan.textContent = AppState.focusSessions.length;

    // Update dashboard
    const todayFocusElem = document.getElementById('todayFocus');
    if (todayFocusElem) {
      const hours = Math.floor(todayTotal / 60);
      const mins = Math.round(todayTotal % 60);
      todayFocusElem.textContent = `${hours}h ${mins}m`;
    }
  }
};
