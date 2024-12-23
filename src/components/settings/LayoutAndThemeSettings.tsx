import { useAtom, useAtomValue } from 'jotai';
import React, { FC } from 'react';
import { Platform, Text, View } from 'react-native';
import { settingsAtom, themeAtom } from '../../atoms';
import { appVisibility, SidebarLayout } from '../../const';
import { useTranslation } from '../../services/i18n.service';
import { useThemedStyles } from '../../services/theme.service';
import { createSettingsStyles } from '../../styles/settings';
import { CardsSelectionButtons } from './CardsSelectionButtons';
import { Select } from '../Select';
import { sendNativeEvent } from '../../services/native-event-emitter.service';
import { NativeEvent } from '../../services/native-event-emitter.service.types';
import { SelectProps } from '../Select.types';

export const LayoutAndThemeSettings: FC = () => {
  const [settings, setSettings] = useAtom(settingsAtom);
  const settingsStyles = useThemedStyles(createSettingsStyles);
  const { type: themeType } = useAtomValue(themeAtom);
  const { t } = useTranslation();

  const appVisibilityOptions: SelectProps<appVisibility>['options'] = [
    { label: t('appVisibility.both'), value: appVisibility.BOTH },
    { label: t('appVisibility.menuBarOnly'), value: appVisibility.MENUBAR_ONLY },
    { label: t('appVisibility.dockOnly'), value: appVisibility.DOCK_ONLY },
  ];

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
            isChecked: settings.sidebarLayout === SidebarLayout.NORMAL,
            onClick: () => setSettings(cur => ({ ...cur, sidebarLayout: SidebarLayout.NORMAL })),
          },
          {
            image:
              themeType === 'dark'
                ? require('../../assets/settings/layout-compact-dark.png')
                : require('../../assets/settings/layout-compact-light.png'),
            label: t('sidebarLayout.compact'),
            isChecked: settings.sidebarLayout === SidebarLayout.COMPACT,
            onClick: () => setSettings(cur => ({ ...cur, sidebarLayout: SidebarLayout.COMPACT })),
          },
          {
            image:
              themeType === 'dark'
                ? require('../../assets/settings/layout-micro-dark.png')
                : require('../../assets/settings/layout-micro-light.png'),
            label: t('sidebarLayout.micro'),
            isChecked: settings.sidebarLayout === SidebarLayout.MICRO,
            onClick: () => setSettings(cur => ({ ...cur, sidebarLayout: SidebarLayout.MICRO })),
          },
        ]}
      />
      <View style={settingsStyles.hr} />
      <Text style={settingsStyles.headline}>{t('appVisibility.headline')}</Text>
      <Select<appVisibility>
        options={appVisibilityOptions}
        value={settings.appVisibility}
        onChange={newState => {
          sendNativeEvent({ name: NativeEvent.SET_APP__VISIBILITY, data: newState });
          setSettings(cur => ({ ...cur, appVisibility: newState }));
        }}
      />
    </View>
  );
};
