import { Alert, AlertButton } from 'react-native';

export interface AlertOptions {
  title: string;
  message: string;
  buttons?: AlertButton[];
  cancelable?: boolean;
}

export interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  destructive?: boolean;
}

export class AlertService {
  /**
   * Show a simple alert with OK button
   */
  static showAlert({ title, message, buttons, cancelable = true }: AlertOptions): void {
    const defaultButtons: AlertButton[] = buttons || [{ text: 'OK' }];
    Alert.alert(title, message, defaultButtons, { cancelable });
  }

  /**
   * Show an error alert
   */
  static showError(message: string, title: string = 'Error'): void {
    Alert.alert(title, message, [{ text: 'OK' }], { cancelable: true });
  }

  /**
   * Show a success alert
   */
  static showSuccess(message: string, title: string = 'Success', onPress?: () => void): void {
    Alert.alert(
      title,
      message,
      [{ text: 'OK', onPress }],
      { cancelable: true }
    );
  }

  /**
   * Show an info alert
   */
  static showInfo(message: string, title: string = 'Info'): void {
    Alert.alert(title, message, [{ text: 'OK' }], { cancelable: true });
  }

  /**
   * Show a confirmation alert with Yes/No or custom buttons
   */
  static showConfirmation({
    title,
    message,
    confirmText = 'Yes',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    destructive = false
  }: ConfirmationOptions): void {
    Alert.alert(
      title,
      message,
      [
        {
          text: cancelText,
          style: 'cancel',
          onPress: onCancel,
        },
        {
          text: confirmText,
          style: destructive ? 'destructive' : 'default',
          onPress: async () => {
            try {
              await onConfirm();
            } catch (error) {
              console.error('Error in confirmation action:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  }

  /**
   * Show a custom alert with multiple options
   */
  static showOptions(title: string, message: string, options: AlertButton[]): void {
    Alert.alert(title, message, options, { cancelable: true });
  }

  /**
   * Show a loading alert (non-dismissible)
   */
  static showLoading(message: string = 'Loading...', title: string = 'Please wait'): void {
    Alert.alert(title, message, [], { cancelable: false });
  }
}

// Convenience exports for common use cases
export const showAlert = AlertService.showAlert;
export const showError = AlertService.showError;
export const showSuccess = AlertService.showSuccess;
export const showInfo = AlertService.showInfo;
export const showConfirmation = AlertService.showConfirmation;
export const showOptions = AlertService.showOptions;
export const showLoading = AlertService.showLoading;

// Export the hook as well
export { useAlert } from './useAlert';
