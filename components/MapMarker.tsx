import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { Marker } from 'react-native-maps';
import { Avatar } from './Avatar';
import { Colors, FontSizes, FontWeights } from '../styles/theme';
import { Friend, PooledMarker } from '../utils/types';

interface MapMarkerProps {
  friend?: Friend;
  pooledMarker?: PooledMarker;
  onPress: () => void;
}

export const MapMarker: React.FC<MapMarkerProps> = ({ friend, pooledMarker, onPress }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const isPooled = !!pooledMarker;

  useEffect(() => {
    // Only animate for individual real-time markers that are online
    if (friend && friend.sharingLevel === 'realtime' && friend.isOnline) {
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
  }, [friend?.sharingLevel, friend?.isOnline, pulseAnim]);

  const getBorderStyle = () => {
    if (isPooled) {
      // Pooled markers use a neutral border
      return {
        borderWidth: 3,
        borderColor: Colors.secondaryBlue,
        borderStyle: 'solid' as const,
      };
    }

    if (!friend?.isOnline) {
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

  const location = isPooled ? pooledMarker.location : friend!.location;

  return (
    <Marker
      coordinate={{
        latitude: location.latitude,
        longitude: location.longitude,
      }}
      onPress={onPress}
      tracksViewChanges={false}
    >
      <View style={styles.markerContainer}>
        {friend && friend.sharingLevel === 'realtime' && friend.isOnline && (
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
          {isPooled ? (
            <View style={styles.countContainer}>
              <Text style={styles.countText}>{pooledMarker.count}</Text>
            </View>
          ) : (
            <Avatar
              imageUri={friend!.avatarUri}
              size="small"
              name={friend!.name}
            />
          )}
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
  countContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.primaryBlue,
  },
});
