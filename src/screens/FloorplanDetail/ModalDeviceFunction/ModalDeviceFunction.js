import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import SummaButton from '../../../components/SummaButton';
import SummaModal from '../../../components/SummaModal';
import SummaText from '../../../components/SummaText';
import { dWidth } from '../../../utils/Dimentions';
import ScannedDeviceList from './ScannedDeviceList';

import { MODAL_IDS } from '../../../constants';

const styles = StyleSheet.create({});

const ModalDeviceFunction = ({
  activeModalId,
  showModal,
  hideCurrentModal,
  setSelectedDevice,
  devices,
  selectedFixture,
  setIsRescanMode,
  selectedMesh,
  onToggleMove,
  setDriverScanned,
}) => {
  const [val, setVal] = useState(false);

  const isVisible = useMemo(() => {
    return activeModalId == MODAL_IDS.FIXTURE_INFO;
  }, [activeModalId]);

  const moveable = useMemo(() => {
    return selectedMesh[0].moveable || false;
  }, [selectedMesh]);

  const toggleMove = useCallback(
    (v) => {
      onToggleMove(v, selectedMesh[0]);
    },
    [selectedMesh],
  );

  useEffect(() => {
    if (isVisible) {
      setDriverScanned(null);
    }
  }, [isVisible]);

  const onAddDevice = useCallback(() => {
    showModal({ modalId: MODAL_IDS.SCAN_DEVICE });
  }, [showModal]);

  const setVisible = useCallback(
    (visible) => {
      if (visible) {
        showModal({ modalId: MODAL_IDS.FIXTURE_INFO });
      } else {
        hideCurrentModal();
      }
    },
    [hideCurrentModal, showModal],
  );

  return isVisible ? (
    <SummaModal bottom isVisible={isVisible} setVisible={setVisible}>
      <View
        style={{
          height: 350,
          width: dWidth,
          backgroundColor: '#0F172A',
          borderTopWidth: 3,
          borderTopColor: '#00cec9',
        }}>
        <View style={{ flexDirection: 'row' }}>
          <SummaText
            customText={{
              marginVertical: 10,
              marginHorizontal: 5,
              flex: 3,
            }}
            textAlign={'left'}
            large
            numberOfLines={1}
            ellipsizeMode={'middle'}>
            {selectedFixture?.id}
          </SummaText>
          <View
            style={{
              marginVertical: 10,
              marginHorizontal: 5,
              flex: 2,
              flexDirection: 'row',
            }}>
            <SummaText
              customText={{
                textAlign: 'right',
                marginHorizontal: 5,
              }}
              textAlign={'left'}
              large>
              Moveable{' '}
            </SummaText>
            <Switch
              value={moveable}
              onValueChange={toggleMove}
              ios_backgroundColor={true}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
            />
          </View>
        </View>

        {/* SHOW SCANNED DEVICES */}
        <ScannedDeviceList
          devices={devices}
          setSelectedDevice={setSelectedDevice}
          showModal={showModal}
          setIsRescanMode={setIsRescanMode}
        />

        <SummaButton
          onPressHanlder={onAddDevice}
          customStyle={{ marginHorizontal: '5%', marginVertical: 15 }}>
          Add device
        </SummaButton>
      </View>
    </SummaModal>
  ) : null;
};

export default ModalDeviceFunction;
