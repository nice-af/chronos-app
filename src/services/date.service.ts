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
export const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = `${date.getUTCMonth() + 1}`.padStart(2, '0');
  const day = `${date.getUTCDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function formatUnixTimestampToHHMM(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  return `${hours}:${minutes}`;
}
