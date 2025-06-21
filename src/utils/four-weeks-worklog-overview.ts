import { store } from '../atoms/store';
import { worklogsAtom } from '../atoms/worklog';
import { settingsAtom } from '../atoms/setting';
import { weekDays, DayCode } from '../types/global.types';
import { FourWeeksWorklogOverview, FourWeeksWorklogDayOverview } from '../services/native-event-emitter.service.types';

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
  today.setHours(0, 0, 0, 0);
  const jsToday = today.getDay();
  const jsWeekStart = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'].indexOf(weekDays[0]);
  const daysSinceWeekStart = (jsToday - jsWeekStart + 7) % 7;
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - daysSinceWeekStart - 21);

  const days: FourWeeksWorklogDayOverview[] = [];
  for (let i = 0; i < 28; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const isoDate = date.toISOString().slice(0, 10);
    const trackedSeconds = worklogs.filter(w => w.started === isoDate).reduce((sum, w) => sum + w.timeSpentSeconds, 0);
    // Map JS day to DayCode using weekDays order
    const jsDay = date.getDay();
    const dayCode: DayCode = weekDays[(jsDay - jsWeekStart + 7) % 7];
    const workingDay = workingDaysAndTime[dayCode];
    days.push({
      date: isoDate,
      trackedHours: Math.round((trackedSeconds / 3600) * 100) / 100,
      workingHours: workingDay?.hours ?? 0,
      enabled: !!workingDay?.enabled,
    });
  }
  return { days };
}
