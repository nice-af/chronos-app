import { useSetAtom } from 'jotai';
import { ModalData, modalDataAtom, modalVisibleAtom } from '../atoms/modal';
import { addNativeEventListener, removeNativeEventListener } from './native-event-emitter.service';
import { NativeEvent } from './native-event-emitter.service.types';

export function useModal() {
  const setModalVisible = useSetAtom(modalVisibleAtom);
  const setModalData = useSetAtom(modalDataAtom);

  function getModalConfirmation(modalData: Omit<ModalData, 'onCancel' | 'onConfirm'>): Promise<boolean> {
    return new Promise(resolve => {
      setModalVisible(true);
      addNativeEventListener({
        name: NativeEvent.CLOSE_MODAL,
        callback: () => {
          setModalVisible(false);
          resolve(false);
          removeNativeEventListener({ name: NativeEvent.CLOSE_MODAL });
        },
      });
      setModalData({
        ...modalData,
        onConfirm: () => {
          setModalVisible(false);
          resolve(true);
        },
        onCancel: () => {
          setModalVisible(false);
          resolve(false);
        },
      });
    });
  }

  return {
    getModalConfirmation,
  };
}
