import { useContext, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useAtomValue } from 'jotai';
import { themeAtom } from '../atoms';
import { Theme } from '../styles/theme/theme-types';

export function useThemedStyles<T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
  createStylesFn: (theme: Theme) => T
) {
  const theme = useAtomValue(themeAtom);
  return useMemo(() => createStylesFn(theme), [theme.type]);
}
