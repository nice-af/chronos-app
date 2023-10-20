import React, { useState } from 'react';
import { Pressable, PressableProps, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors } from '../styles/colors';
import { getPadding } from '../styles/utils';

interface PrimaryButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ onPress, label, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pressable,
        isHovered && styles.isHovered,
        pressed && styles.isActive,
        props.style,
      ]}>
      <Text>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    alignSelf: 'flex-start',
    backgroundColor: colors.buttonBase,
    borderRadius: 5,
    ...getPadding(6, 12),
  },
  isHovered: {
    backgroundColor: colors.buttonHover,
  },
  isActive: {
    backgroundColor: colors.buttonActive,
  },
});
