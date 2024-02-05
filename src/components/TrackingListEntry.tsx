import transparentize from 'polished/lib/color/transparentize';
import React, { useContext } from 'react';
import { Pressable, PressableProps, StyleSheet, Text, View } from 'react-native';
import { NavigationContext } from '../contexts/navigation.context';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';
import { WorklogCompact } from '../types/global.types';
import { useDoublePress } from '../utils/double-press';
import { IssueTag } from './IssueTag';
import { PlayPauseButton } from './PlayPauseButton';

interface TrackingListEntryProps extends Omit<PressableProps, 'style'> {
  worklogCompact: WorklogCompact;
  isSelected?: boolean;
}

export const TrackingListEntry: React.FC<TrackingListEntryProps> = ({ worklogCompact, isSelected }) => {
  const { setCurrentWorklogToEdit } = useContext(NavigationContext);
  const { onPress } = useDoublePress(() => setCurrentWorklogToEdit(worklogCompact));
  const styles = useThemedStyles(createStyles);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, (isSelected || pressed) && styles.containerIsSelected]}>
      <View style={styles.infoContainer}>
        <View style={styles.header}>
          <IssueTag label={worklogCompact.issueKey} project={'orcaya'} />
          <Text numberOfLines={1} style={styles.title}>
            {worklogCompact.issueSummary}
          </Text>
        </View>
        {worklogCompact.comment && <Text style={styles.description}>{worklogCompact.comment}</Text>}
      </View>
      <PlayPauseButton duration={worklogCompact.timeSpent} isRunning={false} onPress={() => {}} />
    </Pressable>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      backgroundColor: 'transparent',
      ...getPadding(12, 16),
    },
    containerIsSelected: {
      backgroundColor: transparentize(0.96, theme.contrast),
    },
    infoContainer: {
      flex: 1,
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      ...typo.headline,
      flex: 1,
      marginLeft: 8,
      marginTop: 2,
    },
    description: {
      marginTop: 8,
      ...typo.callout,
      color: theme.textSecondary,
    },
  });
}
