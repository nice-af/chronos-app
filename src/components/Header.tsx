import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { typo } from '../styles/typo';
import BackgroundView from './BackgroundView.macos';
import { ButtonTransparent } from './ButtonTransparent';

export interface HeaderProps {
  title: string;
  layout: 'center' | 'left';
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, layout, onBackPress, rightElement }) => {
  return (
    <View style={styles.container}>
      <BackgroundView blendingMode={1} material={3} style={styles.backgroundView} />
      <View style={[styles.content, layout === 'center' && styles.isCentered]}>
        {onBackPress && (
          <ButtonTransparent onPress={onBackPress} hasLargePadding>
            <Image style={styles.arrow} source={require('../assets/icon-chevron-left.png')} />
          </ButtonTransparent>
        )}
        {title && <Text style={styles.title}>{title}</Text>}
        {rightElement}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 99,
    width: '100%',
    height: 53,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    borderBottomWidth: 1,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    width: '100%',
    height: 53,
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
});
