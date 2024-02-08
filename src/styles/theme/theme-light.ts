import { Platform, PlatformColor } from 'react-native';
import { Theme } from './theme-types';

const baseColors = {
  contrast: '#000000',
  textPrimary: 'rgba(0,0,0,0.85)',
  textSecondary: 'rgba(0,0,0,0.55)',
  textTertiary: 'rgba(0,0,0,0.25)',
  textButton: '#ffffff',
  red: '#ff3b30',
  orange: '#ff9500',
  yellow: '#ffcc00',
  green: '#28cd41',
  mint: '#00c7be',
  teal: '#59adc4',
  cyan: '#55bef0',
  blue: '#007aff',
  blueHover: '#0c73e4',
  blueActive: '#0e6ed8',
  indigo: '#5856d6',
  purple: '#af52de',
  pink: '#ff2d55',
  gray: '#8e8e93',
  brown: '#a2845e',
};

const windowColors = {
  ...Platform.select({
    default: {
      background: '#ffffff',
      backgroundDark: '#f0f0f0',
      backgroundLogin: '#ffffff',
      backgroundDrawer: '#ffffff',
      border: 'rgba(0,0,0,0.08)',
      borderSolid: '#d9d9d9',
      surface: '#fbfbfb',
      surfaceBorder: '#e3e3e3',
    },
    windows: {
      background: PlatformColor('LayerFillColorDefaultBrush'),
      backgroundDark: PlatformColor('SolidBackgroundFillColorBaseBrush'),
      backgroundLogin: 'transparent',
      backgroundDrawer: PlatformColor('SolidBackgroundFillColorQuarternaryBrush'),
      border: 'rgba(0,0,0,0.08)',
      borderSolid: '#d9d9d9',
      surface: '#fbfbfb',
      surfaceBorder: '#e3e3e3',
    },
  }),
};

const buttonColors = {
  buttonBase: baseColors.blue,
  buttonHover: baseColors.blueHover,
  buttonActive: baseColors.blueActive,
  secondaryButtonBase: 'rgba(0,0,0,0.1)',
  secondaryButtonHover: 'rgba(0,0,0,0.2)',
  secondaryButtonActive: 'rgba(0,0,0,0.1)',
  secondaryButtonBorder: 'rgba(0,0,0,0.1)',
  dangerButtonBase: '#ff453a',
  dangerButtonHover: '#ef453c',
  dangerButtonActive: '#ec433a',
  transparentButtonHover: 'rgba(10,132,255,0.2)',
  transparentButtonActive: 'rgba(10,132,255,0.3)',
  surfaceButtonBase: '#eeeeee',
  surfaceButtonHover: '#e3e3e3',
  surfaceButtonActive: '#dedede',
  ...Platform.select({
    default: {
      dayButtonBase: 'rgba(255,255,255,0.04)',
      dayButtonHover: 'rgba(255,255,255,0.07)',
    },
    windows: {
      dayButtonBase: PlatformColor('CardBackgroundFillColorDefaultBrush'),
      dayButtonHover: PlatformColor('CardBackgroundFillColorSecondaryBrush'),
    },
  }),
  dayButtonBorder: 'rgba(0,0,0,0.14)',
  dayButtonBorderInset: 'rgba(255,255,255,0.16)',
  cardsSelectionButtonBorderInset: 'rgba(255,255,255,0.1)',
  cardsSelectionButtonHover: 'rgba(255,255,255,0.05)',
  cardsSelectionButtonActive: 'rgba(255,255,255,0.08)',
};

export const lightTheme: Theme = {
  type: 'light',
  ...baseColors,
  ...windowColors,
  ...buttonColors,
  buttonBorderRadius: Platform.OS === 'windows' ? 4 : 8,
};
