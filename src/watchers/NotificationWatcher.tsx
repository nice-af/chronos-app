import { useAtomValue } from 'jotai';
import ms from 'ms';
import { FC, useEffect } from 'react';
import { settingsAtom, store, worklogsAtom } from '../atoms';
import { useTranslation } from '../services/i18n.service';
import { sendNativeEvent } from '../services/native-event-emitter.service';
import { NativeEvent } from '../services/native-event-emitter.service.types';
import { DayCode, weekDays, WorklogState } from '../types/global.types';

export const NotificationWatcher: FC = () => {
  const { enableTrackingReminder, trackingReminderTime, workingDaysAndTime } = useAtomValue(settingsAtom);
  const { t } = useTranslation();

  useEffect(() => {
    if (!enableTrackingReminder) {
      return;
    }

    const intervalId = setInterval(() => {
      const now = new Date();
      // Convert Date.getDay() (0=Sunday) to DayCode index (0=Monday)
      const dayIndex = (now.getDay() + 6) % 7;
      const dayCode: DayCode = weekDays[dayIndex];

      if (
        enableTrackingReminder &&
        workingDaysAndTime[dayCode]?.enabled &&
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
            data: {
              title: t('notifications.trackingReminderHeadline'),
              message: t('notifications.trackingReminderNoTimesText'),
            },
          });
        } else if (hasPublishedWorklogs) {
          sendNativeEvent({
            name: NativeEvent.SEND_NOTIFICATION,
            data: {
              title: t('notifications.trackingReminderHeadline'),
              message: t('notifications.trackingReminderUnpublishedTimesText'),
            },
          });
        }
      }
    }, ms('1m'));

    return () => clearInterval(intervalId);
  }, [enableTrackingReminder, trackingReminderTime, workingDaysAndTime]);

  return null;
};
