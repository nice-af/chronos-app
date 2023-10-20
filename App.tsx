import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import BackgroundView from './src/components/BackgroundView.macos';
import { DayPicker } from './src/components/DayPicker';
import { IssueTag } from './src/components/IssueTag';
import { TrackingListEntry } from './src/components/TrackingListEntry';
import { fakeTrackingEntries } from './src/utils/fake-data';

function App(): JSX.Element {
  return (
    <View>
      <BackgroundView style={styles.backgroundView} />
      <DayPicker />
      {fakeTrackingEntries.map(trackingEntry => (
        <TrackingListEntry key={trackingEntry.id} trackingEntry={trackingEntry} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundView: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});

export default App;
