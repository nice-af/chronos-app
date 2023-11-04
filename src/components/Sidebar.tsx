import React, { useContext } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { GlobalContext } from '../contexts/global.context';
import {
  formatDateToYYYYMMDD,
  formatUnixTimestampToHMM,
  getWeekday,
  setDateToThisWeekday,
} from '../services/date.service';
import { colors } from '../styles/colors';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';
import BackgroundView from './BackgroundView.macos';
import { DayButton, DayLabel } from './DayButton';
import { WeekPicker } from './WeekPicker';

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

export const Sidebar: React.FC = () => {
  const { selectedDate, setSelectedDate, worklogs } = useContext(GlobalContext);
  const windowHeight = useWindowDimensions().height;

  return (
    <View style={styles.container}>
      <BackgroundView blendingMode={0} material={7} style={[styles.backgroundView, { height: windowHeight + 52 }]} />
      <WeekPicker />
      {days.map(day => (
        <DayButton
          key={day.id}
          day={day.abbreviation}
          duration={formatUnixTimestampToHMM(
            worklogs?.[formatDateToYYYYMMDD(setDateToThisWeekday(selectedDate, day.id))]?.totalTimeSpent ?? 0
          )}
          isSelected={getWeekday(selectedDate) === day.id}
          onPress={() => setSelectedDate(setDateToThisWeekday(selectedDate, day.id))}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundView: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 92,
    height: '100%',
  },
  container: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    flexGrow: 0,
    flexBasis: 93,
    width: 93,
    ...getPadding(56, 16, 6),
    borderRightColor: 'rgba(0,0,0,0.5)',
    borderRightWidth: 1,
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
