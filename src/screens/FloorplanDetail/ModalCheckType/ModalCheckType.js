import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import SummaButton from '../../../components/SummaButton';
import SummaModal from '../../../components/SummaModal';
import SummaText from '../../../components/SummaText';
import { DEVICE_TYPE, MODAL_IDS } from '../../../constants';
import { dWidth } from '../../../utils/Dimentions';
import ShowDriverInfo from './ShowDriverInfo';

const styles = StyleSheet.create({
  swiper: {
    flex: 1,
  },
});

const ModalCheckType = ({
  driverScanned,
  addDeviceByFixtureIdAction,
  writeFixtureFileAction,
  selectedFixture,
  isRescanMode,
  setIsRescanMode,
  handleDeleteAndReplaceDevice,
  selectedDevice,
  setCheckScannedDevices,
  fetchDriverBySerialNumberAction,
  activeModalId,
  showModal,
  hideCurrentModal,
  clearAllModal,
}) => {
  const [checkTypeLoading, setCheckTypeLoading] = useState(false);
  const [isReadySubmit, setReadySubmit] = useState(false);
  const [currentDevice, setCurrentDevice] = useState(null);
  const [driverData, setDriverData] = useState(null);

  const handleAPICheckDriver = useCallback(async () => {
    try {
      if (!driverScanned) {
        return;
      }
      setCheckTypeLoading(true);
      const driver = await fetchDriverBySerialNumberAction(driverScanned);

      const data = driver?.payload?.data;
      let devices = [];
      if (data) {
        // get real devices when query driver succeed
        devices = data.findDriver?.devices || [];
      } else {
        // generate devices when query driver failed
        devices = DEVICE_TYPE.map((type) => {
          return { key: `${driverScanned}:${type.value}` };
        });
      }
      setDriverData(devices);
    } catch (error) {
    } finally {
      setCheckTypeLoading(false);
    }
  }, [driverScanned]);

  useEffect(() => {
    handleAPICheckDriver();
  }, [handleAPICheckDriver]);

  useEffect(() => {
    setDriverData(null);
  }, [driverScanned]);

  const isModalCheckType = useMemo(() => {
    return activeModalId == MODAL_IDS.DEVICE_TYPE;
  }, [activeModalId]);

  const setIsModalCheckType = useCallback(
    (visible) => {
      if (visible) {
        showModal({ modalId: MODAL_IDS.DEVICE_TYPE });
      } else {
        hideCurrentModal();
      }
    },
    [hideCurrentModal, showModal],
  );

  const hanldeSelectedFromDriver = async (deviceKey, isOneDevice = false) => {
    if (isOneDevice) {
      // ADD DEVICE
      await addDeviceByFixtureIdAction(selectedFixture.id, deviceKey);
      // TO FIXTURE ENTITIES
      await writeFixtureFileAction(selectedFixture.id);
      setCheckScannedDevices(true);
      clearAllModal();
      showModal({ modalId: MODAL_IDS.FIXTURE_INFO });
      setDriverData(null);
    } else {
      setCurrentDevice(deviceKey);
      setReadySubmit(true);
    }
  };

  const onHanldeConfirm = async () => {
    if (isReadySubmit) {
      // DONE
      if (isRescanMode) {
        // RESCAN DEVICE
        handleDeleteAndReplaceDevice('replace', selectedDevice, currentDevice);
        setIsRescanMode(false);
      } else {
        // ADD DEVICE
        await addDeviceByFixtureIdAction(selectedFixture.id, currentDevice);
        // TO FIXTURE ENTITIES
        await writeFixtureFileAction(selectedFixture.id);
        setCheckScannedDevices(true);
      }
      clearAllModal();
      showModal({ modalId: MODAL_IDS.FIXTURE_INFO });
      setDriverData(null);
      setReadySubmit(false);
    }
  };

  return isModalCheckType ? (
    <SummaModal bottom isVisible={isModalCheckType} setVisible={setIsModalCheckType}>
      <View
        style={{
          height: 350,
          width: dWidth,
          backgroundColor: '#0F172A',
          borderTopWidth: 3,
          borderTopColor: '#00cec9',
        }}>
        {checkTypeLoading ? (
          <View style={{ justifyContent: 'center', marginTop: 20 }}>
            <ActivityIndicator size="large" color="#fff" />
            <SummaText customText={{ marginVertical: 10, marginHorizontal: 5 }} center={true} large>
              Checking...
            </SummaText>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <View style={styles.swiper}>
              <ShowDriverInfo
                driverData={driverData}
                hanldeSelectedFromDriver={hanldeSelectedFromDriver}
              />
            </View>
            <SummaButton
              disabled={isReadySubmit ? false : true}
              onPressHanlder={onHanldeConfirm}
              customStyle={{ marginHorizontal: '5%', marginVertical: 15 }}>
              Confirm
            </SummaButton>
          </View>
        )}
      </View>
    </SummaModal>
  ) : null;
};

export default ModalCheckType;
