import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Sizes } from '../styles/theme';

type AvatarSize = 'small' | 'medium' | 'large';
type StatusType = 'online' | 'offline';

interface AvatarProps {
  imageUri?: string;
  size?: AvatarSize;
  status?: StatusType;
  name?: string;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  imageUri,
  size = 'medium',
  status,
  name = '',
  style,
}) => {
  const getSize = (): number => {
    switch (size) {
      case 'small':
        return Sizes.avatarSmall;
      case 'large':
        return Sizes.avatarLarge;
      default:
        return Sizes.avatarMedium;
    }
  };

  const avatarSize = getSize();
  const statusSize = avatarSize * 0.25;

  const getInitials = (): string => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getGradientColor = (): string => {
    // Generate a consistent color based on the name
    if (!name) return Colors.primaryBlue;
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [Colors.primaryBlue, Colors.secondaryBlue, '#9BA3FF', '#BDC5FF'];
    return colors[hash % colors.length];
  };

  return (
    <View style={[styles.container, { width: avatarSize, height: avatarSize }, style]}>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={[styles.avatar, { width: avatarSize, height: avatarSize }]}
        />
      ) : (
        <View
          style={[
            styles.avatar,
            styles.fallback,
            { width: avatarSize, height: avatarSize, backgroundColor: getGradientColor() },
          ]}
        >
          <Text
            style={[
              styles.initials,
              { fontSize: avatarSize * 0.35 },
            ]}
          >
            {getInitials()}
          </Text>
        </View>
      )}
      {status && (
        <View
          style={[
            styles.statusIndicator,
            { width: statusSize, height: statusSize, borderRadius: statusSize / 2 },
            status === 'online' ? styles.statusOnline : styles.statusOffline,
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatar: {
    borderRadius: 9999,
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: Colors.white,
    fontWeight: '600',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  statusOnline: {
    backgroundColor: Colors.success,
  },
  statusOffline: {
    backgroundColor: Colors.darkGray,
    opacity: 0.5,
  },
});
