import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../styles/colors';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';
import { DayPickerArrowButton } from './DayPickerArrowButton';
import { DayLabel, DayPickerButton } from './DayPickerButton';

export const dayPickerHeight = 56;

const days: {
  id: number;
  abbreviation: DayLabel;
  time?: string;
}[] = [
  { id: 0, abbreviation: 'M', time: '8:15' },
  { id: 1, abbreviation: 'T', time: '7:45' },
  { id: 2, abbreviation: 'W', time: '8:00' },
  { id: 3, abbreviation: 'T', time: '7:10' },
  { id: 4, abbreviation: 'F', time: undefined },
  { id: 5, abbreviation: 'S', time: undefined },
  { id: 6, abbreviation: 'S', time: undefined },
];

export const DayPicker: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    setSelectedDay(new Date().getDay());
  }, []);

  return (
    <View style={styles.container}>
      <DayPickerArrowButton
        direction='left'
        onPress={() => setSelectedDay(selectedDay !== null ? Math.max(selectedDay - 1, 0) : 0)}
      />
      {days.map(day => (
        <DayPickerButton
          key={day.id}
          day={day.abbreviation}
          duration={day.time}
          isSelected={selectedDay === day.id}
          onPress={() => setSelectedDay(day.id)}
        />
      ))}
      <DayPickerArrowButton
        direction='right'
        onPress={() => setSelectedDay(selectedDay !== null ? Math.min(selectedDay + 1, 6) : 6)}
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
