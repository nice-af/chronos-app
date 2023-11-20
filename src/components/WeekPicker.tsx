import { getISOWeek } from 'date-fns';
import React, { useContext } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { GlobalContext } from '../contexts/global.context';
import { colors } from '../styles/colors';
import { typo } from '../styles/typo';
import { ButtonTransparent } from './ButtonTransparent';

export const WeekPicker: React.FC = () => {
  const { selectedDate, setSelectedDate } = useContext(GlobalContext);
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

const styles = StyleSheet.create({
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
    color: colors.textSecondary,
    textAlign: 'center',
  },
  value: {
    ...typo.headline,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
