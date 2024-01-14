import { useAppState } from '@react-native-community/hooks';
import React, { useState } from 'react';
import { Pressable, PressableProps, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors } from '../styles/colors';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';

interface ButtonSecondaryProps extends Omit<PressableProps, 'style'> {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  iconRight?: React.ReactNode;
}

export const ButtonSecondary: React.FC<ButtonSecondaryProps> = ({ onPress, label, iconRight, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);
  const currentAppState = useAppState();

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
    alignSelf: 'flex-start',
    backgroundColor: colors.secondaryButtonBase,
    borderColor: colors.secondaryButtonBorder,
    borderWidth: 1,
    borderRadius: 9,
    ...getPadding(7, 12),
  },
  isHovered: {
    backgroundColor: colors.secondaryButtonHover,
  },
  isActive: {
    backgroundColor: colors.secondaryButtonActive,
  },
  label: {
    ...typo.bodyEmphasized,
    color: colors.textPrimary,
    lineHeight: 16,
  },
});
