import { sendNativeEvent } from '../services/native-event-emitter.service';
import { NativeEvent, StatusBarState, StatusBarStateChangeData } from '../services/native-event-emitter.service.types';
import { StorageKey, setInStorage } from '../services/storage.service';
import { jiraAuthAtom } from './auth';
import { settingsAtom } from './setting';
import { store } from './store';
import { activeWorklogAtom, activeWorklogTrackingDurationAtom, worklogsLocalAtom } from './worklog';

/**
 * Persist changes to AsyncStorage
 */
store.sub(jiraAuthAtom, () => {
  const jiraAuth = store.get(jiraAuthAtom);
  // TODO @florianmrz is it secure to store the token in AsyncStorage?
  setInStorage(StorageKey.AUTH, jiraAuth);
});
store.sub(settingsAtom, () => {
  const settings = store.get(settingsAtom);
  setInStorage(StorageKey.SETTINGS, settings);
});
store.sub(worklogsLocalAtom, () => {
  const worklogs = store.get(worklogsLocalAtom);
  setInStorage(StorageKey.WORKLOGS_LOCAL, worklogs);
});

/**
 * Communicate with status bar widget
 */
store.sub(activeWorklogTrackingDurationAtom, () => {
  const activeWorklog = store.get(activeWorklogAtom);
  if (activeWorklog) {
    sendNativeEvent({
      name: NativeEvent.STATUS_BAR_TIME_CHANGE,
      data: activeWorklog.timeSpentSeconds.toString(),
    });
  } else {
    sendNativeEvent({ name: NativeEvent.STATUS_BAR_TIME_CHANGE, data: 'null' });
  }
});
store.sub(activeWorklogAtom, () => {
  const activeWorklog = store.get(activeWorklogAtom);
  const time = activeWorklog?.timeSpentSeconds ?? 0;
  if (activeWorklog) {
    sendNativeEvent({ name: NativeEvent.STATUS_BAR_TIME_CHANGE, data: time.toString() });
    sendNativeEvent({
      name: NativeEvent.STATUS_BAR_STATE_CHANGE,
      data: JSON.stringify({
        state: StatusBarState.RUNNING,
        issueKey: activeWorklog.issue.key,
        issueSummary: activeWorklog.issue.summary,
      } as StatusBarStateChangeData),
    });
  } else {
    sendNativeEvent({ name: NativeEvent.STATUS_BAR_TIME_CHANGE, data: 'null' });
    sendNativeEvent({
      name: NativeEvent.STATUS_BAR_STATE_CHANGE,
      data: JSON.stringify({ state: StatusBarState.PAUSED } as StatusBarStateChangeData),
    });
  }
});
