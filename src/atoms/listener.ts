import { sendNativeEvent } from '../services/native-event-emitter.service';
import { NativeEvent, StatusBarState } from '../services/native-event-emitter.service.types';
import { StorageKey, setInStorage } from '../services/storage.service';
import { UUID } from '../types/accounts.types';
import { loginsAtom, jiraAccountTokensAtom, primaryUUIDAtom } from './auth';
import { settingsAtom } from './setting';
import { store } from './store';
import { activeWorklogAtom, worklogsLocalAtom, worklogsLocalBackupsAtom } from './worklog';

/**
 * Persist changes to AsyncStorage
 */
store.sub(loginsAtom, () => {
  const logins = store.get(loginsAtom);
  store.set(primaryUUIDAtom, logins.find(a => a.isPrimary)?.uuid ?? ('' as UUID));
  setInStorage(StorageKey.LOGINS, logins);
});
store.sub(jiraAccountTokensAtom, () => {
  const jiraAuths = store.get(jiraAccountTokensAtom);
  // TODO @florianmrz is it secure to store the token in AsyncStorage?
  setInStorage(StorageKey.JIRA_ACCOUNT_TOKENS, jiraAuths);
});
store.sub(settingsAtom, () => {
  const settings = store.get(settingsAtom);
  setInStorage(StorageKey.SETTINGS, settings);
});
store.sub(worklogsLocalAtom, () => {
  const worklogs = store.get(worklogsLocalAtom);
  setInStorage(StorageKey.WORKLOGS_LOCAL, worklogs);
});
store.sub(worklogsLocalBackupsAtom, () => {
  const backupWorklogs = store.get(worklogsLocalBackupsAtom);
  setInStorage(StorageKey.WORKLOGS_LOCAL_BACKUPS, backupWorklogs);
});

/**
 * Communicate with status bar widget
 */
store.sub(activeWorklogAtom, () => {
  const activeWorklog = store.get(activeWorklogAtom);
  const time = activeWorklog?.timeSpentSeconds ?? 0;
  if (activeWorklog) {
    sendNativeEvent({ name: NativeEvent.STATUS_BAR_TIME_CHANGE, data: time.toString() });
    sendNativeEvent({
      name: NativeEvent.STATUS_BAR_STATE_CHANGE,
      data: {
        state: StatusBarState.RUNNING,
        issueKey: activeWorklog.issue.key,
        issueSummary: activeWorklog.issue.summary,
      },
    });
  } else {
    sendNativeEvent({ name: NativeEvent.STATUS_BAR_TIME_CHANGE, data: null });
    sendNativeEvent({
      name: NativeEvent.STATUS_BAR_STATE_CHANGE,
      data: { state: StatusBarState.PAUSED },
    });
  }
});
