import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import { Alert, Text, useColorScheme } from 'react-native';
import { jiraAuthAtom, themeAtom, userInfoAtom, worklogsAtom } from '../atoms';
import { Login } from '../screens/Login';
import { getWorklogs, jiraClient } from '../services/jira.service';
import { darkTheme } from '../styles/theme/theme-dark';
import { lightTheme } from '../styles/theme/theme-light';

export const GlobalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const colorScheme = useColorScheme();
  const setTheme = useSetAtom(themeAtom);
  const setWorklogs = useSetAtom(worklogsAtom);
  const jiraAuth = useAtomValue(jiraAuthAtom);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (!isFirstLoad) {
      return;
    }
    if (!jiraAuth) {
      setIsLoading(false);
      return;
    }
    (async () => {
      setIsLoading(true);
      try {
        const userInfoRes = await jiraClient.myself.getCurrentUser();
        setUserInfo(userInfoRes);
        const worklogs = await getWorklogs(userInfoRes.accountId);
        setWorklogs(worklogs);
      } catch (error) {
        if ((error as any).status === 403 || (error as Error).message === 'refresh_token is invalid') {
          // Refresh token has expired after 90 days, user needs to re-authenticate
          Alert.alert('Your session has expired!', 'Please log in again.');
        } else {
          console.error('Failed to authenticate with stored auth token', error);
        }
        setUserInfo(null);
      } finally {
        setIsLoading(false);
        setIsFirstLoad(false);
      }
    })();
  }, [jiraAuth]);

  /**
   * Auto-set theme
   */
  useEffect(() => {
    // The theme is always set to light during development, but we use dark so we change the dev default to dark
    setTheme(!__DEV__ && colorScheme === 'light' ? lightTheme : darkTheme);
  }, [colorScheme]);

  // TODO @AdrianFahrbach make pretty
  return isLoading ? <Text>Loading user state...</Text> : userInfo === null ? <Login /> : children;
};
