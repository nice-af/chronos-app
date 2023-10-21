import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import BackgroundView from './src/components/BackgroundView.macos';
import { DayPicker, dayPickerHeight } from './src/components/DayPicker';
import { Footer, footerHeight } from './src/components/Footer';
import { TrackingListEntry } from './src/components/TrackingListEntry';
import { fakeTrackingEntries } from './src/utils/fake-data';

function App(): JSX.Element {
  return (
    <View>
      <BackgroundView blendingMode={0} style={styles.backgroundView} />
      <View style={styles.container}>
        <DayPicker />
        <ScrollView
          style={styles.entriesContainer}
          removeClippedSubviews={false}
          contentInset={{ top: dayPickerHeight, bottom: footerHeight }}>
          <View style={styles.spacerTop} />
          {fakeTrackingEntries.map(trackingEntry => (
            <TrackingListEntry key={trackingEntry.id} trackingEntry={trackingEntry} />
          ))}
          <View style={styles.spacerBottom} />
        </ScrollView>
        <Footer />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100%',
  },
  backgroundView: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  entriesContainer: {
    flexGrow: 1,
    overflow: 'visible',
  },
  spacerTop: {
    height: dayPickerHeight,
  },
  spacerBottom: {
    height: footerHeight,
  },
});

export default App;
