import { atom } from 'jotai';
import { store } from './store';

export type SyncProgressAtom = { progress: number; total: number } | null;
export const syncProgressAtom = atom<SyncProgressAtom>(null);

export function resetProgress() {
  store.set(syncProgressAtom, null);
}

export function addProgress(progress?: number) {
  store.set(syncProgressAtom, currentProgress =>
    currentProgress === null ? null : { ...currentProgress, progress: currentProgress.progress + (progress ?? 1) }
  );
}

export function setTotalProgress(total: number) {
  store.set(syncProgressAtom, currentProgress => ({ progress: currentProgress?.progress ?? 0, total }));
}
