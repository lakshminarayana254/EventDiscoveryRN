export const STORAGE_KEYS = {
  USER_DATA: '@user_data',
  APP_PREFERENCES: '@app_preferences',
} as const;

export const NAVIGATION_ROUTES = {
  LOGIN: 'Login',
  HOME: 'Home',
  PROFILE: 'Profile',
  EVENT_DETAILS: 'EventDetails',
} as const;

export const DEFAULT_PREFERENCES = {
  theme: 'light' as const,
  notifications: true,
  biometricEnabled: false,
  language: 'en' as const,
  isRTL: false,
};