import { useAppState } from '@react-native-community/hooks';
import { useAtomValue } from 'jotai';
import React, { FC, ReactNode } from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import { themeAtom } from '../atoms';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { ButtonTransparent } from './ButtonTransparent';
import { NativeView } from './NativeView';

export interface HeaderProps {
  title?: ReactNode;
  align: 'center' | 'left';
  onBackPress?: () => void;
  rightElement?: ReactNode;
  position?: 'absolute';
}

export const Header: FC<HeaderProps> = ({ title, align, onBackPress, rightElement, position }) => {
  const currentAppState = useAppState();
  const styles = useThemedStyles(createStyles);
  const theme = useAtomValue(themeAtom);

  return (
    <View style={[styles.container, position === 'absolute' && styles.containerAbsolute]}>
      {Platform.OS === 'macos' && <NativeView type='toolbar' style={styles.backgroundView} isDraggable />}
      <View style={[styles.content, align === 'center' && styles.isCentered]}>
        {onBackPress && (
          <ButtonTransparent
            onPress={onBackPress}
            hasLargePadding
            style={currentAppState === 'inactive' ? { opacity: 0.4 } : undefined}>
            <Image
              style={styles.arrow}
              source={
                theme.type === 'light'
                  ? require('../assets/icons/chevron-left-light.png')
                  : require('../assets/icons/chevron-left-dark.png')
              }
            />
          </ButtonTransparent>
        )}
        {title && typeof title === 'string' ? (
          <Text
            style={[
              styles.title,
              align === 'center' && styles.isCentered,
              currentAppState === 'inactive' && { opacity: 0.4 },
            ]}>
            {title}
          </Text>
        ) : (
          <View
            style={[
              styles.title,
              align === 'center' && styles.isCentered,
              currentAppState === 'inactive' && { opacity: 0.4 },
            ]}>
            {title}
          </View>
        )}
        {rightElement && (
          <View style={[styles.actions, currentAppState === 'inactive' ? { opacity: 0.4 } : undefined]}>
            {rightElement}
          </View>
        )}
      </View>
    </View>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      zIndex: 99,
      width: '100%',
      height: 53,
      ...Platform.select({
        default: {
          borderColor: theme.border,
          borderBottomWidth: 1,
        },
        windows: {},
      }),
    },
    containerAbsolute: {
      position: 'absolute',
      top: 0,
      left: 0,
    },
    content: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      width: '100%',
      height: 52,
      paddingHorizontal: 16,
    },
    isCentered: {
      justifyContent: 'center',
      textAlign: 'center',
    },
    backgroundView: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    arrow: {
      width: 7,
      height: 12,
    },
    title: {
      ...typo.title3Emphasized,
      flexGrow: 1,
    },
    actions: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginLeft: 'auto',
    },
  });
}
