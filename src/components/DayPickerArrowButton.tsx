import React, { useState } from 'react';
import { Image, Pressable, PressableProps, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import { colors } from '../styles/colors';
import { getPadding } from '../styles/utils';
import { typo } from '../styles/typo';

export type DayLabel = 'M' | 'T' | 'W' | 'F' | 'S';

interface DayPickerArrowButtonProps extends Omit<PressableProps, 'style'> {
  onPress: () => void;
  direction: 'left' | 'right';
  style?: ViewStyle;
}

export const DayPickerArrowButton: React.FC<DayPickerArrowButtonProps> = ({ onPress, direction, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPress={onPress}
      style={({ pressed }) => [styles.default, isHovered && styles.isHovered, pressed && styles.isActive, props.style]}>
      {direction === 'left' ? (
        <Image style={styles.arrow} source={require('../assets/icon-chevron-left.png')} />
      ) : (
        <Image style={styles.arrow} source={require('../assets/icon-chevron-right.png')} />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  default: {
    padding: 8,
    margin: -8,
    backgroundColor: 'transparent',
    opacity: 1,
  },
  isHovered: {
    opacity: 0.8,
  },
  isActive: {
    opacity: 0.6,
  },
  arrow: {
    width: 7,
    height: 12,
  },
});
