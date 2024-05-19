import React, { FC, useState } from 'react';
import { Pressable, PressableProps, StyleSheet, Text } from 'react-native';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';
import { CustomButtonProps } from '../types/global.types';
import { LoadingSpinnerSmall } from './LoadingSpinnerSmall';

type ButtonPrimaryProps = Omit<PressableProps, 'style'> &
  CustomButtonProps & {
    isLoading?: boolean;
    isDisabled?: boolean;
  };

export const ButtonPrimary: FC<ButtonPrimaryProps> = ({
  onPress,
  label,
  iconRight,
  isLoading,
  isDisabled,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const styles = useThemedStyles(createStyles);

  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPress={isLoading || isDisabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.pressable,
        isHovered && styles.isHovered,
        pressed && styles.isActive,
        props.style,
      ]}>
      {isLoading && <LoadingSpinnerSmall style={styles.loadingSpinner} forcedTheme='dark' />}
      <Text style={[styles.label, isLoading && styles.labelIsHidden]}>{label}</Text>
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
      textAlign: 'center',
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
