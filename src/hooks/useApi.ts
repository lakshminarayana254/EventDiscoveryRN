import { useState, useCallback } from 'react';

// Generic hook for API calls with loading state
export const useApi = <T = any>() => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

// Hook specifically for fetching events
export const useEvents = () => {
  const { data, loading, error, execute, reset } = useApi<{
    events: any[];
    total: number;
    page: number;
    totalPages: number;
  }>();

  const fetchEvents = useCallback((filters?: {
    category?: string;
    city?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    return execute(() => {
      // For now, return mock data since we don't have a real API
      return Promise.resolve({
        events: [
          {
            id: '1',
            name: 'Rock Concert Live',
            date: '2024-12-15',
            venue: 'Madison Square Garden',
            city: 'New York',
            category: 'music',
            price: { min: 50, max: 200, currency: 'USD' },
            featured: true,
          },
          {
            id: '2',
            name: 'Comedy Night Special',
            date: '2024-12-20',
            venue: 'Comedy Cellar',
            city: 'New York',
            category: 'comedy',
            price: { min: 25, max: 75, currency: 'USD' },
            featured: false,
          },
        ],
        total: 2,
        page: 1,
        totalPages: 1,
      });
    });
  }, [execute]);

  return {
    events: data?.events || [],
    total: data?.total || 0,
    loading,
    error,
    fetchEvents,
    reset,
  };
};

// Hook for user authentication
export const useAuth = () => {
  const { data, loading, error, execute, reset } = useApi<{
    user: any;
    token: string;
    refreshToken: string;
  }>();

  const signIn = useCallback((email: string, password: string) => {
    return execute(() => {
      // Mock authentication for now
      return Promise.resolve({
        user: {
          id: '1',
          email,
          name: 'John Doe',
          favoriteEvents: [],
        },
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
      });
    });
  }, [execute]);

  const signUp = useCallback((email: string, password: string, displayName: string) => {
    return execute(() => {
      // Mock sign up for now
      return Promise.resolve({
        user: {
          id: '2',
          email,
          name: displayName,
          favoriteEvents: [],
        },
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
      });
    });
  }, [execute]);

  return {
    user: data?.user,
    token: data?.token,
    loading,
    error,
    signIn,
    signUp,
    reset,
  };
};

export default useApi;
