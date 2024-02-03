import { Version3Models } from 'jira.js';
import React, { useEffect, useState } from 'react';
import AnimateScreenContainer from './src/components/AnimateScreenContainer';
import { DebugTools } from './src/components/DebugTools';
import { ApiSettings, GlobalContext } from './src/contexts/global.context';
import { NavigationContext } from './src/contexts/navigation.context';
import { Login } from './src/screens/Login';
import { Main } from './src/screens/Main';
import { getWorklogsCompact, initiateJiraClient } from './src/services/jira.service';
import { convertWorklogsToDaysObject } from './src/services/worklogs.service';
import { DayId, Layout, WorklogCompact, WorklogDaysObject } from './src/types/global.types';
import { StorageKey } from './src/const';
import AsyncStorage from '@react-native-async-storage/async-storage';

function App(): JSX.Element {
  const [layout, setLayout] = useState<Layout>('normal');
  const [workingDays, setWorkingDays] = useState<DayId[]>([0, 1, 2, 3, 4]);
  const [hideNonWorkingDays, setHideNonWorkingDays] = useState<boolean>(false);
  const [disableEditingOfPastWorklogs, setDisableEditingOfPastWorklogs] = useState<boolean>(true);
  const [apiSettings, setApiSettings] = useState<ApiSettings | null>(null);
  const [worklogs, setWorklogs] = useState<WorklogDaysObject | null>(null);
  const [userInfo, setUserInfo] = useState<Version3Models.User | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(new Date().setUTCHours(0, 0, 0, 0)));

  const [showLoginScreen, setShowLoginScreen] = useState(true);
  const [showSettingsScreen, setShowSettingsScreen] = useState(false);
  const [showSearchScreen, setShowSearchScreen] = useState(false);
  const [currentWorklogToEdit, setCurrentWorklogToEdit] = useState<WorklogCompact | null>(null);

  useEffect(() => {
    (async () => {
      const storedApiSettings = await AsyncStorage.getItem(StorageKey.API_SETTINGS);
      if (storedApiSettings) {
        const parsedStoredApiSettings = JSON.parse(storedApiSettings);
        setApiSettings(parsedStoredApiSettings);
        initiateJiraClient(parsedStoredApiSettings.resource.id, parsedStoredApiSettings.token);
      }
      const storedUserInfo = await AsyncStorage.getItem(StorageKey.USER_INFO);
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
    })();
  }, []);

  useEffect(() => {
    if (userInfo?.accountId) {
      setShowLoginScreen(false);
      getWorklogsCompact(userInfo?.accountId).then(worklogsCompact => {
        setWorklogs(convertWorklogsToDaysObject(worklogsCompact));
      });
    } else {
      setShowLoginScreen(true);
    }
  }, [userInfo?.accountId]);

  return (
    <GlobalContext.Provider
      value={{
        apiSettings,
        setApiSettings,
        userInfo,
        setUserInfo,
        worklogs,
        setWorklogs,
        layout,
        setLayout,
        workingDays,
        setWorkingDays,
        hideNonWorkingDays,
        setHideNonWorkingDays,
        disableEditingOfPastWorklogs,
        setDisableEditingOfPastWorklogs,
      }}>
      <NavigationContext.Provider
        value={{
          selectedDate,
          setSelectedDate,
          showLoginScreen,
          setShowLoginScreen,
          showSettingsScreen,
          setShowSettingsScreen,
          showSearchScreen,
          setShowSearchScreen,
          currentWorklogToEdit,
          setCurrentWorklogToEdit,
        }}>
        <AnimateScreenContainer isVisible={showLoginScreen} offScreenLocation='left'>
          <Login />
        </AnimateScreenContainer>
        <AnimateScreenContainer isVisible={!showLoginScreen} offScreenLocation='right'>
          <Main />
        </AnimateScreenContainer>
        {__DEV__ && <DebugTools />}
      </NavigationContext.Provider>
    </GlobalContext.Provider>
  );
}

export default App;
