import React, { FC, ReactNode, useState } from 'react';
import { Pressable, PressableProps, StyleSheet, Text, ViewStyle } from 'react-native';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';

interface ButtonPrimaryProps extends Omit<PressableProps, 'style'> {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  iconRight?: ReactNode;
  textAlign?: 'left' | 'center' | 'right';
}

export const ButtonPrimary: FC<ButtonPrimaryProps> = ({ onPress, label, textAlign, iconRight, ...props }) => {
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
        props.style,
      ]}>
      <Text style={[styles.label, { textAlign: textAlign }]}>{label}</Text>
      {iconRight}
    </Pressable>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    pressable: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      gap: 8,
      backgroundColor: theme.buttonBase,
      borderRadius: theme.buttonBorderRadius,
      ...getPadding(7, 20),
    },
    isHovered: {
      backgroundColor: theme.buttonHover,
    },
    isActive: {
      backgroundColor: theme.buttonActive,
    },
    label: {
      ...typo.bodyEmphasized,
      flexGrow: 1,
      color: theme.textButton,
    },
  });
}
