import React, { FC, useState } from 'react';
import { Pressable, PressableProps, StyleSheet, Text } from 'react-native';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';
import { CustomButtonProps } from '../types/global.types';

type ButtonDangerProps = Omit<PressableProps, 'style'> & CustomButtonProps;

export const ButtonDanger: FC<ButtonDangerProps> = ({ onPress, label, iconRight, ...props }) => {
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
      <Text style={styles.label}>{label}</Text>
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
      alignSelf: 'flex-start',
      backgroundColor: theme.dangerButtonBase,
      borderRadius: theme.buttonBorderRadius,
      ...getPadding(8, 12),
    },
    isHovered: {
      backgroundColor: theme.dangerButtonHover,
    },
    isActive: {
      backgroundColor: theme.dangerButtonActive,
    },
    label: {
      ...typo.bodyEmphasized,
      color: theme.textButton,
      lineHeight: 16,
      textAlign: 'center',
    },
  });
}
