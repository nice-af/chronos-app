import React, { useState } from 'react';
import { Pressable, PressableProps, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors } from '../styles/colors';
import { getPadding } from '../styles/utils';
import { typo } from '../styles/typo';

interface ButtonTransparentProps extends Omit<PressableProps, 'style'> {
  onPress: () => void;
  style?: ViewStyle;
  children?: React.ReactNode;
  hasLargePadding?: boolean;
}

export const ButtonTransparent: React.FC<ButtonTransparentProps> = ({
  onPress,
  children,
  hasLargePadding,
  ...props
}) => {
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
        hasLargePadding && styles.hasLargePadding,
        props.style,
      ]}>
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    position: 'relative', // Needed for elements within this button elsewhere
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 2,
    margin: -2,
  },
  hasLargePadding: {
    padding: 8,
    margin: -8,
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
