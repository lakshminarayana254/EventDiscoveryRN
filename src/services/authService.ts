import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';

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
  language: 'en';
  isRTL: boolean;
}

class SecureStorage {
  private readonly USER_KEY = '@secure_user_data';
  private readonly PREFERENCES_KEY = '@secure_app_preferences';
  private readonly FAVORITES_KEY = '@secure_user_favorites_';
  private readonly ENCRYPTION_KEY = 'your-app-specific-encryption-key'; // Should be from secure source

  // Encrypt data before storing
  private encrypt(data: string): string {
    try {
      return CryptoJS.AES.encrypt(data, this.ENCRYPTION_KEY).toString();
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  // Decrypt data after retrieving
  private decrypt(encryptedData: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.ENCRYPTION_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  // User data methods with encryption
  async storeUserData(user: User): Promise<void> {
    try {
      const dataToStore = JSON.stringify(user);
      const encryptedData = this.encrypt(dataToStore);
      await AsyncStorage.setItem(this.USER_KEY, encryptedData);
    } catch (error) {
      console.error('Failed to store user data:', error);
      throw new Error('Failed to save user data securely');
    }
  }

  async getUserData(): Promise<User | null> {
    try {
      const encryptedData = await AsyncStorage.getItem(this.USER_KEY);
      if (!encryptedData) return null;

      const decryptedData = this.decrypt(encryptedData);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Failed to get user data:', error);
      // Clear corrupted data
      await this.clearUserData();
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

  // Favorites methods with encryption
  async storeUserFavorites(userId: string, favorites: string[]): Promise<void> {
    try {
      const key = `${this.FAVORITES_KEY}${userId}`;
      const dataToStore = JSON.stringify(favorites);
      const encryptedData = this.encrypt(dataToStore);
      await AsyncStorage.setItem(key, encryptedData);
    } catch (error) {
      console.error('Failed to store user favorites:', error);
      throw new Error('Failed to save favorites securely');
    }
  }

  async getUserFavorites(userId: string): Promise<string[]> {
    try {
      const key = `${this.FAVORITES_KEY}${userId}`;
      const encryptedData = await AsyncStorage.getItem(key);
      if (!encryptedData) return [];

      const decryptedData = this.decrypt(encryptedData);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Failed to get user favorites:', error);
      return [];
    }
  }

  async clearUserFavorites(userId: string): Promise<void> {
    try {
      const key = `${this.FAVORITES_KEY}${userId}`;
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to clear user favorites:', error);
    }
  }

  // App preferences methods with encryption
  async storeAppPreferences(preferences: AppPreferences): Promise<void> {
    try {
      const dataToStore = JSON.stringify(preferences);
      const encryptedData = this.encrypt(dataToStore);
      await AsyncStorage.setItem(this.PREFERENCES_KEY, encryptedData);
    } catch (error) {
      console.error('Failed to store app preferences:', error);
      throw new Error('Failed to save preferences securely');
    }
  }

  async getAppPreferences(): Promise<AppPreferences | null> {
    try {
      const encryptedData = await AsyncStorage.getItem(this.PREFERENCES_KEY);
      if (!encryptedData) return null;

      const decryptedData = this.decrypt(encryptedData);
      return JSON.parse(decryptedData);
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

  // Clear all data securely
  async clearAll(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const keysToRemove = keys.filter(key => 
        key.startsWith('@secure_user_') || 
        key.startsWith('@secure_app_') ||
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
  async getStorageInfo(): Promise<{ totalKeys: number; userKeys: number; favoriteKeys: number; prefKeys: number }> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      return {
        totalKeys: allKeys.length,
        userKeys: allKeys.filter(key => key === this.USER_KEY).length,
        favoriteKeys: allKeys.filter(key => key.startsWith(this.FAVORITES_KEY)).length,
        prefKeys: allKeys.filter(key => key === this.PREFERENCES_KEY).length,
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return { totalKeys: 0, userKeys: 0, favoriteKeys: 0, prefKeys: 0 };
    }
  }
}

export const secureStorage = new SecureStorage();