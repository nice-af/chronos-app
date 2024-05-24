import { useAtom } from 'jotai';
import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { settingsAtom } from '../../atoms';
import { useTranslation } from '../../services/i18n.service';
import { useThemedStyles } from '../../services/theme.service';
import { createSettingsStyles } from '../../styles/settings';
import { Toggle } from '../Toggle';

export const WorklogSettings: FC = () => {
  const [settings, setSettings] = useAtom(settingsAtom);
  const settingsStyles = useThemedStyles(createSettingsStyles);
  const { t } = useTranslation();

  return (
    <View style={settingsStyles.card}>
      <Text style={settingsStyles.headline}>{t('worklogs.settingsTitle')}</Text>
      <Toggle
        label={t('worklogs.warningWhenEditingOtherDays')}
        state={settings.warningWhenEditingOtherDays}
        setState={newState => setSettings(cur => ({ ...cur, warningWhenEditingOtherDays: newState }))}
      />
      <View style={settingsStyles.hr} />
      <Toggle
        label={t('worklogs.onlyCountPrimaryAccountWorklogs')}
        state={settings.onlyCountPrimaryAccountWorklogs}
        setState={newState => setSettings(cur => ({ ...cur, onlyCountPrimaryAccountWorklogs: newState }))}
      />
    </View>
  );
};
