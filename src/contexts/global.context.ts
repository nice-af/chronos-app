import React from 'react';
import { Screen } from '../types/global.types';
import { JiraResource } from '../types/auth.types';

export interface ApiSettings {
  token: string;
  resource: JiraResource;
}

interface GlobalContextProps {
  currentScreen: Screen;
  apiSettings: ApiSettings | null;
  setApiSettings: (apiSettings: ApiSettings) => void;
}

export const GlobalContext = React.createContext<GlobalContextProps>({
  currentScreen: 'login',
  apiSettings: null,
  setApiSettings: () => {},
});
