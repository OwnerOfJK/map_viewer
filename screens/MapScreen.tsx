import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { MapMarker } from '../components/MapMarker';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
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
        count: friendsList.length,
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

  const getTimeSinceUpdate = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
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
      <Modal
        visible={selectedFriends.length > 0}
        transparent
        animationType="none"
        onRequestClose={closeFriendDetail}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeFriendDetail}
        >
          <Animated.View
            style={[
              styles.detailCard,
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.detailHandle} />

              {selectedFriends.length === 1 ? (
                // Single friend view
                <>
                  <View style={styles.detailHeader}>
                    <Avatar
                      imageUri={selectedFriends[0].avatarUri}
                      size="large"
                      status={selectedFriends[0].isOnline ? 'online' : 'offline'}
                      name={selectedFriends[0].name}
                    />
                  </View>

                  <Text style={styles.detailName}>{selectedFriends[0].name}</Text>
                  <Text style={styles.detailUsername}>@{selectedFriends[0].username}</Text>

                  <View style={styles.detailInfo}>
                    <View style={styles.infoRow}>
                      <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
                      <Text style={styles.infoText}>
                        Updated {getTimeSinceUpdate(selectedFriends[0].lastUpdated)}
                      </Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
                      <Text style={styles.infoText}>
                        {selectedFriends[0].sharingLevel === 'city'
                          ? `${selectedFriends[0].location.city}, ${selectedFriends[0].location.country}`
                          : `${selectedFriends[0].location.latitude.toFixed(4)}, ${selectedFriends[0].location.longitude.toFixed(4)}`}
                      </Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Ionicons
                        name={selectedFriends[0].sharingLevel === 'realtime' ? 'navigate' : 'business'}
                        size={16}
                        color={Colors.textSecondary}
                      />
                      <Text style={styles.infoText}>
                        {selectedFriends[0].sharingLevel === 'realtime'
                          ? 'Real-time location'
                          : 'City-level sharing'}
                      </Text>
                    </View>
                  </View>

                  <Button
                    title="Send Message"
                    variant="secondary"
                    onPress={() => {}}
                    style={styles.messageButton}
                  />
                </>
              ) : selectedFriends.length > 1 ? (
                // Multiple friends list view
                <>
                  <Text style={styles.detailName}>
                    {selectedFriends[0].location.city}, {selectedFriends[0].location.country}
                  </Text>
                  <Text style={styles.detailUsername}>
                    {selectedFriends.length} {selectedFriends.length === 1 ? 'person' : 'people'}
                  </Text>

                  <ScrollView style={styles.friendsList} showsVerticalScrollIndicator={false}>
                    {selectedFriends
                      .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())
                      .map((friend) => (
                        <View key={friend.id} style={styles.friendItem}>
                          <Avatar
                            imageUri={friend.avatarUri}
                            size="medium"
                            status={friend.isOnline ? 'online' : 'offline'}
                            name={friend.name}
                          />
                          <View style={styles.friendItemInfo}>
                            <Text style={styles.friendItemName}>{friend.name}</Text>
                            <Text style={styles.friendItemUsername}>@{friend.username}</Text>
                            <View style={styles.friendItemDetails}>
                              <Ionicons name="time-outline" size={12} color={Colors.textSecondary} />
                              <Text style={styles.friendItemDetailText}>
                                {getTimeSinceUpdate(friend.lastUpdated)}
                              </Text>
                              <Ionicons
                                name={friend.sharingLevel === 'realtime' ? 'navigate' : 'business'}
                                size={12}
                                color={Colors.textSecondary}
                                style={styles.sharingIcon}
                              />
                              <Text style={styles.friendItemDetailText}>
                                {friend.sharingLevel === 'realtime' ? 'Real-time' : 'City-level'}
                              </Text>
                            </View>
                          </View>
                        </View>
                      ))}
                  </ScrollView>
                </>
              ) : null}
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  detailCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.md,
    paddingBottom: 40,
    minHeight: 400,
  },
  detailHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.lightBlue,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  detailHeader: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  detailName: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  detailUsername: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  detailInfo: {
    marginBottom: Spacing.xl,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  infoText: {
    marginLeft: Spacing.sm,
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  messageButton: {
    marginTop: Spacing.md,
  },
  friendsList: {
    marginTop: Spacing.lg,
    maxHeight: 400,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightBlue,
  },
  friendItemInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  friendItemName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  friendItemUsername: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  friendItemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  friendItemDetailText: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  sharingIcon: {
    marginLeft: Spacing.sm,
  },
});
