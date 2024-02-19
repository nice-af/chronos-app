import { useAtomValue } from 'jotai';
import React, { FC, useState } from 'react';
import { Image, Platform, Pressable, PressableProps, StyleSheet, Text, View } from 'react-native';
import {
  activeWorklogAtom,
  activeWorklogTrackingDurationAtom,
  hideNonWorkingDaysAtom,
  selectedDateAtom,
  sidebarLayoutAtom,
  themeAtom,
  workingDaysAtom,
  worklogsAtom,
} from '../atoms';
import { SidebarLayout } from '../const';
import { useThemedStyles } from '../services/theme.service';
import { formatSecondsToHMM } from '../services/time.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { DayLabel, WorklogState, dayLabelToDayIdMap } from '../types/global.types';

interface DayButtonProps extends Omit<PressableProps, 'style'> {
  dateString: string;
  dayLabel: DayLabel;
  onPress: () => void;
}

export const DayButton: FC<DayButtonProps> = ({ onPress, dayLabel, dateString }) => {
  const [isHovered, setIsHovered] = useState(false);
  const sidebarLayout = useAtomValue(sidebarLayoutAtom);
  const workingDays = useAtomValue(workingDaysAtom);
  const hideNonWorkingDays = useAtomValue(hideNonWorkingDaysAtom);
  const isWorkingDay = workingDays.includes(dayLabelToDayIdMap[dayLabel]);
  const styles = useThemedStyles(createStyles);
  const theme = useAtomValue(themeAtom);
  const worklogs = useAtomValue(worklogsAtom);
  const selectedDate = useAtomValue(selectedDateAtom);
  const activeWorklog = useAtomValue(activeWorklogAtom);
  const activeWorklogTrackingDuration = useAtomValue(activeWorklogTrackingDurationAtom);
  const activeWorklogIsThisDay = activeWorklog?.started === dateString;

  if (hideNonWorkingDays && !isWorkingDay) {
    return null;
  }

  let height = 54;
  if (sidebarLayout === SidebarLayout.Compact) {
    height = 44;
  }
  if (sidebarLayout === SidebarLayout.Micro || !isWorkingDay) {
    height = 28;
  }

  let duration = worklogs
    .filter(worklog => worklog.started === dateString)
    .reduce((acc, worklog) => acc + worklog.timeSpentSeconds, 0);
  if (activeWorklogIsThisDay) {
    duration += activeWorklogTrackingDuration;
  }
  const isSelected = selectedDate === dateString;

  const worklogsForThisDay = worklogs.filter(worklog => worklog.started === dateString);
  const isChecked =
    worklogsForThisDay.length > 0 && worklogsForThisDay.every(worklog => worklog.state === WorklogState.Synced);
  const hasChanges =
    activeWorklogIsThisDay ||
    worklogsForThisDay.some(worklog => worklog.started === dateString && worklog.state !== WorklogState.Synced);

  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPress={onPress}
      style={({ pressed }) => [
        styles.default,
        (isHovered || isSelected) && styles.isHovered,
        pressed && styles.isPressed,
        { height: height },
      ]}>
      {Platform.OS !== 'windows' && <View style={[styles.insetBorder, { height: height - 2 }]} />}
      {isSelected && (
        <View style={[styles.selectedBorder, { height: Platform.OS === 'windows' ? height : height + 4 }]} />
      )}
      <View style={styles.dayContainer}>
        {hasChanges ? (
          <View style={styles.dot} />
        ) : isChecked ? (
          <Image
            style={styles.checkmark}
            source={
              theme.type === 'light'
                ? require('../assets/icons/checkmark-small-light.png')
                : require('../assets/icons/checkmark-small-dark.png')
            }
          />
        ) : null}
        <Text style={styles.day}>{dayLabel}</Text>
      </View>
      {isWorkingDay && sidebarLayout !== SidebarLayout.Micro && (
        <Text style={styles.time}>{duration ? formatSecondsToHMM(duration) : '-'}</Text>
      )}
    </Pressable>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    default: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: 54,
      borderRadius: 10,
      backgroundColor: theme.dayButtonBase,
      textAlign: 'center',
      borderWidth: 1,
      borderColor: theme.dayButtonBorder,
      overflow: 'visible',
    },
    isHovered: {
      backgroundColor: theme.dayButtonHover,
    },
    isPressed: {
      opacity: 0.8,
    },
    insetBorder: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 52,
      borderWidth: 1,
      borderColor: theme.dayButtonBorderInset,
      borderRadius: 10,
    },
    selectedBorder: {
      position: 'absolute',
      borderWidth: 2,
      borderColor: theme.blue,
      ...Platform.select({
        default: {
          top: -3,
          left: -3,
          width: 58,
          borderRadius: 12,
        },
        windows: {
          top: -1,
          left: -1,
          width: 54,
          borderRadius: 8,
        },
      }),
    },
    dayContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
      width: '100%',
      marginBottom: 1,
    },
    checkmark: {
      width: 8,
      height: 6,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.red,
    },
    day: {
      zIndex: 2,
      ...typo.headline,
      textAlign: 'center',
      color: theme.textPrimary,
    },
    time: {
      zIndex: 2,
      minWidth: 32,
      ...typo.subheadline,
      color: theme.textSecondary,
      textAlign: 'center',
    },
  });
}
