import { Theme } from './theme-types';

const baseColors = {
  contrast: '#FFFFFF',
  textPrimary: 'rgba(255,255,255,0.85)',
  textSecondary: 'rgba(255,255,255,0.55)',
  textTertiary: 'rgba(255,255,255,0.25)',
  textButton: '#FFFFFF',
  red: '#FF453A',
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
};

const windowColors = {
  background: '#1e1e1e',
  backgroundDark: '#1a1a1a',
  border: 'rgba(0,0,0,0.4)',
  borderSolid: '#111',
  surface: '#292827',
  surfaceBorder: '#3A3938',
};

const buttonColors = {
  buttonBase: baseColors.blue,
  buttonHover: baseColors.blueHover,
  buttonActive: baseColors.blueActive,
  secondaryButtonBase: 'rgba(255,255,255,0.1)',
  secondaryButtonHover: 'rgba(255,255,255,0.2)',
  secondaryButtonActive: 'rgba(255,255,255,0.1)',
  secondaryButtonBorder: 'rgba(255,255,255,0.1)',
  dangerButtonBase: '#FF453A',
  dangerButtonHover: '#ef453c',
  dangerButtonActive: '#ec433a',
  transparentButtonHover: 'rgba(10,132,255,0.2)',
  transparentButtonActive: 'rgba(10,132,255,0.3)',
  surfaceButtonBase: '#3A3938',
  surfaceButtonHover: '#434241',
  surfaceButtonActive: '#454443',
  dayButtonBase: 'rgba(255,255,255,0.04)',
  dayButtonHover: 'rgba(255,255,255,0.06)',
  dayButtonBorder: 'rgba(0,0,0,0.4)',
  dayButtonBorderInset: 'rgba(255,255,255,0.1)',
  cardsSelectionButtonBorderInset: 'rgba(255,255,255,0.1)',
  cardsSelectionButtonHover: 'rgba(255,255,255,0.05)',
  cardsSelectionButtonActive: 'rgba(255,255,255,0.08)',
};

export const darkTheme: Theme = {
  type: 'dark',
  ...baseColors,
  ...windowColors,
  ...buttonColors,
};
