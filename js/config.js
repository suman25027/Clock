/**
 * TimeOS Configuration
 * API keys and environment variables
 * 
 * NOTE: For GitHub Pages, API keys are injected by GitHub Actions during deployment
 * Never commit sensitive keys to the repository.
 */

const CONFIG = {
  // API key is injected by GitHub Actions at deploy time
  // Placeholder: __WEATHER_API_KEY__ is replaced during build
  WEATHER_API_KEY: '__WEATHER_API_KEY__',
  WEATHER_API_BASE: 'https://api.weatherapi.com/v1',
  
  // Add more config here as needed
  APP_NAME: 'TimeOS',
  APP_VERSION: '1.0.0'
};

// Validate critical config
if (!CONFIG.WEATHER_API_KEY || CONFIG.WEATHER_API_KEY === '__WEATHER_API_KEY__') {
  console.warn('⚠️ WEATHER_API_KEY not configured. Weather features will be disabled. Make sure GitHub Actions Secret is set.');
}
