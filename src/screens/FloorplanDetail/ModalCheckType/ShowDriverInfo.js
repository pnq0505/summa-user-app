import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import SummaDropDownPicker from '../../../components/SummaDropDownPicker';
import SummaText from '../../../components/SummaText';
import { dWidth } from '../../../utils/Dimentions';

const styles = StyleSheet.create({});

const ShowDriverInfo = ({ driverData, hanldeSelectedFromDriver }) => {
  const [open, setOpen] = useState(true);
  const [value, setValue] = useState(null);

  const items = useMemo(
    () =>
      driverData
        ? driverData.reduce((result, item) => {
            return [...result, { label: item.key, value: item.key }];
          }, [])
        : [],
    [driverData],
  );

  useEffect(() => {
    if (items.length === 1) {
      hanldeSelectedFromDriver(items[0].value, true);
      return;
    }
    setOpen(true);
  }, [items]);

  useEffect(() => {
    if (value) {
      hanldeSelectedFromDriver(value);
    }
  }, [value]);

  return (
    <View>
      <SummaText customText={{ marginVertical: 10, marginHorizontal: 5 }} center={true} large>
        Driver Info
      </SummaText>
      <View
        style={{
          paddingHorizontal: dWidth > 500 ? '15%' : '5%',
        }}>
        <SummaDropDownPicker
          placeholder={'Please select type'}
          open={open}
          setOpen={setOpen}
          value={value}
          setValue={setValue}
          items={items}
        />
      </View>
    </View>
  );
};

export default ShowDriverInfo;
