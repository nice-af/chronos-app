import { useAtomValue } from 'jotai';
import React, { FC } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { currentOverlayAtom } from '../atoms';
import { AnimateScreenContainer } from '../components/AnimateScreenContainer';
import { Sidebar } from '../components/Sidebar';
import { Overlay } from '../const';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { EditWorklog } from './EditWorklog';
import { Entries } from './Entries';
import { Search } from './Search';
import { Settings } from './Settings';

export const Main: FC = () => {
  const currentOverlay = useAtomValue(currentOverlayAtom);
  const styles = useThemedStyles(createStyles);

  return (
    <AnimateScreenContainer isVisible offScreenLocation='right'>
      <View style={styles.container}>
        <Sidebar />
        <View style={styles.mainViewContainer}>
          <View style={styles.entriesContainer}>
            <Entries />
          </View>
          <AnimateScreenContainer
            isVisible={!!currentOverlay && currentOverlay.includes(Overlay.SEARCH)}
            offScreenLocation='right'
            zIndex={2}>
            <Search />
          </AnimateScreenContainer>
          <AnimateScreenContainer
            isVisible={!!currentOverlay && currentOverlay.includes(Overlay.EDIT_WORKLOG)}
            offScreenLocation='right'
            zIndex={3}>
            <EditWorklog />
          </AnimateScreenContainer>
          <AnimateScreenContainer
            isVisible={!!currentOverlay && currentOverlay.includes(Overlay.SETTINGS)}
            offScreenLocation='right'
            zIndex={4}>
            <Settings />
          </AnimateScreenContainer>
        </View>
      </View>
    </AnimateScreenContainer>
  );
};

function createStyles(theme: Theme) {
  // This needs to be assigned to `styles` for react-native/no-unused-styles to work
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
      ...Platform.select({
        windows: {
          borderTopLeftRadius: 10,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: theme.border,
        },
      }),
    },
    entriesContainer: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: '100%',
      height: '100%',
    },
  });
  return styles;
}
