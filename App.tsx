import AsyncStorage from '@react-native-async-storage/async-storage';
import { Version3Models } from 'jira.js';
import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { DebugTools } from './src/components/DebugTools';
import { GlobalContext } from './src/contexts/global.context';
import { NavigationContext } from './src/contexts/navigation.context';
import { Login } from './src/screens/Login';
import { Main } from './src/screens/Main';
import { getJiraClient, getWorklogsCompact, initiateJiraClient } from './src/services/jira.service';
import { StorageKey, getFromStorage } from './src/services/storage.service';
import { convertWorklogsToDaysObject } from './src/services/worklogs.service';
import { DayId, Layout, WorklogCompact, WorklogDaysObject } from './src/types/global.types';

function App(): JSX.Element {
  const [layout, setLayout] = useState<Layout>('normal');
  const [workingDays, setWorkingDays] = useState<DayId[]>([0, 1, 2, 3, 4]);
  const [hideNonWorkingDays, setHideNonWorkingDays] = useState<boolean>(false);
  const [disableEditingOfPastWorklogs, setDisableEditingOfPastWorklogs] = useState<boolean>(true);
  const [worklogs, setWorklogs] = useState<WorklogDaysObject | null>(null);
  const [userInfo, setUserInfo] = useState<Version3Models.User | null | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(new Date().setUTCHours(0, 0, 0, 0)));

  const [showSettingsScreen, setShowSettingsScreen] = useState(false);
  const [showSearchScreen, setShowSearchScreen] = useState(false);
  const [currentWorklogToEdit, setCurrentWorklogToEdit] = useState<WorklogCompact | null>(null);

  function logout() {
    setShowSettingsScreen(false);
    setShowSearchScreen(false);
    setCurrentWorklogToEdit(null);
    AsyncStorage.removeItem(StorageKey.AUTH);
    setUserInfo(null);
  }

  useEffect(() => {
    (async () => {
      // Attempt to authenticate using existing auth token
      const storedAuth = await getFromStorage(StorageKey.AUTH);

      if (!storedAuth) {
        setUserInfo(null);
        return;
      }

      const { accessToken, refreshToken, cloudId } = storedAuth;
      initiateJiraClient({ accessToken, refreshToken, cloudId });
      try {
        const userInfoRes = await getJiraClient().myself.getCurrentUser();
        setUserInfo(userInfoRes);
      } catch (error) {
        console.error('Failed to authenticate with stored auth token', error);
        setUserInfo(null);
      }
    })();
  }, []);

  useEffect(() => {
    if (userInfo?.accountId) {
      getWorklogsCompact(userInfo?.accountId).then(worklogsCompact => {
        setWorklogs(convertWorklogsToDaysObject(worklogsCompact));
      });
    }
  }, [userInfo?.accountId]);

  return (
    <GlobalContext.Provider
      value={{
        userInfo,
        setUserInfo,
        logout,
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
          showSettingsScreen,
          setShowSettingsScreen,
          showSearchScreen,
          setShowSearchScreen,
          currentWorklogToEdit,
          setCurrentWorklogToEdit,
        }}>
        {/* TODO @AdrianFahrbach make pretty */}
        {userInfo === undefined && <Text>Loading user state...</Text>}
        {userInfo === null && <Login />}
        {!!userInfo && <Main />}
        {__DEV__ && <DebugTools />}
      </NavigationContext.Provider>
    </GlobalContext.Provider>
  );
}

export default App;
