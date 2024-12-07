import { intervalToDuration } from 'date-fns';
import parseDuration from 'parse-duration';

export function formatSecondsToHMM(timestamp: number): string {
  const duration = intervalToDuration({ start: 0, end: timestamp * 1_000 });
  return `${(duration.days ?? 0) * 24 + (duration.hours ?? 0)}:${(duration.minutes ?? 0).toString().padStart(2, '0')}`;
}

/**
 * Parses a string in various formats HH:MM to seconds.
 * @returns The parsed time in seconds. Defaults to 0 if the input is invalid.
 */
export function parseDurationStringToSeconds(input: string): number {
  // Change days to hours
  if (input.toLowerCase().includes('d')) {
    input = input.replace(/([0-9,.]+)d/, days => `${parseFloat(days.replace('d', '').replace(',', '.')) * 8}h`);
  }

  // Convert HH:MM to HHh MMm
  if (input.includes(':')) {
    const [hours, minutes] = input.split(':').map(Number);
    input = `${hours}h ${minutes}m`;
  }

  // Convert 1.5h and 1,5h to 1h 30m
  if (input.includes('.') || input.includes(',')) {
    const [hours, minutesDecimal] = input.split(/[,.]/).map(Number);
    const minutes = Math.round((minutesDecimal / 10) * 60);
    input = `${hours}h ${minutes}m`;
  }

  // Convert single number to hourse e.g. 1 to 1h
  if ((input.length === 1 || input.length === 2) && !isNaN(Number(input))) {
    input = `${input}h`;
  }

  const result = parseDuration(input);

  // We need to divide by 1000 because parseDuration returns milliseconds
  return result ? Math.round(result / 1000) : 0;
}
