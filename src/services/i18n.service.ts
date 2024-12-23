import { Locale as DateFnsLocale } from 'date-fns';
import deLocale from 'date-fns/locale/de';
import enAULocale from 'date-fns/locale/en-AU';
import enCALocale from 'date-fns/locale/en-CA';
import enGBLocale from 'date-fns/locale/en-GB';
import enUSLocale from 'date-fns/locale/en-US';
import { pickLocale } from 'locale-matcher';
import { get } from 'lodash';
import { useCallback, useMemo } from 'react';
import { NativeModules, Platform } from 'react-native';
import translationsDE from '../translations/de.json';
import translationsEN from '../translations/en.json';
import { requestedLanguages } from './i18n-native.service';

type Leaves<T> = T extends object
  ? {
      [K in keyof T]: `${Exclude<K, symbol>}${Leaves<T[K]> extends never ? '' : `.${Leaves<T[K]>}`}`;
    }[keyof T]
  : never;

type TranslationObjectType = typeof translationsDE & typeof translationsEN;
// We have an eslint issue here when the locales are duplicates/synced and therefore correct
// eslint-disable-next-line @typescript-eslint/no-duplicate-type-constituents
type TranslationKey = Leaves<typeof translationsDE> & Leaves<typeof translationsEN>;

export enum Locale {
  EN = 'en',
  DE = 'de',
}

const localeToTranslationsMap: { [key in Locale]: TranslationObjectType } = {
  [Locale.EN]: translationsEN,
  [Locale.DE]: translationsDE,
};

const deviceLocaleToDateFnsLocaleMap: Record<string, DateFnsLocale> = {
  de: deLocale as unknown as DateFnsLocale,
  en_AU: enAULocale as unknown as DateFnsLocale,
  en_CA: enCALocale as unknown as DateFnsLocale,
  en_GB: enGBLocale as unknown as DateFnsLocale,
  en_US: enUSLocale as unknown as DateFnsLocale,
};

const localeToLongDateFormat: { [key in Locale]: string } = {
  [Locale.EN]: 'MMMM do',
  [Locale.DE]: 'do MMMM',
};

function getDateFnsLocale(locale: string): DateFnsLocale {
  if (deviceLocaleToDateFnsLocaleMap[locale]) {
    return deviceLocaleToDateFnsLocaleMap[locale];
  }

  // Try again without the region
  const language = locale.split('_')[0];
  if (deviceLocaleToDateFnsLocaleMap[language]) {
    return deviceLocaleToDateFnsLocaleMap[language];
  }

  // Fallback to en-US
  return enUSLocale as unknown as DateFnsLocale;
}

export function useTranslation() {
  const locale = pickLocale(requestedLanguages, Object.values(Locale), Locale.EN) as Locale;

  const tFunc = useCallback(
    (key: TranslationKey, args?: Record<string, string | number>) => {
      if (!locale || !localeToTranslationsMap[locale]) {
        return key;
      }
      const translations = localeToTranslationsMap[locale];
      const translation = get(translations, key) || key;

      if (args) {
        return Object.entries(args).reduce(
          (acc, [key, value]) => acc.replace(`{${key}}`, value.toString()),
          translation
        );
      }

      return translation;
    },
    [locale]
  );

  const deviceLocale = useMemo<string>(() => {
    if (Platform.OS === 'ios' || Platform.OS === 'macos') {
      return (NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0]) as string;
    }
    return NativeModules.I18nManager.localeIdentifier as string;
  }, [
    NativeModules.SettingsManager.settings.AppleLocale,
    NativeModules.SettingsManager.settings.AppleLanguages,
    NativeModules.I18nManager.localeIdentifier,
  ]);

  const dateFnsLocale = useMemo(() => getDateFnsLocale(deviceLocale), [deviceLocale]);

  return useMemo(
    () => ({
      locale,
      dateFnsLocale,
      longDateFormat: localeToLongDateFormat[locale],
      deviceLocale,
      t: tFunc,
    }),
    [locale]
  );
}
