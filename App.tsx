import { Provider } from 'jotai';
import React, { FC, Suspense } from 'react';
import { Text } from 'react-native';
import { store } from './src/atoms';
import { ColorSchemeWatcher } from './src/components/ColorSchemeWatcher';
import { DebugTools } from './src/components/DebugTools';
import { WorklogStateWatcher } from './src/components/WorklogStateWatcher';
import { GlobalProvider } from './src/providers/GlobalProvider';
import { Main } from './src/screens/Main';
import { Modal } from './src/components/Modal';

const App: FC = () => {
  return (
    // TODO @AdrianFahrbach make pretty
    <Suspense fallback={<Text>Loading...</Text>}>
      <Provider store={store}>
        <Modal
        // icon='timer-warning'
        // headline='You are trying to start a timer on a passed day'
        // text='Are you sure that you want to continue? Otherwise the timer won’t be started.'
        />
        <WorklogStateWatcher />
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
