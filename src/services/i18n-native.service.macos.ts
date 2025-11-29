import { NativeModules } from 'react-native';

export const requestedLanguages = NativeModules?.SettingsManager?.settings.AppleLanguages;
