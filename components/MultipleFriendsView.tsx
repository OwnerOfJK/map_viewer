import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from './Avatar';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius, Shadows, Sizes } from '../styles/theme';
import { Friend } from '../utils/types';

type SharingTab = 'city' | 'realtime';

interface MultipleFriendsViewProps {
  selectedFriends: Friend[];
  getTimeSinceUpdate: (date: Date) => string;
}

export const MultipleFriendsView = ({
  selectedFriends,
  getTimeSinceUpdate,
}: MultipleFriendsViewProps) => {
  const cityFriends = selectedFriends.filter((f) => f.sharingLevel === 'city');
  const realtimeFriends = selectedFriends.filter((f) => f.sharingLevel === 'realtime');

  // Default to the tab that has friends, preferring city if both have friends
  const defaultTab: SharingTab = cityFriends.length > 0 ? 'city' : 'realtime';
  const [activeTab, setActiveTab] = useState<SharingTab>(defaultTab);

  const displayedFriends = activeTab === 'city' ? cityFriends : realtimeFriends;

  return (
    <>
      <Text style={styles.detailName}>
        {selectedFriends[0].location.city}, {selectedFriends[0].location.country}
      </Text>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {cityFriends.length > 0 && (
          <TouchableOpacity
            style={[styles.tab, activeTab === 'city' && styles.activeTab]}
            onPress={() => setActiveTab('city')}
          >
            <Text style={[styles.tabText, activeTab === 'city' && styles.activeTabText]}>
              City-level ({cityFriends.length})
            </Text>
          </TouchableOpacity>
        )}
        {realtimeFriends.length > 0 && (
          <TouchableOpacity
            style={[styles.tab, activeTab === 'realtime' && styles.activeTab]}
            onPress={() => setActiveTab('realtime')}
          >
            <Text style={[styles.tabText, activeTab === 'realtime' && styles.activeTabText]}>
              Real-time ({realtimeFriends.length})
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.friendsList} showsVerticalScrollIndicator={false}>
        {displayedFriends
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
                </View>
              </View>
            </View>
          ))}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  detailName: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.paleBlue,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm - 2,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: Colors.white,
    ...Shadows.small,
  },
  tabText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.primaryBlue,
    fontWeight: FontWeights.semibold,
  },
  friendsList: {
    marginTop: Spacing.lg,
    maxHeight: Sizes.modalMaxHeight,
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
});
