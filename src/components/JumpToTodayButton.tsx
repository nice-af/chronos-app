import React, { FC, useContext } from 'react';
import { Image, StyleSheet, Text } from 'react-native';
import { NavigationContext } from '../contexts/navigation.context';
import { ThemeContext } from '../contexts/theme.context';
import { formatDateToYYYYMMDD } from '../services/date.service';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { ButtonTransparent } from './ButtonTransparent';

export const JumpToTodayButton: FC = () => {
  const { setSelectedDate } = useContext(NavigationContext);
  const styles = useThemedStyles(createStyles);
  const { theme } = useContext(ThemeContext);
  const today = new Date();

  return (
    <ButtonTransparent onPress={() => setSelectedDate(formatDateToYYYYMMDD(today))}>
      <Text style={styles.day}>{today.getDate()}</Text>
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
