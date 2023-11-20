import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { typo } from '../styles/typo';
import BackgroundView from './BackgroundView.macos';
import { ButtonTransparent } from './ButtonTransparent';
import { colors } from '../styles/colors';
import { useAppState } from '@react-native-community/hooks';

export interface HeaderProps {
  title: string;
  layout: 'center' | 'left';
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, layout, onBackPress, rightElement }) => {
  const currentAppState = useAppState();

  return (
    <View style={styles.container}>
      <BackgroundView blendingMode={1} material={3} style={styles.backgroundView} />
      <View style={[styles.content, layout === 'center' && styles.isCentered]}>
        {onBackPress && (
          <ButtonTransparent
            onPress={onBackPress}
            hasLargePadding
            style={currentAppState === 'inactive' ? { opacity: 0.4 } : undefined}>
            <Image style={styles.arrow} source={require('../assets/icon-chevron-left.png')} />
          </ButtonTransparent>
        )}
        {title && <Text style={[styles.title, currentAppState === 'inactive' && { opacity: 0.4 }]}>{title}</Text>}
        {rightElement && (
          <View style={[styles.actions, currentAppState === 'inactive' ? { opacity: 0.4 } : undefined]}>
            {rightElement}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 99,
    width: '100%',
    height: 53,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  content: {
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
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 'auto',
  },
});
