export function durationToString(duration: number): string {
  const hours = Math.floor(duration);
  const minutes = Math.floor((duration - hours) * 60);
  return `${hours}:${minutes.toString().padStart(2, '0')}`;
}
