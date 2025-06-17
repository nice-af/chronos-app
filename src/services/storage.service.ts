import AsyncStorage from '@react-native-async-storage/async-storage';
import { appVisibility, SidebarLayout } from '../const';
import { JiraAccountTokensAtom, LoginsAtom } from '../types/accounts.types';
import { DayCode, ProjectsAtom, Worklog } from '../types/global.types';

export enum StorageKey {
  LOGINS = 'logins',
  JIRA_ACCOUNT_TOKENS = 'jiraAccountTokens',
  SETTINGS = 'settings',
  WORKLOGS_LOCAL = 'worklogsLocal',
  WORKLOGS_LOCAL_BACKUPS = 'worklogsLocalBackups',
  PROJECTS = 'projects',
  LAST_VERSION = 'lastVersion',
}

export type ThemeKey = 'light' | 'dark' | 'system';
export type IssueTagIconOption = 'none' | 'project' | 'workspace' | 'workspaceAndProject';
export type IssueTagColorOption = 'issue' | 'workspace';
export type WorkingTimeCountMethod = 'onlyPrimary' | 'all';
export type WorklogsSyncPeriod = '1w' | '2w' | '4w' | '8w' | '12w' | '24w';
export type WorkingDaysAndTime = Record<DayCode, { enabled: boolean; hours: number }>;

export interface SettingsModel {
  sidebarLayout: SidebarLayout;
  appVisibility: appVisibility;
  workingDaysAndTime: WorkingDaysAndTime;
  hideNonWorkingDays: boolean;
  warningWhenEditingOtherDays: boolean;
  enableTrackingReminder: boolean;
  trackingReminderTime: { hour: number; minute: number };
  themeKey: ThemeKey;
  workingTimeCountMethod: WorkingTimeCountMethod;
  issueTagIcon: IssueTagIconOption;
  issueTagColor: IssueTagColorOption;
  worklogsSyncPeriod: WorklogsSyncPeriod;
}

interface StorageTypes {
  [StorageKey.LOGINS]: LoginsAtom;
  [StorageKey.JIRA_ACCOUNT_TOKENS]: JiraAccountTokensAtom;
  [StorageKey.SETTINGS]: SettingsModel;
  [StorageKey.WORKLOGS_LOCAL]: Worklog[];
  [StorageKey.WORKLOGS_LOCAL_BACKUPS]: Worklog[];
  [StorageKey.PROJECTS]: ProjectsAtom;
  [StorageKey.LAST_VERSION]: string | null;
}

export const defaultStorageValues: { [key in StorageKey]: StorageTypes[key] } = {
  [StorageKey.LOGINS]: [],
  [StorageKey.JIRA_ACCOUNT_TOKENS]: {},
  [StorageKey.SETTINGS]: {
    sidebarLayout: SidebarLayout.NORMAL,
    appVisibility: appVisibility.BOTH,
    workingDaysAndTime: {
      mo: { enabled: true, hours: 8 },
      tu: { enabled: true, hours: 8 },
      we: { enabled: true, hours: 8 },
      th: { enabled: true, hours: 8 },
      fr: { enabled: true, hours: 8 },
      sa: { enabled: false, hours: 0 },
      su: { enabled: false, hours: 0 },
    },
    hideNonWorkingDays: false,
    warningWhenEditingOtherDays: true,
    enableTrackingReminder: false,
    trackingReminderTime: { hour: 18, minute: 30 },
    themeKey: 'system',
    workingTimeCountMethod: 'all',
    issueTagIcon: 'project',
    issueTagColor: 'issue',
    worklogsSyncPeriod: '4w',
  },
  [StorageKey.WORKLOGS_LOCAL]: [],
  [StorageKey.WORKLOGS_LOCAL_BACKUPS]: [],
  [StorageKey.PROJECTS]: {},
  [StorageKey.LAST_VERSION]: null,
};

export async function getFromStorage<T extends StorageKey>(key: T): Promise<StorageTypes[T]> {
  const storedValuesString = await AsyncStorage.getItem(key);
  const defaultValues = defaultStorageValues[key];
  const loadedValues = storedValuesString ? (JSON.parse(storedValuesString) as StorageTypes[T]) : null;

  if (!loadedValues) {
    return defaultValues;
  }

  // We sometimes add new settings or remove old ones, so we need to make sure that the stored settings are up to date
  if (key === StorageKey.SETTINGS) {
    const defaultKeys = Object.keys(defaultStorageValues[StorageKey.SETTINGS]);
    return {
      ...(defaultValues as SettingsModel),
      ...Object.fromEntries(Object.entries(loadedValues).filter(([entryKey]) => defaultKeys.includes(entryKey))),
    } as StorageTypes[T];
  }

  return loadedValues;
}

export async function setInStorage<T extends StorageKey = never>(key: T, value: StorageTypes[T]) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeFromStorage<T extends StorageKey = never>(key: T) {
  await AsyncStorage.removeItem(key);
}
