import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { MapMarker } from '../components/MapMarker';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius, Shadows } from '../styles/theme';
import { useFriends } from '../context/FriendsContext';
import { useUser } from '../context/UserContext';
import { Friend, Region } from '../utils/types';
import { MAP_SETTINGS } from '../utils/constants';

const { height } = Dimensions.get('window');

interface MapScreenProps {
  navigation: any;
}

export const MapScreen: React.FC<MapScreenProps> = ({ navigation }) => {
  const mapRef = useRef<MapView>(null);
  const slideAnim = useRef(new Animated.Value(height)).current;

  const { friends } = useFriends();
  const { user } = useUser();

  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 20,
    longitude: 0,
    latitudeDelta: MAP_SETTINGS.INITIAL_DELTA,
    longitudeDelta: MAP_SETTINGS.INITIAL_DELTA,
  });

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
      mapRef.current?.animateToRegion(newRegion, MAP_SETTINGS.ANIMATION_DURATION);
    }
  };

  const handleMarkerPress = (friend: Friend) => {
    setSelectedFriend(friend);
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
      setSelectedFriend(null);
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
      >
        {friends.map((friend) => (
          <MapMarker
            key={friend.id}
            friend={friend}
            onPress={() => handleMarkerPress(friend)}
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
        visible={selectedFriend !== null}
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

              {selectedFriend && (
                <>
                  <View style={styles.detailHeader}>
                    <Avatar
                      imageUri={selectedFriend.avatarUri}
                      size="large"
                      status={selectedFriend.isOnline ? 'online' : 'offline'}
                      name={selectedFriend.name}
                    />
                  </View>

                  <Text style={styles.detailName}>{selectedFriend.name}</Text>
                  <Text style={styles.detailUsername}>@{selectedFriend.username}</Text>

                  <View style={styles.detailInfo}>
                    <View style={styles.infoRow}>
                      <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
                      <Text style={styles.infoText}>
                        Updated {getTimeSinceUpdate(selectedFriend.lastUpdated)}
                      </Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
                      <Text style={styles.infoText}>
                        {selectedFriend.sharingLevel === 'city'
                          ? `${selectedFriend.location.city}, ${selectedFriend.location.country}`
                          : `${selectedFriend.location.latitude.toFixed(4)}, ${selectedFriend.location.longitude.toFixed(4)}`}
                      </Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Ionicons
                        name={selectedFriend.sharingLevel === 'realtime' ? 'navigate' : 'business'}
                        size={16}
                        color={Colors.textSecondary}
                      />
                      <Text style={styles.infoText}>
                        {selectedFriend.sharingLevel === 'realtime'
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
              )}
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
});
