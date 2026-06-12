# ⏰ TimeOS

> **Intelligent Time Intelligence Platform**  
> Stop wasting time. Start living intentionally.

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Production-green.svg)]()
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-brightgreen.svg)]()

---

## 🎯 Overview

**TimeOS** is a production-grade, intelligent time management and productivity platform that combines smart alarms, focus tracking, time cost analysis, and weather integration into a unified dashboard. Built with vanilla JavaScript and modern CSS, it requires zero build tools while maintaining enterprise-level architecture.

### Core Philosophy
Time is your most valuable resource. TimeOS helps you:
- 📊 **Visualize** how you spend your time
- 🎯 **Optimize** focus sessions with distraction-free timers
- 💰 **Calculate** the real cost of time to boost intentionality
- ⏰ **Smart wake-up** with calendar, traffic, and weather awareness
- 📈 **Analyze** productivity patterns over time

---

## ✨ Key Features

| Feature | Description | Status |
|---------|-------------|--------|
| 📊 **Dashboard** | Real-time time tracking, focus stats, and productivity metrics | ✅ Production |
| ⏰ **Smart Alarm** | Calendar-aware, weather-aware, traffic-aware alarm optimization | ✅ Production |
| 🎯 **Focus Timer** | Pomodoro-style timer with session tracking and notifications | ✅ Production |
| 💰 **Time Cost Calculator** | Calculate hourly rate and track daily time spend value | ✅ Production |
| 🌤️ **Weather Integration** | Real-time weather via WeatherAPI.com with location awareness | ✅ Production |
| 📈 **Analytics** | Track well-spent time ratio, productivity trends, and insights | ✅ Production |
| 💾 **Local Storage** | Persistent data via browser localStorage—no backend needed | ✅ Production |
| 📱 **Responsive Design** | Mobile-first, works on desktop, tablet, and mobile | ✅ Production |
| 🔔 **Notifications** | Browser notifications for timers, alarms, and milestones | ✅ Production |

---

## 📋 Technical Specification

### Architecture

```
TimeOS (Vanilla JS, Zero Build Tools)
├── index.html                 # Entry point
├── css/
│   └── style.css              # Modern CSS Grid + Flexbox
├── js/
│   ├── config.js              # Central configuration & API keys
│   ├── app.js                 # Main orchestrator
│   ├── utils/
│   │   └── storage.js         # LocalStorage abstraction
│   └── modules/
│       ├── clock.js           # Time utilities
│       ├── weather.js         # WeatherAPI.com integration
│       ├── smartAlarm.js      # Intelligent alarm logic
│       ├── focusTimer.js      # Pomodoro & session tracking
│       ├── timeCost.js        # Time-value calculations
│       └── analytics.js       # Usage analytics
└── .github/
    └── workflows/
        └── deploy.yml         # GitHub Pages CI/CD
```

### Technology Stack

- **Frontend:** HTML5, CSS3 (Grid/Flexbox), Vanilla JavaScript (ES6+)
- **Storage:** Browser localStorage
- **APIs:** WeatherAPI.com (v1)
- **Deployment:** GitHub Pages + GitHub Actions
- **Build:** Zero build tools (static files only)

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 🚀 Deployment

### GitHub Pages Setup (Recommended)

This repository is pre-configured for GitHub Pages with automated API key injection.

#### 1. Configure Environment Secrets

Navigate to your repository:
```
Settings → Secrets and variables → Environments → Weather
```

Add the following secrets:
- **`WEATHER_API_KEY`** — Your WeatherAPI.com API key ([Get one free](https://www.weatherapi.com/))
- **`WEATHER_API_URL`** — Set to `https://api.weatherapi.com/v1`

#### 2. Enable GitHub Pages

```
Settings → Pages → Source
Select: Deploy from a branch
Branch: gh-pages
```

#### 3. Deploy

Simply push to `main`:
```bash
git push origin main
```

The GitHub Actions workflow automatically:
1. ✅ Validates that `WEATHER_API_KEY` exists
2. 🔒 Injects the key into `js/config.js` at build time
3. 📦 Uploads built files to `gh-pages` branch
4. 🌐 Publishes to GitHub Pages

Your site will be live at:
```
https://<username>.github.io/Clock
```

---

## 🛠️ Local Development

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/c25il027suman-oss/Clock.git
   cd Clock
   ```

2. **Set up local API key**
   
   Create a `.env` file (already in `.gitignore`):
   ```bash
   echo "WEATHER_API_KEY=your_weatherapi_key_here" > .env
   ```

3. **Inject the key locally**
   ```bash
   python3 << 'PY'
   import os
   from pathlib import Path
   
   env_key = os.getenv('WEATHER_API_KEY', '')
   if not env_key:
       # Read from .env file
       with open('.env') as f:
           env_key = f.read().strip().split('=')[1]
   
   config = Path('js/config.js').read_text()
   config = config.replace('__WEATHER_API_KEY__', env_key)
   Path('js/config.js').write_text(config)
   print('✅ API key injected')
   PY
   ```

4. **Start a local server**
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   
   # OR using Node (if you have http-server)
   npx http-server
   ```

5. **Open browser**
   ```
   http://localhost:8000
   ```

### Development Workflow

```bash
# Make changes to js/modules/*.js or css/style.css
# Changes are live-reload (just refresh browser)

# Test locally with API key:
# 1. Update .env with your key
# 2. Run injection script (see step 3 above)
# 3. Refresh browser

# Push to GitHub to deploy:
git add .
git commit -m "feature: add new timer feature"
git push origin main
```

---

## 📖 Module Documentation

### 1. Dashboard (`js/app.js`)

**Purpose:** Main orchestrator and navigation hub.

**Exports:**
- `setupNavigation()` — Initialize view switching

**Initializes:** All modules in order on page load

---

### 2. Weather Module (`js/modules/weather.js`)

**Purpose:** Real-time weather integration via WeatherAPI.com

**Key Methods:**
```javascript
Weather.init()                          // Initialize and load weather
Weather.setLocation(location)           // Set location and fetch weather
Weather.detectLocationByIP()            // Auto-detect location
Weather.fetchCurrentWeather(query)      // Fetch current conditions
Weather.fetchForecast(query, days=7)    // Fetch n-day forecast
Weather.searchCities(query)             // Search for city locations
Weather.getAstronomy(query, date)       // Get sunrise/sunset/moon data
```

**API Key Required:** `CONFIG.WEATHER_API_KEY` from WeatherAPI.com

---

### 3. Smart Alarm (`js/modules/smartAlarm.js`)

**Purpose:** Intelligent alarm optimization based on calendar, traffic, and weather

**Key Methods:**
```javascript
SmartAlarm.init()                    // Initialize smart alarm
SmartAlarm.setBaseTime(time)         // Set base alarm time
SmartAlarm.calculateAdjustment()     // Calculate optimal wake-up time
SmartAlarm.updateDashboardPreview()  // Update dashboard preview
SmartAlarm.triggerAlarm()            // Sound alarm with notification
```

**Features:**
- Calendar event integration
- Traffic delay estimation
- Weather-aware recommendations
- Customizable travel time

---

### 4. Focus Timer (`js/modules/focusTimer.js`)

**Purpose:** Pomodoro-style session tracking and distraction-free focus blocks

**Key Methods:**
```javascript
FocusTimer.init()                    // Initialize timer module
FocusTimer.startSession(duration)    // Start a focus session
FocusTimer.pauseSession()            // Pause current session
FocusTimer.resumeSession()           // Resume paused session
FocusTimer.endSession()              // End and log session
FocusTimer.updateStats()             // Update dashboard stats
```

**Session Tracking:**
- Per-session duration
- Daily focus time accumulation
- Session history (localStorage)
- Visual progress indicator

---

### 5. Time Cost (`js/modules/timeCost.js`)

**Purpose:** Calculate time value and boost intentional time usage

**Key Methods:**
```javascript
TimeCost.init()                      // Initialize module
TimeCost.setHourlyRate(rate)         // Set personal hourly rate
TimeCost.calculateSessionCost(mins)  // Calculate cost of time block
TimeCost.updateDashboardCost()       // Update cost display
```

**Philosophy:**
Quantifying time in monetary terms increases intentional usage.

---

### 6. Analytics (`js/modules/analytics.js`)

**Purpose:** Track productivity patterns and generate insights

**Key Methods:**
```javascript
Analytics.init()                     // Initialize analytics
Analytics.recordSession(duration)    // Log a completed session
Analytics.calculateWellSpentRatio()  // Calculate ratio of intentional time
Analytics.updateAnalytics()          // Render analytics view
Analytics.generateInsights()         // Generate user recommendations
```

**Metrics:**
- Focus time per day/week
- Well-spent time ratio
- Session length trends
- Productivity peak hours

---

### 7. Storage Utility (`js/utils/storage.js`)

**Purpose:** Abstraction layer for browser localStorage

**API:**
```javascript
Storage.get(key, defaultValue)       // Retrieve stored value
Storage.set(key, value)              // Store value
Storage.remove(key)                  // Delete key
Storage.clear()                      // Clear all app data
Storage.getJSON(key, default)        // Get JSON-parsed value
Storage.setJSON(key, obj)            // Store JSON-stringified value
```

---

### 8. Configuration (`js/config.js`)

**Purpose:** Centralized configuration and validation

**Environment Variables:**
```javascript
CONFIG.WEATHER_API_KEY    // Injected by GitHub Actions
CONFIG.WEATHER_API_BASE   // Base URL for WeatherAPI.com
CONFIG.APP_NAME           // 'TimeOS'
CONFIG.APP_VERSION        // Version string
```

**Note:** `WEATHER_API_KEY` is a placeholder (`__WEATHER_API_KEY__`) in the repository.  
It is replaced at deploy time by GitHub Actions using the `Weather` environment secret.

---

## 🔐 Security & Privacy

### API Key Handling

⚠️ **Important:** The API key is injected into client-side JavaScript, making it visible in the browser.

**Why this is OK:**
- WeatherAPI.com is a public API designed for frontend use
- API key can be restricted to specific domains in WeatherAPI dashboard
- No sensitive user data is handled

**Best Practice:**
Set API key restrictions in WeatherAPI.com dashboard:
```
API Key Settings → Allowed domains → add your domain
```

### Data Storage

- All data stored in browser localStorage
- No data sent to external servers (except weather API)
- Users have full control—can clear anytime
- No tracking or analytics collection

---

## 📊 Directory Structure

```
Clock/
├── README.md                          # This file
├── LICENSE                            # MIT License
├── index.html                         # Main entry point
├── style.css                          # Root styles (legacy)
├── script.js                          # Root scripts (legacy)
├── css/
│   └── style.css                      # Main stylesheet
├── js/
│   ├── config.js                      # Configuration & API keys
│   ├── app.js                         # Main app orchestrator
│   ├── modules/
│   │   ├── weather.js                 # Weather integration
│   │   ├── smartAlarm.js              # Smart alarm logic
│   │   ├── focusTimer.js              # Focus timer & sessions
│   │   ├── timeCost.js                # Time cost calculator
│   │   ├── analytics.js               # Productivity analytics
│   │   └── clock.js                   # Utility functions (legacy)
│   └── utils/
│       └── storage.js                 # localStorage wrapper
└── .github/
    └── workflows/
        └── deploy.yml                 # GitHub Pages CI/CD
```

---

## 🤝 Contributing

Contributions are welcome! Please follow the code style conventions:

1. **Use vanilla JavaScript** (no frameworks)
2. **Modular design** — each feature in its own module
3. **localStorage for persistence** — no backend
4. **JSDoc comments** for all public methods
5. **Mobile-first CSS** — responsive design always

### Development Setup

```bash
# 1. Clone and create feature branch
git clone https://github.com/c25il027suman-oss/Clock.git
git checkout -b feature/your-feature

# 2. Make changes
# 3. Test locally (see Local Development section)
# 4. Commit with clear message
git commit -m "feature: describe your feature"

# 5. Push and create pull request
git push origin feature/your-feature
```

---

## 📝 License

MIT License — See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- **WeatherAPI.com** — Excellent weather data API
- **Vanilla JS Community** — For proving frameworks aren't always necessary
- **GitHub Pages** — Free, fast, reliable hosting

---

## 📞 Support

For issues, feature requests, or questions:
- 🐛 [Open an Issue](https://github.com/c25il027suman-oss/Clock/issues)
- 💬 [Start a Discussion](https://github.com/c25il027suman-oss/Clock/discussions)

---

## 🗺️ Roadmap

- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Slack integration for focus sessions
- [ ] Calendar API integration (Google Calendar, Outlook)
- [ ] Expense tracking
- [ ] Team features & leaderboards

---

## 🌟 Show Your Support

If you find TimeOS helpful, please star ⭐ the repository!

---

**Made with ❤️ by [c25il027Suman](https://github.com/c25il027suman-oss)**
