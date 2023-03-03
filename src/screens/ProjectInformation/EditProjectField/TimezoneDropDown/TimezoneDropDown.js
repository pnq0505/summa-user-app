import React from 'react';
import { StyleSheet } from 'react-native';
import SummaDropDownPicker from '../../../../components/SummaDropDownPicker';
import { timezoneItems } from './timezone.constant';

const styles = StyleSheet.create({});

const TimeZoneDropDown = ({ value, setValue }) => {
  return (
    <SummaDropDownPicker
      placeholder={'Select timezone'}
      items={timezoneItems}
      value={value}
      setValue={setValue}
      open={true}
    />
  );
};

export default TimeZoneDropDown;
