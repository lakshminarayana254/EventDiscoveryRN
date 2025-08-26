# Alert Service Usage Guide

This document describes how to use the reusable Alert Service that replaces React Native's `Alert.alert` throughout the application.

## Available Methods

### AlertService Class Methods

```typescript
import { AlertService } from '../utils/alertService';

// Simple alert
AlertService.showAlert({
  title: 'Title',
  message: 'Message',
  buttons: [{ text: 'OK' }] // optional
});

// Error alert
AlertService.showError('Something went wrong', 'Error Title');

// Success alert
AlertService.showSuccess('Operation completed!', 'Success', () => {
  // Optional callback
});

// Info alert
AlertService.showInfo('Here is some information', 'Info');

// Confirmation dialog
AlertService.showConfirmation({
  title: 'Confirm Action',
  message: 'Are you sure you want to proceed?',
  confirmText: 'Yes', // optional
  cancelText: 'Cancel', // optional
  destructive: true, // optional - makes confirm button red
  onConfirm: async () => {
    // Handle confirmation
  },
  onCancel: () => {
    // Optional cancel handler
  }
});
```

### Convenience Functions

```typescript
import { showError, showSuccess, showInfo, showConfirmation } from '../utils/alertService';

// Direct function calls (recommended for most use cases)
showError('Something went wrong');
showSuccess('Operation completed!');
showInfo('Here is some information');
showConfirmation({
  title: 'Delete Item',
  message: 'This action cannot be undone',
  destructive: true,
  onConfirm: () => handleDelete()
});
```

### React Hook (useAlert)

```typescript
import { useAlert } from '../utils/alertService';

const MyComponent = () => {
  const { showError, showSuccess, showConfirmation } = useAlert();

  const handleAction = () => {
    showConfirmation({
      title: 'Confirm',
      message: 'Are you sure?',
      onConfirm: () => {
        // Handle action
        showSuccess('Action completed!');
      }
    });
  };

  return (
    // Your component JSX
  );
};
```

## Migration from Alert.alert

### Before (Alert.alert)
```typescript
import { Alert } from 'react-native';

Alert.alert('Error', 'Something went wrong');

Alert.alert(
  'Confirm',
  'Are you sure?',
  [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: handleDelete }
  ]
);
```

### After (AlertService)
```typescript
import { showError, showConfirmation } from '../utils/alertService';

showError('Something went wrong');

showConfirmation({
  title: 'Confirm',
  message: 'Are you sure?',
  confirmText: 'Delete',
  destructive: true,
  onConfirm: handleDelete
});
```

## Benefits

1. **Consistent API**: Standardized interface across the app
2. **Better TypeScript Support**: Full type safety and intellisense
3. **Simplified Usage**: Convenience methods for common patterns
4. **Async Support**: Built-in async/await support in confirmation handlers
5. **Flexible**: Can still use full Alert.alert functionality when needed
6. **Testable**: Easier to mock and test than direct Alert.alert calls

## Alert Types

- **showError**: Red icon, error styling - for error messages
- **showSuccess**: Green icon, success styling - for success confirmations
- **showInfo**: Blue icon, info styling - for informational messages
- **showConfirmation**: Two buttons with customizable actions
- **showAlert**: Generic alert with custom buttons
- **showOptions**: Multiple choice alert with custom buttons

## RTL and Internationalization

The Alert Service works seamlessly with your app's internationalization:

```typescript
import { useLanguage } from '../contexts/LanguageContext';
import { showConfirmation } from '../utils/alertService';

const { t } = useLanguage();

showConfirmation({
  title: t('common.confirm'),
  message: t('common.deleteMessage'),
  confirmText: t('common.delete'),
  cancelText: t('common.cancel'),
  onConfirm: handleDelete
});
```
