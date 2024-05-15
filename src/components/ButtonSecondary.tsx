import React, { FC, useState } from 'react';
import { Pressable, PressableProps, StyleSheet, Text } from 'react-native';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';
import { CustomButtonProps } from '../types/global.types';

type ButtonSecondaryProps = Omit<PressableProps, 'style'> & CustomButtonProps;

export const ButtonSecondary: FC<ButtonSecondaryProps> = ({ onPress, label, iconRight, ...props }) => {
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
        !label && !!iconRight && styles.isIconOnly,
        props.style,
      ]}>
      {label && <Text style={styles.label}>{label}</Text>}
      {iconRight}
    </Pressable>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    pressable: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 8,
      alignSelf: 'flex-start',
      backgroundColor: theme.secondaryButtonBase,
      borderColor: theme.secondaryButtonBorder,
      borderWidth: 1,
      borderRadius: theme.buttonBorderRadius,
      ...getPadding(7, 12),
    },
    isIconOnly: {
      paddingRight: 7,
      paddingLeft: 7,
    },
    isHovered: {
      backgroundColor: theme.secondaryButtonHover,
    },
    isActive: {
      backgroundColor: theme.secondaryButtonActive,
    },
    label: {
      ...typo.bodyEmphasized,
      color: theme.textPrimary,
      lineHeight: 16,
      textAlign: 'center',
    },
  });
}
