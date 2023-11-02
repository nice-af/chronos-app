import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { typo } from '../styles/typo';
import BackgroundView from './BackgroundView.macos';

export interface HeaderProps {
  title: string;
  layout: 'center' | 'left';
}

export const Header: React.FC<HeaderProps> = ({ title, layout }) => {
  return (
    <View style={styles.container}>
      <BackgroundView blendingMode={1} material={3} style={styles.backgroundView} />
      <View style={[styles.content, layout === 'center' && styles.isCentered]}>
        {title && <Text style={styles.title}>{title}</Text>}
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
  title: {
    ...typo.title3Emphasized,
  },
});
