import React, { useState } from 'react';
import { Pressable, PressableProps, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors } from '../styles/colors';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';

interface ButtonDangerProps extends Omit<PressableProps, 'style'> {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  iconRight?: React.ReactNode;
}

export const ButtonDanger: React.FC<ButtonDangerProps> = ({ onPress, label, iconRight, ...props }) => {
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
    alignSelf: 'flex-start',
    backgroundColor: colors.dangerButtonBase,
    borderWidth: 1,
    borderRadius: 9,
    ...getPadding(7, 12),
  },
  isHovered: {
    backgroundColor: colors.dangerButtonHover,
  },
  isActive: {
    backgroundColor: colors.dangerButtonActive,
  },
  label: {
    ...typo.bodyEmphasized,
    color: colors.textPrimary,
    lineHeight: 16,
  },
});
