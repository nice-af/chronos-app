import React, { useContext } from 'react';
import { Image, ScrollView, StyleSheet, Text } from 'react-native';
import { ButtonTransparent } from '../components/ButtonTransparent';
import { JumpToTodayButton } from '../components/JumpToTodayButton';
import { Layout } from '../components/Layout';
import { TrackingListEntry } from '../components/TrackingListEntry';
import { GlobalContext } from '../contexts/global.context';
import { NavigationContext } from '../contexts/navigation.context';
import { ThemeContext } from '../contexts/theme.context';
import { WorklogContext } from '../contexts/worklog.context';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { formatDateToYYYYMMDD } from '../services/date.service';
import { ButtonSecondary } from '../components/ButtonSecondary';

export const Entries: React.FC = () => {
  const { logout } = useContext(GlobalContext);
  const { worklogsForCurrentDay, syncWorklogsForCurrentDay } = useContext(WorklogContext);
  const { selectedDate, setShowSearchScreen } = useContext(NavigationContext);
  const { theme } = useContext(ThemeContext);
  const styles = useThemedStyles(createStyles);

  const isToday = selectedDate === formatDateToYYYYMMDD(new Date());

  const rightElement = (
    <>
      <JumpToTodayButton />
      <ButtonTransparent onPress={() => setShowSearchScreen(true)}>
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
        onBackPress: __DEV__ ? () => logout() : undefined,
        position: 'absolute',
      }}>
      <ScrollView
        style={styles.entriesContainer}
        removeClippedSubviews={false}
        contentInset={{ top: 52 + 6, bottom: 6 }}>
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
    },
    errorMessage: {
      ...typo.body,
      textAlign: 'center',
      opacity: 0.4,
      marginTop: 100,
    },
  });
}
