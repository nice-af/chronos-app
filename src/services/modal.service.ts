import { store } from '../atoms';
import {
  ModalAccountSelectionData,
  ModalConfirmationData,
  modalAccountSelectionDataAtom,
  modalAccountSelectionVisibleAtom,
  modalConfirmationDataAtom,
  modalConfirmationVisibleAtom,
} from '../atoms/modals';
import { CloudId } from '../types/accounts.types';
import { addNativeEventListener, removeNativeEventListener } from './native-event-emitter.service';
import { NativeEvent } from './native-event-emitter.service.types';

export function getModalConfirmation(
  modalData: Omit<ModalConfirmationData, 'onCancel' | 'onConfirm'>
): Promise<boolean> {
  return new Promise(resolve => {
    store.set(modalConfirmationVisibleAtom, true);
    addNativeEventListener({
      name: NativeEvent.CLOSE_MODAL,
      callback: () => {
        store.set(modalConfirmationVisibleAtom, false);
        resolve(false);
        removeNativeEventListener({ name: NativeEvent.CLOSE_MODAL });
      },
    });
    store.set(modalConfirmationDataAtom, {
      ...modalData,
      onConfirm: () => {
        store.set(modalConfirmationVisibleAtom, false);
        resolve(true);
      },
      onCancel: () => {
        store.set(modalConfirmationVisibleAtom, false);
        resolve(false);
      },
    });
  });
}

export function getModalAccountSelection(
  modalData: Omit<ModalAccountSelectionData, 'onCancel' | 'onConfirm'>
): Promise<CloudId | null> {
  return new Promise(resolve => {
    store.set(modalAccountSelectionVisibleAtom, true);
    addNativeEventListener({
      name: NativeEvent.CLOSE_MODAL,
      callback: () => {
        store.set(modalAccountSelectionVisibleAtom, false);
        resolve(null);
        removeNativeEventListener({ name: NativeEvent.CLOSE_MODAL });
      },
    });
    store.set(modalAccountSelectionDataAtom, {
      ...modalData,
      onCancel: () => {
        store.set(modalAccountSelectionVisibleAtom, false);
        resolve(null);
      },
      onConfirm: cloudId => {
        store.set(modalAccountSelectionVisibleAtom, false);
        resolve(cloudId);
      },
    });
  });
}
