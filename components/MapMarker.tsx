import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Marker } from 'react-native-maps';
import { Avatar } from './Avatar';
import { Colors } from '../styles/theme';
import { Friend } from '../utils/types';

interface MapMarkerProps {
  friend: Friend;
  onPress: () => void;
}

export const MapMarker: React.FC<MapMarkerProps> = ({ friend, onPress }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Only animate for real-time markers that are online
    if (friend.sharingLevel === 'realtime' && friend.isOnline) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [friend.sharingLevel, friend.isOnline, pulseAnim]);

  const getBorderStyle = () => {
    if (!friend.isOnline) {
      return {
        borderWidth: 2,
        borderColor: Colors.darkGray,
        opacity: 0.5,
      };
    }

    if (friend.sharingLevel === 'realtime') {
      return {
        borderWidth: 3,
        borderColor: Colors.primaryBlue,
        borderStyle: 'solid' as const,
      };
    }

    return {
      borderWidth: 3,
      borderColor: Colors.secondaryBlue,
      borderStyle: 'dashed' as const,
    };
  };

  return (
    <Marker
      coordinate={{
        latitude: friend.location.latitude,
        longitude: friend.location.longitude,
      }}
      onPress={onPress}
      tracksViewChanges={false}
    >
      <View style={styles.markerContainer}>
        {friend.sharingLevel === 'realtime' && friend.isOnline && (
          <Animated.View
            style={[
              styles.pulseCircle,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
        )}
        <View style={[styles.markerBorder, getBorderStyle()]}>
          <Avatar
            imageUri={friend.avatarUri}
            size="small"
            name={friend.name}
          />
        </View>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerBorder: {
    borderRadius: 9999,
    padding: 2,
    backgroundColor: Colors.white,
  },
  pulseCircle: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primaryBlue,
    opacity: 0.3,
  },
});
