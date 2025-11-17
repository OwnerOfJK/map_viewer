# Location Tracker App
# Product Requirements Document

**Frontend Development Specification**  
*React Native with Expo*

**Version 1.0**  
November 16, 2025

---

## Executive Summary

Location Tracker is a privacy-first, real-time location sharing mobile application that connects friends around the world. Built with React Native and Expo, the app provides users with granular control over their location visibility while maintaining an intuitive and beautiful user experience.

The app empowers users to choose between sharing their exact real-time location or just their current city with individual friends. With a clean, rounded design language and a calming blue color palette, Location Tracker prioritizes both functionality and aesthetics.

### Product Vision

Create a trustworthy platform where friends can stay connected through location sharing while maintaining complete control over their privacy. The app should feel familiar, safe, and delightful to use.

### Key Principles

- **Privacy First:** Users have granular control over what they share and with whom
- **Intuitive Design:** Clear navigation with rounded, friendly UI elements
- **Performance:** Smooth animations and minimal battery drain
- **Transparency:** Users always know when and what location data is being shared

---

## Color System & Design Language

### Color Palette

The app uses a calming blue color palette with five shades plus white. Each color serves a specific purpose in the visual hierarchy:

| Color | Hex Code | Usage |
|-------|----------|-------|
| **Primary Blue** | #B1B2FF | Primary actions, CTAs, active states, accent elements |
| **Secondary Blue** | #AAC4FF | Secondary buttons, hover states, interactive elements |
| **Light Blue** | #D2DAFF | Backgrounds, card containers, subtle highlights |
| **Pale Blue** | #EEF1FF | Page backgrounds, input fields, disabled states |
| **White** | #FFFFFF | Content cards, modals, primary surfaces |
| **Dark Gray** | #1A1A1A | Primary text, icons, high-contrast elements |

### Design Language

- **Rounded Corners:** All UI elements use border radius of 16px minimum (buttons, cards, inputs)
- **Rounded Shapes:** Circular map markers, rounded user avatars, circular buttons for primary actions
- **Soft Shadows:** Subtle elevation with shadow opacity 0.1-0.15
- **Smooth Transitions:** All state changes animated with 200-300ms duration
- **Touch Feedback:** Visual feedback on all interactive elements (scale or opacity changes)

---

## Technical Stack

### Core Technologies

- **Framework:** React Native with Expo SDK
- **Navigation:** React Navigation v6+ (Stack Navigator)
- **State Management:** React Context API or Zustand (lightweight state management)
- **Map Component:** react-native-maps
- **Location Services:** expo-location
- **Styling:** StyleSheet with potential for styled-components

### Key Dependencies

- **expo-location** - Location tracking and permissions
- **react-native-maps** - Map rendering and custom styling
- **expo-notifications** - Push notifications for friend requests
- **expo-image-picker** - Profile picture selection
- **react-native-flag** - Country flag visualization

---

## Page Specifications

### 1. Splash Screen

#### Purpose
Brief animated introduction that appears on app launch, then automatically transitions to the Login Page after 2-3 seconds.

#### UI Elements
- App logo or icon (centered)
- App name: "Location Tracker" (below logo)
- Background: Gradient from #EEF1FF to #D2DAFF
- Loading indicator (optional, small animated pulse)

#### Behavior
- Fade-in animation on mount (300ms)
- Display for 2-3 seconds
- Fade-out transition to Login Page (300ms)
- Check authentication state during splash (if user already logged in, navigate directly to Map Page)

#### Component Structure
**File:** `screens/SplashScreen.js`
- Use useEffect to handle automatic navigation after timeout
- Use Animated API from React Native for smooth transitions

---

### 2. Login Page

#### Purpose
Authentication entry point. For MVP, this is a placeholder with UI only - actual authentication will be implemented in Phase 2.

#### UI Elements
- App logo (top center, smaller than splash)
- Welcome text: "Welcome Back" (large, bold, #1A1A1A)
- Subtitle: "Connect with friends around the world" (smaller, #6B7DB8)
- Email input field (rounded, background #FFFFFF, border #D2DAFF)
- Password input field (rounded, background #FFFFFF, border #D2DAFF, secure entry)
- "Login" button (large, rounded, background #B1B2FF, text #FFFFFF, bold)
- "Sign Up" link (bottom, smaller text, color #AAC4FF)
- Background: Solid #EEF1FF

#### Behavior (MVP - Placeholder)
- Login button navigates to Location Preference Page (no actual authentication)
- Input fields are functional but not validated
- Sign Up link is visible but not functional (placeholder for future)

#### Component Structure
**File:** `screens/LoginScreen.js`
- Use KeyboardAvoidingView to prevent keyboard overlap
- Input fields should use controlled components with useState
- Button press provides haptic feedback

---

### 3. Location Preference Page (Onboarding)

#### Purpose
One-time onboarding screen where users set their default location sharing preference. Users can change this later in Settings.

#### UI Elements
- Header: "Choose Your Privacy Level" (bold, #1A1A1A)
- Subtitle: "You can change this anytime in Settings" (smaller, #6B7DB8)
- Two large selection cards (rounded, white background, subtle shadow):
  - **Card 1 - City Only:** Icon of city skyline, "Share My City" title, description "Friends see only the city you're in"
  - **Card 2 - Real-Time:** Icon of location pin, "Share Real-Time Location" title, description "Friends see your exact location"
- Selected card has border color #B1B2FF and background tint #F5F6FF
- Current location display showing country flag (using react-native-flag) and city/country name
- "Continue" button at bottom (rounded, #B1B2FF, enabled only when selection made)

#### Behavior
- On mount, request location permission using expo-location
- Fetch current location and display country flag + city name
- Allow user to select one of the two cards (toggle selection)
- Animate card selection with scale effect
- Continue button navigates to Map Page and saves preference to local storage
- If location permission denied, show educational modal explaining why it's needed

#### Component Structure
**File:** `screens/LocationPreferenceScreen.js`
- Use expo-location for getting current coordinates
- Use reverse geocoding to get city name from coordinates
- Use react-native-flag to display country flag based on country code

---

### 4. Map Page (Primary Screen)

#### Purpose
The core experience. Shows an interactive map with friend locations around the world. This is where users spend most of their time.

#### UI Elements

**Full-screen Map (react-native-maps):**
- Custom map style matching color palette (light blue water, pale backgrounds)
- Initial region centered on user's location
- Zoom level: World view initially, allowing zoom in/out

**Map Markers (Custom Markers):**
- **Real-time location markers:** Circular avatar with thin border #B1B2FF, pulsing animation
- **City-only markers:** Circular avatar with dotted border #AAC4FF, no pulse
- **Offline markers:** Greyed out avatar with 50% opacity
- **Clustered markers:** When multiple friends in same area and zoomed out, show number in circle

**Top Bar (Overlay):**
- Semi-transparent background #FFFFFF with 80% opacity
- Left: App name or logo
- Right: Settings icon button (circular, #B1B2FF background on press)

**Bottom Action Button:**
- Floating circular button (center bottom)
- Icon: Current location crosshair
- Tapping centers map on user's current location

**Friend Detail Card (Popup on Marker Tap):**
- Slide up from bottom, rounded top corners
- Friend's profile picture (large, centered top)
- Friend's name (bold, #1A1A1A)
- Last updated time (small, #6B7DB8, e.g., "Updated 5 min ago")
- Location info: City name or exact coordinates based on sharing level
- "Send Message" button (rounded, #AAC4FF, placeholder for future)
- Swipe down to dismiss

#### Behavior
- On mount, load user's friends and their locations from backend (mocked for now)
- Render markers for each friend based on their sharing preference
- Implement marker clustering when zoomed out (using react-native-maps-super-cluster or similar)
- On marker tap, show friend detail card with animation
- Settings button navigates to User Settings Page
- Center location button animates map to user's current position
- Background location updates (when app is backgrounded, update user's location every 5-10 minutes if real-time sharing enabled)
- Handle location permission edge cases gracefully

#### Map Styling (Custom JSON)
Create custom map style JSON matching the blue color palette:
- Water color: #AAC4FF (lighter blue)
- Land color: #EEF1FF (pale blue)
- Roads: Light gray #D2DAFF
- POI labels: Minimized or hidden

#### Component Structure
**File:** `screens/MapScreen.js`
- Use react-native-maps MapView component
- Custom Marker component for friend avatars
- BottomSheet or Modal component for friend detail card
- Use expo-location watchPositionAsync for real-time updates

---

### 5. User Settings Page

#### Purpose
Comprehensive settings hub organized into three tabs: Profile, Privacy, and Friends. Users manage their account, privacy controls, and friend connections.

#### Navigation Structure
Tab-based layout with three sections. Tabs at the top with active tab indicator (#B1B2FF underline).

---

#### Tab 1: Profile

**UI Elements:**
- Profile picture (large, circular, centered at top)
- "Change Photo" button (below picture, text button, #AAC4FF)
- Name input field (rounded, white background)
- Bio/Description textarea (rounded, white background, max 150 characters)
- "Save Changes" button (rounded, #B1B2FF, bottom of screen)

**Behavior:**
- Change Photo opens image picker (expo-image-picker)
- Input validation for name (min 2 characters, max 50)
- Save button shows loading state and success feedback

---

#### Tab 2: Privacy

**UI Elements:**

**Location Sharing Toggle:**
- Switch component (iOS-style, color #B1B2FF when active)
- Label: "Enable Location Sharing"
- Description: "When off, no friends can see your location"

**Default Sharing Level:**
- Two radio button options: "City Only" or "Real-Time"
- Selected option has #B1B2FF color

**Who Can See My Location:**
- List of friends with individual toggles (for future granular permissions)
- Currently shows "All Friends" as default

**Activity Status:**
- Informational card showing: "Last location update: [time]"
- "Pause Updates" button (to temporarily stop location sharing)

**Behavior:**
- Toggle changes save automatically with visual confirmation
- Pausing updates stops background location tracking until re-enabled
- Show warning modal when completely disabling location sharing

---

#### Tab 3: Friends

**UI Elements:**

**Search Bar:**
- Rounded input field (background #FFFFFF, border #D2DAFF)
- Placeholder: "Search by username"
- Search icon inside field (left side)

**Add Friend Methods:**
- "Add by Username" button (rounded, #AAC4FF)
- "Scan QR Code" button (rounded, #B1B2FF) - Opens QR scanner
- "My QR Code" button (text button, shows user's QR code in modal)

**Pending Requests Section:**
- Header: "Pending Requests ([count])"
- List of incoming friend requests:
  - Avatar (small, left)
  - Username and name
  - "Accept" button (rounded, #B1B2FF, small)
  - "Decline" button (rounded, outline only, #6B7DB8 border)

**Friends List:**
- Header: "Your Friends ([count])"
- Scrollable list of current friends:
  - Avatar (medium, left)
  - Username and name
  - Last seen location (city or "Near you" if close)
  - Three-dot menu for: "View on Map", "Unfriend", "Block"

**Behavior:**
- Username search filters friends list in real-time
- Add by Username opens modal with input field and "Send Request" button
- QR Code scanner uses device camera, shows success/failure feedback
- My QR Code modal shows user's unique QR code (can be screenshot or shared)
- Accept/Decline actions show confirmation toast and update list
- "View on Map" navigates back to Map Page centered on friend's location
- Unfriend shows confirmation dialog

#### Component Structure
**File:** `screens/SettingsScreen.js`
- Use Tab Navigator (createMaterialTopTabNavigator from React Navigation)
- Three separate components: `ProfileTab.js`, `PrivacyTab.js`, `FriendsTab.js`
- Use FlatList for friends list for performance
- QR Code generation using expo-barcode-scanner or react-native-qrcode-svg

---

## Component Library

Reusable components to maintain consistency across the app. All components should follow the design language.

### Button Component
**File:** `components/Button.js`
- Variants: primary (filled), secondary (outline), text
- Props: title, onPress, variant, disabled, loading, icon
- Border radius: 16px
- Padding: 12px vertical, 24px horizontal
- Touch feedback: scale animation to 0.95
- Loading state shows spinner, disabled state has 50% opacity

### Input Component
**File:** `components/Input.js`
- Props: value, onChangeText, placeholder, secure, multiline, icon, error
- Border radius: 12px
- Background: #FFFFFF
- Border: 1px solid #D2DAFF (default), #B1B2FF (focused), red (error)
- Padding: 12px
- Error message below input in red

### Card Component
**File:** `components/Card.js`
- Props: children, onPress, selected
- Border radius: 20px
- Background: #FFFFFF
- Shadow: shadowColor #000, shadowOffset (0, 2), shadowOpacity 0.1, shadowRadius 8
- Selected state: border 2px solid #B1B2FF, background tint #F5F6FF
- Padding: 16px

### Avatar Component
**File:** `components/Avatar.js`
- Props: imageUri, size (small/medium/large), status (online/offline)
- Sizes: small (40px), medium (60px), large (100px)
- Border radius: 50% (circular)
- Status indicator: small dot (bottom right), green for online, gray for offline
- Fallback: Shows initials with gradient background if no image

### MapMarker Component
**File:** `components/MapMarker.js`
- Props: friend (object with imageUri, sharingLevel, isOnline)
- Renders custom marker with avatar and border styling based on sharing level
- Real-time: solid border #B1B2FF with pulsing animation
- City-only: dashed border #AAC4FF
- Offline: 50% opacity

### Toast Component
**File:** `components/Toast.js`
- Props: message, type (success/error/info), duration
- Appears at top of screen, slides down with animation
- Auto-dismisses after duration (default 3 seconds)
- Success: #B1B2FF background, Error: red background, Info: #AAC4FF background

---

## Privacy & Security Requirements

### Location Permissions
- **Foreground Permission:** Request when user first opens Location Preference page
- **Background Permission:** Request ONLY if user selects real-time sharing, with clear explanation
- **Permission Denied Handling:** Show educational modal explaining benefits, offer to open settings
- **Transparency:** Always show when location is being actively tracked (status bar indicator on iOS)

### Data Handling
- Never store exact coordinates locally (only send to backend)
- Cache city-level data only for offline functionality
- Clear all location data when user logs out
- Implement data encryption for sensitive information (future phase)

### User Controls
- Ability to pause location sharing without logging out
- Ability to switch between city-only and real-time at any time
- Ability to see who can currently see user's location
- Ability to block/unfriend users, immediately stopping location sharing

---

## Performance Requirements

### Battery Optimization

**Location Update Frequency:**
- Real-time: Update every 5-10 minutes when app backgrounded
- Real-time: Update every 30 seconds when app in foreground
- City-only: Update only when city changes (significant location change)
- Use significant location change monitoring (iOS) / fused location provider (Android)
- Stop location updates when app is terminated or user pauses sharing

### Rendering Performance
- Use FlatList for any lists (friends, requests) with proper keyExtractor
- Implement marker clustering for map to prevent rendering hundreds of markers
- Lazy load images with placeholder avatars
- Debounce search inputs (300ms delay)
- Use React.memo for components that don't need frequent re-renders

### Animation Performance
- Use native driver for animations whenever possible
- Keep animations under 300ms for snappy feel
- Limit simultaneous animations to avoid frame drops

---

## Notification System

Use expo-notifications for push notification handling. Request permission on first login.

### Notification Types
- **Friend Request Received:** "[Username] sent you a friend request"
- **Friend Request Accepted:** "[Username] accepted your friend request"
- **Friend Nearby (optional):** "[Username] is now in [City]" - only if both users have real-time sharing enabled

### Notification Behavior
- Tapping notification navigates to relevant screen (Friends tab for requests, Map for location)
- Badge count on app icon for pending friend requests
- Allow users to disable specific notification types in Privacy settings (future)

---

## Error Handling & Edge Cases

### Network Errors
- Show toast: "Unable to connect. Please check your internet."
- Cache last known friend locations for offline viewing
- Queue location updates to send when connection restored
- Retry failed requests with exponential backoff

### Location Errors
- GPS unavailable: Show modal explaining to check device settings
- Location timeout: Retry once, then show error toast
- Permission revoked: Detect change and prompt user to re-enable

### Empty States
- No friends yet: Show friendly illustration with "Add Friends" CTA
- No pending requests: "No pending requests" with checkmark icon
- Search no results: "No friends found matching '[query]'"

---

## Future Considerations (Phase 2+)

Features to consider for future iterations after MVP is validated:

### Enhanced Features
- **In-App Messaging:** Direct messaging between friends
- **Location History:** Timeline view of where friends have been (with permission)
- **Groups:** Create friend groups for easier sharing management
- **Check-ins:** Manual location sharing at specific places
- **Events:** Create events with location pins for meetups
- **Geofencing:** Notify when friends enter/leave specific areas
- **Dark Mode:** Dark theme variant with adjusted color palette

### Technical Enhancements
- WebSocket connection for real-time location updates (instead of polling)
- Offline-first architecture with sync when online
- End-to-end encryption for location data
- Analytics integration for usage insights (privacy-respecting)

---

## Development Workflow & Best Practices

### Project Structure

Recommended folder structure:

```
/screens          - All page/screen components
/components       - Reusable UI components
/navigation       - Navigation configuration
/utils            - Helper functions, constants
/services         - API calls, location services
/context          - React Context providers for state
/assets           - Images, fonts, icons
/styles           - Global styles, theme constants
```

### Coding Standards
- Use functional components with hooks (no class components)
- Follow ESLint rules (Airbnb style guide recommended)
- PropTypes or TypeScript for type safety (TypeScript preferred for scaling)
- Meaningful variable names, no single-letter variables except for loops
- Extract magic numbers to constants (e.g., BORDER_RADIUS, UPDATE_INTERVAL)

### Testing Checklist
- Test on both iOS and Android devices
- Test all permission flows (grant, deny, ask again)
- Test offline behavior and reconnection
- Test with 0 friends, 1 friend, 50+ friends for performance
- Test background location updates (leave app idle for 30+ minutes)
- Test accessibility with screen readers

### Version Control
- Branch naming: feature/feature-name, bugfix/bug-description
- Commit messages: Clear, descriptive (e.g., "Add friend request notification handling")
- Create PRs for all features, even if solo developer (good documentation)

---

## Appendix

### Quick Reference: Color Usage

- **#B1B2FF:** Primary buttons, active states, main CTAs, real-time marker borders
- **#AAC4FF:** Secondary buttons, hover effects, city-only marker borders, links
- **#D2DAFF:** Card backgrounds, input borders (default), subtle highlights
- **#EEF1FF:** Page backgrounds, disabled states, very light accents
- **#FFFFFF:** Content cards, modals, input fields, primary text surfaces
- **#1A1A1A:** Primary text, icons, headings, high-contrast elements

### Glossary

- **City-Only Sharing:** Privacy level where only the city name is visible to friends, not exact coordinates
- **Real-Time Sharing:** Privacy level where exact GPS coordinates are shared with friends
- **Marker Clustering:** Grouping multiple markers together when zoomed out to avoid visual clutter
- **Geofencing:** Creating virtual boundaries that trigger notifications when crossed
- **Background Location:** Tracking user location even when app is not actively open
- **Reverse Geocoding:** Converting GPS coordinates to human-readable address/city name

---

**END OF DOCUMENT**

*This PRD serves as the complete specification for frontend development.*
