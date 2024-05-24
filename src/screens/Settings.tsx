import { useAtomValue, useSetAtom } from 'jotai';
import React, { FC } from 'react';
import { ScrollView } from 'react-native';
import { currentOverlayAtom, themeAtom } from '../atoms';
import { Layout } from '../components/Layout';
import { AccountSettings } from '../components/settings/AccountSettings';
import { IssueTagsSettings } from '../components/settings/IssueTagsSettings';
import { LayoutAndThemeSettings } from '../components/settings/LayoutAndThemeSettings';
import { NotificationSettings } from '../components/settings/NotificationSettings';
import { WorkingDaysSetting } from '../components/settings/WorkingDaysSettings';
import { WorklogSettings } from '../components/settings/WorklogSettings';
import { useTranslation } from '../services/i18n.service';
import { useThemedStyles } from '../services/theme.service';
import { createSettingsStyles } from '../styles/settings';

export const Settings: FC = () => {
  const setCurrentOverlay = useSetAtom(currentOverlayAtom);
  const styles = useThemedStyles(createSettingsStyles);
  const theme = useAtomValue(themeAtom);
  const { t } = useTranslation();

  return (
    <Layout
      customBackgroundColor={theme.backgroundDrawer}
      header={{ align: 'left', title: t('settings'), onBackPress: () => setCurrentOverlay(null) }}>
      <ScrollView contentContainerStyle={styles.container}>
        <LayoutAndThemeSettings />
        <IssueTagsSettings />
        <WorkingDaysSetting />
        <WorklogSettings />
        <NotificationSettings />
        <AccountSettings />
      </ScrollView>
    </Layout>
  );
};
