import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import { Alert, Text, useColorScheme } from 'react-native';
import {
  activeWorklogIdAtom,
  activeWorklogTimeElapsedAtom,
  jiraAuthAtom,
  loadWorklogsAtom,
  themeAtom,
  userInfoAtom,
  worklogsAtom,
} from '../atoms';
import { Login } from '../screens/Login';
import { worklogsFakeData } from '../services/fake-data.service';
import { getJiraClient, initiateJiraClient } from '../services/jira.service';
import { darkTheme } from '../styles/theme/theme-dark';
import { lightTheme } from '../styles/theme/theme-light';

export const GlobalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const colorScheme = useColorScheme();
  const setTheme = useSetAtom(themeAtom);
  const setActiveWorklogTimeElapsed = useSetAtom(activeWorklogTimeElapsedAtom);
  const setWorklogs = useSetAtom(worklogsAtom);
  const loadWorklogs = useSetAtom(loadWorklogsAtom);
  const activeWorklogId = useAtomValue(activeWorklogIdAtom);
  const jiraAuth = useAtomValue(jiraAuthAtom);

  // TODO remove again when basic implemention is stable
  const useFakeData = false;

  useEffect(() => {
    (async () => {
      // Attempt to authenticate using existing auth token
      if (!jiraAuth) {
        return setUserInfo(null);
      }

      initiateJiraClient(jiraAuth);

      setIsLoading(true);

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
      } finally {
        setIsLoading(false);
      }
    })();
  }, [jiraAuth]);

  useEffect(() => {
    if (useFakeData) {
      setWorklogs(worklogsFakeData);
      return;
    }
    if (userInfo?.accountId) {
      loadWorklogs();
    }
  }, [userInfo]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (activeWorklogId) {
      intervalId = setInterval(() => setActiveWorklogTimeElapsed(prev => prev + 1), 1000);
    } else {
      setActiveWorklogTimeElapsed(0);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [activeWorklogId]);

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
