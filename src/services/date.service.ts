import { format } from 'date-fns';
import ms from 'ms';

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
export function formatDateToYYYYMMDD(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Converts a date from the YYYY-MM-DD format used in the worklogs object to a Date object.
 */
export function parseDateFromYYYYMMDD(date: string): Date {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Formats a date to the Jira format used in the worklogs object.
 * It also sets the time to 9:00 AM to prevent basic timezone issues.
 */
export function formatDateToJiraFormat(date: Date): string {
  const copy = new Date(date);
  copy.setHours(9);
  return copy.toISOString().replace('Z', '+0000');
}
