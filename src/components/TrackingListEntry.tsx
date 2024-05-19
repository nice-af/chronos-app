import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import transparentize from 'polished/lib/color/transparentize';
import React, { FC, useRef } from 'react';
import { Pressable, PressableProps, StyleSheet, Text, View } from 'react-native';
import {
  activeWorklogAtom,
  currentOverlayAtom,
  currentWorklogToEditAtom,
  deleteWorklogAtom,
  selectedDateAtom,
  setWorklogAsActiveAtom,
  settingsAtom,
  worklogsLocalAtom,
} from '../atoms';
import { Overlay } from '../const';
import { isRightClick, showContextualMenu } from '../services/contextual-menu.service';
import { formatDateToYYYYMMDD } from '../services/date.service';
import { useTranslation } from '../services/i18n.service';
import { useModal } from '../services/modal.service';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';
import { Worklog, WorklogState } from '../types/global.types';
import { useDoublePress } from '../utils/double-press';
import { IssueKeyTag } from './IssueKeyTag';
import { PlayPauseButton } from './PlayPauseButton';
import { set } from 'lodash';

interface TrackingListEntryProps extends Omit<PressableProps, 'style'> {
  worklog: Worklog;
  isSelected?: boolean;
}

export const TrackingListEntry: FC<TrackingListEntryProps> = ({ worklog, isSelected }) => {
  const selectedDate = useAtomValue(selectedDateAtom);
  const settings = useAtomValue(settingsAtom);
  const setCurrentWorklogToEdit = useSetAtom(currentWorklogToEditAtom);
  const setLocalWorklogs = useSetAtom(worklogsLocalAtom);
  const activeWorklog = useAtomValue(activeWorklogAtom);
  const setWorklogAsActive = useSetAtom(setWorklogAsActiveAtom);
  const setCurrentOverlay = useSetAtom(currentOverlayAtom);
  const deleteWorklog = useSetAtom(deleteWorklogAtom);
  const { getModalConfirmation } = useModal();
  const { t } = useTranslation();
  const ref = useRef(null);
  const { onPress: onDoublePress } = useDoublePress(editWorklog);
  const styles = useThemedStyles(createStyles);

  function editWorklog() {
    setCurrentWorklogToEdit(worklog);
    setCurrentOverlay([Overlay.EDIT_WORKLOG]);
  }

  async function handlePlayPause() {
    if (isActiveWorklog) {
      setWorklogAsActive(null);
      return;
    }

    if (!settings.warningWhenEditingOtherDays) {
      setWorklogAsActive(worklog.id);
      return;
    }

    const todayDateString = formatDateToYYYYMMDD(new Date());
    if (todayDateString === selectedDate) {
      setWorklogAsActive(worklog.id);
      return;
    }

    const isInFuture = new Date(selectedDate) > new Date(todayDateString);
    let isConfirmed = false;
    if (isInFuture) {
      isConfirmed = await getModalConfirmation({
        icon: 'timer-warning',
        headline: t('modals.startTimerInFutureHeadline'),
        text: t('modals.startTimerInFutureText'),
      });
    } else {
      isConfirmed = await getModalConfirmation({
        icon: 'timer-warning',
        headline: t('modals.startTimerInPastHeadline'),
        text: t('modals.startTimerInPastText'),
      });
    }
    if (isConfirmed) {
      setWorklogAsActive(worklog.id);
    }
  }

  const contextualMenuItems = [
    { name: t('worklogs.editWorklog'), onClick: editWorklog },
    { name: t('delete'), onClick: async () => await deleteWorklog(worklog.id) },
  ];
  if (worklog.state === WorklogState.EDITED) {
    contextualMenuItems.push({
      name: t('worklogs.resetChanges'),
      onClick: () => setLocalWorklogs(prev => prev.filter(localWorklog => localWorklog.id !== worklog.id)),
    });
  }

  const isActiveWorklog = activeWorklog?.id === worklog.id;
  return (
    <Pressable
      ref={ref}
      onPress={e => {
        if (isRightClick(e)) {
          showContextualMenu(contextualMenuItems, ref.current);
        } else {
          onDoublePress();
        }
      }}
      style={({ pressed }) => [styles.container, (isSelected || pressed) && styles.containerIsSelected]}>
      <View style={styles.infoContainer}>
        <View style={styles.header}>
          {__DEV__ && (
            <Text
              style={{
                color:
                  worklog.state === WorklogState.SYNCED
                    ? 'lime'
                    : worklog.state === WorklogState.EDITED
                      ? 'yellow'
                      : 'aqua',
              }}>
              [{worklog.state.substring(0, 1).toUpperCase()}]
            </Text>
          )}
          <IssueKeyTag issueKey={worklog.issue.key} />
          <Text numberOfLines={1} style={styles.title}>
            {worklog.issue.summary}
          </Text>
        </View>
        {worklog.comment && <Text style={styles.description}>{worklog.comment}</Text>}
      </View>
      <PlayPauseButton duration={worklog.timeSpentSeconds} isRunning={isActiveWorklog} onPress={handlePlayPause} />
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
