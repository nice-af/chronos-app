const baseColors = {
  contrast: '#FFFFFF',
  textPrimary: 'rgba(255,255,255,0.85)',
  textSecondary: 'rgba(255,255,255,0.55)',
  textTertiary: 'rgba(255,255,255,0.25)',
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
  background: '#242422',
  border: 'rgba(0,0,0,0.4)',
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
  transparentButtonHover: 'rgba(10,132,255,0.2)',
  transparentButtonActive: 'rgba(10,132,255,0.3)',
};

export const colors = {
  ...baseColors,
  ...windowColors,
  ...buttonColors,
};
