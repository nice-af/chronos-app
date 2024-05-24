import { useAtom } from 'jotai';
import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { settingsAtom } from '../../atoms';
import { useTranslation } from '../../services/i18n.service';
import { IssueTagColorOption, IssueTagIconOption } from '../../services/storage.service';
import { useThemedStyles } from '../../services/theme.service';
import { createSettingsStyles } from '../../styles/settings';
import { IssueKeyTag } from '../IssueKeyTag';
import { Select } from '../Select';

export const IssueTagsSettings: FC = () => {
  const [settings, setSettings] = useAtom(settingsAtom);
  const settingsStyles = useThemedStyles(createSettingsStyles);
  const { t } = useTranslation();

  const issueTagIconOptions: { label: string; value: IssueTagIconOption }[] = [
    { label: t('issueTag.icon.options.none'), value: 'none' },
    { label: t('issueTag.icon.options.project'), value: 'project' },
    { label: t('issueTag.icon.options.workspace'), value: 'workspace' },
    { label: t('issueTag.icon.options.workspaceAndProject'), value: 'workspaceAndProject' },
  ];

  const issueTagColorOptions: { label: string; value: IssueTagColorOption }[] = [
    { label: t('issueTag.color.options.issue'), value: 'issue' },
    { label: t('issueTag.color.options.workspace'), value: 'workspace' },
  ];

  return (
    <View style={settingsStyles.card}>
      <Text style={settingsStyles.headline}>{t('issueTag.settingsTitle')}</Text>
      <View style={[styles.rowContainer, { marginBottom: 10 }]}>
        <Text style={settingsStyles.label}>{t('issueTag.preview')}</Text>
        <IssueKeyTag issueKey='ISSUE-123' />
      </View>
      <View style={[styles.rowContainer, { marginBottom: 10 }]}>
        <Text style={settingsStyles.label}>{t('issueTag.icon.label')}</Text>
        <Select<IssueTagIconOption>
          options={issueTagIconOptions}
          value={settings.issueTagIcon}
          onChange={newState => setSettings(cur => ({ ...cur, issueTagIcon: newState }))}
        />
      </View>
      <View style={styles.rowContainer}>
        <Text style={settingsStyles.label}>{t('issueTag.color.label')}</Text>
        <Select<IssueTagColorOption>
          options={issueTagColorOptions}
          value={settings.issueTagColor}
          onChange={newState => setSettings(cur => ({ ...cur, issueTagColor: newState }))}
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
