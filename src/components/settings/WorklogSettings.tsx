import { useAtom } from 'jotai';
import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { settingsAtom } from '../../atoms';
import { useTranslation } from '../../services/i18n.service';
import { useThemedStyles } from '../../services/theme.service';
import { createSettingsStyles } from '../../styles/settings';
import { Toggle } from '../Toggle';
import { WorkingTimeCountMethod } from '../../services/storage.service';
import { Select } from '../Select';

export const WorklogSettings: FC = () => {
  const [settings, setSettings] = useAtom(settingsAtom);
  const settingsStyles = useThemedStyles(createSettingsStyles);
  const { t } = useTranslation();

  const workingTimeCountMethodOptions: { label: string; value: WorkingTimeCountMethod }[] = [
    { label: t('worklogs.workingTimeCountMethod.options.all'), value: 'all' },
    { label: t('worklogs.workingTimeCountMethod.options.onlyPrimary'), value: 'onlyPrimary' },
  ];

  return (
    <View style={settingsStyles.card}>
      <Text style={settingsStyles.headline}>{t('worklogs.settingsTitle')}</Text>
      <Toggle
        label={t('worklogs.warningWhenEditingOtherDays')}
        state={settings.warningWhenEditingOtherDays}
        setState={newState => setSettings(cur => ({ ...cur, warningWhenEditingOtherDays: newState }))}
      />
      <View style={settingsStyles.hr} />
      <View style={styles.rowContainer}>
        <Text style={settingsStyles.label}>{t('worklogs.workingTimeCountMethod.label')}</Text>
        <Select<WorkingTimeCountMethod>
          options={workingTimeCountMethodOptions}
          value={settings.workingTimeCountMethod}
          onChange={newState => setSettings(cur => ({ ...cur, workingTimeCountMethod: newState }))}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    width: '100%',
  },
});
