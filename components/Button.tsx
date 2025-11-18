import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Animated,
} from 'react-native';
import { Colors, BorderRadius, Spacing, FontSizes, FontWeights } from '../styles/theme';

type ButtonVariant = 'primary' | 'secondary' | 'text';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  style,
}: ButtonProps) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getButtonStyle = (): ViewStyle => {
    const baseStyle = styles.button;
    if (variant === 'primary') {
      return { ...baseStyle, ...styles.primaryButton };
    } else if (variant === 'secondary') {
      return { ...baseStyle, ...styles.secondaryButton };
    }
    return { ...baseStyle, ...styles.textButton };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle = styles.buttonText;
    if (variant === 'primary') {
      return { ...baseStyle, ...styles.primaryButtonText };
    } else if (variant === 'secondary') {
      return { ...baseStyle, ...styles.secondaryButtonText };
    }
    return { ...baseStyle, ...styles.textButtonText };
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          getButtonStyle(),
          disabled && styles.disabled,
          style,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === 'primary' ? Colors.white : Colors.primaryBlue}
          />
        ) : (
          <>
            {icon}
            <Text style={getTextStyle()}>{title}</Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: 48,
  },
  primaryButton: {
    backgroundColor: Colors.primaryBlue,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primaryBlue,
  },
  textButton: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
  },
  primaryButtonText: {
    color: Colors.white,
  },
  secondaryButtonText: {
    color: Colors.primaryBlue,
  },
  textButtonText: {
    color: Colors.secondaryBlue,
  },
  disabled: {
    opacity: 0.5,
  },
});
