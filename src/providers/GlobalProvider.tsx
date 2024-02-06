import AsyncStorage from '@react-native-async-storage/async-storage';
import { Version3Models } from 'jira.js';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Text } from 'react-native';
import { GlobalContext } from '../contexts/global.context';
import { Login } from '../screens/Login';
import { getJiraClient, getWorklogsCompact, initiateJiraClient } from '../services/jira.service';
import { StorageKey, getFromStorage } from '../services/storage.service';
import { convertWorklogsToDaysObject } from '../services/worklogs.service';
import { DayId, Layout, WorklogDaysObject } from '../types/global.types';

export const GlobalProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [layout, setLayout] = useState<Layout>('normal');
  const [workingDays, setWorkingDays] = useState<DayId[]>([0, 1, 2, 3, 4]);
  const [hideNonWorkingDays, setHideNonWorkingDays] = useState<boolean>(false);
  const [disableEditingOfPastWorklogs, setDisableEditingOfPastWorklogs] = useState<boolean>(true);
  const [worklogs, setWorklogs] = useState<WorklogDaysObject | null>(null);
  const [userInfo, setUserInfo] = useState<Version3Models.User | null>(null);

  function logout() {
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
      {/* TODO @AdrianFahrbach make pretty */}
      {userInfo === undefined && <Text>Loading user state...</Text>}
      {userInfo === null && <Login />}
      {!!userInfo && children}
    </GlobalContext.Provider>
  );
};
