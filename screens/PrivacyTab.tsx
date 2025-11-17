import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Colors, FontSizes, FontWeights, Spacing } from '../styles/theme';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { SharingLevel } from '../utils/types';

export const PrivacyTab: React.FC = () => {
  const { user, setSharingLevel, toggleLocationSharing } = useUser();
  const { showToast } = useToast();

  const [isLocationEnabled, setIsLocationEnabled] = useState(user?.locationEnabled ?? true);
  const [selectedLevel, setSelectedLevel] = useState<SharingLevel>(user?.sharingLevel || 'city');
  const [isPaused, setIsPaused] = useState(false);

  const handleToggleLocation = (value: boolean) => {
    if (!value) {
      Alert.alert(
        'Disable Location Sharing?',
        'Your friends will not be able to see your location when sharing is disabled.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: () => {
              setIsLocationEnabled(false);
              toggleLocationSharing(false);
              showToast('Location sharing disabled', 'info');
            },
          },
        ]
      );
    } else {
      setIsLocationEnabled(true);
      toggleLocationSharing(true);
      showToast('Location sharing enabled', 'success');
    }
  };

  const handleSelectLevel = (level: SharingLevel) => {
    setSelectedLevel(level);
    setSharingLevel(level);
    showToast(
      level === 'city' ? 'Now sharing city only' : 'Now sharing real-time location',
      'success'
    );
  };

  const handlePauseUpdates = () => {
    setIsPaused(!isPaused);
    showToast(
      isPaused ? 'Location updates resumed' : 'Location updates paused',
      'info'
    );
  };

  const getLastUpdateTime = (): string => {
    // Mock last update time
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Location Sharing Toggle */}
      <Card style={styles.card}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Enable Location Sharing</Text>
            <Text style={styles.settingDescription}>
              When off, no friends can see your location
            </Text>
          </View>
          <Switch
            value={isLocationEnabled}
            onValueChange={handleToggleLocation}
            trackColor={{ false: Colors.lightBlue, true: Colors.primaryBlue }}
            thumbColor={Colors.white}
          />
        </View>
      </Card>

      {/* Default Sharing Level */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Default Sharing Level</Text>

        <Card
          selected={selectedLevel === 'city'}
          onPress={() => handleSelectLevel('city')}
          style={styles.optionCard}
        >
          <View style={styles.optionRow}>
            <View style={styles.optionIcon}>
              <Ionicons name="business-outline" size={24} color={Colors.primaryBlue} />
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>City Only</Text>
              <Text style={styles.optionDescription}>
                Friends see only the city you're in
              </Text>
            </View>
            {selectedLevel === 'city' && (
              <Ionicons name="checkmark-circle" size={24} color={Colors.primaryBlue} />
            )}
          </View>
        </Card>

        <Card
          selected={selectedLevel === 'realtime'}
          onPress={() => handleSelectLevel('realtime')}
          style={styles.optionCard}
        >
          <View style={styles.optionRow}>
            <View style={styles.optionIcon}>
              <Ionicons name="navigate-outline" size={24} color={Colors.primaryBlue} />
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Real-Time</Text>
              <Text style={styles.optionDescription}>
                Friends see your exact location
              </Text>
            </View>
            {selectedLevel === 'realtime' && (
              <Ionicons name="checkmark-circle" size={24} color={Colors.primaryBlue} />
            )}
          </View>
        </Card>
      </View>

      {/* Activity Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity Status</Text>

        <Card style={styles.card}>
          <View style={styles.statusRow}>
            <Ionicons name="time-outline" size={20} color={Colors.textSecondary} />
            <Text style={styles.statusText}>
              Last location update: {getLastUpdateTime()}
            </Text>
          </View>
        </Card>

        <Button
          title={isPaused ? 'Resume Updates' : 'Pause Updates'}
          variant="secondary"
          onPress={handlePauseUpdates}
          style={styles.pauseButton}
          icon={
            <Ionicons
              name={isPaused ? 'play-outline' : 'pause-outline'}
              size={20}
              color={Colors.primaryBlue}
              style={{ marginRight: Spacing.sm }}
            />
          }
        />
      </View>

      {/* Info Card */}
      <Card style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <Ionicons name="information-circle-outline" size={24} color={Colors.secondaryBlue} />
          <Text style={styles.infoTitle}>Privacy Information</Text>
        </View>
        <Text style={styles.infoText}>
          You have complete control over your location sharing. You can change your sharing level
          or disable sharing at any time. When paused, your location will not be updated.
        </Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paleBlue,
  },
  content: {
    padding: Spacing.xxl,
  },
  card: {
    marginBottom: Spacing.lg,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  settingDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  optionCard: {
    marginBottom: Spacing.md,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: Spacing.md,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  optionDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: Spacing.sm,
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  pauseButton: {
    marginTop: Spacing.md,
  },
  infoCard: {
    backgroundColor: '#F0F4FF',
    borderColor: Colors.secondaryBlue,
    borderWidth: 1,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  infoTitle: {
    marginLeft: Spacing.sm,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  infoText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
