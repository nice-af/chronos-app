import React from 'react';
import { WorklogCompact } from '../types/global.types';

interface NavigationContextProps {
  showSettingsScreen: boolean;
  setShowSettingsScreen: (state: boolean) => void;
  showSearchScreen: boolean;
  setShowSearchScreen: (state: boolean) => void;
  currentWorklogToEdit: WorklogCompact | null;
  setCurrentWorklogToEdit: (worklog: WorklogCompact | null) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export const NavigationContext = React.createContext<NavigationContextProps>({
  showSettingsScreen: false,
  setShowSettingsScreen: () => {},
  showSearchScreen: true,
  setShowSearchScreen: () => {},
  currentWorklogToEdit: null,
  setCurrentWorklogToEdit: () => {},
  selectedDate: new Date(new Date().setUTCHours(0, 0, 0, 0)),
  setSelectedDate: () => {},
});
