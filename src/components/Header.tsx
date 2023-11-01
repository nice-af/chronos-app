import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BackgroundView from './BackgroundView.macos';
import { DayPicker } from './DayPicker';
import { typo } from '../styles/typo';

export interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <View style={styles.container}>
      <BackgroundView blendingMode={1} material={3} style={styles.backgroundView} />
      {title && <Text style={styles.title}>{title}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 99,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 53,
    paddingTop: 0,
    backgroundColor: 'transparent',
    borderBottomColor: 'rgba(0,0,0,0.5)',
    borderBottomWidth: 1,
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
