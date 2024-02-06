import React from 'react';
import { Appearance } from 'react-native';
import { darkTheme } from '../styles/theme/theme-dark';
import { lightTheme } from '../styles/theme/theme-light';
import { Theme } from '../styles/theme/theme-types';

export type ThemeType = 'dark' | 'light' | 'system';

interface ThemeContextProps {
  theme: Theme;
}

export const ThemeContext = React.createContext<ThemeContextProps>({
  theme: !__DEV__ && Appearance.getColorScheme() === 'light' ? lightTheme : darkTheme,
});
