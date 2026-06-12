/**
 * Smart Alarm Module - Calendar + Traffic + Weather Aware
 * Intelligently suggests wake-up times based on calendar, traffic, and weather
 */

const SmartAlarm = {
  baseAlarmInput: null,
  trafficSlider: null,
  trafficValue: null,
  calculateBtn: null,
  setBtn: null,
  recommendedSpan: null,
  alarmReason: null,
  alarmTimeDisplay: null,
  lastRecommended: null,

  init() {
    this.baseAlarmInput = document.getElementById('baseAlarmTime');
    this.trafficSlider = document.getElementById('trafficSlider');
    this.trafficValue = document.getElementById('trafficValue');
    this.calculateBtn = document.getElementById('calculateSmartAlarmBtn');
    this.setBtn = document.getElementById('setSmartAlarmBtn');
    this.recommendedSpan = document.getElementById('recommendedTime');
    this.alarmReason = document.getElementById('alarmReason');
    this.alarmTimeDisplay = document.getElementById('alarmTimeDisplay');

    if (!this.calculateBtn) return; // Not on alarm page

    this.calculateBtn.addEventListener('click', () => this.calculate());
    this.setBtn.addEventListener('click', () => this.setAlarm());
    this.trafficSlider.addEventListener('input', (e) => {
      this.trafficValue.textContent = `+${e.target.value} min extra travel`;
      this.calculate();
    });
    this.baseAlarmInput.addEventListener('change', () => this.calculate());

    // Listen to calendar checkboxes
    document.querySelectorAll('[data-event]').forEach(cb => {
      cb.addEventListener('change', () => this.calculate());
    });

    this.calculate();
  },

  getEarliestMeetingTime() {
    let earliest = 24 * 60; // late default
    document.querySelectorAll('[data-event]:checked').forEach(cb => {
      const event = cb.getAttribute('data-event');
      if (event === 'meeting') earliest = Math.min(earliest, 9 * 60); // 9:00 AM
      if (event === 'gym') earliest = Math.min(earliest, 8 * 60); // 8:00 AM
    });
    return earliest === 24 * 60 ? null : earliest;
  },

  calculate() {
    if (!this.baseAlarmInput) return;

    const baseTime = this.baseAlarmInput.value;
    const [baseHour, baseMinute] = baseTime.split(':').map(Number);
    let baseMinutes = baseHour * 60 + baseMinute;

    const meetingTime = this.getEarliestMeetingTime();
    let commuteMinutes = 30; // default commute
    const trafficExtra = parseInt(this.trafficSlider.value) || 0;
    const totalCommute = commuteMinutes + trafficExtra;

    let recommendedMinutes = baseMinutes;
    let reason = '';

    if (meetingTime !== null) {
      const requiredWake = meetingTime - totalCommute;
      if (requiredWake < baseMinutes) {
        recommendedMinutes = requiredWake;
        reason = `Meeting at ${Math.floor(meetingTime / 60)}:${(meetingTime % 60).toString().padStart(2, '0')} requires ${totalCommute} min travel.`;
      } else {
        reason = `Meeting later than usual, keeping your preferred time.`;
      }
    } else {
      reason = `No calendar conflicts. Alarm set as requested.`;
    }

    // Add weather-based adjustment
    if (typeof Weather !== 'undefined' && Weather.currentForecast) {
      const weatherAlert = Weather.getWeatherAlert(Weather.currentForecast);
      if (weatherAlert && weatherAlert.severity === 'danger') {
        // Add 15 minutes for severe weather
        recommendedMinutes = Math.max(recommendedMinutes - 15, 4 * 60);
        reason += ` ⚠️ Severe weather tomorrow - adding 15 min buffer.`;
      }
    }

    // Never wake before 4 AM sanity
    if (recommendedMinutes < 4 * 60) recommendedMinutes = 4 * 60;

    const recHour = Math.floor(recommendedMinutes / 60);
    const recMin = recommendedMinutes % 60;
    const ampm = recHour >= 12 ? 'PM' : 'AM';
    const displayHour = recHour % 12 || 12;
    const recTimeStr = `${displayHour}:${recMin.toString().padStart(2, '0')} ${ampm}`;

    this.recommendedSpan.textContent = recTimeStr;
    this.alarmReason.textContent = reason;
    this.alarmTimeDisplay.textContent = recTimeStr;

    this.lastRecommended = { hour: recHour, minute: recMin };
  },

  setAlarm() {
    if (this.lastRecommended) {
      const timeStr = `${this.lastRecommended.hour.toString().padStart(2, '0')}:${this.lastRecommended.minute.toString().padStart(2, '0')}`;
      AppState.smartAlarm = { time: timeStr, enabled: true };
      Storage.set('smartAlarm', AppState.smartAlarm);
      alert(`✅ Alarm set for ${this.recommendedSpan.textContent}. Wake up intentionally!`);
      this.updateDashboardPreview();
    }
  },

  updateDashboardPreview() {
    const alarmPreview = document.getElementById('nextAlarmPreview');
    if (alarmPreview && AppState.smartAlarm?.time) {
      alarmPreview.textContent = AppState.smartAlarm.time;
    }
  }
};
