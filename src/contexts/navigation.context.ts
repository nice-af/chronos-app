import { createContext } from 'react';
import { formatDateToYYYYMMDD } from '../services/date.service';
import { Worklog } from '../types/global.types';

interface NavigationContextProps {
  showSettingsScreen: boolean;
  setShowSettingsScreen: (state: boolean) => void;
  showSearchScreen: boolean;
  setShowSearchScreen: (state: boolean) => void;
  currentWorklogToEdit: Worklog | null;
  setCurrentWorklogToEdit: (worklog: Worklog | null) => void;
  // Format is 'YYYY-MM-DD'
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export const NavigationContext = createContext<NavigationContextProps>({
  showSettingsScreen: false,
  setShowSettingsScreen: () => {},
  showSearchScreen: true,
  setShowSearchScreen: () => {},
  currentWorklogToEdit: null,
  setCurrentWorklogToEdit: () => {},
  selectedDate: formatDateToYYYYMMDD(new Date()),
  setSelectedDate: () => {},
});
