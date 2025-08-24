# Event App - Event Discovery & Ticketing Platform

A React Native application for discovering and booking events with user authentication, favorites management, and multi-language support.

## 🚀 Features

- **User Authentication**: Sign up, sign in, and secure user management
- **Event Discovery**: Browse events using Ticketmaster API
- **Favorites System**: Save and manage favorite events
- **Multi-language Support**: English and Arabic with RTL support
- **Secure Storage**: Encrypted user data and preferences
- **Modern UI**: Clean, responsive design with smooth animations

## 📱 Screenshots

<!-- Add screenshots here -->

## 🛠️ Tech Stack

- **React Native** - Mobile app framework
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Navigation library
- **AsyncStorage** - Local data persistence
- **Ticketmaster API** - Event data source
- **Context API** - State management

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **React Native CLI** - `npm install -g react-native-cli`
- **Xcode** (for iOS development) - Mac only
- **Android Studio** (for Android development)
- **iOS Simulator** or **Android Emulator**

### Platform-specific Requirements

#### iOS (Mac only)
```bash
# Install Xcode from App Store
# Install iOS Simulator
# Install CocoaPods
sudo gem install cocoapods
```

#### Android
```bash
# Install Android Studio
# Set up Android SDK
# Create Android Virtual Device (AVD)
```

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd BankingApp
```

### 2. Install Dependencies
```bash
# Install npm packages
npm install

# Install iOS dependencies (Mac only)
cd ios && pod install && cd ..
```

### 3. Configure Environment
```bash
# Create environment file (optional)
cp .env.example .env

# Add your API keys (if needed)
# TICKETMASTER_API_KEY=your_api_key_here
```

### 4. Start Metro Bundler
```bash
# Start the React Native metro bundler
npm start
# or
npx react-native start
```

### 5. Run the Application

#### iOS (Mac only)
```bash
# Run on iOS Simulator
npm run ios
# or
npx react-native run-ios

# Run on specific iOS Simulator
npx react-native run-ios --simulator="iPhone 15 Pro"
```

#### Android
```bash
# Make sure Android emulator is running or device is connected
npm run android
# or
npx react-native run-android
```

## 📦 Available Scripts

```bash
# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run tests
npm test

# Type checking
npm run type-check

# Lint code
npm run lint

# Clean project
npm run clean

# Reset Metro cache
npm run reset-cache

Advanced Security Architecture: 
Encrypted Local Storage: User data and preferences encrypted with AsyncStorage
Secure Authentication: Password-based authentication with validation
Per-User Data Isolation: Individual secure storage per user account
Session Management: Persistent login state with secure token handling
Data Validation: Input sanitization and form validation

Real-Time API Integration
Live Ticketmaster API: Real-time event data from official Ticketmaster API
Dynamic Content Loading: Events fetched dynamically with search capabilities
Error Handling: Robust API error handling with fallback mechanisms
Rate Limiting: Intelligent API call management to prevent abuse
Image Optimization: Dynamic image loading with error handling

Smart Data Management
Personalized Favorites: User-specific favorites with instant sync
Offline Capability: Local storage ensures app works without internet
Data Persistence: User preferences survive app restarts
Efficient Caching: Smart caching for improved performance
Storage Optimization: Minimal storage footprint with efficient data structures

Advanced Internationalization
RTL Language Support: Complete Arabic language support with RTL layout
Dynamic Language Switching: Real-time language toggle without app restart
Cultural Adaptation: UI elements adapt to language direction
Localized Content: All text properly translated and culturally appropriate

Cross-Platform Excellence
Native Performance: React Native for near-native performance
Platform-Specific Optimizations: iOS and Android specific implementations
Responsive Design: Adapts to all screen sizes and orientations
Native Navigation: Smooth navigation with platform-specific animations

Modern User Experience
Component-Based Architecture: Reusable, maintainable UI components
TypeScript Integration: Type-safe development for reduced bugs
Context API State Management: Efficient state management across the app
Custom Hooks: Reusable business logic with React hooks
Accessibility Support: Screen reader and accessibility features

Performance Optimizations
Lazy Loading: Components and data loaded on demand
Memory Management: Efficient memory usage with proper cleanup
Image Caching: Smart image caching for faster loading
Bundle Optimization: Minimized bundle size for faster downloads
Debounced Search: Optimized search with debouncing

Advanced API Architecture
Generic API Component: Reusable API handling component
Loading States: Proper loading, error, and success states
Retry Mechanisms: Automatic retry for failed requests
Search & Filter: Advanced event filtering and search capabilities
Pagination Support: Efficient data loading with pagination

Production-Ready Quality
Error Boundaries: Graceful error handling throughout the app
Input Validation: Comprehensive form validation
Security Best Practices: Following React Native security guidelines
Code Documentation: Comprehensive code comments and documentation
Testing Support: Structure ready for unit and integration tests

```

## 🏗️ Project Structure

```
BankingApp/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ApiComponent.tsx
│   │   ├── ApiEventComponents.tsx
│   │   └── EventCard.tsx
│   ├── contexts/           # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── LanguageContext.tsx
│   ├── hooks/              # Custom React hooks
│   │   └── useTicketmasterEvents.ts
│   ├── screens/            # Application screens
│   │   ├── HomeScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── EventDetailsScreen.tsx
│   ├── services/           # API and storage services
│   │   ├── apiService.ts
│   │   └── secureStorage.ts
│   ├── styles/             # StyleSheet files
│   ├── types/              # TypeScript type definitions
│   │   └── navigation.ts
│   └── utils/              # Utility functions
│       └── alertService.ts
├── ios/                    # iOS-specific files
├── android/                # Android-specific files
└── package.json
```

## 🔧 Configuration

### API Configuration
The app uses the Ticketmaster API for event data. To use your own API key:

1. Sign up at [Ticketmaster Developer Portal](https://developer.ticketmaster.com/)
2. Get your API key
3. Update the API configuration in `src/services/apiService.ts`

### Storage Configuration
User data and preferences are stored locally using AsyncStorage with the following structure:

```
@user_data                    # Current user information
@user_favorites_{userId}      # User's favorite events
@app_preferences             # App settings (theme, language, etc.)
```

## 🔐 Authentication System

The app includes a complete authentication system:

- **Sign Up**: Create new user accounts
- **Sign In**: Authenticate existing users
- **User Persistence**: Maintain login state across app restarts
- **Secure Storage**: Encrypted user data storage

### Default Test Credentials
For testing purposes, you can use any email/password combination (minimum 6 characters).

## ❤️ Favorites System

Users can save and manage favorite events:

- **Add to Favorites**: Tap the heart icon on any event
- **Remove from Favorites**: Tap the heart icon again
- **Persistent Storage**: Favorites are saved per user
- **Visual Feedback**: Heart icon changes color based on status

## 🌍 Multi-language Support

The app supports:
- **English** (LTR)
- **Arabic** (RTL)

Switch languages in the Profile screen or through the language toggle.

## 🔍 Debugging

### Enable Debug Mode
```bash
# Enable React Native debugging
npx react-native log-ios    # iOS logs
npx react-native log-android # Android logs
```

### Common Debug Commands
```bash
# Reset Metro cache
npx react-native start --reset-cache

# Clean build
cd ios && xcodebuild clean && cd ..  # iOS
cd android && ./gradlew clean && cd .. # Android

# Rebuild app
npm run clean && npm install
```

## 🧪 Testing

### Run Tests
```bash
# Run unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Manual Testing Checklist
- [ ] User can sign up with new account
- [ ] User can sign in with existing account
- [ ] Events load correctly on Home screen
- [ ] User can add/remove favorites
- [ ] Favorites persist after app restart
- [ ] Profile screen shows correct information
- [ ] Language switching works
- [ ] Navigation between screens works

## 📝 Assumptions Made

### 1. **API Limitations**
- Using mock data when Ticketmaster API is unavailable
- Limited API calls to prevent rate limiting
- Event images may not always be available

### 2. **User Authentication**
- Simplified authentication for demo purposes
- No backend server required
- User data stored locally only

### 3. **Event Data**
- Event IDs from Ticketmaster API are used as unique identifiers
- Event availability and pricing are fetched in real-time
- Some events may not have complete information

### 4. **Storage Limitations**
- AsyncStorage has size limitations (~6MB on iOS, ~10MB on Android)
- No data synchronization between devices
- Local storage only - no cloud backup

### 5. **Platform Support**
- Designed primarily for iOS and Android
- Responsive design for various screen sizes
- RTL support for Arabic language

## 🚨 Troubleshooting

### Common Issues

#### Metro Bundler Issues
```bash
# Clear Metro cache
npx react-native start --reset-cache

# Clear npm cache
npm cache clean --force
```

#### iOS Build Issues
```bash
# Clean iOS build
cd ios && xcodebuild clean && cd ..

# Reinstall pods
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..
```

#### Android Build Issues
```bash
# Clean Android build
cd android && ./gradlew clean && cd ..

# Clear Android cache
rm -rf node_modules && npm install
```

#### AsyncStorage Issues
```bash
# Clear app data (will lose all stored data)
# iOS: Reset Simulator
# Android: Clear app data in settings
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you encounter any issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [Issues](link-to-issues)
3. Create a new issue with:
   - Device information
   - OS version
   - Error messages
   - Steps to reproduce

## 🚀 Deployment

### Building for Production

#### iOS
```bash
# Build for iOS App Store
cd ios
xcodebuild -workspace BankingApp.xcworkspace -scheme BankingApp -configuration Release
```

#### Android
```bash
# Build APK
cd android && ./gradlew assembleRelease

# Build AAB (for Play Store)
cd android && ./gradlew bundleRelease
```
Notes:

make sure package.json shouldn't be updated and podfile should be same
node version should be 18 and above
make sure to run in xcode 16.2.
link to App recording video: https://drive.google.com/file/d/1JsWUXG6_NR8wVTO3RwbmeFYskMLBpmoG/view?usp=drivesdk

**Made with ❤️ using React Native**