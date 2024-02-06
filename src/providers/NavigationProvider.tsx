import React, { PropsWithChildren, useState } from 'react';
import { NavigationContext } from '../contexts/navigation.context';
import { WorklogCompact } from '../types/global.types';

export const NavigationProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(new Date().setUTCHours(0, 0, 0, 0)));
  const [showSettingsScreen, setShowSettingsScreen] = useState(false);
  const [showSearchScreen, setShowSearchScreen] = useState(false);
  const [currentWorklogToEdit, setCurrentWorklogToEdit] = useState<WorklogCompact | null>(null);

  return (
    <NavigationContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        showSettingsScreen,
        setShowSettingsScreen,
        showSearchScreen,
        setShowSearchScreen,
        currentWorklogToEdit,
        setCurrentWorklogToEdit,
      }}>
      {children}
    </NavigationContext.Provider>
  );
};
