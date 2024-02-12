import React, { FC, useContext, useState } from 'react';
import { Image, Platform, Pressable, PressableProps, StyleSheet, Text, View } from 'react-native';
import { GlobalContext } from '../contexts/global.context';
import { ThemeContext } from '../contexts/theme.context';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { DayLabel, dayLabelToDayIdMap } from '../types/global.types';

interface DayButtonProps extends Omit<PressableProps, 'style'> {
  dayLabel: DayLabel;
  duration?: string;
  onPress: () => void;
  isSelected?: boolean;
  state?: 'checked' | 'inProgress';
}

export const DayButton: FC<DayButtonProps> = ({ onPress, dayLabel, duration, isSelected, state }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { layout, workingDays, hideNonWorkingDays } = useContext(GlobalContext);
  const isWorkingDay = workingDays.includes(dayLabelToDayIdMap[dayLabel]);
  const styles = useThemedStyles(createStyles);
  const { theme } = useContext(ThemeContext);

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
      <View style={styles.dayContainer}>
        {state === 'inProgress' && <View style={styles.dot} />}
        {state === 'checked' && (
          <Image
            style={styles.checkmark}
            source={
              theme.type === 'light'
                ? require('../assets/icons/checkmark-small-light.png')
                : require('../assets/icons/checkmark-small-dark.png')
            }
          />
        )}
        <Text style={styles.day}>{dayLabel}</Text>
      </View>
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
          borderRadius: 10,
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
