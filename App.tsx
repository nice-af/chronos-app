import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import BackgroundView from './src/components/BackgroundView.macos';
import { DayPicker } from './src/components/DayPicker';
import { IssueTag } from './src/components/IssueTag';
import { TrackingListEntry } from './src/components/TrackingListEntry';
import { fakeTrackingEntries } from './src/fake-data';

function App(): JSX.Element {
  const { width, height } = useWindowDimensions();

  return (
    <View>
      <BackgroundView style={{ ...styles.backgroundView, width: width * 2.5, height: height * 2.5 }} />
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
  },
});

export default App;
