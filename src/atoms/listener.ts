import { sendNativeEvent } from '../services/native-event-emitter.service';
import { NativeEvent, StatusBarState } from '../services/native-event-emitter.service.types';
import { StorageKey, setInStorage } from '../services/storage.service';
import { jiraAccountsAtom, jiraAuthsAtom, primaryJiraAccountIdAtom } from './auth';
import { settingsAtom } from './setting';
import { store } from './store';
import { activeWorklogAtom, worklogsLocalAtom, worklogsLocalBackupsAtom } from './worklog';

/**
 * Persist changes to AsyncStorage
 */
store.sub(jiraAccountsAtom, () => {
  const jiraAccounts = store.get(jiraAccountsAtom);
  store.set(primaryJiraAccountIdAtom, jiraAccounts.find(a => a.isPrimary)?.accountId ?? '');
  setInStorage(StorageKey.ACCOUNTS, jiraAccounts);
});
store.sub(jiraAuthsAtom, () => {
  const jiraAuths = store.get(jiraAuthsAtom);
  // TODO @florianmrz is it secure to store the token in AsyncStorage?
  setInStorage(StorageKey.AUTHS, jiraAuths);
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
