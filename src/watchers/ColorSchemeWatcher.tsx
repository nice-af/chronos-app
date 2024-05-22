import { useAtomValue, useSetAtom } from 'jotai';
import { FC, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { settingsAtom, themeAtom } from '../atoms';
import { darkTheme } from '../styles/theme/theme-dark';
import { lightTheme } from '../styles/theme/theme-light';
import { sendNativeEvent } from '../services/native-event-emitter.service';
import { NativeEvent } from '../services/native-event-emitter.service.types';
import { ThemeKey } from '../services/storage.service';

export const ColorSchemeWatcher: FC = () => {
  const colorScheme = useColorScheme();
  const setTheme = useSetAtom(themeAtom);
  const { themeKey } = useAtomValue(settingsAtom);

  useEffect(() => {
    let newThemeKey = (themeKey === 'system' ? colorScheme ?? 'dark' : themeKey) as ThemeKey;

    // The theme is always set to light during development, but we use dark so we change the dev default to dark
    if (__DEV__ && themeKey === 'system') {
      newThemeKey = 'dark';
    }

    setTheme(newThemeKey === 'light' ? lightTheme : darkTheme);
    sendNativeEvent({ name: NativeEvent.THEME_CHANGED, data: newThemeKey });
  }, [colorScheme, themeKey]);

  return null;
};
