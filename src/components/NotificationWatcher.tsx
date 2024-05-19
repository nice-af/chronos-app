import { useAtomValue } from 'jotai';
import ms from 'ms';
import { FC, useEffect } from 'react';
import { settingsAtom, store, worklogsAtom } from '../atoms';
import { useTranslation } from '../services/i18n.service';
import { sendNativeEvent } from '../services/native-event-emitter.service';
import { NativeEvent } from '../services/native-event-emitter.service.types';
import { DayId, WorklogState } from '../types/global.types';

export const NotificationWatcher: FC = () => {
  const { enableTrackingReminder, trackingReminderTime, workingDays } = useAtomValue(settingsAtom);
  const { t } = useTranslation();

  useEffect(() => {
    if (!enableTrackingReminder) {
      return;
    }

    const intervalId = setInterval(() => {
      const now = new Date();
      if (
        enableTrackingReminder &&
        // The first day of the week is Sunday with getDay but Monday with the DayId enum
        workingDays.includes(((now.getDay() + 6) % 7) as DayId) &&
        now.getHours() === trackingReminderTime.hour &&
        now.getMinutes() === trackingReminderTime.minute
      ) {
        const worklogs = store.get(worklogsAtom);
        const hasPublishedWorklogs = worklogs.some(
          worklog => worklog.state === WorklogState.LOCAL || worklog.state === WorklogState.EDITED
        );
        if (worklogs.length === 0) {
          sendNativeEvent({
            name: NativeEvent.SEND_NOTIFICATION,
            data: JSON.stringify({
              title: t('notifications.trackingReminderHeadline'),
              message: t('notifications.trackingReminderNoTimesText'),
            }),
          });
        } else if (hasPublishedWorklogs) {
          sendNativeEvent({
            name: NativeEvent.SEND_NOTIFICATION,
            data: JSON.stringify({
              title: t('notifications.trackingReminderHeadline'),
              message: t('notifications.trackingReminderUnpublishedTimesText'),
            }),
          });
        }
      }
    }, ms('1m'));

    return () => clearInterval(intervalId);
  }, [enableTrackingReminder, trackingReminderTime, workingDays]);

  return null;
};
