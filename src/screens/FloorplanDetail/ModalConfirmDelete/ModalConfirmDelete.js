import React, { useCallback, useMemo } from 'react';
import SummaModalConfirm from '../../../components/SummaModalConfirm';

import { MODAL_IDS } from '../../../constants';

const ModalConfirmDelete = ({
  activeModalId,
  hideCurrentModal,
  showModal,
  handleDeleteAndReplaceDevice,
  selectedDevice,
}) => {
  const isVisible = useMemo(() => {
    return activeModalId == MODAL_IDS.DELETE_DEVICE;
  }, [activeModalId]);

  const setVisible = useCallback(
    (visible) => {
      if (visible) {
        showModal({ modalId: MODAL_IDS.DELETE_DEVICE });
      } else {
        hideCurrentModal();
      }
    },
    [hideCurrentModal, showModal],
  );

  const handleCancel = useCallback(() => {
    hideCurrentModal();
  }, [hideCurrentModal]);

  const handleDelete = useCallback(() => {
    handleDeleteAndReplaceDevice('delete', selectedDevice);
    hideCurrentModal();
  }, [hideCurrentModal, handleDeleteAndReplaceDevice, selectedDevice]);

  return isVisible ? (
    <SummaModalConfirm
      message={'Are you sure you want to remove this device?'}
      isVisible={isVisible}
      setVisible={setVisible}
      handleCancel={handleCancel}
      handleConfirm={handleDelete}
    />
  ) : null;
};

export default ModalConfirmDelete;
