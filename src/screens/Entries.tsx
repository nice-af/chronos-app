import { format } from 'date-fns';
import { useAtomValue, useSetAtom } from 'jotai';
import React, { FC } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  activeWorklogAtom,
  currentOverlayAtom,
  selectedDateAtom,
  syncWorklogsForCurrentDayAtom,
  themeAtom,
  worklogsForCurrentDayAtom,
} from '../atoms';
import { ButtonPrimary } from '../components/ButtonPrimary';
import { ButtonTransparent } from '../components/ButtonTransparent';
import { JumpToTodayButton } from '../components/JumpToTodayButton';
import { Layout } from '../components/Layout';
import { TrackingListEntry } from '../components/TrackingListEntry';
import { Overlay } from '../const';
import { formatDateToYYYYMMDD } from '../services/date.service';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { WorklogState } from '../types/global.types';

export const Entries: FC = () => {
  const worklogsForCurrentDay = useAtomValue(worklogsForCurrentDayAtom);
  const activeWorklog = useAtomValue(activeWorklogAtom);
  const syncWorklogsForCurrentDay = useSetAtom(syncWorklogsForCurrentDayAtom);
  const selectedDate = useAtomValue(selectedDateAtom);
  const setCurrentOverlay = useSetAtom(currentOverlayAtom);
  const theme = useAtomValue(themeAtom);
  const styles = useThemedStyles(createStyles);
  const todayDateString = formatDateToYYYYMMDD(new Date());
  const activeWorklogIsThisDay = activeWorklog?.started === todayDateString;

  const hasChanges =
    activeWorklogIsThisDay || worklogsForCurrentDay.some(worklog => worklog.state !== WorklogState.Synced);

  const isToday = selectedDate === todayDateString;

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
        title: (
          <View style={styles.titleContainer}>
            {hasChanges && <View style={styles.dot} />}
            <Text style={styles.title}>
              {isToday ? 'Today, ' : ''}
              {format(new Date(selectedDate), 'MMMM do')}
            </Text>
          </View>
        ),
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
      </ScrollView>
      {hasChanges && (
        <View style={styles.submitButtonContainer}>
          <ButtonPrimary label='Sync this day' textAlign='center' onPress={() => syncWorklogsForCurrentDay()} />
        </View>
      )}
    </Layout>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    titleContainer: {
      flexGrow: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    title: {
      ...typo.title3Emphasized,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.red,
    },
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
    submitButtonContainer: {
      paddingVertical: 16,
      paddingHorizontal: 12,
      borderColor: theme.border,
      borderTopWidth: 1,
    },
    errorMessage: {
      ...typo.body,
      textAlign: 'center',
      opacity: 0.4,
      marginTop: 100,
    },
  });
}
