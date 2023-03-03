import { Swap, Trash } from 'phosphor-react-native';
import React, { useCallback } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

import SummaText from '../../../components/SummaText';
import { COLORS } from '../../../theme';
import { checkDeviceType } from '../../../utils/CheckDeviceType';

import { MODAL_IDS } from '../../../constants';

const styles = StyleSheet.create({
  tableContainer: {},
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemBtn: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    padding: 3,
  },
  flex: {
    flex: 1,
  },
  deviceActionContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    flex: 1,
    justifyContent: 'center',
  },
});

const Item = ({ device, setSelectedDevice, showModal, setIsRescanMode }) => {
  const handleRescan = useCallback(() => {
    setSelectedDevice(device);
    setIsRescanMode(true);
    showModal({ modalId: MODAL_IDS.SCAN_DEVICE });
  }, [device, setSelectedDevice, showModal]);

  const handleDelete = useCallback(() => {
    setSelectedDevice(device);
    showModal({ modalId: MODAL_IDS.DELETE_DEVICE });
  }, [device, setSelectedDevice, showModal]);

  return (
    <View style={styles.itemContainer}>
      <View style={{ flex: 2, paddingLeft: 5 }}>
        <SummaText textAlign={'left'} numberOfLines={1}>
          {device}
        </SummaText>
      </View>
      <View style={styles.flex}>
        <SummaText>{checkDeviceType(device)}</SummaText>
      </View>
      <View style={styles.deviceActionContainer}>
        <TouchableOpacity style={styles.itemBtn} onPress={handleRescan}>
          <Swap size={20} color={'#fff'} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.itemBtn, { marginLeft: 8 }]} onPress={handleDelete}>
          <Trash size={20} color={'#fff'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const renderHeader = () => (
  <View
    style={[
      styles.itemContainer,
      {
        marginBottom: 2,
        paddingVertical: 8,
        borderColor: COLORS.secondary,
        marginHorizontal: 5,
        borderWidth: 0.5,
        backgroundColor: COLORS.secondaryTint,
        borderRadius: 8,
      },
    ]}>
    <View style={{ flex: 2, paddingLeft: 5 }}>
      <SummaText textAlign={'left'}>Serial number</SummaText>
    </View>
    <View style={styles.flex}>
      <SummaText>Type</SummaText>
    </View>
    <View style={styles.flex}>
      <SummaText>Action</SummaText>
    </View>
  </View>
);

const ScannedDeviceList = ({ devices, showModal, setSelectedDevice, setIsRescanMode }) => {
  const renderItem = useCallback(
    ({ item }) => {
      return (
        <Item
          device={item}
          setSelectedDevice={setSelectedDevice}
          showModal={showModal}
          setIsRescanMode={setIsRescanMode}
        />
      );
    },
    [setSelectedDevice, showModal],
  );

  return (
    <>
      {renderHeader()}
      <View flex={1}>
        {devices.length > 0 ? (
          <FlatList
            data={devices}
            renderItem={renderItem}
            keyExtractor={(item) => item + Math.random() * 100}
            style={{ padding: 5 }}
          />
        ) : (
          <SummaText customText={{ marginVertical: 20 }}>List is empty, please scan</SummaText>
        )}
      </View>
    </>
  );
};

export default ScannedDeviceList;
