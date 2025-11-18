/**
 * Theme Constants
 * Color palette and design tokens following the PRD specifications
 */

export const Colors = {
  // Primary Color Palette
  primaryBlue: '#B1B2FF',
  secondaryBlue: '#AAC4FF',
  lightBlue: '#D2DAFF',
  paleBlue: '#EEF1FF',
  white: '#FFFFFF',
  darkGray: '#1A1A1A',

  // Semantic Colors
  textPrimary: '#1A1A1A',
  textSecondary: '#6B7DB8',
  background: '#EEF1FF',
  cardBackground: '#FFFFFF',

  // State Colors
  error: '#FF6B6B',
  success: '#51CF66',
  warning: '#FFD93D',
  info: '#AAC4FF',

  // Map Colors
  mapWater: '#AAC4FF',
  mapLand: '#EEF1FF',
  mapRoads: '#D2DAFF',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 12,
  md: 16,
  lg: 20,
  full: 9999,
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const AnimationDuration = {
  fast: 200,
  normal: 300,
  slow: 500,
};

export const Sizes = {
  avatarSmall: 40,
  avatarMedium: 60,
  avatarLarge: 100,
  buttonHeight: 48,
  inputHeight: 48,
  tabBarHeight: 50,
  modalMinHeight: 400,
  modalMaxHeight: 400,
};

export default {
  Colors,
  Spacing,
  BorderRadius,
  FontSizes,
  FontWeights,
  Shadows,
  AnimationDuration,
  Sizes,
};
