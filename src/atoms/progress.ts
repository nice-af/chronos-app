import { atom } from 'jotai';
import { store } from './store';

export const syncProgressAtom = atom<{ progress: number; total: number } | null>(null);

export function resetProgress() {
  store.set(syncProgressAtom, null);
}

export function addProgress(progress?: number) {
  const currentProgress = store.get(syncProgressAtom);
  if (!currentProgress) {
    return;
  }
  store.set(syncProgressAtom, { ...currentProgress, progress: currentProgress.progress + (progress ?? 1) });
}

export function setTotalProgress(total: number) {
  const currentProgress = store.get(syncProgressAtom);
  store.set(syncProgressAtom, { progress: currentProgress?.progress ?? 0, total });
}
