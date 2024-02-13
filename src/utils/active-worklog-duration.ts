import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { activeWorklogTrackingStartedAtom } from '../atoms';

/**
 * Hook to calculate the duration of the active worklog.
 * This "ticks" every 10 seconds to update the duration.
 *
 * @returns The duration of the active worklog in seconds
 */
export function useActiveWorklogDuration() {
  const activeWorklogTrackingStarted = useAtomValue(activeWorklogTrackingStartedAtom);
  const getCurrentDuration = () =>
    activeWorklogTrackingStarted ? Math.floor((Date.now() - activeWorklogTrackingStarted) / 1000) : 0;
  const [duration, setDuration] = useState(getCurrentDuration());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDuration(getCurrentDuration());
    }, 10_000);

    return () => {
      clearInterval(intervalId);
    };
  }, [activeWorklogTrackingStarted]);

  return duration;
}
