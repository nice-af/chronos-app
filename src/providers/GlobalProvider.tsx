import AsyncStorage from '@react-native-async-storage/async-storage';
import { Version3Models } from 'jira.js';
import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import { Alert, Text } from 'react-native';
import { GlobalContext } from '../contexts/global.context';
import { Login } from '../screens/Login';
import { getJiraClient, initiateJiraClient } from '../services/jira.service';
import { StorageKey, getFromStorage } from '../services/storage.service';
import { DayId, Layout } from '../types/global.types';

export const GlobalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [layout, setLayout] = useState<Layout>('normal');
  const [workingDays, setWorkingDays] = useState<DayId[]>([0, 1, 2, 3, 4]);
  const [hideNonWorkingDays, setHideNonWorkingDays] = useState<boolean>(false);
  const [disableEditingOfPastWorklogs, setDisableEditingOfPastWorklogs] = useState<boolean>(true);
  const [userInfo, setUserInfo] = useState<Version3Models.User | null>(null);

  const logout = () => {
    AsyncStorage.removeItem(StorageKey.AUTH);
    setUserInfo(null);
  };

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
        if ((error as any).status === 403) {
          // Refresh token has expired after 90 days, user needs to re-authenticate
          Alert.alert('Your session has expired!', 'Please log in again.');
        } else {
          console.error('Failed to authenticate with stored auth token', error);
        }
        setUserInfo(null);
      }
    })();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        userInfo,
        setUserInfo,
        logout,
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
