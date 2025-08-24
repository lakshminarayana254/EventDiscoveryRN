import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { secureStorage } from '../services/secureStorage';

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  lastLogin: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  favorites: string[];
  addToFavorites: (eventId: string) => Promise<void>;
  removeFromFavorites: (eventId: string) => Promise<void>;
  isFavorite: (eventId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Simple in-memory user store (replace with real backend in production)
const USER_STORE: { [email: string]: { password: string; userData: User } } = {};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const storedUser = await secureStorage.getUserData();
      if (storedUser) {
        // Validate stored user data
        if (storedUser.id && storedUser.email && storedUser.createdAt) {
          setUser(storedUser);
          // Load user's favorites
          const userFavorites = await secureStorage.getUserFavorites(storedUser.id);
          setFavorites(userFavorites);
        } else {
          // Clear invalid user data
          await secureStorage.clearUserData();
        }
      }
    } catch (error) {
      console.error('Error loading stored user data:', error);
      // Clear corrupted data
      await secureStorage.clearUserData();
    } finally {
      setLoading(false);
    }
  };

  // Generate secure user ID
  const generateUserId = (): string => {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    return `user_${timestamp}_${randomPart}`;
  };

  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate password strength
  const isValidPassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const signUp = async (email: string, password: string, name?: string): Promise<void> => {
    setLoading(true);
    try {
      // Input validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (!isValidEmail(email)) {
        throw new Error('Please enter a valid email address');
      }

      if (!isValidPassword(password)) {
        throw new Error('Password must be at least 6 characters long');
      }

      const normalizedEmail = email.toLowerCase().trim();

      // Check if user already exists
      if (USER_STORE[normalizedEmail]) {
        throw new Error('An account with this email already exists');
      }

      // Create new user
      const now = new Date().toISOString();
      const userData: User = {
        id: generateUserId(),
        email: normalizedEmail,
        name: name?.trim() || normalizedEmail.split('@')[0],
        createdAt: now,
        lastLogin: now,
      };

      // Store user in memory (replace with real backend)
      USER_STORE[normalizedEmail] = {
        password: password, // In production, hash this password
        userData: userData
      };

      // Store user data locally
      await secureStorage.storeUserData(userData);
      setUser(userData);
      setFavorites([]); // New user has no favorites

    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      // Input validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (!isValidEmail(email)) {
        throw new Error('Please enter a valid email address');
      }

      const normalizedEmail = email.toLowerCase().trim();

      // Check if user exists
      const storedUser = USER_STORE[normalizedEmail];
      if (!storedUser) {
        throw new Error('Invalid email or password');
      }

      // Verify password (in production, compare hashed passwords)
      if (storedUser.password !== password) {
        throw new Error('Invalid email or password');
      }

      // Update last login
      const updatedUserData: User = {
        ...storedUser.userData,
        lastLogin: new Date().toISOString()
      };

      // Update in memory store
      USER_STORE[normalizedEmail].userData = updatedUserData;

      // Store updated user data locally
      await secureStorage.storeUserData(updatedUserData);
      setUser(updatedUserData);
      
      // Load user's favorites
      const userFavorites = await secureStorage.getUserFavorites(updatedUserData.id);
      setFavorites(userFavorites);

    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      await secureStorage.clearUserData();
      setUser(null);
      setFavorites([]);
    } catch (error) {
      console.error('Error during sign out:', error);
      throw new Error('Failed to sign out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Favorites functionality
// In AuthContext.tsx - addToFavorites function
const addToFavorites = async (eventId: string): Promise<void> => {
  if (!user) throw new Error('Please sign in to add favorites');
  
  try {
    const updatedFavorites = [...favorites, eventId]; // Add to array
    setFavorites(updatedFavorites); // Update state
    await secureStorage.storeUserFavorites(user.id, updatedFavorites); // Save to storage
  } catch (error) {
    setFavorites(favorites); // Revert on error
    throw new Error('Failed to add to favorites');
  }
};

  const removeFromFavorites = async (eventId: string): Promise<void> => {
    if (!user) {
      throw new Error('Please sign in to manage favorites');
    }
    
    if (!eventId) {
      throw new Error('Invalid event ID');
    }
    
    try {
      const updatedFavorites = favorites.filter(id => id !== eventId);
      setFavorites(updatedFavorites);
      await secureStorage.storeUserFavorites(user.id, updatedFavorites);
    } catch (error) {
      // Revert on error
      setFavorites(favorites);
      console.error('Failed to remove from favorites:', error);
      throw new Error('Failed to remove from favorites. Please try again.');
    }
  };

  const isFavorite = (eventId: string): boolean => {
    if (!eventId) return false;
    return favorites.includes(eventId);
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;