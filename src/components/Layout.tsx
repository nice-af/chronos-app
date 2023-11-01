import React from 'react';
import { StyleSheet, View } from 'react-native';
import BackgroundView from './BackgroundView.macos';
import { Header, HeaderProps } from './Header';
import { colors } from '../styles/colors';

interface LayoutProps {
  header: HeaderProps;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ header, children }) => {
  return (
    <View style={styles.globalContainer}>
      {/* <BackgroundView blendingMode={0} style={styles.backgroundView} /> */}
      <View style={styles.container}>
        <Header {...header} />
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  globalContainer: {
    marginTop: -52,
    backgroundColor: colors.background,
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100%',
  },
  // backgroundView: {
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   width: '100%',
  //   height: '100%',
  // },
});
