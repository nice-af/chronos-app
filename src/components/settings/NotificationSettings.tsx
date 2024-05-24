import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import ms from 'ms';
import React, { FC, useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { jiraAuthAtom, logoutAtom, settingsAtom, userInfoAtom } from '../../atoms';
import { useTranslation } from '../../services/i18n.service';
import {
  addNativeEventListener,
  removeNativeEventListener,
  sendNativeEvent,
} from '../../services/native-event-emitter.service';
import { NativeEvent } from '../../services/native-event-emitter.service.types';
import { useThemedStyles } from '../../services/theme.service';
import { createSettingsStyles } from '../../styles/settings';
import { Theme } from '../../styles/theme/theme-types';
import { typo } from '../../styles/typo';
import { Toggle } from '../Toggle';
import { TrackingReminderTimeSettings } from '../TrackingReminderTimeSettings';

export const NotificationSettings: FC = () => {
  const [settings, setSettings] = useAtom(settingsAtom);
  const styles = useThemedStyles(createStyles);
  const settingsStyles = useThemedStyles(createSettingsStyles);
  const { t } = useTranslation();
  const [hasNotificationPermission, setHasNotificationPermission] = useState(true);

  useEffect(() => {
    if (Platform.OS === 'macos' && settings.enableTrackingReminder) {
      addNativeEventListener({
        name: NativeEvent.CHECK_NOTIFICATION_PERMISSION,
        callback: data => setHasNotificationPermission(data === 'granted'),
      });
      sendNativeEvent({ name: NativeEvent.REQUEST_NOTIFICATION_PERMISSION, data: null });

      // Check frequently if the user has missing permissions
      if (!hasNotificationPermission) {
        const intervalId = setInterval(() => {
          sendNativeEvent({ name: NativeEvent.REQUEST_NOTIFICATION_PERMISSION, data: null });
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
    <View style={settingsStyles.card}>
      <Text style={settingsStyles.headline}>{t('notifications.settingsTitle')}</Text>
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
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
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
  });
}
