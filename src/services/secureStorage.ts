import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  lastLogin: string;
}

interface AppPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  biometricEnabled: boolean;
  language: 'en' | 'ar';  // Add this line
  isRTL: boolean; 
}

class SecureStorage {
  private readonly USER_KEY = '@user_data';
  private readonly PREFERENCES_KEY = '@app_preferences';
  private readonly FAVORITES_KEY = '@user_favorites_';

  // User data methods
  async storeUserData(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to store user data:', error);
      throw new Error('Failed to save user data');
    }
  }

  async getUserData(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to get user data:', error);
      return null;
    }
  }

  async clearUserData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.USER_KEY);
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  }

  // ✅ FAVORITES METHODS - These are required by AuthContext
async storeUserFavorites(userId: string, favorites: string[]): Promise<void> {
  try {
    const key = `@user_favorites_${userId}`; // Unique key per user
    await AsyncStorage.setItem(key, JSON.stringify(favorites)); // Store as JSON
  } catch (error) {
    throw new Error('Failed to save favorites');
  }
}

  async getUserFavorites(userId: string): Promise<string[]> {
    try {
      if (!userId) {
        console.warn('User ID is required to get favorites');
        return [];
      }

      const key = `${this.FAVORITES_KEY}${userId}`;
      const favorites = await AsyncStorage.getItem(key);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Failed to get user favorites:', error);
      return [];
    }
  }

  async clearUserFavorites(userId: string): Promise<void> {
    try {
      if (!userId) {
        console.warn('User ID is required to clear favorites');
        return;
      }

      const key = `${this.FAVORITES_KEY}${userId}`;
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to clear user favorites:', error);
    }
  }

  // App preferences methods
  async storeAppPreferences(preferences: AppPreferences): Promise<void> {
    try {
      await AsyncStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to store app preferences:', error);
      throw new Error('Failed to save preferences');
    }
  }

  async getAppPreferences(): Promise<AppPreferences | null> {
    try {
      const preferences = await AsyncStorage.getItem(this.PREFERENCES_KEY);
      return preferences ? JSON.parse(preferences) : null;
    } catch (error) {
      console.error('Failed to get app preferences:', error);
      return null;
    }
  }

  async clearAppPreferences(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.PREFERENCES_KEY);
    } catch (error) {
      console.error('Failed to clear app preferences:', error);
    }
  }

  // Utility methods
  async getAllFavoriteKeys(): Promise<string[]> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      return allKeys.filter(key => key.startsWith(this.FAVORITES_KEY));
    } catch (error) {
      console.error('Failed to get all favorite keys:', error);
      return [];
    }
  }

  async clearAllUserFavorites(): Promise<void> {
    try {
      const favoriteKeys = await this.getAllFavoriteKeys();
      if (favoriteKeys.length > 0) {
        await AsyncStorage.multiRemove(favoriteKeys);
      }
    } catch (error) {
      console.error('Failed to clear all user favorites:', error);
    }
  }

  // Clear all data
  async clearAll(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const keysToRemove = keys.filter(key => 
        key.startsWith('@user_') || 
        key.startsWith('@app_') ||
        key.startsWith(this.FAVORITES_KEY)
      );
      
      if (keysToRemove.length > 0) {
        await AsyncStorage.multiRemove(keysToRemove);
      }
    } catch (error) {
      console.error('Failed to clear all data:', error);
    }
  }

  // Debug methods
  async getStorageInfo(): Promise<{ 
    totalKeys: number; 
    userKeys: number; 
    favoriteKeys: number; 
    prefKeys: number;
    favoriteUsers: string[];
  }> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const favoriteKeys = allKeys.filter(key => key.startsWith(this.FAVORITES_KEY));
      
      // Extract user IDs from favorite keys
      const favoriteUsers = favoriteKeys.map(key => 
        key.replace(this.FAVORITES_KEY, '')
      );

      return {
        totalKeys: allKeys.length,
        userKeys: allKeys.filter(key => key === this.USER_KEY).length,
        favoriteKeys: favoriteKeys.length,
        prefKeys: allKeys.filter(key => key === this.PREFERENCES_KEY).length,
        favoriteUsers,
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return { 
        totalKeys: 0, 
        userKeys: 0, 
        favoriteKeys: 0, 
        prefKeys: 0,
        favoriteUsers: []
      };
    }
  }

  // Check if data exists
  async hasUserData(): Promise<boolean> {
    try {
      const userData = await AsyncStorage.getItem(this.USER_KEY);
      return userData !== null;
    } catch (error) {
      console.error('Failed to check user data existence:', error);
      return false;
    }
  }

  async hasUserFavorites(userId: string): Promise<boolean> {
    try {
      if (!userId) return false;
      
      const key = `${this.FAVORITES_KEY}${userId}`;
      const favorites = await AsyncStorage.getItem(key);
      return favorites !== null;
    } catch (error) {
      console.error('Failed to check user favorites existence:', error);
      return false;
    }
  }

  async hasAppPreferences(): Promise<boolean> {
    try {
      const preferences = await AsyncStorage.getItem(this.PREFERENCES_KEY);
      return preferences !== null;
    } catch (error) {
      console.error('Failed to check app preferences existence:', error);
      return false;
    }
  }

  // Get favorite count for a user
  async getFavoriteCount(userId: string): Promise<number> {
    try {
      const favorites = await this.getUserFavorites(userId);
      return favorites.length;
    } catch (error) {
      console.error('Failed to get favorite count:', error);
      return 0;
    }
  }

  // Check if a specific event is favorited by user
  async isEventFavorited(userId: string, eventId: string): Promise<boolean> {
    try {
      if (!userId || !eventId) return false;
      
      const favorites = await this.getUserFavorites(userId);
      return favorites.includes(eventId);
    } catch (error) {
      console.error('Failed to check if event is favorited:', error);
      return false;
    }
  }
}

export const secureStorage = new SecureStorage();