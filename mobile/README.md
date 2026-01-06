# LankaTrips Mobile App

A professional React Native mobile application for LankaTrips customers to browse locations, packages, make bookings, and manage their travel plans.

## Features

### 🔐 Authentication
- User login and registration
- JWT token-based authentication
- Secure token storage with AsyncStorage

### 🏠 Home Screen
- Welcome dashboard
- Quick navigation to key features
- User-friendly interface

### 📍 Locations
- Browse Sri Lankan destinations
- Search functionality
- Detailed location information with image galleries
- Location highlights and descriptions

### 📦 Packages
- Browse travel packages
- Advanced filtering (category, region, price, duration)
- Package details with itineraries
- Image galleries and highlights

### 📅 Booking System
- Complete booking flow
- Date picker for travel dates
- Form validation
- Booking confirmation
- Real-time price calculation

### 📋 My Bookings
- View all user bookings
- Booking status tracking
- Detailed booking information

### 🧾 My Receipts
- View all receipts
- Download PDF receipts
- Share receipts
- Receipt management

### 👤 Profile Management
- User profile information
- Account settings
- Logout functionality

## Tech Stack

### Core
- **React Native 0.83.1** - Latest stable version
- **TypeScript** - Type safety and better development experience
- **React Navigation 7** - Navigation system

### UI/UX
- **React Native Paper** - Material Design components
- **React Native Vector Icons** - Icon library
- **React Native Fast Image** - Optimized image loading
- **React Native Safe Area Context** - Safe area handling

### Forms & Validation
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **@hookform/resolvers** - Form validation integration

### Networking
- **Axios** - HTTP client
- **AsyncStorage** - Local storage

### Additional Features
- **React Native Date Picker** - Date selection
- **React Native Toast Message** - Toast notifications
- **React Native File Viewer** - PDF viewing
- **React Native FS** - File system operations
- **React Native Share** - Share functionality

## Project Structure

```
src/
├── api/                 # API configuration and axios setup
├── components/          # Reusable UI components
├── context/            # React Context providers
├── navigation/         # Navigation configuration
├── screens/           # Screen components
│   ├── auth/         # Authentication screens
│   └── ...           # Other screens
├── theme/            # Theme and styling
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- React Native development environment
- Android Studio (for Android)
- Xcode (for iOS, macOS only)

### Installation

1. **Install dependencies:**
   ```bash
   cd mobile
   npm install
   ```

2. **iOS Setup (macOS only):**
   ```bash
   cd ios
   pod install
   cd ..
   ```

3. **Android Setup:**
   - Ensure Android SDK is installed
   - Create virtual device in Android Studio

### Running the App

1. **Start Metro bundler:**
   ```bash
   npm start
   ```

2. **Run on Android:**
   ```bash
   npm run android
   ```

3. **Run on iOS:**
   ```bash
   npm run ios
   ```

## Configuration

### API Configuration
Update the API base URL in `src/api/axios.ts`:
```typescript
const API_BASE_URL = 'http://10.0.2.2:5001'; // Android emulator
// const API_BASE_URL = 'http://localhost:5001'; // iOS simulator
// const API_BASE_URL = 'https://your-api-domain.com'; // Production
```

### Environment Setup
The app is configured to work with the LankaTrips server. Ensure the server is running on the configured URL.

## Key Features Implementation

### Authentication Flow
- Automatic token management
- Persistent login state
- Secure logout

### Navigation Structure
- Bottom tab navigation for main screens
- Stack navigation for detailed views
- Proper navigation state management

### Form Handling
- Real-time validation
- Error handling
- User-friendly error messages

### Image Handling
- Optimized image loading
- Image galleries with pagination
- Fallback for missing images

### File Operations
- PDF download and viewing
- File sharing capabilities
- Local file storage

## Performance Optimizations

- **Fast Image Loading** - Using react-native-fast-image
- **Lazy Loading** - Efficient list rendering with FlatList
- **Memory Management** - Proper cleanup and optimization
- **Network Optimization** - Request caching and error handling

## Security Features

- **Token Security** - Secure token storage
- **Input Validation** - Client-side and server-side validation
- **Error Handling** - Secure error messages

## Testing

Run tests with:
```bash
npm test
```

## Building for Production

### Android
```bash
cd android
./gradlew assembleRelease
```

### iOS
1. Open `ios/mobile.xcworkspace` in Xcode
2. Select "Product" → "Archive"
3. Follow App Store submission process

## Troubleshooting

### Common Issues

1. **Metro bundler issues:**
   ```bash
   npx react-native start --reset-cache
   ```

2. **Android build issues:**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npm run android
   ```

3. **iOS build issues:**
   ```bash
   cd ios
   pod install --repo-update
   cd ..
   npm run ios
   ```

### Network Issues
- Ensure the server is running
- Check API URL configuration
- Verify network connectivity

## Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Follow React Native best practices
4. Test on both platforms before submitting

## License

This project is part of the LankaTrips application suite.