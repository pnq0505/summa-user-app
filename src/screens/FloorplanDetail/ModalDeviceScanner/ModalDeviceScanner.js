import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import SummaButton from '../../../components/SummaButton';
import SummaModal from '../../../components/SummaModal';
import SummaQRScan from '../../../components/SummaQRScan';
import SummaText from '../../../components/SummaText';
import { DRIVER_TYPE_REGEX, MODAL_IDS } from '../../../constants';
import { dWidth } from '../../../utils/Dimentions';

const styles = StyleSheet.create({});

const ModalDeviceScanner = ({ setDriverScanned, activeModalId, hideCurrentModal, showModal }) => {
  const [isInvalidQR, setInvalidQR] = useState(false);
  const isModalQrScanVisible = useMemo(() => {
    return activeModalId == MODAL_IDS.SCAN_DEVICE;
  }, [activeModalId]);

  const setModalQrScanVisible = useCallback(
    (visible) => {
      if (visible) {
        showModal({ modalId: MODAL_IDS.SCAN_DEVICE });
      } else {
        hideCurrentModal();
      }
    },
    [hideCurrentModal, showModal],
  );

  const handleCancel = useCallback(() => {
    setInvalidQR(false);
    hideCurrentModal();
  }, [hideCurrentModal]);

  const onQrScanSuccess = (e) => {
    if (DRIVER_TYPE_REGEX.test(e.data) && typeof e.data === 'string') {
      setDriverScanned(e.data);
      showModal({ modalId: MODAL_IDS.DEVICE_TYPE });
    } else {
      setInvalidQR(true);
    }
  };

  return isModalQrScanVisible ? (
    <SummaModal center isVisible={isModalQrScanVisible} setVisible={setModalQrScanVisible}>
      <View
        style={{
          height: '90%',
          width: dWidth,
          backgroundColor: '#0F172A',
        }}>
        <SummaText large customText={{ marginTop: 10 }}>
          Scan Serial Number
        </SummaText>
        {isInvalidQR ? (
          <View style={{ flex: 1 }}>
            <SummaText error large>
              Invalid serial number
            </SummaText>
            <SummaButton
              onPressHanlder={() => {
                setInvalidQR(false);
              }}
              customStyle={{ marginHorizontal: '5%' }}>
              Retry
            </SummaButton>
          </View>
        ) : (
          <SummaQRScan onScanSuccess={onQrScanSuccess} />
        )}
        <SummaButton
          onPressHanlder={handleCancel}
          customStyle={{
            marginHorizontal: '5%',
            marginVertical: '5%',
          }}>
          Cancel
        </SummaButton>
      </View>
    </SummaModal>
  ) : null;
};

export default ModalDeviceScanner;
