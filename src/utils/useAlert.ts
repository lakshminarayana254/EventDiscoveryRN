import { useCallback } from 'react';
import { AlertService, ConfirmationOptions } from './alertService';

/**
 * Custom hook that provides alert functionality with proper React patterns
 * @returns Object containing alert methods
 */
export const useAlert = () => {
  const showAlert = useCallback((title: string, message: string, buttons?: any[]) => {
    AlertService.showAlert({ title, message, buttons });
  }, []);

  const showError = useCallback((message: string, title: string = 'Error') => {
    AlertService.showError(message, title);
  }, []);

  const showSuccess = useCallback((message: string, title: string = 'Success', onPress?: () => void) => {
    AlertService.showSuccess(message, title, onPress);
  }, []);

  const showInfo = useCallback((message: string, title: string = 'Info') => {
    AlertService.showInfo(message, title);
  }, []);

  const showConfirmation = useCallback((options: ConfirmationOptions) => {
    AlertService.showConfirmation(options);
  }, []);

  const showOptions = useCallback((title: string, message: string, options: any[]) => {
    AlertService.showOptions(title, message, options);
  }, []);

  return {
    showAlert,
    showError,
    showSuccess,
    showInfo,
    showConfirmation,
    showOptions,
  };
};
