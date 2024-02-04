import React from 'react';
import { DebugTools } from './src/components/DebugTools';
import { GlobalProvider } from './src/providers/GlobalProvider';
import { NavigationProvider } from './src/providers/NavigationProvider';
import { Login } from './src/screens/Login';
import { Main } from './src/screens/Main';

const App: React.FC = () => {
  return (
    <NavigationProvider>
      <GlobalProvider>
        <Login />
        <Main />
        {__DEV__ && <DebugTools />}
      </GlobalProvider>
    </NavigationProvider>
  );
};

export default App;
