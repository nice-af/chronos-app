import { Provider } from 'jotai';
import React, { FC, Suspense } from 'react';
import { Platform, Text } from 'react-native';
import { store } from './src/atoms';
import { DebugTools } from './src/components/DebugTools';
import { TrafficLights } from './src/components/TrafficLights';
import { ModalAccountSelection } from './src/components/modals/ModalAccountSelection';
import { ModalConfirmation } from './src/components/modals/ModalConfirmation';
import { GlobalProvider } from './src/providers/GlobalProvider';
import { Main } from './src/screens/Main';
import { ColorSchemeWatcher } from './src/watchers/ColorSchemeWatcher';
import { NotificationWatcher } from './src/watchers/NotificationWatcher';
import { WorklogBackupsWatcher } from './src/watchers/WorklogBackupsWatcher';
import { WorklogDeepLinkWatcher } from './src/watchers/WorklogDeepLinkWatcher';
import { WorklogStateWatcher } from './src/watchers/WorklogStateWatcher';

const App: FC = () => {
  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      <Provider store={store}>
        {Platform.OS === 'macos' && <TrafficLights />}
        <ModalConfirmation />
        <ModalAccountSelection />
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
