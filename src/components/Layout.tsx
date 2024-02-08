import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { Header, HeaderProps } from './Header';

interface LayoutProps {
  header?: HeaderProps;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ header, children }) => {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.globalContainer}>
      <View style={styles.container}>
        {header && <Header {...header} />}
        {children}
      </View>
    </View>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    globalContainer: {
      flexGrow: 1,
      backgroundColor: theme.background,
    },
    container: {
      display: 'flex',
      justifyContent: 'flex-start',
      flexDirection: 'column',
      alignItems: 'stretch',
      height: '100%',
    },
  });
}
