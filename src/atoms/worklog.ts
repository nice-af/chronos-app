import { atom } from 'jotai';
import ms from 'ms';
import { requestAccountData } from '../services/jira-info.service';
import { deleteRemoteWorklog, getRemoteWorklogs } from '../services/jira-worklogs.service';
import { syncWorklogs } from '../services/worklog.service';
import { JiraAccountTokensAtom, LoginsAtom } from '../types/accounts.types';
import { Worklog, WorklogId, WorklogState } from '../types/global.types';
import { jiraAccountTokensAtom, loginsAtom, primaryUUIDAtom } from './auth';
import { selectedDateAtom } from './navigation';
import { store } from './store';

export const currentWorklogToEditAtom = atom<Worklog | null>(null);
export const syncProgressAtom = atom<number | null>(null);
export const worklogsLocalAtom = atom<Worklog[]>([]);
export const worklogsRemoteAtom = atom<Worklog[]>([]);
export const worklogsLocalBackupsAtom = atom<Worklog[]>([]);

/**
 * Local and remote worklogs combined.
 * Local worklogs are prioritized over remote worklogs.
 */
export const worklogsAtom = atom<Worklog[]>(get => {
  const local = get(worklogsLocalAtom);
  const remote = get(worklogsRemoteAtom).filter(worklog => !local.some(w => w.id === worklog.id));
  return [...remote, ...local].sort((a, b) => a.id.localeCompare(b.id));
});
const activeWorklogIdAtom = atom<string | null>(null);
export const activeWorklogAtom = atom(get => {
  const worklogId = get(activeWorklogIdAtom);
  return get(worklogsAtom).find(worklog => worklog.id === worklogId) ?? null;
});
export const lastActiveWorklogIdAtom = atom<string | null>(null);
/**
 * Unix timestamp where the tracking of the active worklog started
 */
const activeWorklogTrackingStartedAtom = atom(0);

// TODO @florianmrz we need to run the below logic once upon the app being focussed / opened again
// TODO @florianmrz this will mark the active worklog as edited when started and stopped within the same minute (minutes displayed in the UI are rounded to full minutes) which might be confusing to the user
/**
 * Tick every few seconds to update the current duration
 */
setInterval(() => {
  const activeWorklog = store.get(activeWorklogAtom);
  if (!activeWorklog) {
    return;
  }

  const start = store.get(activeWorklogTrackingStartedAtom);
  const now = Date.now();
  let diff: number;
  if (start === 0) {
    diff = 0;
  } else {
    diff = Math.floor((now - start) / 1000);
  }
  if (diff > 0) {
    updateWorklog({ ...activeWorklog, timeSpentSeconds: activeWorklog.timeSpentSeconds + diff });
    store.set(activeWorklogTrackingStartedAtom, now);
  }
}, ms('3s'));

export function getWorklogsForSelectedDay() {
  const worklogs = store.get(worklogsAtom);
  return worklogs.filter(worklog => worklog.started === store.get(selectedDateAtom));
}

/**
 * Syncs all worklogs for the selected day and updates accounts and remote worklogs
 */
export async function syncWorklogsForCurrentDay() {
  const logins = store.get(loginsAtom);
  const jiraAccountTokens = store.get(jiraAccountTokensAtom);
  const primaryUUID = store.get(primaryUUIDAtom);
  const localWorklogs = store.get(worklogsLocalAtom);
  const worklogsToSync = getWorklogsForSelectedDay()
    .filter(w => localWorklogs.find(lw => lw.id === w.id))
    .filter(worklog => worklog.timeSpentSeconds >= 60);

  // Setup progress tracking
  store.set(syncProgressAtom, 0);
  const progressStepsSync = worklogsToSync.length; // Each worklog equals one progress step
  const progressStepsAccountsLoop = logins.length * 3; // Each account has 3 progress steps: 1 to get user info and 2 to get worklogs
  const progressPerStep = 1 / (progressStepsSync + progressStepsAccountsLoop);
  await syncWorklogs(worklogsToSync, progressPerStep);

  // Sync worklogs for all accounts
  const newLogins: LoginsAtom = [];
  const newWorklogsRemote: Worklog[] = [];
  const newJiraAccountTokens: JiraAccountTokensAtom = {};
  for (let i = 0; i < logins.length; i++) {
    const login = logins[i];
    const tokens = jiraAccountTokens[login.accountId];
    const {
      login: newLogin,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    } = await requestAccountData(tokens.accessToken, tokens.refreshToken, login.accountId);
    newJiraAccountTokens[login.accountId] = {
      ...tokens,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
    newLogins.push(newLogin);
    store.set(syncProgressAtom, cur => cur ?? 0 + progressPerStep);
    newWorklogsRemote.push(...(await getRemoteWorklogs(login.uuid, login.accountId)));
    store.set(syncProgressAtom, cur => cur ?? 0 + progressPerStep * 2);
  }
  store.set(jiraAccountTokensAtom, newJiraAccountTokens);
  store.set(
    loginsAtom,
    newLogins.map(account => ({ ...account, isPrimary: account.accountId === primaryUUID }))
  );
  store.set(worklogsRemoteAtom, newWorklogsRemote);

  // Remove local worklogs that have been synced
  store.set(worklogsLocalAtom, worklogs => worklogs.filter(w => !worklogsToSync.find(lw => lw.id === w.id)));
  setTimeout(() => store.set(syncProgressAtom, null), 1500);
}

/**
 * Adds a new worklog to the local worklogs and sets it as active
 */
export function addWorklog(worklog: Worklog) {
  store.set(worklogsLocalAtom, worklogs => [...worklogs, worklog]);
  setWorklogAsActive(worklog.id);
}

/**
 * Sets the given worklog as active and stops the previously active worklog
 */
export function setWorklogAsActive(worklogId: WorklogId | null) {
  const activeWorklog = store.get(activeWorklogAtom);
  const activeWorklogTrackingStarted = store.get(activeWorklogTrackingStartedAtom);

  if (activeWorklog && activeWorklogTrackingStarted > 0) {
    const activeWorklogDuration = Math.floor((Date.now() - activeWorklogTrackingStarted) / 1000);
    const newTimeSpent = activeWorklog.timeSpentSeconds + activeWorklogDuration;
    const roundedToFullMinute = Math.floor(newTimeSpent / 60) * 60;
    updateWorklog({ ...activeWorklog, timeSpentSeconds: roundedToFullMinute });
  }

  store.set(activeWorklogIdAtom, worklogId);
  if (worklogId) {
    store.set(lastActiveWorklogIdAtom, worklogId);
  }
  store.set(activeWorklogTrackingStartedAtom, Date.now());
}

/**
 * Updates the given worklog and stores it in the local worklogs
 */
export function updateWorklog(worklog: Worklog) {
  if (worklog.state !== WorklogState.LOCAL) {
    worklog.state = WorklogState.EDITED;
  }
  const currentWorklogs = store.get(worklogsLocalAtom);
  const exists = currentWorklogs.some(w => w.id === worklog.id);
  if (exists) {
    store.set(worklogsLocalAtom, worklogs => worklogs.map(w => (w.id === worklog.id ? worklog : w)));
  } else {
    store.set(worklogsLocalAtom, worklogs => [...worklogs, worklog]);
  }
}

/**
 * Deletes the worklog with the given ID locally and remotely
 */
export async function deleteWorklog(worklogId: WorklogId) {
  const worklogsRemote = store.get(worklogsRemoteAtom);
  const worklogRemote = worklogsRemote.find(w => w.id === worklogId);
  if (worklogRemote) {
    await deleteRemoteWorklog(worklogRemote);
    store.set(
      worklogsRemoteAtom,
      worklogsRemote.filter(w => w.id !== worklogId)
    );
  }
  const worklogsLocal = store.get(worklogsLocalAtom);
  const worklogLocal = worklogsLocal.find(w => w.id === worklogId);
  if (worklogLocal) {
    store.set(
      worklogsLocalAtom,
      worklogsLocal.filter(w => w.id !== worklogId)
    );
  }
}
