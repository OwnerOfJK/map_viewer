import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { Colors, BorderRadius, Spacing, FontSizes, Shadows } from '../styles/theme';
import { ToastType } from '../utils/types';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onDismiss: () => void;
}

export const Toast = ({
  message,
  type = 'info',
  duration = 3000,
  onDismiss,
}: ToastProps) => {
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    // Slide in
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();

    // Auto dismiss
    const timer = setTimeout(() => {
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onDismiss();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss, translateY]);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return Colors.success;
      case 'error':
        return Colors.error;
      default:
        return Colors.primaryBlue;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: Spacing.lg,
    right: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    ...Shadows.medium,
    zIndex: 1000,
  },
  message: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: '600',
    textAlign: 'center',
  },
});
