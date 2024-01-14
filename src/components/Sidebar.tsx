import { useAppState } from '@react-native-community/hooks';
import React, { useContext } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { GlobalContext } from '../contexts/global.context';
import { NavigationContext } from '../contexts/navigation.context';
import {
  formatDateToYYYYMMDD,
  formatUnixTimestampToHMM,
  getWeekday,
  setDateToThisWeekday,
} from '../services/date.service';
import { colors } from '../styles/colors';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';
import { weekDays } from '../types/global.types';
import BackgroundView from './BackgroundView.macos';
import { DayButton } from './DayButton';
import { SettingsButton } from './SettingsButton';
import { WeekPicker } from './WeekPicker';

export const dayPickerHeight = 56;

export const Sidebar: React.FC = () => {
  const { worklogs } = useContext(GlobalContext);
  const { selectedDate, setSelectedDate } = useContext(NavigationContext);
  const windowHeight = useWindowDimensions().height;
  const currentAppState = useAppState();

  return (
    <View style={[styles.container, currentAppState === 'inactive' ? { opacity: 0.6 } : undefined]}>
      <BackgroundView blendingMode={0} material={7} style={[styles.backgroundView, { height: windowHeight + 52 }]} />
      <WeekPicker />
      {weekDays.map(day => (
        <DayButton
          key={day.id}
          dayLabel={day.abbreviation}
          duration={formatUnixTimestampToHMM(
            worklogs?.[formatDateToYYYYMMDD(setDateToThisWeekday(selectedDate, day.id))]?.totalTimeSpent ?? 0
          )}
          isSelected={getWeekday(selectedDate) === day.id}
          onPress={() => setSelectedDate(setDateToThisWeekday(selectedDate, day.id))}
        />
      ))}
      <SettingsButton />
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
    borderRightColor: colors.border,
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
