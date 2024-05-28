import { atom } from 'jotai';

export type ModalData = {
  icon?: 'timer-warning' | 'account-warning' | 'recover-worklogs';
  headline: string;
  text: string;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const modalDataAtom = atom<ModalData | null>(null);
export const modalVisibleAtom = atom(false);
