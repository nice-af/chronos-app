import AsyncStorage from '@react-native-async-storage/async-storage';
import { Version3Client } from 'jira.js';
import { SidebarLayout } from '../const';
import { DayId, Worklog } from '../types/global.types';

export enum StorageKey {
  ACCOUNTS = 'accounts',
  AUTHS = 'auths',
  SETTINGS = 'settings',
  WORKLOGS_LOCAL = 'worklogsLocal',
}

export interface JiraAccountModel {
  accountId: string;
  name?: string;
  avatarUrl?: string;
  workspaceName: string;
  workspaceAvatarUrl?: string;
  workspaceColors: { light: string; dark: string };
  isPrimary: boolean;
}

export interface JiraAuthModel {
  accessToken: string;
  refreshToken: string;
  cloudId: string;
}

export type JiraAccountsAtom = JiraAccountModel[];
export type JiraAuthsAtom = Record<string, JiraAuthModel>;
export type JiraClientsAtom = Record<string, Version3Client>;

export type ThemeKey = 'light' | 'dark' | 'system';
export type IssueTagIconOption = 'none' | 'project' | 'workspace' | 'workspaceAndProject';
export type IssueTagColorOption = 'issue' | 'workspace';
export type WorkingTimeCountMethod = 'onlyPrimary' | 'all';

export interface SettingsModel {
  sidebarLayout: SidebarLayout;
  workingDays: DayId[];
  hideNonWorkingDays: boolean;
  warningWhenEditingOtherDays: boolean;
  enableTrackingReminder: boolean;
  trackingReminderTime: { hour: number; minute: number };
  themeKey: ThemeKey;
  workingTimeCountMethod: WorkingTimeCountMethod;
  issueTagIcon: IssueTagIconOption;
  issueTagColor: IssueTagColorOption;
}

interface StorageTypes {
  [StorageKey.ACCOUNTS]: JiraAccountsAtom;
  [StorageKey.AUTHS]: JiraAuthsAtom;
  [StorageKey.SETTINGS]: SettingsModel;
  [StorageKey.WORKLOGS_LOCAL]: Worklog[];
}

export const defaultStorageValues: Record<StorageKey, StorageTypes[StorageKey]> = {
  [StorageKey.ACCOUNTS]: [],
  [StorageKey.AUTHS]: {},
  [StorageKey.SETTINGS]: {
    sidebarLayout: SidebarLayout.NORMAL,
    workingDays: [0, 1, 2, 3, 4],
    hideNonWorkingDays: false,
    warningWhenEditingOtherDays: true,
    enableTrackingReminder: false,
    trackingReminderTime: { hour: 18, minute: 30 },
    themeKey: 'system',
    workingTimeCountMethod: 'all',
    issueTagIcon: 'project',
    issueTagColor: 'issue',
  },
  [StorageKey.WORKLOGS_LOCAL]: [],
};

export async function getFromStorage<T extends StorageKey = never>(key: T): Promise<StorageTypes[T]> {
  const storedValuesString = await AsyncStorage.getItem(key);
  const defaultValues = defaultStorageValues[key];
  let newValues = storedValuesString ? JSON.parse(storedValuesString) : defaultValues;

  // We sometimes add new settings or remove old ones, so we need to make sure that the stored settings are up to date
  if (key === StorageKey.SETTINGS && defaultValues) {
    const defaultKeys = Object.keys(defaultValues);
    newValues = {
      ...defaultValues,
      ...Object.fromEntries(Object.entries(newValues).filter(([entryKey]) => defaultKeys.includes(entryKey))),
    };
  }

  return newValues;
}

export async function setInStorage<T extends StorageKey = never>(key: T, value: StorageTypes[T]) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeFromStorage<T extends StorageKey = never>(key: T) {
  await AsyncStorage.removeItem(key);
}
