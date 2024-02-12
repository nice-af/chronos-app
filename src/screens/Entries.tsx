import React, { FC, useContext } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ButtonPrimary } from '../components/ButtonPrimary';
import { ButtonTransparent } from '../components/ButtonTransparent';
import { JumpToTodayButton } from '../components/JumpToTodayButton';
import { Layout } from '../components/Layout';
import { TrackingListEntry } from '../components/TrackingListEntry';
import { GlobalContext } from '../contexts/global.context';
import { NavigationContext } from '../contexts/navigation.context';
import { ThemeContext } from '../contexts/theme.context';
import { WorklogContext } from '../contexts/worklog.context';
import { formatDateToYYYYMMDD } from '../services/date.service';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import { format } from 'date-fns';

export const Entries: FC = () => {
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
        title: `${isToday ? 'Today, ' : ''}${format(new Date(selectedDate), 'MMMM do')}`,
        rightElement,
        onBackPress: __DEV__ ? () => logout() : undefined,
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
      {/* TODO @florianmrz: Only show this when there are entries to sync  */}
      <View style={styles.submitButtonContainer}>
        <ButtonPrimary label='Sync this day' textAlign='center' onPress={() => syncWorklogsForCurrentDay()} />
      </View>
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
