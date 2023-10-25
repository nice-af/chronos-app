import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../styles/colors';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';
import { DayPickerArrowButton } from './DayPickerArrowButton';
import { DayLabel, DayPickerButton } from './DayPickerButton';
import { GlobalContext } from '../contexts/global.context';
import ms from 'ms';
import {
  formatUnixTimestampToHHMM,
  formatDateToYYYYMMDD,
  getWeekday,
  setDateToThisWeekday,
} from '../services/date.service';

export const dayPickerHeight = 56;

const days: {
  id: number;
  abbreviation: DayLabel;
}[] = [
  { id: 0, abbreviation: 'M' },
  { id: 1, abbreviation: 'T' },
  { id: 2, abbreviation: 'W' },
  { id: 3, abbreviation: 'T' },
  { id: 4, abbreviation: 'F' },
  { id: 5, abbreviation: 'S' },
  { id: 6, abbreviation: 'S' },
];

export const DayPicker: React.FC = () => {
  const { selectedDate, setSelectedDate, worklogs } = useContext(GlobalContext);

  return (
    <View style={styles.container}>
      <DayPickerArrowButton
        direction='left'
        onPress={() => setSelectedDate(new Date(selectedDate.getTime() - ms('1d')))}
      />
      {days.map(day => (
        <DayPickerButton
          key={day.id}
          day={day.abbreviation}
          duration={formatUnixTimestampToHHMM(
            worklogs?.[formatDateToYYYYMMDD(setDateToThisWeekday(selectedDate, day.id))]?.totalTimeSpent ?? 0
          )}
          isSelected={getWeekday(selectedDate) === day.id}
          onPress={() => setSelectedDate(setDateToThisWeekday(selectedDate, day.id))}
        />
      ))}
      <DayPickerArrowButton
        direction='right'
        onPress={() => setSelectedDate(new Date(selectedDate.getTime() + ms('1d')))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...getPadding(6, 16),
  },
  today: {
    ...typo.bodyEmphasized,
    position: 'absolute',
    top: 6,
    left: 0,
    width: '100%',
    textAlign: 'center',
    color: colors.textPrimary,
  },
});
