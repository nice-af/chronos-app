import React, { PropsWithChildren } from 'react';
import { ThemeContext } from '../contexts/theme.context';
import { useColorScheme } from 'react-native';
import { darkTheme } from '../styles/theme/theme-dark';
import { lightTheme } from '../styles/theme/theme-light';

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const colorScheme = useColorScheme();

  return (
    <ThemeContext.Provider
      value={{
        theme: colorScheme === 'dark' ? darkTheme : lightTheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};
