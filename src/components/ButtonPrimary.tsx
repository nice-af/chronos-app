import React, { useState } from 'react';
import { Pressable, PressableProps, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors } from '../styles/colors';
import { getPadding } from '../styles/utils';
import { typo } from '../styles/typo';

interface ButtonPrimaryProps extends Omit<PressableProps, 'style'> {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  iconRight?: React.ReactNode;
}

export const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({ onPress, label, iconRight, ...props }) => {
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
      <Text style={styles.label}>{label}</Text>
      {iconRight}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.buttonBase,
    borderRadius: 8,
    ...getPadding(8, 20),
  },
  isHovered: {
    backgroundColor: colors.buttonHover,
  },
  isActive: {
    backgroundColor: colors.buttonActive,
  },
  label: {
    ...typo.bodyEmphasized,
    color: colors.textPrimary,
  },
});
