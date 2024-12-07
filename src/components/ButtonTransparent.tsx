import React, { FC, ReactNode, useState } from 'react';
import { Pressable, PressableProps, StyleSheet, ViewStyle } from 'react-native';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';

interface ButtonTransparentProps extends Omit<PressableProps, 'style'> {
  onPress: () => void;
  style?: ViewStyle;
  children?: ReactNode;
  hasLargePadding?: boolean;
}

export const ButtonTransparent: FC<ButtonTransparentProps> = ({ onPress, children, hasLargePadding, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);
  const styles = useThemedStyles(createStyles);

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

function createStyles(theme: Theme) {
  // This needs to be assigned to `styles` for react-native/no-unused-styles to work
  const styles = StyleSheet.create({
    pressable: {
      position: 'relative', // Needed for elements within this button elsewhere
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      flexShrink: 0,
      gap: 8,
      backgroundColor: theme.transparent,
      borderRadius: theme.buttonBorderRadius,
      padding: 2,
      margin: -2,
    },
    hasLargePadding: {
      padding: 8,
      margin: -8,
    },
    isHovered: {
      backgroundColor: theme.transparentButtonHover,
    },
    isActive: {
      backgroundColor: theme.transparentButtonActive,
    },
  });
  return styles;
}
