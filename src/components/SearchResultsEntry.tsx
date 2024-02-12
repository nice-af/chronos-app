import { Issue } from 'jira.js/out/version3/models';
import React, { FC, useContext } from 'react';
import { Image, PressableProps, StyleSheet, Text, View } from 'react-native';
import { ThemeContext } from '../contexts/theme.context';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { ButtonTransparent } from './ButtonTransparent';
import { IssueTag } from './IssueTag';
import { getPadding } from '../styles/utils';
import { typo } from '../styles/typo';

interface SearchResultsEntryProps extends Omit<PressableProps, 'style'> {
  issue: Issue;
  onPress: () => void;
}

export const SearchResultsEntry: FC<SearchResultsEntryProps> = ({ issue, onPress }) => {
  const styles = useThemedStyles(createStyles);
  const { theme } = useContext(ThemeContext);

  return (
    <View key={issue.id} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headlineContainer}>
          <IssueTag label={issue.key} project='orcaya' />
          <Image
            style={styles.chevronIcon}
            source={
              theme.type === 'light'
                ? require('../assets/icons/chevron-right-small-light.png')
                : require('../assets/icons/chevron-right-small-dark.png')
            }
          />
          <Text style={styles.parentIssue}>{issue.fields.project.name}</Text>
        </View>
        <Text style={styles.title}>{issue.fields.summary}</Text>
      </View>
      <ButtonTransparent onPress={onPress}>
        <Image
          style={styles.plusIcon}
          source={
            theme.type === 'light'
              ? require('../assets/icons/plus-light.png')
              : require('../assets/icons/plus-dark.png')
          }
        />
      </ButtonTransparent>
    </View>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      display: 'flex',
      gap: 8,
      flexDirection: 'row',
      alignItems: 'center',
      ...getPadding(12, 16),
    },
    content: {
      flexGrow: 1,
    },
    headlineContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    parentIssue: {
      ...typo.callout,
      color: theme.textSecondary,
    },
    title: {
      ...typo.headline,
      color: theme.textPrimary,
      marginTop: 8,
    },
    plusIcon: {
      width: 24,
      height: 24,
    },
    chevronIcon: {
      width: 5,
      height: 8,
    },
  });
}
