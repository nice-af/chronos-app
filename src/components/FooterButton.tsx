import { useAppState } from '@react-native-community/hooks';
import React, { useState } from 'react';
import { Pressable, PressableProps, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../styles/colors';

interface FooterButtonProps extends Omit<PressableProps, 'style'> {
  onPress: () => void;
  style?: ViewStyle;
  children?: React.ReactNode;
}

export const FooterButton: React.FC<FooterButtonProps> = ({ onPress, children, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);
  const currentAppState = useAppState();

  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPress={onPress}
      style={({ pressed }) => [
        styles.default,
        isHovered && styles.isHovered,
        pressed && styles.isActive,
        props.style,
        currentAppState === 'inactive' && { opacity: 0.4 },
      ]}>
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
