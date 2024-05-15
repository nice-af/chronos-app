import { useSetAtom } from 'jotai';
import { ModalData, modalDataAtom, modalVisibleAtom } from '../atoms/modal';

export function useModal() {
  const setModalVisible = useSetAtom(modalVisibleAtom);
  const setModalData = useSetAtom(modalDataAtom);

  function getModalConfirmation(modalData: Omit<ModalData, 'onCancel' | 'onConfirm'>): Promise<boolean> {
    return new Promise(resolve => {
      setModalVisible(true);
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
