import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { CustomTabView } from '../components/CustomTabView';
import { ProfileTab } from './ProfileTab';
import { PrivacyTab } from './PrivacyTab';
import { FriendsTab } from './FriendsTab';
import { Colors, Spacing } from '../styles/theme';
import { RootStackParamList } from '../navigation/AppNavigator';

type SettingsScreenProps = StackScreenProps<RootStackParamList, 'Settings'>;

export const SettingsScreen = ({ navigation }: SettingsScreenProps) => {
  const tabs = [
    { key: 'profile', title: 'Profile', component: ProfileTab },
    { key: 'privacy', title: 'Privacy', component: PrivacyTab },
    { key: 'friends', title: 'Friends', component: FriendsTab },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Custom Tabs */}
      <CustomTabView tabs={tabs} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    paddingTop: 50,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
  },
  backButton: {
    padding: Spacing.sm,
  },
});
