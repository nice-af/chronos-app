import { atom } from 'jotai';
import { Version3Models } from 'jira.js';
import { Alert } from 'react-native';
import { initiateJiraClient, getJiraClient, getWorklogs, deleteWorklog } from '../services/jira.service';
import { getFromStorage, StorageKey } from '../services/storage.service';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { AuthModel } from '../services/storage.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DayId, Layout, Worklog, WorklogState } from '../types/global.types';
import { formatDateToYYYYMMDD } from '../services/date.service';
import { Overlay, SidebarLayout } from '../const';
import { createNewWorklogForIssue, syncWorklogs } from '../services/worklog.service';
import { lightTheme } from '../styles/theme/theme-light';
import { Theme } from '../styles/theme/theme-types';

// TODO @florianmrz is it secure to store the token in AsyncStorage?
// TODO @florianmrz should we type `any` here?
const storage = createJSONStorage<any>(() => AsyncStorage);

export const jiraAuthAtom = atomWithStorage<AuthModel | null>(StorageKey.AUTH, null, storage, { getOnInit: true });

export const logoutAtom = atom(null, (_get, set) => {
  set(jiraAuthAtom, null);
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
export const worklogsForCurrentDayAtom = atom(get => {
  const worklogs = get(worklogsAtom);
  return worklogs.filter(worklog => worklog.started === get(selectedDateAtom));
});

export const loadWorklogsAtom = atom(null, async (get, set) => {
  const userInfo = await get(userInfoAtom);
  const worklogs = await getWorklogs(userInfo!.accountId!);
  set(worklogsAtom, worklogs);
});
export const syncWorklogsForCurrentDayAtom = atom(null, async (get, set) => {
  const worklogs = get(worklogsForCurrentDayAtom);
  await syncWorklogs(worklogs);
  const userInfo = await get(userInfoAtom);
  const updatedWorklogs = await getWorklogs(userInfo!.accountId!);
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
