import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, useWindowDimensions } from 'react-native';
import { GlobalContext } from './src/contexts/global.context';
import { DayView } from './src/screens/DayView';
import { Login } from './src/screens/Login';
import { Screen } from './src/utils/types';

function App(): JSX.Element {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const screenPos = useRef(new Animated.Value(0)).current;
  const { width: windowWidth } = useWindowDimensions();

  useEffect(() => {
    Animated.timing(screenPos, {
      toValue: currentScreen === 'login' ? 0 : 1,
      duration: 250,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.quad),
    }).start();
  }, [currentScreen]);

  return (
    <GlobalContext.Provider value={{ currentScreen }}>
      <Animated.View
        style={[
          styles.screenContainer,
          {
            transform: [
              {
                translateX: screenPos.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -windowWidth],
                }),
              },
            ],
            zIndex: currentScreen === 'login' ? 1 : 0,
          },
        ]}>
        <Login onLoginPress={() => setCurrentScreen('dayView')} />
      </Animated.View>
      <Animated.View
        style={[
          styles.screenContainer,
          {
            transform: [
              {
                translateX: screenPos.interpolate({
                  inputRange: [0, 1],
                  outputRange: [windowWidth, 0],
                }),
              },
            ],
            zIndex: currentScreen === 'dayView' ? 1 : 0,
          },
        ]}>
        <DayView onSubmitPress={() => setCurrentScreen('login')} />
      </Animated.View>
    </GlobalContext.Provider>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});

export default App;
