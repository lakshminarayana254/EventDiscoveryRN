export const API_CONFIG = {
  TICKETMASTER: {
    BASE_URL: 'https://app.ticketmaster.com/discovery/v2/events.json',
    API_KEY: 'dA1kldVp1XUANQmYmkSuucGbpWg6LR3S',
    TIMEOUT: 15000,
  },
};

export const APP_CONFIG = {
  APP_NAME: 'Event Discovery',
  VERSION: '1.0.0',
  ENVIRONMENT: __DEV__ ? 'development' : 'production',
};