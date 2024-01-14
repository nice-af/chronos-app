import React from 'react';
import { JiraResource } from '../types/auth.types';

export interface ApiSettings {
  token: string;
  resource: JiraResource;
}

interface NavigationContextProps {
  showLoginScreen: boolean;
  setShowLoginScreen: (state: boolean) => void;
  showSettingsScreen: boolean;
  setShowSettingsScreen: (state: boolean) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export const NavigationContext = React.createContext<NavigationContextProps>({
  showLoginScreen: true,
  setShowLoginScreen: () => {},
  showSettingsScreen: false,
  setShowSettingsScreen: () => {},
  selectedDate: new Date(new Date().setUTCHours(0, 0, 0, 0)),
  setSelectedDate: () => {},
});
