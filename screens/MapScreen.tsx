import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { MapMarker } from '../components/MapMarker';
import { FriendDetailModal } from '../components/FriendDetailModal';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius, Shadows } from '../styles/theme';
import { useFriends } from '../context/FriendsContext';
import { useUser } from '../context/UserContext';
import { Friend, Region, PooledMarker } from '../utils/types';
import { MAP_SETTINGS } from '../utils/constants';

const { height } = Dimensions.get('window');

// Zoom level threshold for pooling real-time sharers with city-level sharers
const ZOOM_THRESHOLD = 10;

interface MapScreenProps {
  navigation: any;
}

export const MapScreen: React.FC<MapScreenProps> = ({ navigation }) => {
  const mapRef = useRef<MapView>(null);
  const slideAnim = useRef(new Animated.Value(height)).current;

  const { friends } = useFriends();
  const { user } = useUser();

  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);
  const [region, setRegion] = useState<Region>({
    latitude: 20,
    longitude: 0,
    latitudeDelta: MAP_SETTINGS.INITIAL_DELTA,
    longitudeDelta: MAP_SETTINGS.INITIAL_DELTA,
  });
  const [currentZoom, setCurrentZoom] = useState<number>(MAP_SETTINGS.INITIAL_DELTA);

  useEffect(() => {
    centerOnUserLocation();
  }, []);

  const centerOnUserLocation = async () => {
    if (user?.location) {
      const newRegion = {
        latitude: user.location.latitude,
        longitude: user.location.longitude,
        latitudeDelta: 10,
        longitudeDelta: 10,
      };
      setRegion(newRegion);
      setCurrentZoom(10);
      mapRef.current?.animateToRegion(newRegion, MAP_SETTINGS.ANIMATION_DURATION);
    }
  };

  const handleRegionChange = (newRegion: Region) => {
    setCurrentZoom(newRegion.latitudeDelta);
  };

  const poolMarkers = (): PooledMarker[] => {
    const shouldPoolRealtime = currentZoom > ZOOM_THRESHOLD;
    const cityGroups: { [key: string]: Friend[] } = {};
    const cityTotals: { [key: string]: number } = {};

    // First pass: count ALL friends in each city (for display count)
    friends.forEach((friend) => {
      if (friend.location.city) {
        const cityKey = `${friend.location.city}-${friend.location.country}`;
        cityTotals[cityKey] = (cityTotals[cityKey] || 0) + 1;
      }
    });

    // Second pass: group friends that should be pooled
    friends.forEach((friend) => {
      // Only pool city-level sharers by default, or all friends if zoomed out
      const shouldPool =
        friend.sharingLevel === 'city' ||
        (shouldPoolRealtime && friend.sharingLevel === 'realtime');

      if (shouldPool && friend.location.city) {
        const cityKey = `${friend.location.city}-${friend.location.country}`;
        if (!cityGroups[cityKey]) {
          cityGroups[cityKey] = [];
        }
        cityGroups[cityKey].push(friend);
      }
    });

    return Object.entries(cityGroups)
      .filter(([_, friendsList]) => friendsList.length > 0)
      .map(([cityKey, friendsList]) => ({
        id: cityKey,
        location: friendsList[0].location,
        friends: friendsList,
        count: cityTotals[cityKey], // Use total count of all friends in city
      }));
  };

  const handleMarkerPress = (friendsToShow: Friend[]) => {
    setSelectedFriends(friendsToShow);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  };

  const closeFriendDetail = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSelectedFriends([]);
    });
  };

  const mapStyle = [
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: Colors.mapWater }],
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ color: Colors.mapLand }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: Colors.mapRoads }],
    },
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ];

  const pooledMarkers = poolMarkers();
  const pooledFriendIds = new Set(
    pooledMarkers.flatMap((marker) => marker.friends.map((f) => f.id))
  );

  // Get individual markers (real-time sharers when zoomed in)
  const individualMarkers = friends.filter(
    (friend) =>
      !pooledFriendIds.has(friend.id) &&
      friend.sharingLevel === 'realtime' &&
      currentZoom <= ZOOM_THRESHOLD
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        customMapStyle={mapStyle}
        showsUserLocation
        showsMyLocationButton={false}
        onRegionChangeComplete={handleRegionChange}
      >
        {/* Pooled markers */}
        {pooledMarkers.map((pooledMarker) => (
          <MapMarker
            key={pooledMarker.id}
            pooledMarker={pooledMarker}
            onPress={() => handleMarkerPress(pooledMarker.friends)}
          />
        ))}

        {/* Individual real-time markers when zoomed in */}
        {individualMarkers.map((friend) => (
          <MapMarker
            key={friend.id}
            friend={friend}
            onPress={() => handleMarkerPress([friend])}
          />
        ))}
      </MapView>

      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.appName}>Location Tracker</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Ionicons name="settings-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Center on Location Button */}
      <TouchableOpacity
        style={styles.centerButton}
        onPress={centerOnUserLocation}
      >
        <Ionicons name="locate" size={24} color={Colors.white} />
      </TouchableOpacity>

      {/* Friend Detail Modal */}
      <FriendDetailModal
        selectedFriends={selectedFriends}
        visible={selectedFriends.length > 0}
        onClose={closeFriendDetail}
        slideAnim={slideAnim}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: Spacing.lg,
    right: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    ...Shadows.medium,
  },
  appName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  settingsButton: {
    padding: Spacing.sm,
  },
  centerButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.large,
  },
});
