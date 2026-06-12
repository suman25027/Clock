/**
 * Storage Module - Production-grade persistence with namespacing
 * Handles localStorage operations with proper error handling
 */

const Storage = {
  set(key, value) {
    try {
      localStorage.setItem(`timeos_${key}`, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage.set error:', e);
      return false;
    }
  },

  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(`timeos_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('Storage.get error:', e);
      return defaultValue;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(`timeos_${key}`);
      return true;
    } catch (e) {
      console.error('Storage.remove error:', e);
      return false;
    }
  },

  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('timeos_')) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (e) {
      console.error('Storage.clear error:', e);
      return false;
    }
  }
};

/**
 * Global Application State
 * Centralized state management with persistence
 */
const AppState = {
  focusSessions: Storage.get('focusSessions', []),
  purchases: Storage.get('purchases', []),
  smartAlarm: Storage.get('smartAlarm', { time: '07:30', enabled: false }),
  hourlyRate: Storage.get('hourlyRate', 35),

  saveFocusSession(session) {
    this.focusSessions.push(session);
    Storage.set('focusSessions', this.focusSessions);
  },

  addPurchase(item) {
    this.purchases.unshift(item);
    if (this.purchases.length > 20) this.purchases.pop();
    Storage.set('purchases', this.purchases);
  },

  resetAll() {
    this.focusSessions = [];
    this.purchases = [];
    this.smartAlarm = { time: '07:30', enabled: false };
    Storage.set('focusSessions', []);
    Storage.set('purchases', []);
    Storage.set('smartAlarm', this.smartAlarm);
  }
};
