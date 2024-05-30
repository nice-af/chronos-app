import { atom } from 'jotai';
import { CloudId } from '../types/accounts.types';
import { JiraResource } from '../types/jira.types';

export type ModalConfirmationData = {
  icon?: 'timer-warning' | 'account-warning' | 'recover-worklogs';
  headline: string;
  text: string;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const modalConfirmationDataAtom = atom<ModalConfirmationData | null>(null);
export const modalConfirmationVisibleAtom = atom(false);

export type ModalAccountSelectionData = {
  jiraResources: JiraResource[];
  onConfirm: (cloudId: CloudId) => void;
  onCancel: () => void;
};

export const modalAccountSelectionDataAtom = atom<ModalAccountSelectionData | null>(null);
export const modalAccountSelectionVisibleAtom = atom(false);
