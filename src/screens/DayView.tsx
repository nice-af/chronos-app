import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { dayPickerHeight } from '../components/DayPicker';
import { Footer, footerHeight } from '../components/Footer';
import { GlobalContainer } from '../components/GlobalContainer';
import { titleBarHeight } from '../components/TitleBar';
import { TrackingListEntry } from '../components/TrackingListEntry';
import { fakeTrackingEntries } from '../utils/fake-data';

export const DayView: React.FC = () => {
  return (
    <GlobalContainer header={{ title: 'Today, 21 Oct', showDayPicker: true }}>
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
      <Footer />
    </GlobalContainer>
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
