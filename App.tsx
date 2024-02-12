import React, { FC, Suspense } from 'react';
import { DebugTools } from './src/components/DebugTools';
import { GlobalProvider } from './src/providers/GlobalProvider';
import { Main } from './src/screens/Main';
import { Text } from 'react-native';

const App: FC = () => {
  return (
    // TODO @AdrianFahrbach make pretty
    <Suspense fallback={<Text>Loading...</Text>}>
      <GlobalProvider>
        <Main />
        {__DEV__ && <DebugTools />}
      </GlobalProvider>
    </Suspense>
  );
};

export default App;
