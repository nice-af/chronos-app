import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { dayPickerHeight } from '../components/DayPicker';
import { Footer, footerHeight } from '../components/Footer';
import { Layout } from '../components/Layout';
import { titleBarHeight } from '../components/TitleBar';
import { TrackingListEntry } from '../components/TrackingListEntry';
import { GlobalContext } from '../contexts/global.context';
import { formatDateToYYYYMMDD } from '../services/date.service';
import { typo } from '../styles/typo';

interface DayViewProps {
  onSubmitPress: () => void;
}

export const DayView: React.FC<DayViewProps> = ({ onSubmitPress }) => {
  const { worklogs, selectedDate } = useContext(GlobalContext);

  const currentWorklogs = (worklogs ?? {})[formatDateToYYYYMMDD(selectedDate)]?.worklogs ?? [];

  return (
    <Layout header={{ title: 'Today, 21 Oct', showDayPicker: true }}>
      <ScrollView
        style={styles.entriesContainer}
        removeClippedSubviews={false}
        contentInset={{ top: titleBarHeight + dayPickerHeight + 6, bottom: footerHeight + 6 }}>
        <View style={styles.spacerTop} />
        {currentWorklogs.map(worklog => (
          <TrackingListEntry key={worklog.id} worklogCompact={worklog} />
        ))}
        {currentWorklogs.length === 0 && <Text style={styles.errorMessage}>No worklogs for this day yet</Text>}
        <View style={styles.spacerBottom} />
      </ScrollView>
      <Footer onSubmitPress={onSubmitPress} />
    </Layout>
  );
};

const styles = StyleSheet.create({
  entriesContainer: {
    flexGrow: 1,
    overflow: 'visible',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  spacerTop: {
    height: titleBarHeight + dayPickerHeight,
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
