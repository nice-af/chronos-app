import React, { FC, PropsWithChildren, useState } from 'react';
import { NavigationContext } from '../contexts/navigation.context';
import { formatDateToYYYYMMDD } from '../services/date.service';
import { Worklog } from '../types/global.types';

export const NavigationProvider: FC<PropsWithChildren> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState<string>(formatDateToYYYYMMDD(new Date()));
  const [showSettingsScreen, setShowSettingsScreen] = useState(false);
  const [showSearchScreen, setShowSearchScreen] = useState(false);
  const [currentWorklogToEdit, setCurrentWorklogToEdit] = useState<Worklog | null>(null);

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
