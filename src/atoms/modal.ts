import { atom } from 'jotai';

export type ModalData = {
  icon?: 'timer-warning';
  headline: string;
  text: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const modalDataAtom = atom<ModalData | null>(null);
export const modalVisibleAtom = atom(false);
