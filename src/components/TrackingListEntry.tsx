import { useAtomValue, useSetAtom } from 'jotai';
import transparentize from 'polished/lib/color/transparentize';
import React, { FC } from 'react';
import { Pressable, PressableProps, StyleSheet, Text, View } from 'react-native';
import {
  activeWorklogIdAtom,
  activeWorklogTrackingDurationAtom,
  activeWorklogTrackingStartedAtom,
  currentOverlayAtom,
  currentWorklogToEditAtom,
  updateWorklogAtom,
} from '../atoms';
import { Overlay } from '../const';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';
import { Worklog, WorklogState } from '../types/global.types';
import { useDoublePress } from '../utils/double-press';
import { IssueTag } from './IssueTag';
import { PlayPauseButton } from './PlayPauseButton';

interface TrackingListEntryProps extends Omit<PressableProps, 'style'> {
  worklog: Worklog;
  isSelected?: boolean;
}

export const TrackingListEntry: FC<TrackingListEntryProps> = ({ worklog, isSelected }) => {
  const setCurrentWorklogToEdit = useSetAtom(currentWorklogToEditAtom);
  const setActiveWorklogId = useSetAtom(activeWorklogIdAtom);
  const activeWorklogId = useAtomValue(activeWorklogIdAtom);
  const setActiveWorklogTrackingStarted = useSetAtom(activeWorklogTrackingStartedAtom);
  const activeWorklogTrackingDuration = useAtomValue(activeWorklogTrackingDurationAtom);
  const updateWorklog = useSetAtom(updateWorklogAtom);
  const setCurrentOverlay = useSetAtom(currentOverlayAtom);
  const { onPress } = useDoublePress(() => {
    setCurrentWorklogToEdit(worklog);
    setCurrentOverlay(Overlay.EditWorklog);
  });
  const styles = useThemedStyles(createStyles);

  const isActiveWorklog = activeWorklogId === worklog.id;

  let duration = worklog.timeSpentSeconds;
  if (isActiveWorklog) {
    duration = worklog.timeSpentSeconds + activeWorklogTrackingDuration;
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, (isSelected || pressed) && styles.containerIsSelected]}>
      <View style={styles.infoContainer}>
        <View style={styles.header}>
          {/* TODO remove, only for debugging */}
          <Text
            style={{
              color:
                worklog.state === WorklogState.Synced
                  ? 'lime'
                  : worklog.state === WorklogState.Edited
                  ? 'yellow'
                  : 'aqua',
            }}>
            [{worklog.state}]
          </Text>
          <IssueTag label={worklog.issue.key} project={'orcaya'} />
          <Text numberOfLines={1} style={styles.title}>
            {worklog.issue.summary}
          </Text>
        </View>
        {worklog.comment && <Text style={styles.description}>{worklog.comment}</Text>}
      </View>
      <PlayPauseButton
        duration={duration}
        isRunning={isActiveWorklog}
        onPress={() => {
          if (isActiveWorklog) {
            setActiveWorklogId(null);
            if (activeWorklogTrackingDuration >= 60) {
              updateWorklog({ ...worklog, timeSpentSeconds: duration });
            }
          } else {
            setActiveWorklogTrackingStarted(Date.now());
            setActiveWorklogId(worklog.id);
          }
        }}
      />
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
      backgroundColor: transparentize(0.96, theme.contrast as string),
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
      color: theme.textPrimary,
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
