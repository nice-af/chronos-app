import { Platform, PlatformColor } from 'react-native';
import { Theme } from './theme-types';

const baseColors = {
  transparent: 'transparent',
  white: '#ffffff',
  black: '#000000',

  contrast: '#000000',
  ...Platform.select({
    default: {
      textPrimary: 'rgba(0,0,0,0.85)',
      textSecondary: 'rgba(0,0,0,0.55)',
      textTertiary: 'rgba(0,0,0,0.25)',
    },
    windows: {
      textPrimary: PlatformColor('TextFillColorPrimaryBrush'),
      textSecondary: PlatformColor('TextFillColorSecondaryBrush'),
      textTertiary: PlatformColor('TextFillColorTertiaryBrush'),
    },
  }),
  textButton: '#ffffff',
  red: '#ff3b30',
  redTransparent: 'rgba(255,59,48,0.1)',
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
} satisfies Partial<Theme>;

const windowColors = {
  ...Platform.select({
    default: {
      background: '#ffffff',
      backgroundSolid: '#ffffff',
      backgroundDark: '#f0f0f0',
      backgroundLogin: '#ffffff',
      backgroundDrawer: '#ffffff',
      border: 'rgba(0,0,0,0.15)',
      surface: '#fbfbfb',
      surfaceBorder: '#e3e3e3',
      inputBorder: '#e1e1e1',
    },
    windows: {
      background: PlatformColor('LayerFillColorDefaultBrush'),
      backgroundSolid: '#e7e7e7',
      backgroundDark: PlatformColor('SolidBackgroundFillColorBaseBrush'),
      backgroundLogin: 'transparent',
      backgroundDrawer: PlatformColor('SolidBackgroundFillColorQuarternaryBrush'),
      border: 'rgba(0,0,0,0.07)',
      surface: PlatformColor('CardBackgroundFillColorDefaultBrush'),
      surfaceBorder: PlatformColor('CardBackgroundFillColorDefaultBrush'),
      inputBorder: PlatformColor('CardBackgroundFillColorDefaultBrush'),
    },
  }),
  backdrop: 'rgba(0,0,0,0.3)',
  borderSolid: '#d9d9d9',
  borderInset: 'rgba(255,255,255,0.1)',
} satisfies Partial<Theme>;

const buttonColors = {
  buttonBase: baseColors.blue,
  buttonHover: baseColors.blueHover,
  buttonActive: baseColors.blueActive,
  secondaryButtonBase: 'rgba(0,0,0,0.07)',
  secondaryButtonHover: 'rgba(0,0,0,0.11)',
  secondaryButtonActive: 'rgba(0,0,0,0.16)',
  ...Platform.select({
    default: {
      secondaryButtonBorder: 'rgba(0,0,0,0.08)',
    },
    windows: {
      secondaryButtonBorder: 'transparent',
    },
  }),
  dangerButtonBase: '#ff453a',
  dangerButtonHover: '#ef453c',
  dangerButtonActive: '#ec433a',
  transparentButtonHover: 'rgba(10,132,255,0.2)',
  transparentButtonActive: 'rgba(10,132,255,0.3)',
  surfaceButtonBase: '#ececec',
  surfaceButtonHover: '#e2e2e2',
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
  dayButtonBorderSelected: Platform.OS === 'windows' ? baseColors.blue : '#ededed',
  dayButtonBorderInset: 'rgba(255,255,255,0.16)',
  cardsSelectionButtonBorder: 'rgba(0,0,0,0.2)',
  ...Platform.select({
    default: {
      cardsSelectionButtonBorderInset: 'rgba(255,255,255,0.2)',
    },
    windows: {
      cardsSelectionButtonBorderInset: 'transparent',
    },
  }),
  cardsSelectionButtonHover: 'rgba(255,255,255,0.05)',
  cardsSelectionButtonActive: 'rgba(255,255,255,0.08)',
  workingDayButtonInputBg: '#0e67c6',
  workingDayButtonInputBorder: '#125fb1',
  workingDayButtonTextColor: 'rgba(255,255,255,0.85)',
} satisfies Partial<Theme>;

export const lightTheme: Theme = {
  type: 'light',
  ...baseColors,
  ...windowColors,
  ...buttonColors,
  buttonBorderRadius: Platform.OS === 'windows' ? 4 : 8,
};
