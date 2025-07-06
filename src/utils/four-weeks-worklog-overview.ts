import { addDays, subDays } from 'date-fns';
import { settingsAtom } from '../atoms/setting';
import { store } from '../atoms/store';
import { worklogsAtom } from '../atoms/worklog';
import { sendNativeEvent } from '../services/native-event-emitter.service';
import {
  FourWeeksWorklogDayOverview,
  FourWeeksWorklogOverview,
  NativeEvent,
} from '../services/native-event-emitter.service.types';
import { DayCode, weekDays } from '../types/global.types';

/**
 * Returns 4 weeks worklog overview data for the last 4 weeks (28 days), oldest to newest.
 * Each day contains: date (YYYY-MM-DD), trackedHours, workingHours, enabled.
 */
export function get4WeeksWorklogOverview(): FourWeeksWorklogOverview {
  const settings = store.get(settingsAtom);
  const worklogs = store.get(worklogsAtom);
  const workingDaysAndTime = settings.workingDaysAndTime;

  // Calculate the start date for 4 full weeks (28 days), starting from the week's first day
  const today = new Date();
  const todayDayId = today.getDay() - 1; // We use -1 to set monday as the first day of the week
  const startDate = subDays(today, todayDayId + 21); // Go back 3 weeks from the start of the current week

  const days: FourWeeksWorklogDayOverview[] = [];
  for (let i = 0; i < 28; i++) {
    const date = addDays(startDate, i);
    const isoDate = date.toISOString().slice(0, 10);
    const trackedSeconds = worklogs.filter(w => w.started === isoDate).reduce((sum, w) => sum + w.timeSpentSeconds, 0);
    const dayCode: DayCode = weekDays[i % 7];
    const workingDay = workingDaysAndTime[dayCode];
    days.push({
      date: isoDate,
      trackedHours: Math.round((trackedSeconds / 3600) * 100) / 100,
      workingHours: workingDay?.hours ?? 0,
      enabled: !!workingDay?.enabled,
    });
  }
  console.log(JSON.stringify(days, null, 2));
  return { days };
}

export function send4WeeksWorklogOverview() {
  const data = get4WeeksWorklogOverview();
  sendNativeEvent({ name: NativeEvent.NEW_4_WEEKS_WORKLOG_OVERVIEW, data });
}
