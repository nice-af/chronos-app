import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import BackgroundView from './src/components/BackgroundView.macos';
import { DayPicker, dayPickerHeight } from './src/components/DayPicker';
import { Footer, footerHeight } from './src/components/Footer';
import { TrackingListEntry } from './src/components/TrackingListEntry';
import { fakeTrackingEntries } from './src/utils/fake-data';
import { Header } from './src/components/Header';

function App(): JSX.Element {
  return (
    <View style={styles.globalContainer}>
      <BackgroundView blendingMode={0} style={styles.backgroundView} />
      <View style={styles.container}>
        <Header />
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
  globalContainer: {
    marginTop: -28,
  },
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
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  spacerTop: {
    height: dayPickerHeight,
  },
  spacerBottom: {
    height: footerHeight,
  },
});

export default App;
