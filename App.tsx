import { Provider } from 'jotai';
import React, { FC, Suspense } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
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
import { useThemedStyles } from './src/services/theme.service';
import { Theme } from './src/styles/theme/theme-types';

const App: FC = () => {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
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
    </View>
  );
};

function createStyles(theme: Theme) {
  // This needs to be assigned to `styles` for react-native/no-unused-styles to work
  const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.background,
    },
  });
  return styles;
}

export default App;
