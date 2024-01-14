import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Sidebar } from '../components/Sidebar';
import { Entries } from './Entries';
import { Settings } from './Settings';
import { NavigationContext } from '../contexts/navigation.context';
import AnimateScreenContainer from '../components/AnimateScreenContainer';

export const Main: React.FC = () => {
  const { showSettingsScreen } = useContext(NavigationContext);

  return (
    <View style={styles.container}>
      <Sidebar />
      <View style={styles.mainViewContainer}>
        <AnimateScreenContainer isVisible={showSettingsScreen} offScreenLocation='right' zIndex={3}>
          <Settings />
        </AnimateScreenContainer>
        <View style={styles.entriesContainer}>
          <Entries />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    width: '100%',
    height: '100%',
  },
  mainViewContainer: {
    position: 'relative',
    flexGrow: 1,
  },
  entriesContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 2,
    width: '100%',
    height: '100%',
  },
});
