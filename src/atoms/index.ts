import AsyncStorage from '@react-native-async-storage/async-storage';
import { Version3Models } from 'jira.js';
import { atom, createStore } from 'jotai';
import { Overlay, SidebarLayout } from '../const';
import { formatDateToYYYYMMDD } from '../services/date.service';
import { deleteWorklog, getRemoteWorklogs } from '../services/jira.service';
import { AuthModel, StorageKey, setInStorage } from '../services/storage.service';
import { syncWorklogs } from '../services/worklog.service';
import { lightTheme } from '../styles/theme/theme-light';
import { Theme } from '../styles/theme/theme-types';
import { DayId, Worklog, WorklogState } from '../types/global.types';

export const store = createStore();

export const jiraAuthAtom = atom<AuthModel | null>(null);

export const logoutAtom = atom(null, (_get, set) => {
  set(jiraAuthAtom, null);
  set(userInfoAtom, null);
});

export const userInfoAtom = atom<Version3Models.User | null>(null);

/**
 * Format is 'YYYY-MM-DD'
 */
export const selectedDateAtom = atom(formatDateToYYYYMMDD(new Date()));
export const currentOverlayAtom = atom<Overlay | null>(null);
export const currentWorklogToEditAtom = atom<Worklog | null>(null);

export const worklogsAtom = atom<Worklog[]>([]);
export const activeWorklogIdAtom = atom<string | null>(null);
export const activeWorklogAtom = atom(get => {
  const worklogId = get(activeWorklogIdAtom);
  return get(worklogsAtom).find(worklog => worklog.id === worklogId) ?? null;
});
/**
 * Unix timestamp where the tracking of the active worklog started
 */
export const activeWorklogTrackingStartedAtom = atom(0);
/**
 * Duration in seconds of the currently running worklog
 */
export const activeWorklogTrackingDurationAtom = atom(0);

/**
 * Tick every 10 seconds to update the current duration
 */
setInterval(() => {
  const start = store.get(activeWorklogTrackingStartedAtom);
  if (start === 0) {
    store.set(activeWorklogTrackingDurationAtom, 0);
  }
  const raw = Date.now() - start;
  // Round to nearest minute
  const diff = Math.floor(raw / 1000 / 60) * 60;
  store.set(activeWorklogTrackingDurationAtom, diff);
}, 1_000);

export const worklogsForCurrentDayAtom = atom(get => {
  const worklogs = get(worklogsAtom);
  return worklogs.filter(worklog => worklog.started === get(selectedDateAtom));
});

export const syncWorklogsForCurrentDayAtom = atom(null, async (get, set) => {
  const worklogs = get(worklogsForCurrentDayAtom);
  await syncWorklogs(worklogs);
  const userInfo = get(userInfoAtom);
  const updatedWorklogs = await getRemoteWorklogs(userInfo!.accountId!);
  set(worklogsAtom, updatedWorklogs);
  return updatedWorklogs;
});

export const addWorklogAtom = atom(null, async (_get, set, worklog: Worklog) => {
  set(worklogsAtom, worklogs => [...worklogs, worklog]);
  set(activeWorklogIdAtom, worklog.id);
});
export const updateWorklogAtom = atom(null, (_get, set, worklog: Worklog) => {
  if (worklog.state !== WorklogState.Local) {
    worklog.state = WorklogState.Edited;
  }
  set(worklogsAtom, worklogs => worklogs.map(w => (w.id === worklog.id ? worklog : w)));
});
export const deleteWorklogAtom = atom(null, async (get, set, worklogId: string) => {
  const worklogs = get(worklogsAtom);
  const worklogToDelete = worklogs.find(w => w.id === worklogId);
  if (worklogToDelete) {
    set(
      worklogsAtom,
      worklogs.filter(w => w.id !== worklogId)
    );
    await deleteWorklog(worklogToDelete);
  }
});

export const sidebarLayoutAtom = atom<SidebarLayout>(SidebarLayout.Normal);
export const workingDaysAtom = atom<DayId[]>([0, 1, 2, 3, 4]);
export const hideNonWorkingDaysAtom = atom(false);
export const disableEditingOfPastWorklogsAtom = atom(true);
export const themeAtom = atom<Theme>(lightTheme);

store.sub(jiraAuthAtom, () => {
  const jiraAuth = store.get(jiraAuthAtom);
  // TODO @florianmrz is it secure to store the token in AsyncStorage?
  setInStorage(StorageKey.AUTH, jiraAuth);
});
