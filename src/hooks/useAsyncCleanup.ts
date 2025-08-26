// Create src/hooks/useAsyncCleanup.ts
import { useRef, useEffect, useCallback } from 'react';

export const useAsyncCleanup = () => {
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const safeAsyncCall = useCallback(async (asyncFn: () => Promise<any>) => {
    try {
      const result = await asyncFn();
      return mountedRef.current ? result : null;
    } catch (error) {
      if (mountedRef.current) {
        throw error;
      }
      return null;
    }
  }, []);

  return { mountedRef, safeAsyncCall };
};