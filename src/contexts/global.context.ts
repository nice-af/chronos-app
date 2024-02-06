import { Version3Models } from 'jira.js';
import React from 'react';
import { DayId, Layout, WorklogDaysObject } from '../types/global.types';

// TODO @florianmrz: Sollten wir das hier refactoren?
interface GlobalContextProps {
  /**
   * Information about the current user:
   * - `null`: the user is not logged in
   * - `undefined`: the app is still loading the user info
   * - `Version3Models.User`: the user is logged in
   */
  userInfo: Version3Models.User | null | undefined;
  setUserInfo: (apiSettings: Version3Models.User | null) => void;
  logout: () => void;
  worklogs: WorklogDaysObject | null;
  setWorklogs: (worklogs: WorklogDaysObject) => void;
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
  userInfo: null,
  setUserInfo: () => {},
  logout: () => {},
  worklogs: null,
  setWorklogs: () => {},
  layout: 'normal',
  setLayout: () => {},
  workingDays: [0, 1, 2, 3, 4],
  setWorkingDays: () => {},
  hideNonWorkingDays: false,
  setHideNonWorkingDays: () => {},
  disableEditingOfPastWorklogs: true,
  setDisableEditingOfPastWorklogs: () => {},
});
