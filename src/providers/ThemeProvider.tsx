import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeContext } from '../contexts/theme.context';
import { darkTheme } from '../styles/theme/theme-dark';
import { lightTheme } from '../styles/theme/theme-light';
import { Theme } from '../styles/theme/theme-types';

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const colorScheme = useColorScheme();
  // The theme is always set to light during development, but we use dark so we change the dev default to dark
  const [theme, setTheme] = useState<Theme>(!__DEV__ && colorScheme === 'light' ? lightTheme : darkTheme);

  useEffect(() => {
    setTheme(!__DEV__ && colorScheme === 'light' ? lightTheme : darkTheme);
  }, [colorScheme]);

  return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>;
};
