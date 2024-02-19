import { useAppState } from '@react-native-community/hooks';
import { useAtom, useSetAtom } from 'jotai';
import React, { FC } from 'react';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import { currentOverlayAtom, selectedDateAtom } from '../atoms';
import { formatDateToYYYYMMDD, parseDateFromYYYYMMDD, setDateToThisWeekday } from '../services/date.service';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { getPadding } from '../styles/utils';
import { weekDays } from '../types/global.types';
import { DayButton } from './DayButton';
import { NativeView } from './NativeView';
import { SettingsButton } from './SettingsButton';
import { WeekPicker } from './WeekPicker';

export const dayPickerHeight = 56;

export const Sidebar: FC = () => {
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const setCurrentOverlay = useSetAtom(currentOverlayAtom);
  const windowHeight = useWindowDimensions().height;
  const currentAppState = useAppState();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.outerContainer}>
      {Platform.OS === 'macos' && (
        <NativeView type='sidebar' style={[styles.backgroundView, { height: windowHeight + 52 }]} />
      )}
      <View style={[styles.container, currentAppState === 'inactive' ? { opacity: 0.6 } : undefined]}>
        <WeekPicker />
        {weekDays.map(day => {
          const date = setDateToThisWeekday(parseDateFromYYYYMMDD(selectedDate), day.id);
          const dateString = formatDateToYYYYMMDD(date);

          return (
            <DayButton
              key={day.id}
              dayLabel={day.abbreviation}
              dateString={dateString}
              onPress={() => {
                setCurrentOverlay(null);
                setSelectedDate(dateString);
              }}
            />
          );
        })}
        <SettingsButton />
      </View>
    </View>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    outerContainer: {
      position: 'relative',
      width: 93,
      ...Platform.select({
        macos: {
          borderColor: theme.border,
          borderRightWidth: 1,
          backgroundColor: theme.borderSolid,
        },
      }),
    },
    backgroundView: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 93,
      height: '100%',
      ...Platform.select({
        macos: {
          width: 92,
        },
      }),
    },
    container: {
      position: 'relative',
      zIndex: 2,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
      width: 92,
      ...getPadding(11, 16, 6),
      ...Platform.select({
        macos: {
          paddingTop: 56,
        },
      }),
    },
    today: {
      ...typo.bodyEmphasized,
      position: 'absolute',
      top: 6,
      left: 0,
      width: '100%',
      textAlign: 'center',
      color: theme.textPrimary,
    },
  });
}
