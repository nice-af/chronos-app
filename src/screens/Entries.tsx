import React, { useContext } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ButtonTransparent } from '../components/ButtonTransparent';
import { JumpToTodayButton } from '../components/JumpToTodayButton';
import { Layout } from '../components/Layout';
import { TrackingListEntry } from '../components/TrackingListEntry';
import { GlobalContext } from '../contexts/global.context';
import { formatDateToYYYYMMDD } from '../services/date.service';
import { typo } from '../styles/typo';
import { NavigationContext } from '../contexts/navigation.context';

export const Entries: React.FC = () => {
  const { worklogs, logout } = useContext(GlobalContext);
  const { selectedDate, setShowSearchScreen } = useContext(NavigationContext);

  const currentWorklogs = (worklogs ?? {})[formatDateToYYYYMMDD(selectedDate)]?.worklogs ?? [];

  const rightElement = (
    <>
      <JumpToTodayButton />
      <ButtonTransparent onPress={() => setShowSearchScreen(true)}>
        <Image style={styles.icon} source={require('../assets/icon-plus.png')} />
      </ButtonTransparent>
    </>
  );

  return (
    <Layout
      header={{
        align: 'left',
        title: 'Today, 21 Oct',
        rightElement,
        onBackPress: __DEV__ ? () => logout() : undefined,
        position: 'absolute',
      }}>
      <ScrollView
        style={styles.entriesContainer}
        removeClippedSubviews={false}
        contentInset={{ top: 52 + 6, bottom: 6 }}>
        {currentWorklogs.map(worklog => (
          <TrackingListEntry key={worklog.id} worklogCompact={worklog} />
        ))}
        {currentWorklogs.length === 0 && <Text style={styles.errorMessage}>No worklogs for this day yet</Text>}
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
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
