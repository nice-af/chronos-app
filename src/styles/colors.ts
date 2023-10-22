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
  blueHover: '#017AF4',
  blueActive: '#0270DE',
  indigo: '#5E5CE6',
  purple: '#BF5AF2',
  pink: '#FF375F',
  gray: '#98989D',
  brown: '#AC8E68',
};

const buttonColors = {
  buttonBase: baseColors.blue,
  buttonHover: '#0872dd',
  buttonActive: '#0b6ac9',
  secondaryButtonBase: 'rgba(255,255,255,0.1)',
  secondaryButtonHover: 'rgba(255,255,255,0.2)',
  secondaryButtonActive: 'rgba(255,255,255,0.1)',
};

export const colors = {
  ...baseColors,
  ...buttonColors,
};
