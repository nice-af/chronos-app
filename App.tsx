import { Version3Models } from 'jira.js';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions } from 'react-native';
import { DebugTools } from './src/components/DebugTools';
import { ApiSettings, GlobalContext } from './src/contexts/global.context';
import { DayView } from './src/screens/DayView';
import { Login } from './src/screens/Login';
import { Screen, WorklogDaysObject } from './src/types/global.types';
import { getWorklogsCompact } from './src/services/jira.service';
import { convertWorklogsToDaysObject } from './src/services/worklogs.service';

function App(): JSX.Element {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [apiSettings, setApiSettings] = useState<ApiSettings | null>(null);
  const [worklogs, setWorklogs] = useState<WorklogDaysObject | null>(null);
  const [userInfo, setUserInfo] = useState<Version3Models.User | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(new Date().setUTCHours(0, 0, 0, 0)));
  const screenPos = useRef(new Animated.Value(0)).current;
  const { width: windowWidth } = useWindowDimensions();

  useEffect(() => {
    if (userInfo?.accountId) {
      getWorklogsCompact(userInfo?.accountId).then(worklogsCompact => {
        setWorklogs(convertWorklogsToDaysObject(worklogsCompact));
      });
    }
  }, [userInfo?.accountId]);

  useEffect(() => {
    Animated.timing(screenPos, {
      toValue: currentScreen === 'login' ? 0 : 1,
      duration: 250,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.quad),
    }).start();
  }, [currentScreen]);

  return (
    <GlobalContext.Provider
      value={{
        currentScreen,
        apiSettings,
        setApiSettings,
        userInfo,
        setUserInfo,
        worklogs,
        setWorklogs,
        selectedDate,
        setSelectedDate,
      }}>
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
      <DebugTools />
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
