import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '../styles/theme';
import { useUser } from '../context/UserContext';
import { SharingLevel } from '../utils/types';
import { RootStackParamList } from '../navigation/AppNavigator';

type LocationPreferenceScreenProps = StackScreenProps<RootStackParamList, 'LocationPreference'>;

export const LocationPreferenceScreen = ({
  navigation,
}: LocationPreferenceScreenProps) => {
  const [selectedLevel, setSelectedLevel] = useState<SharingLevel | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationInfo, setLocationInfo] = useState<{
    city?: string;
    country?: string;
    countryCode?: string;
  }>({});

  const { setSharingLevel, setUserLocation } = useUser();

  const requestLocationPermission = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'Location Tracker needs access to your location to share it with your friends. You can change this later in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Location.requestForegroundPermissionsAsync() },
          ]
        );
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const [geocode] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocode) {
        setLocationInfo({
          city: geocode.city || geocode.region || 'Unknown City',
          country: geocode.country || 'Unknown Country',
          countryCode: geocode.isoCountryCode || 'US',
        });

        setUserLocation(
          location.coords.latitude,
          location.coords.longitude,
          geocode.city || geocode.region || undefined,
          geocode.country || undefined,
          geocode.isoCountryCode || undefined
        );
      }

      setLoading(false);
    } catch (error) {
      console.error('Error getting location:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to get your location. Please try again.');
    }
  }, [setUserLocation]);

  useEffect(() => {
    requestLocationPermission();
  }, [requestLocationPermission]);

  const handleContinue = () => {
    if (selectedLevel) {
      setSharingLevel(selectedLevel);
      navigation.replace('Map');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primaryBlue} />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Privacy Level</Text>
        <Text style={styles.subtitle}>You can change this anytime in Settings</Text>
      </View>

      {locationInfo.city && (
        <View style={styles.locationDisplay}>
          <Ionicons name="location-outline" size={20} color={Colors.textSecondary} />
          <Text style={styles.locationText}>
            {locationInfo.city}, {locationInfo.country}
          </Text>
        </View>
      )}

      <View style={styles.cardsContainer}>
        <Card
          selected={selectedLevel === 'city'}
          onPress={() => setSelectedLevel('city')}
          style={styles.card}
        >
          <View style={styles.cardIcon}>
            <Ionicons name="business-outline" size={40} color={Colors.primaryBlue} />
          </View>
          <Text style={styles.cardTitle}>Share My City</Text>
          <Text style={styles.cardDescription}>
            Friends see only the city you're in. More privacy, less precision.
          </Text>
        </Card>

        <Card
          selected={selectedLevel === 'realtime'}
          onPress={() => setSelectedLevel('realtime')}
          style={styles.card}
        >
          <View style={styles.cardIcon}>
            <Ionicons name="navigate-outline" size={40} color={Colors.primaryBlue} />
          </View>
          <Text style={styles.cardTitle}>Share Real-Time Location</Text>
          <Text style={styles.cardDescription}>
            Friends see your exact location. Great for meeting up and staying connected.
          </Text>
        </Card>
      </View>

      <Button
        title="Continue"
        onPress={handleContinue}
        disabled={!selectedLevel}
        style={styles.continueButton}
      />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.paleBlue,
  },
  loadingText: {
    marginTop: Spacing.lg,
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  locationDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
  },
  locationText: {
    marginLeft: Spacing.sm,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    fontWeight: FontWeights.medium,
  },
  cardsContainer: {
    marginBottom: Spacing.xl,
  },
  card: {
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  cardIcon: {
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  cardDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  continueButton: {
    marginTop: Spacing.lg,
  },
});
