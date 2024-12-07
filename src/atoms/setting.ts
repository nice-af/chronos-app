import { atom } from 'jotai';
import { Appearance } from 'react-native';
import { SidebarLayout } from '../const';
import { SettingsModel, StorageKey, defaultStorageValues } from '../services/storage.service';
import { darkTheme } from '../styles/theme/theme-dark';
import { lightTheme } from '../styles/theme/theme-light';
import { Theme } from '../styles/theme/theme-types';
import { DayId } from '../types/global.types';

export const settingsAtom = atom<SettingsModel>(defaultStorageValues[StorageKey.SETTINGS]);
export const sidebarLayoutAtom = atom<SidebarLayout>(get => get(settingsAtom).sidebarLayout);
export const workingDaysAtom = atom<DayId[]>(get => get(settingsAtom).workingDays);
export const hideNonWorkingDaysAtom = atom(get => get(settingsAtom).hideNonWorkingDays);
export const disableEditingOfPastWorklogsAtom = atom(get => get(settingsAtom).warningWhenEditingOtherDays);
export const themeAtom = atom<Theme>(Appearance.getColorScheme() === 'dark' ? darkTheme : lightTheme);
export const isFullscreenAtom = atom(false);
