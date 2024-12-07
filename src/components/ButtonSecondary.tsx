import React, { FC, forwardRef, useState } from 'react';
import { Pressable, PressableProps, StyleSheet, Text, View } from 'react-native';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';
import { CustomButtonProps } from '../types/global.types';

type ButtonSecondaryProps = Omit<PressableProps, 'style'> &
  CustomButtonProps & {
    isSmall?: boolean;
    ref?: any;
  };

export const ButtonSecondary: FC<ButtonSecondaryProps> = forwardRef<View, ButtonSecondaryProps>(
  ({ onPress, label, iconRight, isSmall, ...props }, ref) => {
    const [isHovered, setIsHovered] = useState(false);
    const styles = useThemedStyles(createStyles);

    return (
      <Pressable
        ref={ref}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        onPress={onPress}
        style={({ pressed }) => [
          styles.pressable,
          isHovered && styles.isHovered,
          pressed && styles.isActive,
          !label && !!iconRight && styles.isIconOnly,
          isSmall && styles.isSmall,
          props.style,
        ]}>
        {label && (
          <Text numberOfLines={1} lineBreakMode='clip' style={styles.label}>
            {label}
          </Text>
        )}
        {iconRight && <View style={styles.icon}>{iconRight}</View>}
      </Pressable>
    );
  }
);

function createStyles(theme: Theme) {
  // This needs to be assigned to `styles` for react-native/no-unused-styles to work
  const styles = StyleSheet.create({
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
    isSmall: {
      paddingTop: 5,
      paddingBottom: 5,
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
      flexShrink: 1,
    },
    icon: {
      pointerEvents: 'none',
    },
  });
  return styles;
}
