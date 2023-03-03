import React from 'react';
import { StyleSheet, View } from 'react-native';
import SummaButton from '../SummaButton';
import SummaModal from '../SummaModal';
import SummaText from '../SummaText';

const styles = StyleSheet.create({
  modalStyle: {
    height: 150,
    width: 350,
    backgroundColor: '#0F172A',
    borderTopWidth: 3,
    borderTopColor: '#00cec9',
    paddingHorizontal: '1%',
    justifyContent: 'space-between',
    borderRadius: 8,
  },
});

const SummaModalConfirm = ({ message, isVisible, setVisible, handleCancel, handleConfirm }) => {
  return (
    <SummaModal center isVisible={isVisible} setVisible={setVisible}>
      <View style={styles.modalStyle}>
        <SummaText customText={{ marginVertical: 10, marginHorizontal: 5 }} center={true} large>
          {message}
        </SummaText>
        <View style={{ flexDirection: 'row', marginVertical: 10 }}>
          <SummaButton onPressHanlder={handleCancel}>No</SummaButton>
          <SummaButton onPressHanlder={handleConfirm}>Yes</SummaButton>
        </View>
      </View>
    </SummaModal>
  );
};

export default SummaModalConfirm;
