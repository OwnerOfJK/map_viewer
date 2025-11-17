# Location Tracker - React Native App

A privacy-first, real-time location sharing mobile application built with React Native and Expo.

## 🎯 Features

- **Privacy-First Design**: Choose between city-level or real-time location sharing
- **Friend Management**: Add friends via username or QR code
- **Interactive Map**: View friend locations on a beautiful custom-styled map
- **Comprehensive Settings**: Manage profile, privacy, and friend connections
- **Beautiful UI**: Calming blue color palette with rounded design language

## 📱 Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript 5.6
- **Navigation**: React Navigation v6 (Stack & Material Top Tabs)
- **State Management**: React Context API
- **Maps**: react-native-maps
- **Location**: expo-location
- **UI Components**: Custom components with consistent design system

## 📂 Project Structure

```
/screens          - All page/screen components
/components       - Reusable UI components (Button, Input, Card, Avatar, etc.)
/navigation       - Navigation configuration
/utils            - Helper functions, constants, types
/context          - React Context providers for state management
/assets           - Images, fonts, icons
/styles           - Global styles and theme constants
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo Go app on your mobile device (iOS or Android)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Scan the QR code with Expo Go (Android) or Camera app (iOS)

### Running on Specific Platforms

```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## 🎨 Design System

### Color Palette

- **Primary Blue** (#B1B2FF): Primary actions, CTAs, active states
- **Secondary Blue** (#AAC4FF): Secondary buttons, interactive elements
- **Light Blue** (#D2DAFF): Backgrounds, card containers
- **Pale Blue** (#EEF1FF): Page backgrounds, disabled states
- **White** (#FFFFFF): Content cards, modals
- **Dark Gray** (#1A1A1A): Primary text, icons

### Design Principles

- Minimum border radius: 16px for buttons and cards
- Rounded shapes: Circular avatars and map markers
- Soft shadows with 0.1-0.15 opacity
- Smooth transitions: 200-300ms duration
- Touch feedback on all interactive elements

## 📱 Screens Overview

### 1. Splash Screen
- Animated introduction with app logo
- Auto-navigates after 2.5 seconds
- Checks authentication state

### 2. Login Screen
- Email and password input (MVP - no actual auth)
- Navigates to Location Preference after login

### 3. Location Preference Screen
- One-time onboarding
- Choose between City-only or Real-time sharing
- Requests location permissions

### 4. Map Screen (Main)
- Interactive world map with friend markers
- Custom markers based on sharing level
- Friend detail card on marker tap
- Center on location button

### 5. Settings Screen
Three tabs for comprehensive settings:

#### Profile Tab
- Update profile photo
- Edit name and bio
- View username and email

#### Privacy Tab
- Toggle location sharing
- Choose default sharing level (City/Real-time)
- Pause location updates
- View last update time

#### Friends Tab
- Search friends
- Add by username or QR code
- View/generate QR code
- Accept/decline friend requests
- Manage existing friends

## 🔧 Key Components

### Reusable Components
- **Button**: Primary, secondary, and text variants with loading states
- **Input**: Text fields with icons, error states, and multiline support
- **Card**: Selectable cards with animations
- **Avatar**: Circular avatars with fallback initials and status indicators
- **MapMarker**: Custom map markers with pulsing animation for real-time sharing
- **Toast**: Notification system with success, error, and info types

### Context Providers
- **AuthContext**: Authentication state management
- **UserContext**: User profile and settings
- **FriendsContext**: Friends and friend requests
- **ToastContext**: Global toast notifications

## 🧪 Mock Data

The app includes 25 mock friends with diverse locations around the world:
- Mix of city-level and real-time sharing
- Various online/offline statuses
- Locations spanning major cities globally

## 🔐 Permissions Required

- **Location (Foreground)**: Required for basic location sharing
- **Location (Background)**: Required for real-time location updates
- **Camera**: Required for QR code scanning
- **Photo Library**: Required for profile photo updates

## 📝 Configuration

### Google Maps API (Android)
Add your Google Maps API key in `app.json`:
```json
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "YOUR_API_KEY_HERE"
    }
  }
}
```

## 🎯 MVP Scope

This is an MVP (Minimum Viable Product) with the following limitations:
- No real authentication (placeholder UI only)
- No actual backend integration
- Mock friend data
- QR code scanning is functional but doesn't send real friend requests
- No actual messaging functionality (placeholder button)

## 🚧 Future Enhancements

Planned for Phase 2+:
- Real authentication system
- Backend API integration
- In-app messaging
- Location history
- Friend groups
- Events and check-ins
- Dark mode
- WebSocket for real-time updates

## 📄 License

This project follows the specifications outlined in PRD.md

## 🤝 Contributing

This is an MVP built according to the Product Requirements Document. Refer to PRD.md for complete specifications.

## 📞 Support

For issues or questions, please refer to the PRD.md documentation.

---

Built with ❤️ using React Native and Expo
