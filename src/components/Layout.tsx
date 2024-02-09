import React, { FC, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { Header, HeaderProps } from './Header';

interface LayoutProps {
  header?: HeaderProps | false;
  children: ReactNode;
  customBackgroundColor?: any;
}

export const Layout: FC<LayoutProps> = ({ header, children, customBackgroundColor }) => {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.globalContainer, customBackgroundColor && { backgroundColor: customBackgroundColor }]}>
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
      zIndex: 1,
    },
  });
}
