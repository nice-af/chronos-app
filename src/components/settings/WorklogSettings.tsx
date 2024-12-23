import { useAtom, useAtomValue } from 'jotai';
import React, { FC, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { loginsAtom, settingsAtom } from '../../atoms';
import { useTranslation } from '../../services/i18n.service';
import { WorkingTimeCountMethod, WorklogsSyncPeriod } from '../../services/storage.service';
import { useThemedStyles } from '../../services/theme.service';
import { createSettingsStyles } from '../../styles/settings';
import { Select } from '../Select';
import { Toggle } from '../Toggle';
import { ButtonSecondary } from '../ButtonSecondary';
import { refetchAllRemoteWorklogs } from '../../services/jira-worklogs.service';

export const WorklogSettings: FC = () => {
  const [settings, setSettings] = useAtom(settingsAtom);
  const settingsStyles = useThemedStyles(createSettingsStyles);
  const jiraAccounts = useAtomValue(loginsAtom);
  const [previousSyncPeriod, setPreviousSyncPeriod] = useState(settings.worklogsSyncPeriod);
  const { t } = useTranslation();

  const workingTimeCountMethodOptions: { label: string; value: WorkingTimeCountMethod }[] = [
    { label: t('worklogs.workingTimeCountMethod.options.all'), value: 'all' },
    { label: t('worklogs.workingTimeCountMethod.options.onlyPrimary'), value: 'onlyPrimary' },
  ];

  const worklogsSyncPeriodOptions: { label: string; value: WorklogsSyncPeriod }[] = [
    { label: t('worklogs.worklogsSyncPeriod.options.1w'), value: '1w' },
    { label: t('worklogs.worklogsSyncPeriod.options.2w'), value: '2w' },
    { label: t('worklogs.worklogsSyncPeriod.options.4w'), value: '4w' },
    { label: t('worklogs.worklogsSyncPeriod.options.8w'), value: '8w' },
    { label: t('worklogs.worklogsSyncPeriod.options.12w'), value: '12w' },
    { label: t('worklogs.worklogsSyncPeriod.options.24w'), value: '24w' },
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
        <View>
          <Text style={settingsStyles.label}>{t('worklogs.workingTimeCountMethod.label')}</Text>
          {jiraAccounts.length < 2 && (
            <Text style={settingsStyles.note}>{t('worklogs.workingTimeCountMethod.note')}</Text>
          )}
        </View>
        <Select<WorkingTimeCountMethod>
          options={workingTimeCountMethodOptions}
          value={settings.workingTimeCountMethod}
          onChange={newState => setSettings(cur => ({ ...cur, workingTimeCountMethod: newState }))}
        />
      </View>
      <View style={settingsStyles.hr} />
      <View style={styles.rowContainer}>
        <View>
          <Text style={settingsStyles.label}>{t('worklogs.worklogsSyncPeriod.label')}</Text>
          {jiraAccounts.length < 2 && <Text style={settingsStyles.note}>{t('worklogs.worklogsSyncPeriod.note')}</Text>}
        </View>
        <View>
          <Select<WorklogsSyncPeriod>
            options={worklogsSyncPeriodOptions}
            value={settings.worklogsSyncPeriod}
            onChange={newState => setSettings(cur => ({ ...cur, worklogsSyncPeriod: newState }))}
          />
          {settings.worklogsSyncPeriod !== previousSyncPeriod && (
            <ButtonSecondary
              style={styles.syncNowButton}
              label={t('worklogs.syncNow')}
              onPress={() => {
                setPreviousSyncPeriod(settings.worklogsSyncPeriod);
                void refetchAllRemoteWorklogs();
              }}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    width: '100%',
  },
  syncNowButton: {
    marginTop: 8,
  },
});
