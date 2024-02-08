import React, { useContext, useState } from 'react';
import { Platform, PlatformColor, Pressable, PressableProps, StyleSheet, Text, View } from 'react-native';
import { GlobalContext } from '../contexts/global.context';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { DayLabel, dayLabelToDayIdMap } from '../types/global.types';

interface DayButtonProps extends Omit<PressableProps, 'style'> {
  dayLabel: DayLabel;
  duration?: string;
  onPress: () => void;
  isSelected?: boolean;
}

export const DayButton: React.FC<DayButtonProps> = ({ onPress, dayLabel, duration, isSelected }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { layout, workingDays, hideNonWorkingDays } = useContext(GlobalContext);
  const isWorkingDay = workingDays.includes(dayLabelToDayIdMap[dayLabel]);
  const styles = useThemedStyles(createStyles);

  if (hideNonWorkingDays && !isWorkingDay) {
    return null;
  }

  let height = 54;
  if (layout === 'compact') {
    height = 44;
  }
  if (layout === 'micro' || !isWorkingDay) {
    height = 28;
  }

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
      <Text style={styles.day}>{dayLabel}</Text>
      {isWorkingDay && layout !== 'micro' && <Text style={styles.time}>{duration ?? '-'}</Text>}
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
      ...Platform.select({
        default: {
          backgroundColor: theme.dayButtonBase,
        },
        windows: {
          backgroundColor: PlatformColor('CardBackgroundFillColorDefaultBrush'),
        },
      }),
      textAlign: 'center',
      borderWidth: 1,
      borderColor: theme.dayButtonBorder,
      overflow: 'visible',
    },
    isHovered: {
      ...Platform.select({
        default: {
          backgroundColor: theme.dayButtonHover,
        },
        windows: {
          backgroundColor: PlatformColor('CardBackgroundFillColorSecondaryBrush'),
        },
      }),
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
          borderRadius: 10,
        },
      }),
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
