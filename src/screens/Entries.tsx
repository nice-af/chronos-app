import { useAtomValue, useSetAtom } from 'jotai';
import React, { FC } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import {
  currentOverlayAtom,
  selectedDateAtom,
  syncWorklogsForCurrentDayAtom,
  themeAtom,
  worklogsForCurrentDayAtom,
} from '../atoms';
import { ButtonSecondary } from '../components/ButtonSecondary';
import { ButtonTransparent } from '../components/ButtonTransparent';
import { JumpToTodayButton } from '../components/JumpToTodayButton';
import { Layout } from '../components/Layout';
import { TrackingListEntry } from '../components/TrackingListEntry';
import { Overlay } from '../const';
import { formatDateToYYYYMMDD } from '../services/date.service';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';

export const Entries: FC = () => {
  const worklogsForCurrentDay = useAtomValue(worklogsForCurrentDayAtom);
  const syncWorklogsForCurrentDay = useSetAtom(syncWorklogsForCurrentDayAtom);
  const [selectedDate] = useAtomValue(selectedDateAtom);
  const setCurrentOverlay = useSetAtom(currentOverlayAtom);
  const theme = useAtomValue(themeAtom);
  const styles = useThemedStyles(createStyles);

  const isToday = selectedDate === formatDateToYYYYMMDD(new Date());

  const rightElement = (
    <>
      <JumpToTodayButton />
      <ButtonTransparent onPress={() => setCurrentOverlay(Overlay.Search)}>
        <Image
          style={styles.icon}
          source={
            theme.type === 'light'
              ? require('../assets/icons/plus-light.png')
              : require('../assets/icons/plus-dark.png')
          }
        />
      </ButtonTransparent>
    </>
  );

  return (
    <Layout
      header={{
        align: 'left',
        // TODO format pretty
        title: `${selectedDate} ${isToday ? '(Today)' : ''}`,
        rightElement,
        onBackPress: undefined,
        position: 'absolute',
      }}>
      <ScrollView
        style={styles.entriesContainer}
        removeClippedSubviews={false}
        contentInset={{ top: Platform.OS === 'windows' ? 0 : 52 + 6, bottom: 6 }}>
        {worklogsForCurrentDay.map(worklog => (
          <TrackingListEntry key={worklog.id} worklog={worklog} />
        ))}
        {worklogsForCurrentDay.length === 0 && <Text style={styles.errorMessage}>No worklogs for this day yet</Text>}

        {/* TODO remove again */}
        <ButtonSecondary label='Sync this day' onPress={() => syncWorklogsForCurrentDay()} />
      </ScrollView>
    </Layout>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    icon: {
      width: 24,
      height: 24,
    },
    entriesContainer: {
      flexGrow: 1,
      overflow: 'visible',
      ...Platform.select({
        default: {},
        windows: {
          marginTop: 52 + 6,
          marginBottom: 6,
        },
      }),
    },
    errorMessage: {
      ...typo.body,
      textAlign: 'center',
      opacity: 0.4,
      marginTop: 100,
    },
  });
}
