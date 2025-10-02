import { Platform } from 'react-native';

export function isTahoeOrGreater(): boolean {
  if (Platform.OS !== 'macos') {
    return false;
  }
  const majorVersion = parseInt(Platform.Version, 10);
  return !isNaN(majorVersion) && majorVersion > 15;
}
