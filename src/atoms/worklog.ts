import { atom } from 'jotai';
import ms from 'ms';
import { requestAccountData } from '../services/jira-info.service';
import { deleteRemoteWorklog, getRemoteWorklogs } from '../services/jira-worklogs.service';
import { JiraAccountsAtom, JiraAuthsAtom } from '../services/storage.service';
import { syncWorklogs } from '../services/worklog.service';
import { Worklog, WorklogState } from '../types/global.types';
import { jiraAccountsAtom, jiraAuthsAtom } from './auth';
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
    store.set(updateWorklogAtom, {
      ...activeWorklog,
      timeSpentSeconds: activeWorklog.timeSpentSeconds + diff,
    });
    store.set(activeWorklogTrackingStartedAtom, now);
  }
}, ms('3s'));

export const worklogsForCurrentDayAtom = atom(get => {
  const worklogs = get(worklogsAtom);
  return worklogs.filter(worklog => worklog.started === get(selectedDateAtom));
});

export const syncWorklogsForCurrentDayAtom = atom(null, async (get, set) => {
  const jiraAccounts = store.get(jiraAccountsAtom);
  const jiraAuths = store.get(jiraAuthsAtom);
  store.set(syncProgressAtom, 0);
  const localWorklogs = get(worklogsLocalAtom);
  const worklogsToSync = get(worklogsForCurrentDayAtom)
    .filter(w => localWorklogs.find(lw => lw.id === w.id))
    .filter(worklog => worklog.timeSpentSeconds >= 60);

  // Each worklog equals one progress step
  const progressStepsSync = worklogsToSync.length;
  // Each account has 3 progress steps: 1 to get user info and 2 to get worklogs
  const progressStepsAccountsLoop = jiraAccounts.length * 3;
  const progressPerStep = 1 / (progressStepsSync + progressStepsAccountsLoop);
  await syncWorklogs(worklogsToSync, progressPerStep);

  const newAccountsData: JiraAccountsAtom = [];
  const primaryAccountId = jiraAccounts.find(account => account.isPrimary)?.accountId;
  const newWorklogsRemote: Worklog[] = [];
  const newAuths: JiraAuthsAtom = {};
  for (let i = 0; i < jiraAccounts.length; i++) {
    const jiraAccount = jiraAccounts[i];
    const auth = jiraAuths[jiraAccount.accountId];
    const {
      jiraAccount: newJiraAccount,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    } = await requestAccountData(auth.accessToken, auth.refreshToken);
    newAuths[jiraAccount.accountId] = { ...auth, accessToken: newAccessToken, refreshToken: newRefreshToken };
    newAccountsData.push(newJiraAccount);
    store.set(syncProgressAtom, progressPerStep * (progressStepsSync + i + 1));
    newWorklogsRemote.push(...(await getRemoteWorklogs(jiraAccount.accountId)));
    store.set(syncProgressAtom, progressPerStep * (progressStepsSync + progressStepsAccountsLoop + i + 1));
  }
  store.set(jiraAuthsAtom, newAuths);
  store.set(
    jiraAccountsAtom,
    newAccountsData.map(account => ({ ...account, isPrimary: account.accountId === primaryAccountId }))
  );
  store.set(worklogsRemoteAtom, newWorklogsRemote);

  // Remove local worklogs that have been synced
  set(worklogsLocalAtom, worklogs => worklogs.filter(w => !worklogsToSync.find(lw => lw.id === w.id)));
  setTimeout(() => store.set(syncProgressAtom, null), 1500);
});

export const addWorklogAtom = atom(null, async (_get, set, worklog: Worklog) => {
  set(worklogsLocalAtom, worklogs => [...worklogs, worklog]);
  set(setWorklogAsActiveAtom, worklog.id);
});
export const setWorklogAsActiveAtom = atom(null, (get, set, worklogId: string | null) => {
  const activeWorklog = get(activeWorklogAtom);
  const activeWorklogTrackingStarted = get(activeWorklogTrackingStartedAtom);

  if (activeWorklog && activeWorklogTrackingStarted > 0) {
    const activeWorklogDuration = Math.floor((Date.now() - activeWorklogTrackingStarted) / 1000);
    const newTimeSpent = activeWorklog.timeSpentSeconds + activeWorklogDuration;
    const roundedToFullMinute = Math.floor(newTimeSpent / 60) * 60;
    set(updateWorklogAtom, {
      ...activeWorklog,
      timeSpentSeconds: roundedToFullMinute,
    });
  }

  set(activeWorklogIdAtom, worklogId);
  if (worklogId) {
    set(lastActiveWorklogIdAtom, worklogId);
  }
  set(activeWorklogTrackingStartedAtom, Date.now());
});
export const updateWorklogAtom = atom(null, (get, set, worklog: Worklog) => {
  if (worklog.state !== WorklogState.LOCAL) {
    worklog.state = WorklogState.EDITED;
  }
  const currentWorklogs = get(worklogsLocalAtom);
  const exists = currentWorklogs.some(w => w.id === worklog.id);
  if (exists) {
    set(worklogsLocalAtom, worklogs => worklogs.map(w => (w.id === worklog.id ? worklog : w)));
  } else {
    set(worklogsLocalAtom, worklogs => [...worklogs, worklog]);
  }
});
export const deleteWorklogAtom = atom(null, async (get, set, worklogId: string) => {
  const worklogsRemote = get(worklogsRemoteAtom);
  const worklogRemote = worklogsRemote.find(w => w.id === worklogId);
  if (worklogRemote) {
    await deleteRemoteWorklog(worklogRemote);
    set(
      worklogsRemoteAtom,
      worklogsRemote.filter(w => w.id !== worklogId)
    );
  }
  const worklogsLocal = get(worklogsLocalAtom);
  const worklogLocal = worklogsLocal.find(w => w.id === worklogId);
  if (worklogLocal) {
    set(
      worklogsLocalAtom,
      worklogsLocal.filter(w => w.id !== worklogId)
    );
  }
});
