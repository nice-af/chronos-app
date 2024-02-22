import { useSetAtom } from 'jotai';
import { FC, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { settingsAtom } from '../atoms';
import { darkTheme } from '../styles/theme/theme-dark';
import { lightTheme } from '../styles/theme/theme-light';

const ColorSchemeWatcher: FC = () => {
  const colorScheme = useColorScheme();
  const setSettings = useSetAtom(settingsAtom);
  /**
   * Auto-set theme
   */
  useEffect(() => {
    // The theme is always set to light during development, but we use dark so we change the dev default to dark
    setSettings(cur => ({ ...cur, theme: !__DEV__ && colorScheme === 'light' ? lightTheme : darkTheme }));
  }, [colorScheme]);

  return null;
};

export default ColorSchemeWatcher;