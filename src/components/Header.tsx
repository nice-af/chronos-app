import React from 'react';
import { StyleSheet, View } from 'react-native';
import BackgroundView from './BackgroundView.macos';
import { DayPicker, dayPickerHeight } from './DayPicker';
import { TitleBar, titleBarHeight } from './TitleBar';

export interface HeaderProps {
  title: string;
  showDayPicker?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, showDayPicker }) => {
  return (
    <View style={[styles.container, { minHeight: titleBarHeight + (showDayPicker ? dayPickerHeight : 0) }]}>
      <BackgroundView blendingMode={1} material={3} style={styles.backgroundView} />
      <TitleBar title={title} />
      {showDayPicker && <DayPicker />}
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
    paddingTop: 0,
    backgroundColor: 'transparent',
    borderBottomColor: 'rgba(0,0,0,0.25)',
    borderBottomWidth: 1,
  },
  backgroundView: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});
