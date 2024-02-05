import { useContext, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeContext } from '../contexts/theme.context';
import { Theme } from '../styles/theme/theme-types';

export function useThemedStyles<T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
  createStylesFn: (theme: Theme) => T
) {
  const { theme } = useContext(ThemeContext);
  return useMemo(() => createStylesFn(theme), [theme.type]);
}
