import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Footer, footerHeight } from '../components/Footer';
import { Layout } from '../components/Layout';
import { TrackingListEntry } from '../components/TrackingListEntry';
import { GlobalContext } from '../contexts/global.context';
import { formatDateToYYYYMMDD } from '../services/date.service';
import { typo } from '../styles/typo';
import { Sidebar } from '../components/Sidebar';

export const Main: React.FC = () => {
  const { worklogs, selectedDate } = useContext(GlobalContext);

  const currentWorklogs = (worklogs ?? {})[formatDateToYYYYMMDD(selectedDate)]?.worklogs ?? [];

  return (
    <View style={styles.container}>
      <Sidebar />
      <Layout header={{ title: 'Today, 21 Oct' }}>
        <ScrollView
          style={styles.entriesContainer}
          removeClippedSubviews={false}
          contentInset={{ top: 52 + 6, bottom: footerHeight + 6 }}>
          <View style={styles.spacerTop} />
          {currentWorklogs.map(worklog => (
            <TrackingListEntry key={worklog.id} worklogCompact={worklog} />
          ))}
          {currentWorklogs.length === 0 && <Text style={styles.errorMessage}>No worklogs for this day yet</Text>}
          <View style={styles.spacerBottom} />
        </ScrollView>
      </Layout>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  entriesContainer: {
    flexGrow: 1,
    overflow: 'visible',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  spacerTop: {
    height: 52,
  },
  spacerBottom: {
    height: footerHeight,
  },
  errorMessage: {
    ...typo.body,
    textAlign: 'center',
    opacity: 0.4,
    marginTop: 100,
  },
});
