import { intervalToDuration } from 'date-fns';

export function formatSecondsToHMM(timestamp: number): string {
  const duration = intervalToDuration({ start: 0, end: timestamp * 1_000 });
  return `${duration.hours ?? 0}:${(duration.minutes ?? 0).toString().padStart(2, '0')}`;
}

/**
 * Parses a string in the format HH:MM to seconds.
 * @returns The parsed time in seconds or null if the input is invalid.
 */
export function parseHMMToSeconds(input: string): number | null {
  // TODO can we make this smarter, see Harvest parse function of time input
  let seconds = 0;
  try {
    const [hours, minutes] = input.split(':').map(Number);
    seconds = hours * 3600 + minutes * 60;
    if (isNaN(seconds) || seconds < 0) {
      return null;
    }
  } catch (e) {
    console.error(`Error parsing HMM string ${input} to seconds`, e);
    return null;
  }
  return seconds;
}
