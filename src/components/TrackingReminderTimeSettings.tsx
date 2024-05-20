import { useAtom, useAtomValue } from 'jotai';
import React, { FC, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { currentOverlayAtom, settingsAtom } from '../atoms';
import { Overlay } from '../const';
import { useTranslation } from '../services/i18n.service';
import { useThemedStyles } from '../services/theme.service';
import { Theme } from '../styles/theme/theme-types';
import { CustomTextInput } from './CustomTextInput';
import { typo } from '../styles/typo';

export interface TrackingReminderTimeSettingsProps {}

export const TrackingReminderTimeSettings: FC<TrackingReminderTimeSettingsProps> = () => {
  const styles = useThemedStyles(createStyles);
  const [settings, setSettings] = useAtom(settingsAtom);
  const [reminderHour, setReminderHour] = useState(
    (settings.trackingReminderTime.hour ?? 18).toString().padStart(2, '0')
  );
  const [reminderMinute, setReminderMinute] = useState(
    (settings.trackingReminderTime.minute ?? 30).toString().padStart(2, '0')
  );
  const currentOverlay = useAtomValue(currentOverlayAtom);
  const { t } = useTranslation();

  function saveHoursAndMinutes() {
    const newHour = Math.min(Math.max(parseInt(reminderHour === '' ? '0' : reminderHour), 0), 23);
    const newMinute = Math.min(Math.max(parseInt(reminderMinute === '' ? '0' : reminderMinute), 0), 59);
    setSettings(cur => ({
      ...cur,
      trackingReminderTime: { hour: newHour, minute: newMinute },
    }));
    setReminderHour(newHour.toString().padStart(2, '0'));
    setReminderMinute(newMinute.toString().padStart(2, '0'));
  }

  function cleanInputString(value: string, format: 'h' | 'm'): string {
    value = value.replace(/\D/g, '').substring(0, 2);
    const intValue = parseInt(value);
    const maxValue = format === 'h' ? 23 : 59;
    if (intValue > maxValue) {
      return maxValue.toString();
    }
    return value;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t('notifications.trackingReminderTime')}</Text>
      <View style={styles.inputsContainer}>
        <CustomTextInput
          isVisible={!!currentOverlay && currentOverlay.includes(Overlay.SETTINGS)}
          value={reminderHour}
          onChangeText={newText => setReminderHour(cleanInputString(newText, 'h'))}
          maxLength={2}
          onBlur={saveHoursAndMinutes}
          style={styles.timeInput}
        />
        <Text>:</Text>
        <CustomTextInput
          isVisible={!!currentOverlay && currentOverlay.includes(Overlay.SETTINGS)}
          value={reminderMinute}
          onChangeText={newText => setReminderMinute(cleanInputString(newText, 'm'))}
          maxLength={2}
          onBlur={saveHoursAndMinutes}
          style={styles.timeInput}
        />
      </View>
    </View>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 16,
    },
    text: {
      ...typo.body,
    },
    inputsContainer: {
      display: 'flex',
      flexDirection: 'row',
      gap: 2,
      alignItems: 'center',
    },
    timeInput: {
      width: 46,
      height: 36,
      fontSize: 16,
      lineHeight: 16,
      paddingLeft: 0,
      paddingRight: 0,
      textAlign: 'center',
      verticalAlign: 'middle',
    },
  });
}
