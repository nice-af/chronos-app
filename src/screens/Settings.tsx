import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import React, { FC, useEffect, useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { currentOverlayAtom, jiraAuthAtom, logoutAtom, settingsAtom, themeAtom, userInfoAtom } from '../atoms';
import { ButtonDanger } from '../components/ButtonDanger';
import { CardsSelectionButton } from '../components/CardsSelectionButton';
import { Layout } from '../components/Layout';
import { Toggle } from '../components/Toggle';
import { TrackingReminderTimeSettings } from '../components/TrackingReminderTimeSettings';
import { WorkingDaysSetting } from '../components/WorkingDaysSetting';
import { SidebarLayout } from '../const';
import { useTranslation } from '../services/i18n.service';
import {
  addNativeEventListener,
  removeNativeEventListener,
  sendNativeEvent,
} from '../services/native-event-emitter.service';
import { NativeEvent } from '../services/native-event-emitter.service.types';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { typo } from '../styles/typo';
import ms from 'ms';

export const Settings: FC = () => {
  const logout = useSetAtom(logoutAtom);
  const [settings, setSettings] = useAtom(settingsAtom);
  const userInfo = useAtomValue(userInfoAtom);
  const workspaceName = useAtomValue(jiraAuthAtom)?.workspaceName;
  const avatarUrl = userInfo?.avatarUrls?.['48x48'];
  const [hasNotificationPermission, setHasNotificationPermission] = useState(true);
  const setCurrentOverlay = useSetAtom(currentOverlayAtom);
  const styles = useThemedStyles(createStyles);
  const theme = useAtomValue(themeAtom);
  const { t } = useTranslation();

  useEffect(() => {
    if (Platform.OS === 'macos' && settings.enableTrackingReminder) {
      addNativeEventListener({
        name: NativeEvent.CHECK_NOTIFICATION_PERMISSION,
        callback: data => setHasNotificationPermission(data === 'granted'),
      });
      sendNativeEvent({ name: NativeEvent.REQUEST_NOTIFICATION_PERMISSION, data: '' });

      // Check frequently if the user has missing permissions
      if (!hasNotificationPermission) {
        const intervalId = setInterval(() => {
          sendNativeEvent({ name: NativeEvent.REQUEST_NOTIFICATION_PERMISSION, data: '' });
        }, ms('3s'));
        return () => {
          clearInterval(intervalId);
          removeNativeEventListener({ name: NativeEvent.CHECK_NOTIFICATION_PERMISSION });
        };
      }

      return () => removeNativeEventListener({ name: NativeEvent.CHECK_NOTIFICATION_PERMISSION });
    }
  }, [settings.enableTrackingReminder, hasNotificationPermission]);

  return (
    <Layout
      customBackgroundColor={theme.backgroundDrawer}
      header={{ align: 'left', title: t('settings'), onBackPress: () => setCurrentOverlay(null) }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.headline}>{t('sidebarLayout.settingsTitle')}</Text>
          <View style={styles.cardsButtonContainer}>
            <CardsSelectionButton
              isChecked={settings.sidebarLayout === 'normal'}
              onClick={() => setSettings(cur => ({ ...cur, sidebarLayout: SidebarLayout.NORMAL }))}
              image={
                theme.type === 'light'
                  ? require('../assets/settings/layout-normal-light.png')
                  : require('../assets/settings/layout-normal-dark.png')
              }
              label={t('sidebarLayout.normal')}
            />
            <CardsSelectionButton
              isChecked={settings.sidebarLayout === 'compact'}
              onClick={() => setSettings(cur => ({ ...cur, sidebarLayout: SidebarLayout.COMPACT }))}
              image={
                theme.type === 'light'
                  ? require('../assets/settings/layout-compact-light.png')
                  : require('../assets/settings/layout-compact-dark.png')
              }
              label={t('sidebarLayout.compact')}
            />
            <CardsSelectionButton
              isChecked={settings.sidebarLayout === 'micro'}
              onClick={() => setSettings(cur => ({ ...cur, sidebarLayout: SidebarLayout.MICRO }))}
              image={
                theme.type === 'light'
                  ? require('../assets/settings/layout-micro-light.png')
                  : require('../assets/settings/layout-micro-dark.png')
              }
              label={t('sidebarLayout.micro')}
            />
          </View>
          <View style={styles.hr} />
          <Text style={styles.headline}>{t('weekDays.settingsTitle')}</Text>
          <WorkingDaysSetting />
          <View style={styles.hr} />
          <Toggle
            label={t('weekDays.hideNonWorkingDays')}
            state={settings.hideNonWorkingDays}
            setState={newState => setSettings(cur => ({ ...cur, hideNonWorkingDays: newState }))}
          />
        </View>
        <View style={styles.card}>
          <Text style={styles.headline}>{t('worklogs.settingsTitle')}</Text>
          <Toggle
            label={t('worklogs.warningWhenEditingOtherDays')}
            state={settings.warningWhenEditingOtherDays}
            setState={newState => setSettings(cur => ({ ...cur, warningWhenEditingOtherDays: newState }))}
          />
        </View>
        <View style={styles.card}>
          <Text style={styles.headline}>{t('notifications.settingsTitle')}</Text>
          <Toggle
            label={t('notifications.enableTrackingReminder')}
            state={settings.enableTrackingReminder}
            setState={newState => setSettings(cur => ({ ...cur, enableTrackingReminder: newState }))}
          />
          {settings.enableTrackingReminder && <TrackingReminderTimeSettings />}
          {settings.enableTrackingReminder && !hasNotificationPermission && (
            <View style={styles.errorMessageContainer}>
              <Text style={styles.errorMessageText}>{t('notifications.noPermission')}</Text>
            </View>
          )}
        </View>
        <View style={styles.card}>
          <Text style={styles.headline}>{t('account.settingsTitle')}</Text>
          <View style={styles.accountContainer}>
            <Image source={{ uri: avatarUrl, width: 48, height: 48 }} style={styles.avatar} />
            <View style={styles.accountInfo}>
              <Text numberOfLines={1} lineBreakMode='clip' style={styles.username}>
                {userInfo?.displayName}
              </Text>
              {workspaceName && (
                <Text numberOfLines={1} lineBreakMode='clip' style={styles.workspaceName}>
                  {workspaceName}
                </Text>
              )}
            </View>
            <ButtonDanger label={t('account.logOut')} onPress={logout} />
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      padding: 16,
      gap: 16,
      ...Platform.select({
        windows: {
          paddingTop: 8,
        },
      }),
    },
    card: {
      position: 'relative',
      padding: 10,
      backgroundColor: theme.surface,
      borderColor: theme.surfaceBorder,
      borderWidth: 1,
      borderRadius: 6,
    },
    headline: {
      ...typo.headline,
      color: theme.textPrimary,
      marginBottom: 12,
    },
    cardsButtonContainer: {
      display: 'flex',
      gap: 10,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    hr: {
      width: '100%',
      height: 1,
      backgroundColor: theme.surfaceBorder,
      marginVertical: 12,
    },
    errorMessageContainer: {
      backgroundColor: theme.redTransparent,
      marginTop: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: theme.red,
      borderRadius: 6,
    },
    errorMessageText: {
      ...typo.callout,
      color: theme.textPrimary,
    },
    accountContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 10,
      width: '100%',
    },
    accountInfo: {
      flexBasis: '100%',
      flexShrink: 1,
    },
    username: {
      ...typo.calloutEmphasized,
      color: theme.textPrimary,
    },
    workspaceName: {
      ...typo.callout,
      color: theme.textSecondary,
    },
    avatar: {
      width: 24,
      height: 24,
      borderRadius: 12,
    },
  });
}
