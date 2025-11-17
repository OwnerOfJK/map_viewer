import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ProfileTab } from './ProfileTab';
import { PrivacyTab } from './PrivacyTab';
import { FriendsTab } from './FriendsTab';
import { Colors, FontSizes, FontWeights, Spacing } from '../styles/theme';

const Tab = createMaterialTopTabNavigator();

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
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

      {/* Tabs */}
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: Colors.primaryBlue,
          tabBarInactiveTintColor: Colors.textSecondary,
          tabBarLabelStyle: {
            fontSize: FontSizes.sm,
            fontWeight: FontWeights.semibold,
            textTransform: 'none',
          },
          tabBarStyle: {
            backgroundColor: Colors.white,
          },
          tabBarIndicatorStyle: {
            backgroundColor: Colors.primaryBlue,
            height: 3,
          },
        }}
      >
        <Tab.Screen name="Profile" component={ProfileTab} />
        <Tab.Screen name="Privacy" component={PrivacyTab} />
        <Tab.Screen name="Friends" component={FriendsTab} />
      </Tab.Navigator>
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
