import { useAppState } from '@react-native-community/hooks';
import React, { useContext } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ThemeContext } from '../contexts/theme.context';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import BackgroundView from './BackgroundView';
import { ButtonTransparent } from './ButtonTransparent';

export interface HeaderProps {
  title?: React.ReactNode;
  align: 'center' | 'left';
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
  position?: 'absolute';
}

export const Header: React.FC<HeaderProps> = ({ title, align, onBackPress, rightElement, position }) => {
  const currentAppState = useAppState();
  const styles = useThemedStyles(createStyles);
  const { theme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, position === 'absolute' && styles.containerAbsolute]}>
      <BackgroundView blendingMode={1} material={3} style={styles.backgroundView} />
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
      borderBottomColor: theme.border,
      borderBottomWidth: 1,
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
