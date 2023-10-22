import React from 'react';
import { StyleSheet, View } from 'react-native';
import BackgroundView from './BackgroundView.macos';
import { DayPicker, dayPickerHeight } from './DayPicker';
import { TitleBar, titleBarHeight } from './TitleBar';

export const Header: React.FC = () => {
  return (
    <View style={styles.container}>
      <BackgroundView blendingMode={1} material={3} style={styles.backgroundView} />
      <TitleBar />
      <DayPicker />
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
    minHeight: titleBarHeight + dayPickerHeight,
    paddingTop: 0,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 1 },
  },
  backgroundView: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});
