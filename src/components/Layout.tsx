import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../styles/colors';
import { Header, HeaderProps } from './Header';

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
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  container: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'stretch',
    height: '100%',
  },
});
