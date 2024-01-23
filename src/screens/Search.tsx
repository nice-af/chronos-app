import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Layout } from '../components/Layout';
import { SearchInput } from '../components/SearchInput';
import { TrackingListEntry } from '../components/TrackingListEntry';
import { GlobalContext } from '../contexts/global.context';
import { NavigationContext } from '../contexts/navigation.context';
import { formatDateToYYYYMMDD } from '../services/date.service';
import { typo } from '../styles/typo';

export const Search: React.FC = () => {
  const { worklogs } = useContext(GlobalContext);
  const { selectedDate, setShowSearchScreen } = useContext(NavigationContext);

  const currentWorklogs = (worklogs ?? {})[formatDateToYYYYMMDD(selectedDate)]?.worklogs ?? [];

  return (
    <Layout
      header={{
        align: 'left',
        title: <SearchInput />,
        onBackPress: () => setShowSearchScreen(false),
        position: 'absolute',
      }}>
      <ScrollView
        style={styles.entriesContainer}
        removeClippedSubviews={false}
        contentInset={{ top: 52 + 6, bottom: 6 }}>
        {currentWorklogs.map(worklog => (
          <TrackingListEntry key={worklog.id} worklogCompact={worklog} />
        ))}
        {currentWorklogs.length === 0 && <Text style={styles.errorMessage}>No search results found</Text>}
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
