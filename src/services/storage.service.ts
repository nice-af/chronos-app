import AsyncStorage from '@react-native-async-storage/async-storage';
import { DayId, Worklog } from '../types/global.types';
import { SidebarLayout } from '../const';
import { Theme } from '../styles/theme/theme-types';
import { lightTheme } from '../styles/theme/theme-light';

export enum StorageKey {
  AUTH = 'auth',
  SETTINGS = 'settings',
  WORKLOGS_LOCAL = 'worklogsLocal',
}

export interface AuthModel {
  accessToken: string;
  refreshToken: string;
  cloudId: string;
}

export interface SettingsModel {
  sidebarLayout: SidebarLayout;
  workingDays: DayId[];
  hideNonWorkingDays: boolean;
  warningWhenEditingOtherDays: boolean;
  enableTrackingReminder: boolean;
  trackingReminderTime: [number, number];
  theme: Theme;
}

interface StorageTypes {
  [StorageKey.AUTH]: AuthModel | null;
  [StorageKey.SETTINGS]: SettingsModel;
  [StorageKey.WORKLOGS_LOCAL]: Worklog[];
}

export const defaultStorageValues: Record<StorageKey, StorageTypes[StorageKey]> = {
  [StorageKey.AUTH]: null,
  [StorageKey.SETTINGS]: {
    sidebarLayout: SidebarLayout.NORMAL,
    workingDays: [0, 1, 2, 3, 4],
    hideNonWorkingDays: false,
    warningWhenEditingOtherDays: true,
    enableTrackingReminder: false,
    trackingReminderTime: [18, 30],
    theme: lightTheme,
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
      ...Object.fromEntries(Object.entries(newValues).filter(([key]) => defaultKeys.includes(key))),
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
