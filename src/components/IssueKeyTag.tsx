import { useAtomValue } from 'jotai';
import transparentize from 'polished/lib/color/transparentize';
import React, { FC, useMemo } from 'react';
import { Image, Pressable, PressableProps, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { projectsAtom, themeAtom } from '../atoms';
import { getProjectByIssueKey } from '../services/project.service';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
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
  onPress?: () => void;
  style?: ViewStyle;
}

export const IssueKeyTag: FC<IssueKeyTagProps> = ({ issueKey, onPress, ...props }) => {
  const theme = useAtomValue(themeAtom);
  const styles = useThemedStyles(createStyles);
  const tagThemes: Record<string, { text: TextStyle; bg: ViewStyle }> = useMemo(
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
  const tagThemesKeys = Object.keys(tagThemes);
  const currentTheme = tagThemes[tagThemesKeys[hashStr(issueKey) % tagThemesKeys.length]];
  const projects = useAtomValue(projectsAtom);

  // The useMemo hook is used to assure that the project is up-to-date when the projects change to display the latest avatar.
  const project = useMemo(() => getProjectByIssueKey(issueKey), [issueKey, projects]);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.default, pressed && styles.isSelected, props.style]}>
      {project?.avatar ? (
        <Image
          style={styles.logo}
          source={{
            uri: project.avatar,
            width: 48,
            height: 48,
          }}
        />
      ) : (
        <View style={styles.logo} />
      )}
      <View style={[styles.labelContainer, currentTheme.bg]}>
        <Text style={[styles.label, currentTheme.text]}>{issueKey}</Text>
      </View>
    </Pressable>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    default: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      height: 20,
      backgroundColor: 'transparent',
      textAlign: 'center',
    },
    isSelected: {
      opacity: 0.75,
    },
    logo: {
      width: 20,
      height: 20,
      marginRight: 2,
      borderTopLeftRadius: 5,
      borderBottomLeftRadius: 5,
      backgroundColor: theme.surfaceButtonBase,
    },
    labelContainer: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      ...getPadding(3, 5),
      height: 20,
      borderTopRightRadius: 5,
      borderBottomRightRadius: 5,
    },
    label: {
      ...typo.subheadlineEmphasized,
    },
  });
}
