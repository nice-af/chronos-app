import { useAtom, useAtomValue } from 'jotai';
import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { currentOverlayAtom, isFullscreenAtom, loginsAtom } from '../atoms';
import { DebugTools } from '../components/DebugTools';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Overlay } from '../const';
import { Login } from '../screens/Login';
import { initialize } from '../services/global.service';
import { addNativeEventListener, removeNativeEventListener } from '../services/native-event-emitter.service';
import { NativeEvent } from '../services/native-event-emitter.service.types';

export const GlobalProvider: FC<PropsWithChildren> = ({ children }) => {
  const jiraLogins = useAtomValue(loginsAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [_isFullscreen, setIsFullscreen] = useAtom(isFullscreenAtom);
  const [_currentOverlay, setCurrentOverlay] = useAtom(currentOverlayAtom);

  useEffect(() => {
    setIsLoading(true);
    void initialize().finally(() => {
      setIsLoading(false);
    });

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
