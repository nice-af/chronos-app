import React, { useState } from 'react';
import { Pressable, PressableProps, StyleSheet, ViewStyle } from 'react-native';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
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
  return StyleSheet.create({
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
      backgroundColor: theme.transparentButtonHover,
    },
    isActive: {
      backgroundColor: theme.transparentButtonActive,
    },
    label: {
      ...typo.bodyEmphasized,
      color: theme.textPrimary,
    },
  });
}
