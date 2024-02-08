import React from 'react';
import { DebugTools } from './src/components/DebugTools';
import { GlobalProvider } from './src/providers/GlobalProvider';
import { NavigationProvider } from './src/providers/NavigationProvider';
import { ThemeProvider } from './src/providers/ThemeProvider';
import { Main } from './src/screens/Main';
import { WorklogProvider } from './src/providers/WorklogProvider';

const App: React.FC = () => {
  return (
    <NavigationProvider>
      <GlobalProvider>
        <WorklogProvider>
          <ThemeProvider>
            <Main />
            {__DEV__ && <DebugTools />}
          </ThemeProvider>
        </WorklogProvider>
      </GlobalProvider>
    </NavigationProvider>
  );
};

export default App;
