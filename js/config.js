/**
 * TimeOS Configuration
 * API keys and environment variables
 * 
 * WARNING: For production, use environment variables properly
 * This is exposed client-side for the demo only.
 */

const CONFIG = {
  WEATHER_API_KEY: '7f2a70ea55fa42d98ae12305261206',
  WEATHER_API_BASE: 'https://api.weatherapi.com/v1',
  
  // Add more config here as needed
  APP_NAME: 'TimeOS',
  APP_VERSION: '1.0.0'
};

// Validate critical config
if (!CONFIG.WEATHER_API_KEY) {
  console.warn('⚠️ WEATHER_API_KEY not configured. Weather features will be disabled.');
}
