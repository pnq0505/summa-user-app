import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import SummaDropDownPicker from '../../../components/SummaDropDownPicker';
import SummaModal from '../../../components/SummaModal';
import SummaText from '../../../components/SummaText';
import { FIXTURE_STATUS_LIST, MODAL_IDS } from '../../../constants';
import { dWidth } from '../../../utils/Dimentions';

const styles = StyleSheet.create({});

const ModalFilterFixtures = ({
  setFilterValues,
  filterValues,
  hideCurrentModal,
  showModal,
  activeModalId,
}) => {
  const [open, setOpen] = useState(true);
  const [value, setValue] = useState(filterValues);
  const [items, setItems] = useState(FIXTURE_STATUS_LIST);

  useEffect(() => {
    if (!value) return;
    setFilterValues(value);
  }, [value]);

  useEffect(() => {
    setOpen(true); // this will trigger the dropdown visibility
  });

  const openFilterFixtures = useMemo(() => {
    return activeModalId == MODAL_IDS.FILTER_FIXTURE;
  }, [activeModalId]);

  const setOpenFilterFixtures = useCallback(
    (visible) => {
      if (visible) {
        showModal({ modalId: MODAL_IDS.FILTER_FIXTURE });
      } else {
        hideCurrentModal();
      }
    },
    [hideCurrentModal, showModal],
  );

  return openFilterFixtures ? (
    <SummaModal bottom isVisible={openFilterFixtures} setVisible={setOpenFilterFixtures}>
      <View
        style={{
          height: 350,
          width: dWidth,
          backgroundColor: '#0F172A',
          borderTopWidth: 3,
          borderTopColor: '#00cec9',
        }}>
        <SummaText customText={{ marginVertical: 10, marginHorizontal: 5 }} center={true} large>
          Filter Fixtures
        </SummaText>
        <View
          style={{
            paddingHorizontal: dWidth > 500 ? '15%' : '5%',
          }}>
          <SummaDropDownPicker
            placeholder={'You can select multiple status'}
            open={open}
            setOpen={setOpen}
            value={value}
            setValue={setValue}
            items={items}
            setItems={setItems}
            multiple={true}
            mode={'BADGE'}
          />
        </View>
      </View>
    </SummaModal>
  ) : null;
};

export default ModalFilterFixtures;
