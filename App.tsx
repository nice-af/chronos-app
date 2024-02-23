import { Provider } from 'jotai';
import React, { FC, Suspense } from 'react';
import { Text } from 'react-native';
import { store } from './src/atoms';
import { DebugTools } from './src/components/DebugTools';
import { GlobalProvider } from './src/providers/GlobalProvider';
import { Main } from './src/screens/Main';
import ColorSchemeWatcher from './src/components/ColorSchemeWatcher';

const App: FC = () => {
  return (
    // TODO @AdrianFahrbach make pretty
    <Suspense fallback={<Text>Loading...</Text>}>
      <Provider store={store}>
        <ColorSchemeWatcher />
        <GlobalProvider>
          <Main />
          {__DEV__ && <DebugTools />}
        </GlobalProvider>
      </Provider>
    </Suspense>
  );
};

export default App;
