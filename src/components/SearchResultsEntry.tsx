import { useAtomValue } from 'jotai';
import React, { FC } from 'react';
import { Image, PressableProps, StyleSheet, Text, View } from 'react-native';
import { themeAtom } from '../atoms';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';
import { ButtonTransparent } from './ButtonTransparent';
import { IssueKeyTag } from './IssueKeyTag';

interface SearchResultIssue {
  id: string;
  key: string;
  project: {
    name: string;
  };
  summary: string;
}

interface SearchResultsEntryProps extends Omit<PressableProps, 'style'> {
  issue: SearchResultIssue;
  onPress: () => void;
}

export const SearchResultsEntry: FC<SearchResultsEntryProps> = ({ issue, onPress }) => {
  const styles = useThemedStyles(createStyles);
  const theme = useAtomValue(themeAtom);

  return (
    <View key={issue.id} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headlineContainer}>
          <IssueKeyTag issueKey={issue.key} />
          <Image
            style={styles.chevronIcon}
            source={
              theme.type === 'light'
                ? require('../assets/icons/chevron-right-small-light.png')
                : require('../assets/icons/chevron-right-small-dark.png')
            }
          />
          <Text numberOfLines={1} style={styles.parentIssue}>
            {issue.project.name}
          </Text>
        </View>
        <Text style={styles.title}>{issue.summary}</Text>
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
      flexBasis: 1,
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
      flex: 1,
    },
    title: {
      ...typo.headline,
      color: theme.textPrimary,
      marginTop: 8,
      width: '100%',
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
