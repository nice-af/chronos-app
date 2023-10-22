import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { dayPickerHeight } from '../components/DayPicker';
import { Footer, footerHeight } from '../components/Footer';
import { Layout } from '../components/Layout';
import { titleBarHeight } from '../components/TitleBar';
import { TrackingListEntry } from '../components/TrackingListEntry';
import { fakeTrackingEntries } from '../utils/fake-data';

interface DayViewProps {
  onSubmitPress: () => void;
}

export const DayView: React.FC<DayViewProps> = ({ onSubmitPress }) => {
  return (
    <Layout header={{ title: 'Today, 21 Oct', showDayPicker: true }}>
      <ScrollView
        style={styles.entriesContainer}
        removeClippedSubviews={false}
        contentInset={{ top: titleBarHeight + dayPickerHeight, bottom: footerHeight }}>
        <View style={styles.spacerTop} />
        {fakeTrackingEntries.map(trackingEntry => (
          <TrackingListEntry key={trackingEntry.id} trackingEntry={trackingEntry} />
        ))}
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
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  spacerTop: {
    height: titleBarHeight + dayPickerHeight,
  },
  spacerBottom: {
    height: footerHeight,
  },
});
