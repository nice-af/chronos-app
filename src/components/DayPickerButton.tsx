import React, { useState } from 'react';
import { Pressable, PressableProps, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import { colors } from '../styles/colors';
import { getPadding } from '../styles/utils';
import { typo } from '../styles/typo';

export type DayLabel = 'M' | 'T' | 'W' | 'F' | 'S';

interface DayPickerButtonProps extends Omit<PressableProps, 'style'> {
  day: DayLabel;
  duration?: string;
  onPress: () => void;
  style?: ViewStyle;
  isSelected?: boolean;
}

export const DayPickerButton: React.FC<DayPickerButtonProps> = ({ onPress, day, duration, isSelected, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPress={onPress}
      style={({ pressed }) => [
        styles.default,
        isHovered && styles.isHovered,
        pressed && styles.isSelected,
        isSelected && styles.isSelected,
        props.style,
      ]}>
      <Text style={isSelected ? styles.textDaySelected : styles.textDay}>{day}</Text>
      <Text style={styles.textTime}>{duration ?? '-'}</Text>
    </Pressable>
  );
};

const textDay: TextStyle = {
  minWidth: 32,
  ...typo.headline,
  textAlign: 'center',
};

const styles = StyleSheet.create({
  default: {
    ...getPadding(6, 4),
    borderRadius: 5,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  isHovered: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  isSelected: {
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  textDay: {
    ...textDay,
    color: colors.textSecondary,
  },
  textDaySelected: {
    ...textDay,
    color: colors.textPrimary,
  },
  textTime: {
    minWidth: 32,
    ...typo.subheadline,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
});
