import { Platform, PlatformColor } from 'react-native';
import { Theme } from './theme-types';

const baseColors = {
  transparent: 'transparent',
  white: '#ffffff',
  black: '#000000',

  contrast: '#ffffff',
  ...Platform.select({
    default: {
      textPrimary: 'rgba(255,255,255,0.85)',
      textSecondary: 'rgba(255,255,255,0.55)',
      textTertiary: 'rgba(255,255,255,0.25)',
    },
    windows: {
      textPrimary: PlatformColor('TextFillColorPrimaryBrush'),
      textSecondary: PlatformColor('TextFillColorSecondaryBrush'),
      textTertiary: PlatformColor('TextFillColorTertiaryBrush'),
    },
  }),
  textButton: '#ffffff',
  red: '#ff453a',
  redTransparent: 'rgba(255,69,58,0.1)',
  orange: '#ff9f0a',
  yellow: '#ffd60a',
  green: '#32d74b',
  mint: '#66d4cf',
  teal: '#6ac4dc',
  cyan: '#5ac8f5',
  blue: '#0a84ff',
  blueHover: '#0c7ced',
  blueActive: '#0e77e1',
  indigo: '#5e5ce6',
  purple: '#bf5af2',
  pink: '#ff375f',
  gray: '#98989d',
  brown: '#ac8e68',
} satisfies Partial<Theme>;

const windowColors = {
  ...Platform.select({
    default: {
      background: '#1e1e1e',
      backgroundSolid: '#1e1e1e',
      backgroundDark: '#1a1a1a',
      backgroundLogin: '#1e1e1e',
      backgroundDrawer: '#1e1e1e',
      border: 'rgba(0,0,0,0.4)',
      surface: '#292827',
      surfaceBorder: '#3a3938',
      inputBorder: '#2f2e2d',
    },
    windows: {
      background: PlatformColor('LayerFillColorDefaultBrush'),
      backgroundSolid: '#272727',
      backgroundDark: PlatformColor('SolidBackgroundFillColorBaseBrush'),
      backgroundLogin: 'transparent',
      backgroundDrawer: PlatformColor('SolidBackgroundFillColorTertiaryBrush'),
      border: PlatformColor('CardStrokeColorDefaultBrush'),
      surface: PlatformColor('CardBackgroundFillColorDefaultBrush'),
      surfaceBorder: PlatformColor('CardBackgroundFillColorDefaultBrush'),
      inputBorder: PlatformColor('CardBackgroundFillColorDefaultBrush'),
    },
  }),
  backdrop: 'rgba(0,0,0,0.3)',
  borderSolid: '#111',
  borderInset: 'rgba(255,255,255,0.1)',
} satisfies Partial<Theme>;

const buttonColors = {
  buttonBase: baseColors.blue,
  buttonHover: baseColors.blueHover,
  buttonActive: baseColors.blueActive,
  secondaryButtonBase: 'rgba(255,255,255,0.1)',
  secondaryButtonHover: 'rgba(255,255,255,0.2)',
  secondaryButtonActive: 'rgba(255,255,255,0.1)',
  ...Platform.select({
    default: {
      secondaryButtonBorder: 'rgba(255,255,255,0.1)',
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
  surfaceButtonBase: '#3a3938',
  surfaceButtonHover: '#434241',
  surfaceButtonActive: '#454443',
  ...Platform.select({
    default: {
      dayButtonBase: 'rgba(255,255,255,0.04)',
      dayButtonHover: 'rgba(255,255,255,0.06)',
    },
    windows: {
      dayButtonBase: PlatformColor('CardBackgroundFillColorDefaultBrush'),
      dayButtonHover: PlatformColor('CardBackgroundFillColorSecondaryBrush'),
    },
  }),
  dayButtonBorder: Platform.OS === 'windows' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.4)',
  dayButtonBorderSelected: Platform.OS === 'windows' ? baseColors.blue : 'rgba(0,0,0,0.4)',
  dayButtonBorderInset: 'rgba(255,255,255,0.1)',
  cardsSelectionButtonBorder: 'rgba(0,0,0,0.4)',
  ...Platform.select({
    default: {
      cardsSelectionButtonBorderInset: 'rgba(255,255,255,0.1)',
    },
    windows: {
      cardsSelectionButtonBorderInset: 'transparent',
    },
  }),
  cardsSelectionButtonHover: 'rgba(255,255,255,0.05)',
  cardsSelectionButtonActive: 'rgba(255,255,255,0.08)',
  workingDayButtonInputBg: '#0f69c4',
  workingDayButtonInputBorder: '#125fad',
} satisfies Partial<Theme>;

export const darkTheme: Theme = {
  type: 'dark',
  ...baseColors,
  ...windowColors,
  ...buttonColors,
  buttonBorderRadius: Platform.OS === 'windows' ? 4 : 8,
};
