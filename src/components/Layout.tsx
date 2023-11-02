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
      <View style={styles.container}>
        <Header {...header} />
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  globalContainer: {
    width: '100%',
    marginTop: -52,
    backgroundColor: colors.background,
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100%',
  },
});
