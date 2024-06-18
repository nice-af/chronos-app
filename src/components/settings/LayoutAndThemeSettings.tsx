import { useAtom, useAtomValue } from 'jotai';
import React, { FC } from 'react';
import { Platform, Text, View } from 'react-native';
import { settingsAtom, themeAtom } from '../../atoms';
import { SidebarLayout } from '../../const';
import { useTranslation } from '../../services/i18n.service';
import { useThemedStyles } from '../../services/theme.service';
import { createSettingsStyles } from '../../styles/settings';
import { CardsSelectionButtons } from './CardsSelectionButtons';

export const LayoutAndThemeSettings: FC = () => {
  const [settings, setSettings] = useAtom(settingsAtom);
  const settingsStyles = useThemedStyles(createSettingsStyles);
  const { type: themeType } = useAtomValue(themeAtom);
  const { t } = useTranslation();

  return (
    <View style={settingsStyles.card}>
      {Platform.OS === 'macos' && (
        <>
          <Text style={settingsStyles.headline}>{t('theme.settingsTitle')}</Text>
          <CardsSelectionButtons
            options={[
              {
                image: require('../../assets/settings/theme-light.png'),
                label: t('theme.light'),
                isChecked: settings.themeKey === 'light',
                onClick: () => setSettings(cur => ({ ...cur, themeKey: 'light' })),
              },
              {
                image: require('../../assets/settings/theme-dark.png'),
                label: t('theme.dark'),
                isChecked: settings.themeKey === 'dark',
                onClick: () => setSettings(cur => ({ ...cur, themeKey: 'dark' })),
              },
              {
                image: require('../../assets/settings/theme-system.png'),
                label: t('theme.system'),
                isChecked: settings.themeKey === 'system',
                onClick: () => setSettings(cur => ({ ...cur, themeKey: 'system' })),
              },
            ]}
          />
          <View style={settingsStyles.hr} />
        </>
      )}
      <Text style={settingsStyles.headline}>{t('sidebarLayout.settingsTitle')}</Text>
      <CardsSelectionButtons
        options={[
          {
            image:
              themeType === 'dark'
                ? require('../../assets/settings/layout-normal-dark.png')
                : require('../../assets/settings/layout-normal-light.png'),
            label: t('sidebarLayout.normal'),
            isChecked: settings.sidebarLayout === 'normal',
            onClick: () => setSettings(cur => ({ ...cur, sidebarLayout: SidebarLayout.NORMAL })),
          },
          {
            image:
              themeType === 'dark'
                ? require('../../assets/settings/layout-compact-dark.png')
                : require('../../assets/settings/layout-compact-light.png'),
            label: t('sidebarLayout.compact'),
            isChecked: settings.sidebarLayout === 'compact',
            onClick: () => setSettings(cur => ({ ...cur, sidebarLayout: SidebarLayout.COMPACT })),
          },
          {
            image:
              themeType === 'dark'
                ? require('../../assets/settings/layout-micro-dark.png')
                : require('../../assets/settings/layout-micro-light.png'),
            label: t('sidebarLayout.micro'),
            isChecked: settings.sidebarLayout === 'micro',
            onClick: () => setSettings(cur => ({ ...cur, sidebarLayout: SidebarLayout.MICRO })),
          },
        ]}
      />
    </View>
  );
};
