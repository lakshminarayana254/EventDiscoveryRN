import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { showError } from '../utils/alertService';

// API Configuration
const API_BASE_URL = process.env.REACT_NATIVE_API_URL || 'https://api.example.com'; // Replace with your API URL
const API_TIMEOUT = 30000; // 30 seconds

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    // const token = await getAuthToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('📤 Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle responses and errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`📥 API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error('📥 Response Error:', error.response?.status, error.response?.data);
    
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized - maybe redirect to login
      showError('Your session has expired. Please login again.', 'Authentication Error');
    } else if (error.response?.status === 500) {
      showError('Server error. Please try again later.', 'Server Error');
    } else if (error.code === 'ECONNABORTED') {
      showError('Request timed out. Please check your connection.', 'Timeout Error');
    } else if (!error.response) {
      showError('Network error. Please check your internet connection.', 'Network Error');
    }
    
    return Promise.reject(error);
  }
);

// API Service class
export class ApiService {
  // Generic GET request
  static async get<T>(endpoint: string, params?: object): Promise<T> {
    try {
      const response = await apiClient.get<T>(endpoint, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Generic POST request
  static async post<T>(endpoint: string, data?: object): Promise<T> {
    try {
      const response = await apiClient.post<T>(endpoint, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Generic PUT request
  static async put<T>(endpoint: string, data?: object): Promise<T> {
    try {
      const response = await apiClient.put<T>(endpoint, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Generic DELETE request
  static async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await apiClient.delete<T>(endpoint);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Generic PATCH request
  static async patch<T>(endpoint: string, data?: object): Promise<T> {
    try {
      const response = await apiClient.patch<T>(endpoint, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handler
  private static handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.statusText || 'An error occurred';
      return new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      return new Error('No response from server. Please check your connection.');
    } else {
      // Something else happened
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

// Specific API endpoints for your banking app
export class BankingApiService extends ApiService {
  // Events API
  static async getEvents(filters?: {
    category?: string;
    city?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    return this.get<{
      events: Event[];
      total: number;
      page: number;
      totalPages: number;
    }>('/events', filters);
  }

  static async getEventById(eventId: string) {
    return this.get<Event>(`/events/${eventId}`);
  }

  static async getFeaturedEvents() {
    return this.get<Event[]>('/events/featured');
  }

  // User API
  static async getUserProfile() {
    return this.get<UserProfile>('/user/profile');
  }

  static async updateUserProfile(profileData: Partial<UserProfile>) {
    return this.put<UserProfile>('/user/profile', profileData);
  }

  static async getUserFavorites() {
    return this.get<string[]>('/user/favorites');
  }

  static async addToFavorites(eventId: string) {
    return this.post<{ success: boolean }>('/user/favorites', { eventId });
  }

  static async removeFromFavorites(eventId: string) {
    return this.delete<{ success: boolean }>(`/user/favorites/${eventId}`);
  }

  // Authentication API
  static async signIn(email: string, password: string) {
    return this.post<{
      user: UserProfile;
      token: string;
      refreshToken: string;
    }>('/auth/signin', { email, password });
  }

  static async signUp(email: string, password: string, displayName: string) {
    return this.post<{
      user: UserProfile;
      token: string;
      refreshToken: string;
    }>('/auth/signup', { email, password, displayName });
  }

  static async signOut() {
    return this.post<{ success: boolean }>('/auth/signout');
  }

  static async refreshToken(refreshToken: string) {
    return this.post<{
      token: string;
      refreshToken: string;
    }>('/auth/refresh', { refreshToken });
  }

  static async forgotPassword(email: string) {
    return this.post<{ success: boolean }>('/auth/forgot-password', { email });
  }

  // Booking API
  static async bookEvent(eventId: string, bookingData: {
    ticketType: string;
    quantity: number;
    contactInfo: {
      email: string;
      phone: string;
    };
  }) {
    return this.post<{
      bookingId: string;
      status: string;
      paymentUrl?: string;
    }>(`/events/${eventId}/book`, bookingData);
  }

  static async getBookingHistory() {
    return this.get<Booking[]>('/user/bookings');
  }

  static async getBookingDetails(bookingId: string) {
    return this.get<Booking>(`/bookings/${bookingId}`);
  }
}

// Type definitions for API responses
interface Event {
  id: string;
  name: string;
  date: string;
  venue: string;
  city: string;
  category: string;
  description?: string;
  price?: {
    min: number;
    max: number;
    currency: string;
  };
  image?: string;
  url?: string;
  availableTickets?: number;
  featured?: boolean;
}

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  displayName?: string;
  favoriteEvents: string[];
  createdAt: string;
  updatedAt: string;
}

interface Booking {
  id: string;
  eventId: string;
  event: Event;
  ticketType: string;
  quantity: number;
  totalAmount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  bookingDate: string;
  contactInfo: {
    email: string;
    phone: string;
  };
}

export default ApiService;
