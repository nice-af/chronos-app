import { useAtom, useAtomValue } from 'jotai';
import { FC, useEffect } from 'react';
import { Platform } from 'react-native';
import { lastActiveWorklogIdAtom, selectedDateAtom, setWorklogAsActive, worklogsLocalAtom } from '../atoms';
import { addNativeEventListener, removeNativeEventListener } from '../services/native-event-emitter.service';
import { NativeEvent, StatusBarState } from '../services/native-event-emitter.service.types';

export const WorklogStateWatcher: FC = () => {
  const lastActiveWorklogId = useAtomValue(lastActiveWorklogIdAtom);
  const [worklogsLocal, setWorklogsLocal] = useAtom(worklogsLocalAtom);
  const selectedDate = useAtomValue(selectedDateAtom);

  function handlePlayPauseClick(currentState: StatusBarState) {
    if (currentState === StatusBarState.PAUSED) {
      setWorklogAsActive(lastActiveWorklogId);
    } else {
      setWorklogAsActive(null);
    }
  }

  function resetWorklogsForSelectedDate() {
    setWorklogsLocal(worklogsLocal.filter(worklog => worklog.started !== selectedDate));
  }

  useEffect(() => {
    if (Platform.OS === 'macos') {
      addNativeEventListener({ name: NativeEvent.PLAY_PAUSE_CLICK, callback: handlePlayPauseClick });
    }
    return () => {
      if (Platform.OS === 'macos') {
        removeNativeEventListener({ name: NativeEvent.PLAY_PAUSE_CLICK });
      }
    };
  }, [lastActiveWorklogId]);
  useEffect(() => {
    if (Platform.OS === 'macos' && worklogsLocal.length > 0) {
      addNativeEventListener({
        name: NativeEvent.RESET_WORKLOGS_FOR_SELECTED_DATE,
        callback: resetWorklogsForSelectedDate,
      });
    }
    return () => {
      if (Platform.OS === 'macos' && worklogsLocal.length > 0) {
        removeNativeEventListener({ name: NativeEvent.RESET_WORKLOGS_FOR_SELECTED_DATE });
      }
    };
  }, [selectedDate, worklogsLocal]);

  return null;
};
