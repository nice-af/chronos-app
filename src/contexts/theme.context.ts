import React from 'react';
import { darkTheme } from '../styles/theme/theme-dark';
import { Theme } from '../styles/theme/theme-types';

interface ThemeContextProps {
  theme: Theme;
}

export const ThemeContext = React.createContext<ThemeContextProps>({
  theme: darkTheme,
});
