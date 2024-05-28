import { Provider } from 'jotai';
import React, { FC, Suspense } from 'react';
import { Platform, Text } from 'react-native';
import { store } from './src/atoms';
import { ColorSchemeWatcher } from './src/watchers/ColorSchemeWatcher';
import { DebugTools } from './src/components/DebugTools';
import { Modal } from './src/components/Modal';
import { NotificationWatcher } from './src/watchers/NotificationWatcher';
import { TrafficLights } from './src/components/TrafficLights';
import { WorklogStateWatcher } from './src/watchers/WorklogStateWatcher';
import { GlobalProvider } from './src/providers/GlobalProvider';
import { Main } from './src/screens/Main';
import { WorklogDeepLinkWatcher } from './src/watchers/WorklogDeepLinkWatcher';
import { WorklogBackupsWatcher } from './src/watchers/WorklogBackupsWatcher';

const App: FC = () => {
  return (
    // TODO @AdrianFahrbach make pretty
    <Suspense fallback={<Text>Loading...</Text>}>
      <Provider store={store}>
        {Platform.OS === 'macos' && <TrafficLights />}
        <Modal />
        <WorklogStateWatcher />
        <WorklogDeepLinkWatcher />
        <WorklogBackupsWatcher />
        <NotificationWatcher />
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
