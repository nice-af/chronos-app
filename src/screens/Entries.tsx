import { format } from 'date-fns';
import { useAtomValue, useSetAtom } from 'jotai';
import ms from 'ms';
import React, { FC } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  activeWorklogAtom,
  currentOverlayAtom,
  isFullscreenAtom,
  selectedDateAtom,
  themeAtom,
  worklogsForCurrentDayAtom,
} from '../atoms';
import { ButtonTransparent } from '../components/ButtonTransparent';
import { EntriesFooter } from '../components/EntriesFooter';
import { JumpToTodayButton } from '../components/JumpToTodayButton';
import { Layout } from '../components/Layout';
import { TrackingListEntry } from '../components/TrackingListEntry';
import { Overlay } from '../const';
import { formatDateToYYYYMMDD, parseDateFromYYYYMMDD } from '../services/date.service';
import { useTranslation } from '../services/i18n.service';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { WorklogState } from '../types/global.types';

export const Entries: FC = () => {
  const worklogsForCurrentDay = useAtomValue(worklogsForCurrentDayAtom);
  const activeWorklog = useAtomValue(activeWorklogAtom);
  const selectedDate = useAtomValue(selectedDateAtom);
  const setCurrentOverlay = useSetAtom(currentOverlayAtom);
  const theme = useAtomValue(themeAtom);
  const styles = useThemedStyles(createStyles);
  const todayDateString = formatDateToYYYYMMDD(new Date());
  const activeWorklogIsThisDay = activeWorklog?.started === todayDateString;
  const { t, dateFnsLocale, longDateFormat } = useTranslation();
  const isFullscreen = useAtomValue(isFullscreenAtom);

  const hasChanges =
    activeWorklogIsThisDay || worklogsForCurrentDay.some(worklog => worklog.state !== WorklogState.SYNCED);
  const isToday = selectedDate === todayDateString;
  const isOlderThan4Weeks = parseDateFromYYYYMMDD(selectedDate) < new Date(new Date().getTime() - ms('4w'));

  const rightElement = (
    <>
      <JumpToTodayButton />
      <ButtonTransparent onPress={() => setCurrentOverlay([Overlay.SEARCH])}>
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
              {isToday ? `${t('today')}, ` : ''}
              {format(new Date(selectedDate), longDateFormat, { locale: dateFnsLocale })}
            </Text>
          </View>
        ),
        rightElement,
        onBackPress: undefined,
        position: 'absolute',
      }}>
      {worklogsForCurrentDay.length === 0 ? (
        <View style={styles.errorMessageContainer}>
          <Text style={styles.errorMessage}>{t(isOlderThan4Weeks ? 'worklogOlderThen4Weeks' : 'noWorklogs')}</Text>
        </View>
      ) : (
        <ScrollView style={[styles.entriesContainer, isFullscreen && Platform.OS === 'macos' && { marginTop: 53 }]}>
          {worklogsForCurrentDay.map(worklog => (
            <TrackingListEntry key={worklog.id} worklog={worklog} />
          ))}
          {hasChanges && <View style={{ height: 60 }} />}
        </ScrollView>
      )}
      <EntriesFooter dayHasChanges={hasChanges} />
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
    errorMessageContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      flexGrow: 1,
    },
    errorMessage: {
      ...typo.body,
      textAlign: 'center',
      opacity: 0.4,
      maxWidth: 300,
    },
  });
}
