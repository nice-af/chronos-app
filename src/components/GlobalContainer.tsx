import React from 'react';
import { StyleSheet, View } from 'react-native';
import BackgroundView from '../components/BackgroundView.macos';
import { dayPickerHeight } from '../components/DayPicker';
import { footerHeight } from '../components/Footer';
import { Header, HeaderProps } from '../components/Header';
import { titleBarHeight } from '../components/TitleBar';

interface GlobalContainerProps {
  header: HeaderProps;
  children: React.ReactNode;
}

export const GlobalContainer: React.FC<GlobalContainerProps> = ({ header, children }) => {
  return (
    <View style={styles.globalContainer}>
      <BackgroundView blendingMode={0} style={styles.backgroundView} />
      <View style={styles.container}>
        <Header {...header} />
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  globalContainer: {
    marginTop: -28,
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100%',
  },
  backgroundView: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});
