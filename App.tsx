import React from 'react';
import { StyleSheet, View } from 'react-native';
import { dayPickerHeight } from './src/components/DayPicker';
import { footerHeight } from './src/components/Footer';
import { titleBarHeight } from './src/components/TitleBar';
import { DayView } from './src/screens/DayView';
import { Login } from './src/screens/Login';

function App(): JSX.Element {
  return (
    <View>
      <DayView />
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
    height: titleBarHeight + dayPickerHeight,
  },
  spacerBottom: {
    height: footerHeight,
  },
});

export default App;
