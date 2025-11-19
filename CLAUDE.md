# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the App
```bash
npm start              # Start Expo development server
npm run android        # Run on Android device/emulator
npm run ios            # Run on iOS device/simulator
npm run web            # Run in web browser
```

### TypeScript
This project uses TypeScript with strict mode enabled. The compiler enforces:
- Strict type checking
- No unused locals or parameters
- No implicit returns
- No fallthrough cases in switch statements

## Architecture Overview

### Navigation Structure
Single-stack navigation using React Navigation:
- `Splash` → `Login` → `LocationPreference` → `Map` (main screen) → `Settings` (modal)
- Settings screen uses a custom `CustomTabView` component (not a navigator) with three tabs: Profile, Privacy, and Friends
- Modal overlays (friend details, QR codes) are handled within screens, not as separate navigation routes

### State Management
Four-tier Context API provider hierarchy (defined in App.tsx):

1. **AuthContext** - Authentication state (`isAuthenticated`, `isLoading`)
2. **UserContext** - Current user profile, location data, and sharing preferences
3. **FriendsContext** - Friends list and friend requests (populated with mock data)
4. **ToastContext** - Global toast notification system

All contexts follow the same pattern: context creation, provider component, and custom hook for access.

### Mock Data System
The app currently uses mock data for the MVP:
- `utils/mockData.ts` contains factory functions: `generateMockFriends()` and `generateMockFriendRequests()`
- Mock friends (50 total, 35 in New York for testing marker pooling) are loaded in FriendsContext on app initialization
- Async operations (login, friend requests) use `setTimeout` to simulate API calls
- To implement real backend: replace context method implementations with actual API calls

### Design System
Centralized theme at `styles/theme.ts`:
- **Colors**: Blue palette (#B1B2FF primary, #AAC4FF secondary, #D2DAFF light, #EEF1FF pale)
- **Spacing**: Scale from xs (4px) to xxxl (48px)
- **Border radius**: Minimum 16px for buttons/cards, 12px for inputs
- **Typography**: Font sizes and weights defined as constants
- All components must import from theme for consistency

### Type Safety
All domain models defined in `utils/types.ts`:
- `User`, `Friend`, `FriendRequest`, `Region`, `SharingLevel`, `ToastType`
- Navigation types in `RootStackParamList` for type-safe routing
- Use strict TypeScript - the compiler will catch type errors

## Key Implementation Details

### Location Handling
Two sharing levels drive the core privacy model:
- **City-only**: Users share approximate location (city name via reverse geocoding)
- **Real-time**: Users share exact GPS coordinates

Location updates use expo-location with different frequencies based on sharing level.

### Map Rendering
- `MapScreen` uses react-native-maps with custom styling to match the blue theme
- Friend markers rendered with custom `MapMarker` component:
  - Real-time: Solid border with pulsing animation
  - City-only: Dashed border, no pulse
  - Offline: 50% opacity
- Friend detail cards slide up from bottom using Animated API (not a separate screen)

### Custom Components
Reusable components in `/components`:
- **CustomTabView**: Generic tab container accepting tab config array, manages active state
- **Avatar**: Circular with status indicators and fallback initials
- **Button**: Three variants (primary, secondary, text) with loading states
- **Card**: Selectable cards with animation and selected state styling
- **Input**: Text fields with icons, error states, multiline support
- **Toast**: Global notifications rendered at provider level

### Settings Screen Pattern
`SettingsScreen` wraps `CustomTabView` with three tab components as children:
- `ProfileTab`: Profile photo, name, bio editing
- `PrivacyTab`: Location sharing toggles and default sharing level
- `FriendsTab`: Friend list, search, requests, QR code functionality

These are screen-level sub-components, not separate navigation screens.

## Common Patterns

### Adding New Context State
1. Create context file in `/context` following existing pattern
2. Define TypeScript interface for context shape
3. Create provider component with useState
4. Export custom hook with error handling
5. Add provider to App.tsx hierarchy

### Adding New Screens
1. Create screen component in `/screens`
2. Import theme from `styles/theme.ts` for styling
3. Add screen to `RootStackParamList` in `navigation/AppNavigator.tsx`
4. Add Stack.Screen in AppNavigator component
5. Use `navigation.navigate('ScreenName')` to navigate

## Configuration Files

### app.json
- **iOS**: Privacy descriptions required for location and camera access
- **Android**: Google Maps API key placeholder at `android.config.googleMaps.apiKey`
- **Plugins**: expo-location, expo-notifications, expo-camera configured
- **Permissions**: Location (foreground/background) and camera permissions defined

### package.json
- React 19.1.0 with React Native 0.81.5
- Expo SDK 54
- No test scripts currently defined

## Privacy & Permissions
The app requires careful permission handling:
- Request foreground location on `LocationPreferenceScreen`
- Request background location only for real-time sharing users
- Request camera permission for QR code scanning in FriendsTab
- Show educational modals when permissions are denied

## Important Notes

- All styling uses StyleSheet.create() for performance
- Animations use native driver when possible
- This is an MVP - no real authentication or backend integration yet
- PRD.md contains complete product specifications
- The app follows a "privacy-first" design philosophy - always give users granular control

## Target Architecture (Phase 2)

The app is designed to integrate with a TEE (Trusted Execution Environment) backend for truly private location sharing:

### Data Flow
```
📱 React Native App (User)
    │
    │  (1) Get GPS via OS API
    │  (2) Verify enclave attestation
    │  (3) Encrypt(location) + Sign(payload)
    │──────────────────────────────────────────▶
    │             Encrypted upload
    │
    ▼
🌐 ROFL REST endpoint (inside Oasis TEE)
    │
    │  (4) Decrypt + compute proximity to friends
    │  (5) Enforce sharing policies (city / exact)
    │  (6) Encrypt personalized results for user(s)
    │◀──────────────────────────────────────────
    │             Encrypted response
    ▼
📱 React Native App (User)
    │
    │  (7) Decrypt result (e.g. "Friend X within 5 km")
    │  (8) Display or trigger in-app action / push
```

### Key Components
- **Oasis ROFL**: TEE computation for location processing
- **Sapphire Blockchain**: Social graph storage and verification
- **Enclave Attestation**: Verify TEE integrity before sending data
- **End-to-End Encryption**: Location data encrypted client-side

See `FRONTEND_ARCHITECTURE.md` for detailed technical architecture and `PROGRESS.md` for implementation status.

### Working with Mock Data
Current mock data simulates 50 friends across global cities. When implementing real features:
- Keep mock data structure intact for testing
- Replace context method internals (not signatures)
- FriendsContext methods like `addFriend()` currently just update local state
