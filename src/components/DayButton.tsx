import React, { useContext, useState } from 'react';
import { Pressable, PressableProps, StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/colors';
import { typo } from '../styles/typo';
import { DayLabel, dayLabelToDayIdMap } from '../types/global.types';
import { GlobalContext } from '../contexts/global.context';

interface DayButtonProps extends Omit<PressableProps, 'style'> {
  dayLabel: DayLabel;
  duration?: string;
  onPress: () => void;
  isSelected?: boolean;
}

export const DayButton: React.FC<DayButtonProps> = ({ onPress, dayLabel, duration, isSelected, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { layout, workingDays, hideNonWorkingDays } = useContext(GlobalContext);
  const isWorkingDay = workingDays.includes(dayLabelToDayIdMap[dayLabel]);

  let height = 54;
  if (layout === 'compact') {
    height = 44;
  }
  if (layout === 'micro' || !isWorkingDay) {
    height = 28;
  }

  if (hideNonWorkingDays && !isWorkingDay) {
    return null;
  }

  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPress={onPress}
      style={[styles.default, (isHovered || isSelected) && styles.isHovered, { height: height }]}>
      <View style={[styles.insetBorder, { height: height - 2 }]} />
      {isSelected && <View style={[styles.selectedBorder, { height: height + 4 }]} />}
      <Text style={styles.day}>{dayLabel}</Text>
      {isWorkingDay && layout !== 'micro' && <Text style={styles.time}>{duration ?? '-'}</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  default: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 54,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.4)',
  },
  isHovered: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  insetBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 52,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
  },
  selectedBorder: {
    position: 'absolute',
    top: -3,
    left: -3,
    width: 58,
    borderWidth: 2,
    borderColor: colors.blue,
    borderRadius: 12,
  },
  day: {
    zIndex: 2,
    ...typo.headline,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  time: {
    zIndex: 2,
    minWidth: 32,
    ...typo.subheadline,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
});
