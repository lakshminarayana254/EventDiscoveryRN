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
    totalPages: number;
    number: number;
    size: number;
  };
}

interface UseTicketmasterEventsResult {
  events: TicketmasterEvent[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  totalEvents: number;
  hasMore: boolean;
  currentPage: number;
  fetchInitialEvents: () => Promise<void>;
  searchEvents: (city: string, keyword: string) => Promise<void>;
  loadMoreEvents: () => Promise<void>;
  refetch: () => Promise<void>;
}

interface UseTicketmasterEventsOptions {
  apiKey?: string;
  autoLoad?: boolean;
  fallbackToMock?: boolean;
  pageSize?: number;
}

export const useTicketmasterEvents = (options: UseTicketmasterEventsOptions = {}): UseTicketmasterEventsResult => {
  const {
    apiKey = API_CONFIG.TICKETMASTER.API_KEY,
    autoLoad = true,
    fallbackToMock = true,
    pageSize = 20
  } = options;

  // State management
  const [events, setEvents] = useState<TicketmasterEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalEvents, setTotalEvents] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [lastSearchParams, setLastSearchParams] = useState<{ city: string; keyword: string } | null>(null);

  // Refs to prevent multiple simultaneous calls
  const isInitialLoadingRef = useRef(false);
  const isSearchingRef = useRef(false);
  const isLoadingMoreRef = useRef(false);
  const hasInitiallyLoadedRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Configure axios
  const apiClient = useRef(axios.create({
    timeout: API_CONFIG.TICKETMASTER.TIMEOUT,
    headers: {
      'Accept': 'application/json',
    }
  })).current;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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

  // Generic fetch function for API calls
  const fetchEventsFromAPI = useCallback(async (
    city: string, 
    keyword: string, 
    page: number = 0, 
    append: boolean = false
  ): Promise<void> => {
    try {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();

      let url = `${API_CONFIG.TICKETMASTER.BASE_URL}?apikey=${API_CONFIG.TICKETMASTER.API_KEY}&page=${page}&size=${pageSize}`;
      
      if (city.trim()) {
        url += `&city=${encodeURIComponent(city.trim())}`;
      }
      if (keyword.trim()) {
        url += `&keyword=${encodeURIComponent(keyword.trim())}`;
      }
      
      console.log(`🔍 Fetching events - Page: ${page + 1}, Append: ${append}`);
      
      const response = await apiClient.get<TicketmasterResponse>(url, {
        signal: abortControllerRef.current.signal
      });

      if (response.data._embedded?.events) {
        const newEvents = transformEvents(response.data._embedded.events, city);
        const pageInfo = response.data.page;
        
        if (append) {
          // Append new events for pagination
          setEvents(prev => [...prev, ...newEvents]);
          console.log(`📄 Loaded ${newEvents.length} more events`);
        } else {
          // Replace events for new search
          setEvents(newEvents);
          console.log(`🆕 Loaded ${newEvents.length} events for new search`);
        }
        
        setTotalEvents(pageInfo?.totalElements || newEvents.length);
        setCurrentPage(page);
        setHasMore(pageInfo ? (page + 1) < pageInfo.totalPages : false);
        setError(null);
        
        console.log(`📊 Page: ${page + 1}/${pageInfo?.totalPages || 1}, Has More: ${pageInfo ? (page + 1) < pageInfo.totalPages : false}`);
      } else {
        if (!append) {
          setEvents([]);
          setTotalEvents(0);
        }
        setHasMore(false);
        console.log('📭 No events found');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
        if (!append) {
          setEvents([]);
          setTotalEvents(0);
        }
        setHasMore(false);
      }
    }
  }, [pageSize, transformEvents, handleApiError]);

  // Fetch initial events (US events)
  const fetchInitialEvents = useCallback(async () => {
  if (isInitialLoadingRef.current) {
    console.log('Initial loading already in progress, skipping...');
    return;
  }

  isInitialLoadingRef.current = true;
  setLoading(true);
  setError(null);
  // SET lastSearchParams for initial load pagination
  setLastSearchParams({ city: '', keyword: '' });
  setCurrentPage(0);
  setHasMore(true);

  try {
    const isConnected = await testConnectivity();
    if (!isConnected && fallbackToMock) {
      console.log('No internet connection detected');
      setError('No internet connection. Please check your network.');
      hasInitiallyLoadedRef.current = true;
      return;
    }

    console.log('Fetching initial events from Ticketmaster API...');
    await fetchEventsFromAPI('', '', 0, false);
    hasInitiallyLoadedRef.current = true;
  } finally {
    setLoading(false);
    isInitialLoadingRef.current = false;
  }
}, [testConnectivity, fallbackToMock, fetchEventsFromAPI]);

  // Search events (no debounce - manual trigger)
  const searchEvents = useCallback(async (city: string, keyword: string) => {
    if (isSearchingRef.current) {
      console.log('⚠️ Search already in progress...');
      return;
    }

    isSearchingRef.current = true;
    setLoading(true);
    setError(null);
    setLastSearchParams({ city: city.trim(), keyword: keyword.trim() });
    setCurrentPage(0);
    setHasMore(true);

    try {
      console.log(`🔍 Searching events: city="${city}", keyword="${keyword}"`);
      await fetchEventsFromAPI(city, keyword, 0, false);
    } finally {
      setLoading(false);
      isSearchingRef.current = false;
    }
  }, [fetchEventsFromAPI]);

  // Load more events (pagination)
  const loadMoreEvents = useCallback(async () => {
    console.log('📄 Load more triggered', {
    isLoadingMore: isLoadingMoreRef.current,
    hasMore,
    loading,
    lastSearchParams,
    currentPage
  });

    if (isLoadingMoreRef.current || !hasMore || loading ) {
      console.log('🚫 Cannot load more - conditions not met');
      return;
    }

    isLoadingMoreRef.current = true;
    setLoadingMore(true);
    setError(null);

    try {
      const nextPage = currentPage + 1;
      console.log(`📄 Loading page ${nextPage + 1}...`);

      // FIX: Get search parameters from lastSearchParams
    const searchCity = lastSearchParams?.city || '';
    const searchKeyword = lastSearchParams?.keyword || '';
      
      await fetchEventsFromAPI(
      searchCity, 
      searchKeyword, 
      nextPage, 
      true // append = true
      );
    } catch (err) {
      console.error('❌ Error loading more events:', err);
    } finally {
      setLoadingMore(false);
      isLoadingMoreRef.current = false;
    }
  }, [hasMore, loading, lastSearchParams, currentPage, fetchEventsFromAPI]);

  // Refetch current search
  const refetch = useCallback(async () => {
    if (lastSearchParams) {
      await searchEvents(lastSearchParams.city, lastSearchParams.keyword);
    } else {
      await fetchInitialEvents();
    }
  }, [lastSearchParams, searchEvents, fetchInitialEvents]);

  // Auto-load initial events on mount
  useEffect(() => {
    if (autoLoad && !hasInitiallyLoadedRef.current && !isInitialLoadingRef.current) {
      console.log('Auto-loading initial events...');
      fetchInitialEvents();
    }
  }, [autoLoad, fetchInitialEvents]);

  return {
    events,
    loading,
    loadingMore,
    error,
    totalEvents,
    hasMore,
    currentPage,
    fetchInitialEvents,
    searchEvents,
    loadMoreEvents,
    refetch
  };
};

export default useTicketmasterEvents;