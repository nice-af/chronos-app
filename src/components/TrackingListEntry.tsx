import transparentize from 'polished/lib/color/transparentize';
import React, { useContext } from 'react';
import { Pressable, PressableProps, StyleSheet, Text, View } from 'react-native';
import { NavigationContext } from '../contexts/navigation.context';
import { colors } from '../styles/colors';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';
import { WorklogCompact } from '../types/global.types';
import { IssueTag } from './IssueTag';
import { PlayPauseButton } from './PlayPauseButton';

interface TrackingListEntryProps extends Omit<PressableProps, 'style'> {
  worklogCompact: WorklogCompact;
  isSelected?: boolean;
}

export const TrackingListEntry: React.FC<TrackingListEntryProps> = ({ worklogCompact, isSelected }) => {
  const { setCurrentWorklogToEdit } = useContext(NavigationContext);

  return (
    <Pressable
      onPress={() => setCurrentWorklogToEdit(worklogCompact)}
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

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'transparent',
    ...getPadding(12, 16),
  },
  containerIsSelected: {
    backgroundColor: transparentize(0.96, colors.contrast),
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
    color: colors.textSecondary,
  },
});
