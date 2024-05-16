import { Platform, PlatformColor } from 'react-native';
import { Theme } from './theme-types';

const baseColors = {
  contrast: '#FFFFFF',
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
  textButton: '#FFFFFF',
  red: '#FF453A',
  redTransparent: 'rgba(255,69,58,0.1)',
  orange: '#FF9F0A',
  yellow: '#FFD60A',
  green: '#32D74B',
  mint: '#66D4CF',
  teal: '#6AC4DC',
  cyan: '#5AC8F5',
  blue: '#0A84FF',
  blueHover: '#0c7ced',
  blueActive: '#0e77e1',
  indigo: '#5E5CE6',
  purple: '#BF5AF2',
  pink: '#FF375F',
  gray: '#98989D',
  brown: '#AC8E68',
} satisfies Partial<Theme>;

const windowColors = {
  ...Platform.select({
    default: {
      background: '#1e1e1e',
      backgroundDark: '#1a1a1a',
      backgroundLogin: '#1e1e1e',
      backgroundDrawer: '#1e1e1e',
      border: 'rgba(0,0,0,0.4)',
      surface: '#292827',
      surfaceBorder: '#3A3938',
    },
    windows: {
      background: PlatformColor('LayerFillColorDefaultBrush'),
      backgroundDark: PlatformColor('SolidBackgroundFillColorBaseBrush'),
      backgroundLogin: 'transparent',
      backgroundDrawer: PlatformColor('SolidBackgroundFillColorTertiaryBrush'),
      border: PlatformColor('CardStrokeColorDefaultBrush'),
      surface: PlatformColor('CardBackgroundFillColorDefaultBrush'),
      surfaceBorder: PlatformColor('CardBackgroundFillColorDefaultBrush'),
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
  dangerButtonBase: '#FF453A',
  dangerButtonHover: '#ef453c',
  dangerButtonActive: '#ec433a',
  transparentButtonHover: 'rgba(10,132,255,0.2)',
  transparentButtonActive: 'rgba(10,132,255,0.3)',
  surfaceButtonBase: '#3A3938',
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
  dayButtonBorderInset: 'rgba(255,255,255,0.1)',
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
} satisfies Partial<Theme>;

export const darkTheme: Theme = {
  type: 'dark',
  ...baseColors,
  ...windowColors,
  ...buttonColors,
  buttonBorderRadius: Platform.OS === 'windows' ? 4 : 8,
};
