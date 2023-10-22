import React, { useState } from 'react';
import { Image, Pressable, PressableProps, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../styles/colors';

interface FooterButtonProps extends Omit<PressableProps, 'style'> {
  onPress: () => void;
  style?: ViewStyle;
  children?: React.ReactNode;
}

export const FooterButton: React.FC<FooterButtonProps> = ({ onPress, children, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPress={onPress}
      style={({ pressed }) => [styles.default, isHovered && styles.isHovered, pressed && styles.isActive, props.style]}>
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  default: {
    padding: 6,
    borderRadius: 5,
    backgroundColor: colors.secondaryButtonBase,
  },
  isHovered: {
    backgroundColor: colors.secondaryButtonHover,
  },
  isActive: {
    backgroundColor: colors.secondaryButtonActive,
  },
});
