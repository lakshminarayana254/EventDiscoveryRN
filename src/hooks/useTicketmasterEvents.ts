import { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_CONFIG } from '../config/api';

export interface TicketmasterEvent {
  id: string;
  name: string;
  date: string;
  venue: string;
  city: string;
  category: string;
  url?: string;
  images?: Array<{ url: string; width: number; height: number }>;
  priceRanges?: Array<{ min: number; max: number; currency: string }>;
}

interface TicketmasterResponse {
  _embedded?: {
    events: Array<{
      id: string;
      name: string;
      dates: {
        start: {
          localDate: string;
          localTime?: string;
        };
      };
      _embedded?: {
        venues: Array<{
          name: string;
          city: {
            name: string;
          };
        }>;
      };
      classifications?: Array<{
        segment: {
          name: string;
        };
      }>;
      url?: string;
      images?: Array<{ url: string; width: number; height: number }>;
      priceRanges?: Array<{ min: number; max: number; currency: string }>;
    }>;
  };
  page?: {
    totalElements: number;
  };
}

interface UseTicketmasterEventsResult {
  events: TicketmasterEvent[];
  loading: boolean;
  error: string | null;
  totalEvents: number;
  fetchInitialEvents: () => Promise<void>;
  searchEvents: (city: string, keyword: string) => Promise<void>;
  refetch: () => Promise<void>;
}

interface UseTicketmasterEventsOptions {
  apiKey?: string;
  autoLoad?: boolean;
  fallbackToMock?: boolean;
}


export const useTicketmasterEvents = (options: UseTicketmasterEventsOptions = {}): UseTicketmasterEventsResult => {
  const {
    apiKey = API_CONFIG.TICKETMASTER.API_KEY,
    autoLoad = true,
    fallbackToMock = true
  } = options;

  const [events, setEvents] = useState<TicketmasterEvent[]>([]);
  const [loading, setLoading] = useState(false); // Changed: Don't auto-set loading on mount
  const [error, setError] = useState<string | null>(null);
  const [totalEvents, setTotalEvents] = useState(0);
  const [lastSearchParams, setLastSearchParams] = useState<{ city: string; keyword: string } | null>(null);

  // Add refs to prevent multiple simultaneous calls
  const isInitialLoadingRef = useRef(false);
  const isSearchingRef = useRef(false);
  const hasInitiallyLoadedRef = useRef(false);

  // Configure axios with better error handling for React Native
  const apiClient = useRef(axios.create({
    timeout: API_CONFIG.TICKETMASTER.TIMEOUT,
    headers: {
      'Accept': 'application/json',
    }
  })).current;

  // Test network connectivity
  const testConnectivity = useCallback(async (): Promise<boolean> => {
    try {
      console.log('Testing basic connectivity...');
      const testResponse = await axios.get('https://www.google.com', { timeout: 5000 });
      console.log('Basic connectivity test passed:', testResponse.status);
      return true;
    } catch (error) {
      console.log('Basic connectivity test failed:', error);
      return false;
    }
  }, []);

  // Transform API response to our event format
  const transformEvents = useCallback((apiEvents: any[], searchCity?: string): TicketmasterEvent[] => {
    return apiEvents.map(event => ({
      id: event.id,
      name: event.name,
      date: event.dates.start.localDate,
      venue: event._embedded?.venues?.[0]?.name || 'TBA',
      city: event._embedded?.venues?.[0]?.city?.name || searchCity || 'Unknown',
      category: event.classifications?.[0]?.segment?.name?.toLowerCase() || 'general',
      url: event.url,
      images: event.images,
      priceRanges: event.priceRanges
    }));
  }, []);

  // Handle API errors with user-friendly messages
  const handleApiError = useCallback((err: any): string => {
    console.error('Ticketmaster API Error:', err);
    
    if (axios.isAxiosError(err)) {
      if (err.code === 'ECONNABORTED') {
        return 'Request timeout. Please try again.';
      } else if (err.response?.status === 401) {
        return 'API key is invalid or expired.';
      } else if (err.response && err.response.status >= 500) {
        return 'Ticketmaster service is temporarily unavailable.';
      } else {
        return 'Failed to fetch events. Please check your connection.';
      }
    }
    return 'An unexpected error occurred.';
  }, []);

  // Fetch initial events (US events) - Fixed to prevent multiple calls
  const fetchInitialEvents = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (isInitialLoadingRef.current) {
      console.log('Initial loading already in progress, skipping...');
      return;
    }

    isInitialLoadingRef.current = true;
    setLoading(true);
    setError(null);
    setLastSearchParams(null);

    try {
      // Test connectivity first
      const isConnected = await testConnectivity();
      if (!isConnected && fallbackToMock) {
        console.log('No internet connection detected, using mock data');
        setError('No internet connection. Using offline data.');
        hasInitiallyLoadedRef.current = true;
        return;
      }

      console.log('Fetching initial events from Ticketmaster API...');
      const url = `${API_CONFIG.TICKETMASTER.BASE_URL}?countryCode=US&apikey=${API_CONFIG.TICKETMASTER.API_KEY}`;
      console.log('Request URL:', url);
      
      const response = await apiClient.get<TicketmasterResponse>(url);
      console.log('API Response status:', response.status);

      if (response.data._embedded?.events) {
        const formattedEvents = transformEvents(response.data._embedded.events);
        setEvents(formattedEvents);
        setTotalEvents(response.data.page?.totalElements || formattedEvents.length);
        setError(null);
        hasInitiallyLoadedRef.current = true;
      } else {
        setEvents([]);
        setTotalEvents(0);
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      setEvents([]);
      setTotalEvents(0);
    } finally {
      setLoading(false);
      isInitialLoadingRef.current = false;
    }
  }, [apiKey, testConnectivity, fallbackToMock, transformEvents, handleApiError]);

  // Search events with city and/or keyword - Fixed to prevent multiple calls
  const searchEvents = useCallback(async (city: string, keyword: string) => {
    // Prevent multiple simultaneous calls
    if (isSearchingRef.current) {
      console.log('Search already in progress, skipping...');
      return;
    }

    const trimmedCity = city.trim();
    const trimmedKeyword = keyword.trim();
    
    isSearchingRef.current = true;
    setLoading(true);
    setError(null);
    setLastSearchParams({ city: trimmedCity, keyword: trimmedKeyword });

    try {
       let url = `${API_CONFIG.TICKETMASTER.BASE_URL}?apikey=${API_CONFIG.TICKETMASTER.API_KEY}`;
      
      // Add search parameters only if they have values
      if (trimmedCity) {
        url += `&city=${encodeURIComponent(trimmedCity)}`;
      }
      if (trimmedKeyword) {
        url += `&keyword=${encodeURIComponent(trimmedKeyword)}`;
      }
      
      console.log('Search URL:', url);
      const response = await apiClient.get<TicketmasterResponse>(url);

      if (response.data._embedded?.events) {
        const formattedEvents = transformEvents(response.data._embedded.events, trimmedCity);
        setEvents(formattedEvents);
        setTotalEvents(response.data.page?.totalElements || formattedEvents.length);
        setError(null);
      } else {
        setEvents([]);
        setTotalEvents(0);
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      setEvents([]);
      setTotalEvents(0);
    } finally {
      setLoading(false);
      isSearchingRef.current = false;
    }
  }, [apiKey, transformEvents, handleApiError]);

  // Refetch last request (useful for retry functionality)
  const refetch = useCallback(async () => {
    if (lastSearchParams) {
      await searchEvents(lastSearchParams.city, lastSearchParams.keyword);
    } else {
      await fetchInitialEvents();
    }
  }, [lastSearchParams, searchEvents, fetchInitialEvents]);

  // Auto-load initial events on mount - Fixed to prevent multiple calls
  useEffect(() => {
    if (autoLoad && !hasInitiallyLoadedRef.current && !isInitialLoadingRef.current) {
      console.log('Auto-loading initial events...');
      fetchInitialEvents();
    }
  }, []); // Empty dependency array to run only once

  return {
    events,
    loading,
    error,
    totalEvents,
    fetchInitialEvents,
    searchEvents,
    refetch
  };
};

export default useTicketmasterEvents;