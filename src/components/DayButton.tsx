import { useAtomValue } from 'jotai';
import React, { FC, useState } from 'react';
import { Image, Platform, Pressable, PressableProps, StyleSheet, Text, View } from 'react-native';
import {
  activeWorklogAtom,
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
import { DayCode, WorklogState, dayCodeToDayIdMap } from '../types/global.types';
import { useTranslation } from '../services/i18n.service';

interface DayButtonProps extends Omit<PressableProps, 'style'> {
  dateString: string;
  dayCode: DayCode;
  onPress: () => void;
}

export const DayButton: FC<DayButtonProps> = ({ onPress, dayCode, dateString }) => {
  const [isHovered, setIsHovered] = useState(false);
  const sidebarLayout = useAtomValue(sidebarLayoutAtom);
  const workingDays = useAtomValue(workingDaysAtom);
  const hideNonWorkingDays = useAtomValue(hideNonWorkingDaysAtom);
  const isWorkingDay = workingDays.includes(dayCodeToDayIdMap[dayCode]);
  const styles = useThemedStyles(createStyles);
  const theme = useAtomValue(themeAtom);
  const worklogs = useAtomValue(worklogsAtom);
  const selectedDate = useAtomValue(selectedDateAtom);
  const { t } = useTranslation();

  if (hideNonWorkingDays && !isWorkingDay) {
    return null;
  }

  let height = 54;
  if (sidebarLayout === SidebarLayout.COMPACT) {
    height = 44;
  }
  if (sidebarLayout === SidebarLayout.MICRO || !isWorkingDay) {
    height = 28;
  }

  let duration = worklogs
    .filter(worklog => worklog.started === dateString)
    .reduce((acc, worklog) => acc + worklog.timeSpentSeconds, 0);
  const isSelected = selectedDate === dateString;

  const worklogsForThisDay = worklogs.filter(worklog => worklog.started === dateString);
  const isChecked =
    worklogsForThisDay.length > 0 && worklogsForThisDay.every(worklog => worklog.state === WorklogState.SYNCED);
  const hasChanges = worklogsForThisDay.some(
    worklog => worklog.started === dateString && worklog.state !== WorklogState.SYNCED
  );

  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPress={onPress}
      style={({ pressed }) => [
        styles.default,
        (isHovered || isSelected) && styles.isHovered,
        pressed && styles.isPressed,
        Platform.OS === 'windows' && isSelected && styles.isSelected,
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
        <Text style={styles.day}>{t(`weekDays.${dayCode}`)}</Text>
      </View>
      {isWorkingDay && sidebarLayout !== SidebarLayout.MICRO && (
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
    isSelected: {
      borderColor: theme.blue,
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
      borderColor: theme.blue,
      ...Platform.select({
        default: {
          top: -3,
          left: -3,
          width: 58,
          borderWidth: 2,
          borderRadius: 12,
        },
        windows: {
          top: -1,
          left: -1,
          width: 54,
          borderWidth: 2,
          borderRadius: 9,
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
