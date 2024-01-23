import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import AnimateScreenContainer from '../components/AnimateScreenContainer';
import { Sidebar } from '../components/Sidebar';
import { NavigationContext } from '../contexts/navigation.context';
import { EditWorklog } from './EditWorklog';
import { Entries } from './Entries';
import { Search } from './Search';
import { Settings } from './Settings';

export const Main: React.FC = () => {
  const {
    showSettingsScreen,
    showSearchScreen,
    currentWorklogToEdit: showEditWorklogScreen,
  } = useContext(NavigationContext);

  return (
    <View style={styles.container}>
      <Sidebar />
      <View style={styles.mainViewContainer}>
        <View style={styles.entriesContainer}>
          <Entries />
        </View>
        <AnimateScreenContainer isVisible={showSearchScreen} offScreenLocation='right' zIndex={2}>
          <Search />
        </AnimateScreenContainer>
        <AnimateScreenContainer isVisible={!!showEditWorklogScreen} offScreenLocation='right' zIndex={3}>
          <EditWorklog />
        </AnimateScreenContainer>
        <AnimateScreenContainer isVisible={showSettingsScreen} offScreenLocation='right' zIndex={4}>
          <Settings />
        </AnimateScreenContainer>
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
