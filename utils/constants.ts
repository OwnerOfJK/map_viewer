/**
 * Application constants
 */

// Location update intervals (in milliseconds)
export const LOCATION_UPDATE_INTERVAL = {
  FOREGROUND_REALTIME: 30000, // 30 seconds when app is in foreground
  BACKGROUND_REALTIME: 300000, // 5 minutes when app is in background
};

// Map settings
export const MAP_SETTINGS = {
  INITIAL_DELTA: 50, // Initial zoom level (higher = more zoomed out)
  ANIMATION_DURATION: 300,
};

// Timing
export const SPLASH_DURATION = 2500; // 2.5 seconds

// Input validation
export const VALIDATION = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MAX_BIO_LENGTH: 150,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 20,
};

// Toast defaults
export const TOAST_DURATION = 3000; // 3 seconds

// Search debounce
export const SEARCH_DEBOUNCE_MS = 300;
