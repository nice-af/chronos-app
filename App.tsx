import { Version3Models } from 'jira.js';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions } from 'react-native';
import { DebugTools } from './src/components/DebugTools';
import { ApiSettings, GlobalContext } from './src/contexts/global.context';
import { Login } from './src/screens/Login';
import { Main } from './src/screens/Main';
import { getWorklogsCompact } from './src/services/jira.service';
import { convertWorklogsToDaysObject } from './src/services/worklogs.service';
import { DayId, Layout, Screen, WorklogDaysObject } from './src/types/global.types';

function App(): JSX.Element {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [layout, setLayout] = useState<Layout>('normal');
  const [workingDays, setWorkingDays] = useState<DayId[]>([0, 1, 2, 3, 4]);
  const [hideNonWorkingDays, setHideNonWorkingDays] = useState<boolean>(false);
  const [disableEditingOfPastWorklogs, setDisableEditingOfPastWorklogs] = useState<boolean>(true);
  const [visibleScreens, setVisibleScreens] = useState<Screen[]>(['login']);
  const previousScreen = useRef<Screen>('login');
  const [apiSettings, setApiSettings] = useState<ApiSettings | null>(null);
  const [worklogs, setWorklogs] = useState<WorklogDaysObject | null>(null);
  const [userInfo, setUserInfo] = useState<Version3Models.User | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(new Date().setUTCHours(0, 0, 0, 0)));
  const screenPos = useRef(new Animated.Value(0)).current;
  const { width: windowWidth } = useWindowDimensions();

  useEffect(() => {
    if (userInfo?.accountId) {
      setCurrentScreen('entries');
      getWorklogsCompact(userInfo?.accountId).then(worklogsCompact => {
        setWorklogs(convertWorklogsToDaysObject(worklogsCompact));
      });
    }
  }, [userInfo?.accountId]);

  useEffect(() => {
    // The current screen is the next screen in this case at the end of this useEffect it actually is the current screen
    // This is only for better readability
    const nextScreen = currentScreen;

    if (previousScreen.current === 'login' || nextScreen === 'login') {
      // Run animation only if login screen should move
      Animated.timing(screenPos, {
        toValue: nextScreen === 'login' ? 0 : 1,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.quad),
      }).start();
    }

    setVisibleScreens([previousScreen.current, nextScreen]);
    previousScreen.current = nextScreen;
    setTimeout(() => setVisibleScreens([nextScreen]), 250);
  }, [currentScreen]);

  return (
    <GlobalContext.Provider
      value={{
        previousScreen: previousScreen.current,
        currentScreen,
        setCurrentScreen,
        visibleScreens,
        setVisibleScreens,
        apiSettings,
        setApiSettings,
        userInfo,
        setUserInfo,
        worklogs,
        setWorklogs,
        selectedDate,
        setSelectedDate,
        layout,
        setLayout,
        workingDays,
        setWorkingDays,
        hideNonWorkingDays,
        setHideNonWorkingDays,
        disableEditingOfPastWorklogs,
        setDisableEditingOfPastWorklogs,
      }}>
      {visibleScreens.includes('login') && (
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
          <Login onLoginPress={() => setCurrentScreen('entries')} />
        </Animated.View>
      )}
      {/* We always render this screen since it is the main screen */}
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
            zIndex: currentScreen === 'entries' ? 1 : 0,
          },
        ]}>
        <Main />
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
