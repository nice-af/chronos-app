import React, { useContext } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ButtonTransparent } from '../components/ButtonTransparent';
import { JumpToTodayButton } from '../components/JumpToTodayButton';
import { Layout } from '../components/Layout';
import { TrackingListEntry } from '../components/TrackingListEntry';
import { GlobalContext } from '../contexts/global.context';
import { formatDateToYYYYMMDD } from '../services/date.service';
import { typo } from '../styles/typo';

export const Entries: React.FC = () => {
  const { worklogs, selectedDate, setCurrentScreen } = useContext(GlobalContext);

  const currentWorklogs = (worklogs ?? {})[formatDateToYYYYMMDD(selectedDate)]?.worklogs ?? [];

  const rightElement = (
    <>
      <JumpToTodayButton />
      <ButtonTransparent onPress={() => {}}>
        <Image style={styles.icon} source={require('../assets/icon-plus.png')} />
      </ButtonTransparent>
    </>
  );

  return (
    <Layout
      header={{ layout: 'left', title: 'Today, 21 Oct', rightElement, onBackPress: () => setCurrentScreen('login') }}>
      <ScrollView
        style={styles.entriesContainer}
        removeClippedSubviews={false}
        contentInset={{ top: 52 + 6, bottom: 6 }}>
        <View style={styles.spacerTop} />
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
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  spacerTop: {
    height: 52,
  },
  errorMessage: {
    ...typo.body,
    textAlign: 'center',
    opacity: 0.4,
    marginTop: 100,
  },
});
