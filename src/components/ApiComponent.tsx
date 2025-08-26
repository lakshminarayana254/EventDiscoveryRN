import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from 'react-native';

// Generic API Hook
interface UseApiOptions<T> {
  initialData?: T;
  autoFetch?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export const useApiCall = <T = any>(
  apiFunction: () => Promise<T>,
  options: UseApiOptions<T> = {}
) => {
  const { initialData, autoFetch = false, onSuccess, onError } = options;
  
  const [data, setData] = useState<T | null>(initialData || null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFunction();
      setData(result);
      setLastFetch(new Date());
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, onSuccess, onError]);

  const refresh = useCallback(() => {
    return execute();
  }, [execute]);

  const reset = useCallback(() => {
    setData(initialData || null);
    setError(null);
    setLoading(false);
    setLastFetch(null);
  }, [initialData]);

  useEffect(() => {
    if (autoFetch) {
      execute();
    }
  }, [execute, autoFetch]);

  return {
    data,
    loading,
    error,
    lastFetch,
    execute,
    refresh,
    reset,
  };
};

// Props for the API Component
interface ApiComponentProps<T> {
  // API Configuration
  apiFunction: () => Promise<T>;
  autoFetch?: boolean;
  refreshInterval?: number; // Auto refresh every X milliseconds
  
  // Render Functions
  renderData: (data: T, refresh: () => Promise<T>) => ReactNode;
  renderLoading?: () => ReactNode;
  renderError?: (error: string, retry: () => Promise<T>) => ReactNode;
  renderEmpty?: () => ReactNode;
  
  // Event Handlers
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  
  // UI Configuration
  showRefreshControl?: boolean;
  containerStyle?: object;
  
  // Data Validation
  isEmpty?: (data: T) => boolean;
}

// Generic API Component
export const ApiComponent = <T extends any>({
  apiFunction,
  autoFetch = true,
  refreshInterval,
  renderData,
  renderLoading,
  renderError,
  renderEmpty,
  onSuccess,
  onError,
  showRefreshControl = true,
  containerStyle,
  isEmpty,
}: ApiComponentProps<T>) => {
  const {
    data,
    loading,
    error,
    lastFetch,
    execute,
    refresh,
    reset,
  } = useApiCall(apiFunction, {
    autoFetch,
    onSuccess,
    onError,
  });

  // Auto refresh interval
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(() => {
        if (!loading) {
          refresh();
        }
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [refreshInterval, loading, refresh]);

  // Default loading component
  const defaultLoadingComponent = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );

  // Default error component
  const defaultErrorComponent = (errorMessage: string, retry: () => Promise<T>) => (
    <View style={styles.centerContainer}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorMessage}>{errorMessage}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={retry}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  // Default empty component
  const defaultEmptyComponent = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyTitle}>No Data Found</Text>
      <Text style={styles.emptyMessage}>There's nothing to display right now.</Text>
    </View>
  );

  // Check if data is empty
  const isDataEmpty = data && isEmpty ? isEmpty(data) : false;

  // Render loading state
  if (loading && !data) {
    return (
      <View style={[styles.container, containerStyle]}>
        {renderLoading ? renderLoading() : defaultLoadingComponent()}
      </View>
    );
  }

  // Render error state
  if (error && !data) {
    return (
      <View style={[styles.container, containerStyle]}>
        {renderError ? renderError(error, execute) : defaultErrorComponent(error, execute)}
      </View>
    );
  }

  // Render empty state
  if (isDataEmpty) {
    return (
      <View style={[styles.container, containerStyle]}>
        {renderEmpty ? renderEmpty() : defaultEmptyComponent()}
      </View>
    );
  }

  // Render data with optional refresh control
  if (showRefreshControl) {
    return (
      <ScrollView
        style={[styles.container, containerStyle]}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
      >
        {data && renderData(data, refresh)}
      </ScrollView>
    );
  }

  // Render data without refresh control
  return (
    <View style={[styles.container, containerStyle]}>
      {data && renderData(data, refresh)}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ApiComponent;
