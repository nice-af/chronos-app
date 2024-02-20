import { useCallback, useMemo } from 'react';
import { NativeModules } from 'react-native';
import translationsDE from '../translations/de.json';
import translationsEN from '../translations/en.json';
import { pickLocale } from 'locale-matcher';
import { get } from 'lodash';
import deLocale from 'date-fns/locale/de';
import enLocale from 'date-fns/locale/en-US';
import { Locale as DateFnsLocale } from 'date-fns';

type Leaves<T> = T extends object
  ? {
      [K in keyof T]: `${Exclude<K, symbol>}${Leaves<T[K]> extends never ? '' : `.${Leaves<T[K]>}`}`;
    }[keyof T]
  : never;

type TranslationObjectType = typeof translationsDE & typeof translationsEN;
type TranslationKey = Leaves<typeof translationsDE> & Leaves<typeof translationsEN>;

export enum Locale {
  EN = 'en',
  DE = 'de',
}

const localeToTranslationsMap: { [key in Locale]: TranslationObjectType } = {
  [Locale.EN]: translationsEN,
  [Locale.DE]: translationsDE,
};

const localeToDateFnsLocaleMap: { [key in Locale]: DateFnsLocale } = {
  [Locale.EN]: enLocale,
  [Locale.DE]: deLocale,
};

const localeToLongDateFormat: { [key in Locale]: string } = {
  [Locale.EN]: 'MMMM do',
  [Locale.DE]: 'do MMMM',
};

export function useTranslation() {
  const locale = pickLocale(
    NativeModules.SettingsManager.settings.AppleLanguages,
    Object.values(Locale),
    Locale.EN
  ) as Locale;

  const tFunc = useCallback(
    (key: TranslationKey) => {
      if (!locale || !localeToTranslationsMap[locale]) {
        return key;
      }
      const translations = localeToTranslationsMap[locale];
      return get(translations, key) || key;
    },
    [locale]
  );

  return useMemo(
    () => ({
      locale,
      dateFnsLocale: localeToDateFnsLocaleMap[locale],
      longDateFormat: localeToLongDateFormat[locale],
      t: tFunc,
    }),
    [locale]
  );
}
