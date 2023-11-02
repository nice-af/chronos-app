import React, { useState } from 'react';
import { Pressable, PressableProps, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors } from '../styles/colors';
import { getPadding } from '../styles/utils';
import { typo } from '../styles/typo';

interface ButtonTransparentProps extends Omit<PressableProps, 'style'> {
  onPress: () => void;
  style?: ViewStyle;
  children?: React.ReactNode;
}

export const ButtonTransparent: React.FC<ButtonTransparentProps> = ({ onPress, children, ...props }) => {
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
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 8,
  },
  isHovered: {
    backgroundColor: colors.transparentButtonHover,
  },
  isActive: {
    backgroundColor: colors.transparentButtonActive,
  },
  label: {
    ...typo.bodyEmphasized,
    color: colors.textPrimary,
  },
});
