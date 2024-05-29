import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { themeAtom } from '../atoms';
import { Theme } from '../styles/theme/theme-types';
import { JiraAccountModel } from './storage.service';

export function useThemedStyles<T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
  createStylesFn: (theme: Theme) => T
) {
  const theme = useAtomValue(themeAtom);
  return useMemo(() => createStylesFn(theme), [theme.type]);
}

export function getWorkspaceColor(jiraAccount: JiraAccountModel | undefined, theme: Theme): string | undefined {
  if (!jiraAccount) {
    return undefined;
  }
  if (jiraAccount.workspaceColor === 'custom' && jiraAccount.customWorkspaceColor) {
    return jiraAccount.customWorkspaceColor;
  }
  if (!!jiraAccount.workspaceColor && jiraAccount.workspaceColor !== 'custom') {
    return theme[jiraAccount.workspaceColor].toString();
  }
}
