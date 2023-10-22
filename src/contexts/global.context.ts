import React from 'react';
import { Screen } from '../utils/types';

interface GlobalContextProps {
  currentScreen: Screen;
}

export const GlobalContext = React.createContext<GlobalContextProps>({
  currentScreen: 'login',
});
