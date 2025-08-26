# Firebase Authentication Setup Guide

This app uses Firebase Authentication for secure user authentication. Follow these steps to set up Firebase for your project:

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing project
3. Follow the setup wizard to create your project

## 2. Add Your App to Firebase

### For iOS:
1. In Firebase Console, click "Add app" and select iOS
2. Enter your iOS bundle ID (found in your iOS project settings)
3. Download the `GoogleService-Info.plist` file
4. Add this file to your iOS project in Xcode

### For Android:
1. In Firebase Console, click "Add app" and select Android
2. Enter your Android package name (found in `android/app/src/main/AndroidManifest.xml`)
3. Download the `google-services.json` file
4. Place this file in `android/app/` directory

## 3. Enable Authentication

1. In Firebase Console, go to "Authentication" in the left sidebar
2. Click on the "Sign-in method" tab
3. Enable "Email/Password" authentication
4. Optionally, enable other sign-in methods like Google, Facebook, etc.

## 4. Configure Security Rules (Optional)

Go to "Firestore Database" or "Realtime Database" and set up security rules as needed.

## 5. Test Your Authentication

The app includes:
- ✅ Email/Password Sign Up
- ✅ Email/Password Sign In
- ✅ Password Reset
- ✅ Secure local storage using Keychain (iOS) / Keystore (Android)
- ✅ Automatic session management
- ✅ User profile management

## Security Features Implemented

1. **Secure Storage**: User data is stored securely using:
   - iOS: Keychain Services with biometric protection
   - Android: Android Keystore with hardware-backed security

2. **Data Protection**: 
   - Sensitive data (auth tokens, user info) stored in secure hardware
   - Non-sensitive data (preferences) stored in AsyncStorage
   - Automatic data encryption at rest

3. **Session Management**:
   - Automatic token refresh
   - Secure sign-out that clears all local data
   - Session persistence across app restarts

4. **Input Validation**:
   - Email format validation
   - Password strength requirements
   - Real-time form validation with user-friendly error messages

## Environment Variables (Optional)

For additional security, you can use environment variables for configuration:

```bash
# .env file (create this in your project root)
FIREBASE_API_KEY=your_api_key_here
FIREBASE_PROJECT_ID=your_project_id_here
```

## Troubleshooting

1. **Build errors**: Make sure you've added the configuration files to the correct locations
2. **Authentication not working**: Check that Email/Password is enabled in Firebase Console
3. **iOS build issues**: Ensure `GoogleService-Info.plist` is added to your Xcode project
4. **Android build issues**: Ensure `google-services.json` is in the `android/app/` directory

## Next Steps

Once Firebase is configured, you can:
1. Test user registration and login
2. Add additional authentication providers
3. Implement user profile features
4. Add password complexity requirements
5. Set up email verification workflows
