import React from 'react';
import { DebugTools } from './src/components/DebugTools';
import { GlobalProvider } from './src/providers/GlobalProvider';
import { NavigationProvider } from './src/providers/NavigationProvider';
import { ThemeProvider } from './src/providers/ThemeProvider';
import { Login } from './src/screens/Login';
import { Main } from './src/screens/Main';

const App: React.FC = () => {
  return (
    <NavigationProvider>
      <GlobalProvider>
        <ThemeProvider>
          <Login />
          <Main />
          {__DEV__ && <DebugTools />}
        </ThemeProvider>
      </GlobalProvider>
    </NavigationProvider>
  );
};

export default App;
