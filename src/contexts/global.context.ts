import { Version3Models } from 'jira.js';
import React from 'react';
import { JiraResource } from '../types/auth.types';
import { Screen } from '../types/global.types';

export interface ApiSettings {
  token: string;
  resource: JiraResource;
}

interface GlobalContextProps {
  currentScreen: Screen;
  apiSettings: ApiSettings | null;
  setApiSettings: (apiSettings: ApiSettings) => void;
  userInfo: Version3Models.User | null;
  setUserInfo: (apiSettings: Version3Models.User) => void;
}

export const GlobalContext = React.createContext<GlobalContextProps>({
  currentScreen: 'login',
  apiSettings: null,
  setApiSettings: () => {},
  userInfo: null,
  setUserInfo: () => {},
});
