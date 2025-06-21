import { useAtom, useAtomValue } from 'jotai';
import React, { FC, PropsWithChildren, useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { currentOverlayAtom, isFullscreenAtom, loginsAtom, settingsAtom } from '../atoms';
import { DebugTools } from '../components/DebugTools';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Overlay } from '../const';
import { Login } from '../screens/Login';
import { initialize } from '../services/global.service';
import {
  addNativeEventListener,
  removeNativeEventListener,
  sendNativeEvent,
} from '../services/native-event-emitter.service.macos';
import { NativeEvent } from '../services/native-event-emitter.service.types';
import { send4WeeksWorklogOverview } from '../utils/four-weeks-worklog-overview';

export const GlobalProvider: FC<PropsWithChildren> = ({ children }) => {
  const jiraLogins = useAtomValue(loginsAtom);
  const settings = useAtomValue(settingsAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [_isFullscreen, setIsFullscreen] = useAtom(isFullscreenAtom);
  const [_currentOverlay, setCurrentOverlay] = useAtom(currentOverlayAtom);
  const timeout4WeeksWorklogOverview = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsLoading(true);

    // Communicate the current app icon setting to the native side
    sendNativeEvent({ name: NativeEvent.SET_APP__VISIBILITY, data: settings.appVisibility });

    // Initialize the Jira logins and the worklogs
    void initialize().finally(() => {
      setIsLoading(false);

      if (Platform.OS === 'macos') {
        // Listen for widget tracking data requests from the native side
        addNativeEventListener({
          name: NativeEvent.REQUEST_4_WEEKS_WORKLOG_OVERVIEW,
          callback: send4WeeksWorklogOverview,
        });
        send4WeeksWorklogOverview();
        timeout4WeeksWorklogOverview.current = setTimeout(send4WeeksWorklogOverview, 10000);
      }
    });

    // Add event listeners for native events
    if (Platform.OS === 'macos') {
      addNativeEventListener({
        name: NativeEvent.FULLSCREEN_CHANGE,
        callback: eventBody => setIsFullscreen(eventBody === 'true'),
      });

      addNativeEventListener({
        name: NativeEvent.CREATE_NEW_WORKLOG,
        callback: () => setCurrentOverlay([Overlay.SEARCH]),
      });

      addNativeEventListener({
        name: NativeEvent.CLOSE_OVERLAY,
        callback: () => setCurrentOverlay(null),
      });
    }

    return () => {
      if (Platform.OS === 'macos') {
        removeNativeEventListener({ name: NativeEvent.FULLSCREEN_CHANGE });
        removeNativeEventListener({ name: NativeEvent.CREATE_NEW_WORKLOG });
        removeNativeEventListener({ name: NativeEvent.CLOSE_OVERLAY });
        removeNativeEventListener({ name: NativeEvent.REQUEST_4_WEEKS_WORKLOG_OVERVIEW });
        if (timeout4WeeksWorklogOverview.current) {
          clearTimeout(timeout4WeeksWorklogOverview.current);
          timeout4WeeksWorklogOverview.current = null;
        }
      }
    };
  }, []);

  return isLoading ? (
    <View style={styles.container}>
      <LoadingSpinner />
    </View>
  ) : jiraLogins === null || jiraLogins.length === 0 ? (
    <>
      {__DEV__ && <DebugTools />}
      <Login />
    </>
  ) : (
    children
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});
