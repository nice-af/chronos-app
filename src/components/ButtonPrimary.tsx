import React, { FC, ReactNode, useState } from 'react';
import { Pressable, PressableProps, StyleSheet, Text, ViewStyle } from 'react-native';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';
import { LoadingSpinnerSmall } from './LoadingSpinnerSmall';

interface ButtonPrimaryProps extends Omit<PressableProps, 'style'> {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  iconRight?: ReactNode;
  textAlign?: 'left' | 'center' | 'right';
  isLoading?: boolean;
}

export const ButtonPrimary: FC<ButtonPrimaryProps> = ({
  onPress,
  label,
  iconRight,
  isLoading,
  textAlign,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const styles = useThemedStyles(createStyles);

  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPress={isLoading ? undefined : onPress}
      style={({ pressed }) => [
        styles.pressable,
        isHovered && styles.isHovered,
        pressed && styles.isActive,
        props.style,
      ]}>
      {isLoading && <LoadingSpinnerSmall style={styles.loadingSpinner} />}
      <Text style={[styles.label, isLoading && styles.labelIsHidden, { textAlign: textAlign }]}>{label}</Text>
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
      color: theme.textButton,
    },
    labelIsHidden: {
      opacity: 0,
    },
    loadingSpinner: {
      position: 'absolute',
      top: 5,
      left: '50%',
      marginLeft: 8,
    },
  });
}
