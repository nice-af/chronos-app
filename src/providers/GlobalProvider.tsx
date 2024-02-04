import AsyncStorage from '@react-native-async-storage/async-storage';
import { Version3Models } from 'jira.js';
import React, { PropsWithChildren, useContext, useEffect, useState } from 'react';
import { StorageKey } from '../const';
import { ApiSettings, GlobalContext } from '../contexts/global.context';
import { NavigationContext } from '../contexts/navigation.context';
import { getWorklogsCompact, initiateJiraClient } from '../services/jira.service';
import { convertWorklogsToDaysObject } from '../services/worklogs.service';
import { DayId, Layout, WorklogDaysObject } from '../types/global.types';

export const GlobalProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [layout, setLayout] = useState<Layout>('normal');
  const [workingDays, setWorkingDays] = useState<DayId[]>([0, 1, 2, 3, 4]);
  const [hideNonWorkingDays, setHideNonWorkingDays] = useState<boolean>(false);
  const [disableEditingOfPastWorklogs, setDisableEditingOfPastWorklogs] = useState<boolean>(true);
  const [apiSettings, setApiSettings] = useState<ApiSettings | null>(null);
  const [worklogs, setWorklogs] = useState<WorklogDaysObject | null>(null);
  const [userInfo, setUserInfo] = useState<Version3Models.User | null>(null);

  const { setShowLoginScreen } = useContext(NavigationContext);

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
      {children}
    </GlobalContext.Provider>
  );
};
