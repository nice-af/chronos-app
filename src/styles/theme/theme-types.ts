import { ColorSchemeName, OpaqueColorValue } from 'react-native';

export interface Theme {
  type: ColorSchemeName;

  contrast: string | OpaqueColorValue;
  textPrimary: string | OpaqueColorValue;
  textSecondary: string | OpaqueColorValue;
  textTertiary: string | OpaqueColorValue;
  textButton: string | OpaqueColorValue;
  red: string | OpaqueColorValue;
  redTransparent: string | OpaqueColorValue;
  orange: string | OpaqueColorValue;
  yellow: string | OpaqueColorValue;
  green: string | OpaqueColorValue;
  mint: string | OpaqueColorValue;
  teal: string | OpaqueColorValue;
  cyan: string | OpaqueColorValue;
  blue: string | OpaqueColorValue;
  blueHover: string | OpaqueColorValue;
  blueActive: string | OpaqueColorValue;
  indigo: string | OpaqueColorValue;
  purple: string | OpaqueColorValue;
  pink: string | OpaqueColorValue;
  gray: string | OpaqueColorValue;
  brown: string | OpaqueColorValue;

  background: string | OpaqueColorValue;
  backgroundSolid: string | OpaqueColorValue; // Only different to background on Windows
  backgroundDark: string | OpaqueColorValue;
  backgroundLogin: string | OpaqueColorValue;
  backgroundDrawer: string | OpaqueColorValue;
  border: string | OpaqueColorValue;
  borderSolid: string | OpaqueColorValue;
  surface: string | OpaqueColorValue;
  surfaceBorder: string | OpaqueColorValue;
  backdrop: string | OpaqueColorValue;
  borderInset: string | OpaqueColorValue;

  buttonBase: string | OpaqueColorValue;
  buttonHover: string | OpaqueColorValue;
  buttonActive: string | OpaqueColorValue;
  secondaryButtonBase: string | OpaqueColorValue;
  secondaryButtonHover: string | OpaqueColorValue;
  secondaryButtonActive: string | OpaqueColorValue;
  secondaryButtonBorder: string | OpaqueColorValue;
  dangerButtonBase: string | OpaqueColorValue;
  dangerButtonHover: string | OpaqueColorValue;
  dangerButtonActive: string | OpaqueColorValue;
  transparentButtonHover: string | OpaqueColorValue;
  transparentButtonActive: string | OpaqueColorValue;
  surfaceButtonBase: string | OpaqueColorValue;
  surfaceButtonHover: string | OpaqueColorValue;
  surfaceButtonActive: string | OpaqueColorValue;
  dayButtonBase: string | OpaqueColorValue;
  dayButtonHover: string | OpaqueColorValue;
  dayButtonBorder: string | OpaqueColorValue;
  dayButtonBorderInset: string | OpaqueColorValue;
  cardsSelectionButtonBorderInset: string | OpaqueColorValue;
  cardsSelectionButtonHover: string | OpaqueColorValue;
  cardsSelectionButtonActive: string | OpaqueColorValue;

  buttonBorderRadius: number;
}

export const colorKeys = [
  'red',
  'orange',
  'yellow',
  'green',
  'mint',
  'teal',
  'cyan',
  'blue',
  'indigo',
  'purple',
  'pink',
  'gray',
  'brown',
] as const;
export type ColorKey = (typeof colorKeys)[number];
export type ColorOption = ColorKey | 'custom';
