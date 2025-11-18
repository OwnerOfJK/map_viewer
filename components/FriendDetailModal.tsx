import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius, Shadows } from '../styles/theme';
import { Friend } from '../utils/types';

const { height } = Dimensions.get('window');

interface FriendDetailModalProps {
  selectedFriends: Friend[];
  visible: boolean;
  onClose: () => void;
  slideAnim: Animated.Value;
}

export const FriendDetailModal: React.FC<FriendDetailModalProps> = ({
  selectedFriends,
  visible,
  onClose,
  slideAnim,
}) => {
  const getTimeSinceUpdate = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        {/* Background overlay - tapping here closes the modal */}
        <Pressable style={styles.backdrop} onPress={onClose} />

        {/* Card content - separate from the backdrop */}
        <Animated.View
          style={[
            styles.detailCard,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
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
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
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
