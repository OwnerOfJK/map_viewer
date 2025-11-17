import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing } from '../styles/theme';
import { SPLASH_DURATION } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

interface SplashScreenProps {
  navigation: any;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after duration
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        if (isAuthenticated) {
          navigation.replace('Map');
        } else {
          navigation.replace('Login');
        }
      });
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, isAuthenticated, navigation]);

  return (
    <LinearGradient
      colors={[Colors.paleBlue, Colors.lightBlue]}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="location" size={80} color={Colors.primaryBlue} />
        </View>
        <Text style={styles.title}>Location Tracker</Text>
        <Text style={styles.subtitle}>Connect with friends around the world</Text>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
});
