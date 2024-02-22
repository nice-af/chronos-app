import { Version3Models } from 'jira.js';
import { atom, createStore } from 'jotai';
import { Overlay, SidebarLayout } from '../const';
import { formatDateToYYYYMMDD } from '../services/date.service';
import { deleteRemoteWorklog, getRemoteWorklogs } from '../services/jira.service';
import { sendNativeEvent } from '../services/native-event-emitter.service';
import { StatusBarState, NativeEvent } from '../services/native-event-emitter.service.types';
import { AuthModel, SettingsModel, StorageKey, defaultStorageValues, setInStorage } from '../services/storage.service';
import { formatSecondsToHMM } from '../services/time.service';
import { syncWorklogs } from '../services/worklog.service';
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

export const worklogsLocalAtom = atom<Worklog[]>([]);
export const worklogsRemoteAtom = atom<Worklog[]>([]);
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
/**
 * Unix timestamp where the tracking of the active worklog started
 */
const activeWorklogTrackingStartedAtom = atom(0);
/**
 * Duration in seconds of the currently running worklog
 */
export const activeWorklogTrackingDurationAtom = atom(0);

/**
 * Tick every 10 seconds to update the current duration
 */
setInterval(() => {
  const start = store.get(activeWorklogTrackingStartedAtom);
  let diff: number;
  if (start === 0) {
    diff = 0;
  } else {
    const raw = Date.now() - start;
    // Round to nearest minute
    diff = Math.floor(raw / 1000 / 60) * 60;
  }
  store.set(activeWorklogTrackingDurationAtom, diff);
}, 10_000);

export const worklogsForCurrentDayAtom = atom(get => {
  const worklogs = get(worklogsAtom);
  return worklogs.filter(worklog => worklog.started === get(selectedDateAtom));
});

export const syncWorklogsForCurrentDayAtom = atom(null, async (get, set) => {
  const localWorklogs = get(worklogsLocalAtom);
  const worklogsToSync = get(worklogsForCurrentDayAtom).filter(w => localWorklogs.find(lw => lw.id === w.id));
  await syncWorklogs(worklogsToSync);

  const userInfo = get(userInfoAtom);
  const updatedWorklogs = await getRemoteWorklogs(userInfo!.accountId!);
  set(worklogsRemoteAtom, updatedWorklogs);

  // Remove local worklogs that have been synced
  set(worklogsLocalAtom, worklogs => worklogs.filter(w => !worklogsToSync.find(lw => lw.id === w.id)));

  return updatedWorklogs;
});

export const addWorklogAtom = atom(null, async (_get, set, worklog: Worklog) => {
  set(worklogsLocalAtom, worklogs => [...worklogs, worklog]);
  set(setWorklogAsActiveAtom, worklog.id);
});
export const setWorklogAsActiveAtom = atom(null, (get, set, worklogId: string | null) => {
  const activeWorklog = get(activeWorklogAtom);
  const activeWorklogTrackingDuration = get(activeWorklogTrackingDurationAtom);

  if (activeWorklog && activeWorklogTrackingDuration > 0) {
    set(updateWorklogAtom, {
      ...activeWorklog,
      timeSpentSeconds: activeWorklog.timeSpentSeconds + activeWorklogTrackingDuration,
    });
  }

  set(activeWorklogIdAtom, worklogId);
  set(activeWorklogTrackingDurationAtom, 0);
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

export const settingsAtom = atom<SettingsModel>(defaultStorageValues[StorageKey.SETTINGS] as SettingsModel);
export const sidebarLayoutAtom = atom<SidebarLayout>(get => get(settingsAtom).sidebarLayout);
export const workingDaysAtom = atom<DayId[]>(get => get(settingsAtom).workingDays);
export const hideNonWorkingDaysAtom = atom(get => get(settingsAtom).hideNonWorkingDays);
export const disableEditingOfPastWorklogsAtom = atom(get => get(settingsAtom).disableEditingOfPastWorklogs);
export const themeAtom = atom<Theme>(get => get(settingsAtom).theme);
export const isFullscreenAtom = atom(false);

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
store.sub(activeWorklogTrackingDurationAtom, () => {
  const activeWorklog = store.get(activeWorklogAtom);
  if (activeWorklog) {
    sendNativeEvent({ name: NativeEvent.STATUS_BAR_STATE_CHANGE, data: StatusBarState.RUNNING });
    sendNativeEvent({
      name: NativeEvent.STATUS_BAR_TEXT_CHANGE,
      data: formatSecondsToHMM(activeWorklog.timeSpentSeconds),
    });
  } else {
    sendNativeEvent({ name: NativeEvent.STATUS_BAR_STATE_CHANGE, data: StatusBarState.PAUSED });
    sendNativeEvent({ name: NativeEvent.STATUS_BAR_TEXT_CHANGE, data: '-:--' });
  }
});
store.sub(activeWorklogAtom, () => {
  const activeWorklog = store.get(activeWorklogAtom);
  const time = activeWorklog?.timeSpentSeconds ?? 0;
  if (activeWorklog) {
    sendNativeEvent({ name: NativeEvent.STATUS_BAR_STATE_CHANGE, data: StatusBarState.RUNNING });
    sendNativeEvent({ name: NativeEvent.STATUS_BAR_TEXT_CHANGE, data: formatSecondsToHMM(time) });
  } else {
    sendNativeEvent({ name: NativeEvent.STATUS_BAR_STATE_CHANGE, data: StatusBarState.PAUSED });
    sendNativeEvent({ name: NativeEvent.STATUS_BAR_TEXT_CHANGE, data: '-:--' });
  }
});
