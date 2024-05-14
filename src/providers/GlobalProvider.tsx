import { useAtom, useAtomValue } from 'jotai';
import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { currentOverlayAtom, isFullscreenAtom, jiraAuthAtom } from '../atoms';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Login } from '../screens/Login';
import { initialize } from '../services/global.service';
import { addNativeEventListener, removeNativeEventListener } from '../services/native-event-emitter.service';
import { NativeEvent } from '../services/native-event-emitter.service.types';
import { Overlay } from '../const';

export const GlobalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const jiraAuth = useAtomValue(jiraAuthAtom);
  const [_isFullscreen, setIsFullscreen] = useAtom(isFullscreenAtom);
  const [currentOverlay, setCurrentOverlay] = useAtom(currentOverlayAtom);

  useEffect(() => {
    setIsLoading(true);
    initialize().finally(() => {
      setIsLoading(false);
    });

    if (Platform.OS === 'macos') {
      addNativeEventListener({
        name: NativeEvent.FULLSCREEN_CHANGE,
        callback: eventBody => {
          setIsFullscreen(eventBody === 'true');
        },
      });

      addNativeEventListener({
        name: NativeEvent.CREATE_NEW_WORKLOG,
        callback: () => {
          setCurrentOverlay(Overlay.SEARCH);
        },
      });

      addNativeEventListener({
        name: NativeEvent.CLOSE_OVERLAY,
        callback: () => {
          setCurrentOverlay(null);
        },
      });
    }

    return () => {
      if (Platform.OS === 'macos') {
        removeNativeEventListener({ name: NativeEvent.FULLSCREEN_CHANGE });
      }
    };
  }, []);

  return isLoading ? (
    <View style={styles.container}>
      <LoadingSpinner />
    </View>
  ) : jiraAuth === null ? (
    <Login />
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
