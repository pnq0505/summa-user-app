import React from 'react';
import { StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

const styles = StyleSheet.create({
  modalStyle: {
    margin: 0,
  },
  centerPosition: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomPosition: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

const SummaModal = ({ children, isVisible, setVisible, center, bottom, customModalStyle }) => {
  const position = [center && styles.centerPosition, bottom && styles.bottomPosition];

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={() => setVisible(false)}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      style={[styles.modalStyle, customModalStyle, [...position]]}>
      {children}
    </Modal>
  );
};

export default SummaModal;
