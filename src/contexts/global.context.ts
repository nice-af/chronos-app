import { Version3Models } from 'jira.js';
import React from 'react';
import { JiraResource } from '../types/auth.types';
import { DayId, Layout, Screen, WorklogDaysObject } from '../types/global.types';

export interface ApiSettings {
  token: string;
  resource: JiraResource;
}

// TODO @florianmrz: Sollten wir das hier refactoren?
interface GlobalContextProps {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  apiSettings: ApiSettings | null;
  setApiSettings: (apiSettings: ApiSettings) => void;
  userInfo: Version3Models.User | null;
  setUserInfo: (apiSettings: Version3Models.User) => void;
  worklogs: WorklogDaysObject | null;
  setWorklogs: (worklogs: WorklogDaysObject) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  layout: Layout;
  setLayout: (layout: Layout) => void;
  workingDays: DayId[];
  setWorkingDays: (days: DayId[]) => void;
  hideNonWorkingDays: boolean;
  setHideNonWorkingDays: (newValue: boolean) => void;
  disableEditingOfPastWorklogs: boolean;
  setDisableEditingOfPastWorklogs: (newValue: boolean) => void;
}

export const GlobalContext = React.createContext<GlobalContextProps>({
  currentScreen: 'login',
  setCurrentScreen: () => {},
  apiSettings: null,
  setApiSettings: () => {},
  userInfo: null,
  setUserInfo: () => {},
  worklogs: null,
  setWorklogs: () => {},
  selectedDate: new Date(new Date().setUTCHours(0, 0, 0, 0)),
  setSelectedDate: () => {},
  layout: 'normal',
  setLayout: () => {},
  workingDays: [0, 1, 2, 3, 4],
  setWorkingDays: () => {},
  hideNonWorkingDays: false,
  setHideNonWorkingDays: () => {},
  disableEditingOfPastWorklogs: true,
  setDisableEditingOfPastWorklogs: () => {},
});
