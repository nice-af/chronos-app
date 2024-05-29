import { useAtomValue } from 'jotai';
import transparentize from 'polished/lib/color/transparentize';
import React, { FC, useMemo } from 'react';
import { Image, Pressable, PressableProps, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { jiraAccountsAtom, projectsAtom, settingsAtom, themeAtom } from '../atoms';
import { getProjectByIssueKey } from '../services/project.service';
import { getWorkspaceColor, useThemedStyles } from '../services/theme.service';
import { ColorKey, Theme, colorKeys } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';

function hashStr(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    hash += charCode;
  }
  return hash;
}

interface IssueKeyTagProps extends Omit<PressableProps, 'style'> {
  issueKey: string;
  accountId: string;
  onPress?: () => void;
  style?: ViewStyle;
}

type IssueKeyTagTheme = { text: TextStyle; bg: ViewStyle };
type IssueKeyTagThemes = Record<ColorKey, IssueKeyTagTheme>;

export const IssueKeyTag: FC<IssueKeyTagProps> = ({ issueKey, accountId, onPress, ...props }) => {
  const theme = useAtomValue(themeAtom);
  const jiraAccounts = useAtomValue(jiraAccountsAtom);
  const thisJiraAccount = jiraAccounts.find(account => account.accountId === accountId);
  const projects = useAtomValue(projectsAtom);
  const styles = useThemedStyles(createStyles);
  const { issueTagIcon, issueTagColor } = useAtomValue(settingsAtom);
  const tagThemes: IssueKeyTagThemes = useMemo(
    () => ({
      red: {
        text: { color: theme.red },
        bg: { backgroundColor: transparentize(0.75, theme.red as string) },
      },
      orange: {
        text: { color: theme.orange },
        bg: { backgroundColor: transparentize(0.75, theme.orange as string) },
      },
      yellow: {
        text: { color: theme.yellow },
        bg: { backgroundColor: transparentize(0.75, theme.yellow as string) },
      },
      green: {
        text: { color: theme.green },
        bg: { backgroundColor: transparentize(0.75, theme.green as string) },
      },
      mint: {
        text: { color: theme.mint },
        bg: { backgroundColor: transparentize(0.75, theme.mint as string) },
      },
      teal: {
        text: { color: theme.teal },
        bg: { backgroundColor: transparentize(0.75, theme.teal as string) },
      },
      cyan: {
        text: { color: theme.cyan },
        bg: { backgroundColor: transparentize(0.75, theme.cyan as string) },
      },
      blue: {
        text: { color: theme.blue },
        bg: { backgroundColor: transparentize(0.75, theme.blue as string) },
      },
      indigo: {
        text: { color: theme.indigo },
        bg: { backgroundColor: transparentize(0.75, theme.indigo as string) },
      },
      purple: {
        text: { color: theme.purple },
        bg: { backgroundColor: transparentize(0.75, theme.purple as string) },
      },
      pink: {
        text: { color: theme.pink },
        bg: { backgroundColor: transparentize(0.75, theme.pink as string) },
      },
      gray: {
        text: { color: theme.gray },
        bg: { backgroundColor: transparentize(0.75, theme.gray as string) },
      },
      brown: {
        text: { color: theme.brown },
        bg: { backgroundColor: transparentize(0.75, theme.brown as string) },
      },
    }),
    [theme.type]
  );
  colorKeys;

  // The placeholder is used to display the component in the settings screen.
  const isPlaceholder = issueKey === 'placeholder';
  if (isPlaceholder) {
    issueKey = 'PROJ-123';
  }

  // Assign tag color theme
  const currentTheme: IssueKeyTagTheme = useMemo(() => {
    let newTheme = tagThemes[colorKeys[hashStr(issueKey) % colorKeys.length]];
    if (thisJiraAccount && issueTagColor === 'workspace') {
      if (thisJiraAccount.workspaceColor === 'custom' && thisJiraAccount.customWorkspaceColor) {
        newTheme = {
          text: { color: thisJiraAccount.customWorkspaceColor },
          bg: { backgroundColor: transparentize(0.75, thisJiraAccount.customWorkspaceColor) },
        };
      } else if (thisJiraAccount.workspaceColor !== 'custom') {
        newTheme = tagThemes[thisJiraAccount.workspaceColor as ColorKey];
      }
    }
    return newTheme;
  }, [issueKey, thisJiraAccount?.workspaceColor, thisJiraAccount?.customWorkspaceColor, issueTagColor]);

  // The useMemo hook is used to assure that the project is up-to-date when the projects change to display the latest avatar.
  const project = useMemo(
    () => (isPlaceholder ? null : getProjectByIssueKey(issueKey, accountId)),
    [issueKey, accountId, projects, isPlaceholder]
  );
  const hasProjectIcon = issueTagIcon === 'project' || issueTagIcon === 'workspaceAndProject';
  const projectImageSrc = isPlaceholder
    ? require('../assets/placeholder-project-icon.png')
    : project
      ? { uri: project.avatar, width: 48, height: 48 }
      : undefined;

  const hasWorkspaceIndicator = issueTagIcon === 'workspace' || issueTagIcon === 'workspaceAndProject';

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.container, pressed && styles.isSelected, props.style]}>
      {hasWorkspaceIndicator && (
        <View style={[styles.indicator, { backgroundColor: getWorkspaceColor(thisJiraAccount, theme) }]} />
      )}
      {hasProjectIcon &&
        (projectImageSrc ? <Image style={styles.logo} source={projectImageSrc} /> : <View style={styles.logo} />)}
      <View style={[styles.labelContainer, currentTheme.bg]}>
        <Text style={[styles.label, currentTheme.text]}>{issueKey}</Text>
      </View>
    </Pressable>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      gap: 2,
      height: 20,
      backgroundColor: 'transparent',
      textAlign: 'center',
      borderRadius: 5,
      overflow: 'hidden',
    },
    isSelected: {
      opacity: 0.75,
    },
    indicator: {
      width: 4,
      height: 20,
      backgroundColor: theme.surfaceButtonBase,
    },
    logo: {
      width: 20,
      height: 20,
      backgroundColor: theme.surfaceButtonBase,
    },
    labelContainer: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      ...getPadding(3, 5),
      height: 20,
    },
    label: {
      ...typo.subheadlineEmphasized,
    },
  });
}
