import { useAtomValue, useSetAtom } from 'jotai';
import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import { Text, useColorScheme } from 'react-native';
import { jiraAuthAtom, themeAtom } from '../atoms';
import { Login } from '../screens/Login';
import { initialize } from '../services/global.service';
import { darkTheme } from '../styles/theme/theme-dark';
import { lightTheme } from '../styles/theme/theme-light';

export const GlobalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();
  const setTheme = useSetAtom(themeAtom);
  const jiraAuth = useAtomValue(jiraAuthAtom);

  useEffect(() => {
    setIsLoading(true);
    initialize().finally(() => {
      setIsLoading(false);
    });
  }, []);

  /**
   * Auto-set theme
   */
  useEffect(() => {
    // The theme is always set to light during development, but we use dark so we change the dev default to dark
    setTheme(!__DEV__ && colorScheme === 'light' ? lightTheme : darkTheme);
  }, [colorScheme]);

  // TODO @AdrianFahrbach make pretty
  return isLoading ? <Text>Loading user state...</Text> : jiraAuth === null ? <Login /> : children;
};
