import { useAppState } from '@react-native-community/hooks';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import React, { FC } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { currentOverlayAtom, isFullscreenAtom, selectedDateAtom } from '../atoms';
import { formatDateToYYYYMMDD, parseDateFromYYYYMMDD, setDateToThisWeekday } from '../services/date.service';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
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
  const isFullscreen = useAtomValue(isFullscreenAtom);
  const currentAppState = useAppState();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.outerContainer}>
      {Platform.OS === 'macos' && <NativeView type='sidebar' style={styles.backgroundView} />}
      <ScrollView
        contentContainerStyle={[
          styles.container,
          currentAppState === 'inactive' && { opacity: 0.6 },
          !isFullscreen && Platform.OS === 'macos' && { paddingTop: 0, paddingBottom: 16 },
        ]}>
        <WeekPicker />
        {weekDays.map(day => {
          const date = setDateToThisWeekday(parseDateFromYYYYMMDD(selectedDate), day.id);
          const dateString = formatDateToYYYYMMDD(date);

          return (
            <DayButton
              key={day.id}
              dayCode={day.code}
              dateString={dateString}
              onPress={() => {
                setCurrentOverlay(null);
                setSelectedDate(dateString);
              }}
            />
          );
        })}
        <SettingsButton />
      </ScrollView>
    </View>
  );
};

function createStyles(theme: Theme) {
  // This needs to be assigned to `styles` for react-native/no-unused-styles to work
  const styles = StyleSheet.create({
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
    },
  });
  return styles;
}
