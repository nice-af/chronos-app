import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { themeAtom } from '../atoms';
import { Theme } from '../styles/theme/theme-types';
import { LoginModel } from '../types/accounts.types';

export function useThemedStyles<T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
  createStylesFn: (theme: Theme) => T
) {
  const theme = useAtomValue(themeAtom);
  return useMemo(() => createStylesFn(theme), [theme.type]);
}

export function getWorkspaceColor(login: LoginModel | undefined, theme: Theme): string | undefined {
  if (!login) {
    return undefined;
  }
  if (login.workspaceColor === 'custom' && login.customWorkspaceColor) {
    return login.customWorkspaceColor;
  }
  if (!!login.workspaceColor && login.workspaceColor !== 'custom') {
    return theme[login.workspaceColor].toString();
  }
}
