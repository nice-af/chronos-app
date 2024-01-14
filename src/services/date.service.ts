import ms from 'ms';
import { intervalToDuration } from 'date-fns';

/**
 * Returns the day of the week from Monday (0) to Sunday (6) for the given date.
 */
export function getWeekday(date: Date): number {
  return date.getDay() === 0 ? 6 : date.getDay() - 1;
}

/**
 * Sets the date to the given weekday of the current week from Monday (0) to Sunday (6).
 */
export function setDateToThisWeekday(date: Date, weekday: number): Date {
  const currentDay = getWeekday(date);
  const dayOffset = weekday - currentDay;
  return new Date(date.getTime() + ms(`${dayOffset}d`));
}

/**
 * Converts a date to the YYYY-MM-DD format used in the worklogs object.
 */
export const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = `${date.getUTCMonth() + 1}`.padStart(2, '0');
  const day = `${date.getUTCDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function formatUnixTimestampToHMM(timestamp: number): string {
  const duration = intervalToDuration({ start: 0, end: timestamp });
  return `${duration.hours ?? 0}:${(duration.minutes ?? 0).toString().padStart(2, '0')}`;
}
