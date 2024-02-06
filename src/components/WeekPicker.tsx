import { getISOWeek } from 'date-fns';
import React, { useContext } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { NavigationContext } from '../contexts/navigation.context';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { ButtonTransparent } from './ButtonTransparent';

export const WeekPicker: React.FC = () => {
  const { selectedDate, setSelectedDate } = useContext(NavigationContext);
  const styles = useThemedStyles(createStyles);

  return (
    <>
      <View style={styles.container}>
        <ButtonTransparent
          onPress={() => {
            const newDate = new Date(selectedDate);
            newDate.setDate(newDate.getDate() - 7);
            setSelectedDate(newDate);
          }}
          hasLargePadding>
          <Image style={styles.arrow} source={require('../assets/icon-chevron-left.png')} />
        </ButtonTransparent>
        <View>
          <Text style={styles.label}>KW</Text>
          {/* TODO: This is not locale aware, but it's fine for now. */}
          <Text style={styles.value}>{getISOWeek(selectedDate)}</Text>
        </View>
        <ButtonTransparent
          onPress={() => {
            const newDate = new Date(selectedDate);
            newDate.setDate(newDate.getDate() + 7);
            setSelectedDate(newDate);
          }}
          hasLargePadding>
          <Image style={styles.arrow} source={require('../assets/icon-chevron-right.png')} />
        </ButtonTransparent>
      </View>
    </>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      marginBottom: 8,
    },
    arrow: {
      width: 7,
      height: 12,
    },
    label: {
      ...typo.subheadline,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    value: {
      ...typo.headline,
      color: theme.textPrimary,
      textAlign: 'center',
    },
  });
}
