import { useAtomValue, useSetAtom } from 'jotai';
import { FC, useEffect } from 'react';
import { lastActiveWorklogIdAtom, setWorklogAsActiveAtom } from '../atoms';
import { addNativeEventListener } from '../services/native-event-emitter.service';
import { NativeEvent, StatusBarState } from '../services/native-event-emitter.service.types';

export const WorklogStateWatcher: FC = () => {
  const lastActiveWorklogId = useAtomValue(lastActiveWorklogIdAtom);
  const setWorklogAsActive = useSetAtom(setWorklogAsActiveAtom);

  useEffect(() => {
    addNativeEventListener({
      name: NativeEvent.PLAY_PAUSE_CLICK,
      callback: currentState => {
        if (currentState === StatusBarState.PAUSED.toString()) {
          setWorklogAsActive(lastActiveWorklogId);
        } else {
          setWorklogAsActive(null);
        }
      },
    });
  }, []);

  return null;
};
