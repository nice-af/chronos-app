import React, { useContext, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Sidebar } from '../components/Sidebar';
import { GlobalContext } from '../contexts/global.context';
import { Entries } from './Entries';
import { Settings } from './Settings';

export const Main: React.FC = () => {
  const { previousScreen, currentScreen, visibleScreens } = useContext(GlobalContext);
  const screenPos = useRef(new Animated.Value(0)).current;
  const { width: windowWidth } = useWindowDimensions();

  useEffect(() => {
    // The current screen is the next screen in this case at the end of this useEffect it actually is the current screen
    // This is only for better readability
    const nextScreen = currentScreen;

    if (previousScreen !== 'login' && nextScreen !== 'login') {
      Animated.timing(screenPos, {
        toValue: currentScreen === 'entries' ? 0 : 1,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.quad),
      }).start();
    }
  }, [currentScreen]);

  return (
    <View style={styles.container}>
      <Sidebar />
      <View style={styles.mainViewContainer}>
        <View style={styles.entriesContainer}>
          <Entries />
        </View>
        {visibleScreens.includes('settings') && (
          <Animated.View
            style={[
              styles.overlayContainer,
              {
                transform: [
                  {
                    translateX: screenPos.interpolate({
                      inputRange: [0, 1],
                      outputRange: [windowWidth - 52, 0],
                    }),
                  },
                ],
                zIndex: currentScreen === 'entries' ? 1 : 0,
              },
            ]}>
            <Settings />
          </Animated.View>
        )}
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
