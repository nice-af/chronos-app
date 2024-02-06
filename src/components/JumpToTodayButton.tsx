import React, { useContext } from 'react';
import { Image, StyleSheet, Text } from 'react-native';
import { NavigationContext } from '../contexts/navigation.context';
import { ButtonTransparent } from './ButtonTransparent';
import { Theme } from '../styles/theme/theme-types';
import { useThemedStyles } from '../services/theme.service';
import { ThemeContext } from '../contexts/theme.context';

export const JumpToTodayButton: React.FC = () => {
  const { setSelectedDate } = useContext(NavigationContext);
  const styles = useThemedStyles(createStyles);
  const { theme } = useContext(ThemeContext);
  const now = new Date();

  return (
    <ButtonTransparent onPress={() => setSelectedDate(now)}>
      <Text style={styles.day}>{now.getDate()}</Text>
      <Image
        style={styles.icon}
        source={
          theme.type === 'light'
            ? require('../assets/icons/calendar-blank-light.png')
            : require('../assets/icons/calendar-blank-dark.png')
        }
      />
    </ButtonTransparent>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    icon: {
      width: 24,
      height: 24,
    },
    day: {
      position: 'absolute',
      top: 11,
      left: 0,
      width: 28,
      textAlign: 'center',
      fontSize: 9,
      fontWeight: 'bold',
      lineHeight: 9,
      color: theme.textPrimary,
      opacity: theme.type === 'light' ? 0.6 : 1,
    },
  });
}
