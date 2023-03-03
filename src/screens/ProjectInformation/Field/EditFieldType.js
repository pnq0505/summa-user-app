import { Barcode, CaretRight } from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import SummaText from '../../../components/SummaText';
import { COLORS } from '../../../theme';

const styles = StyleSheet.create({
  ValueField: {
    flexDirection: 'row',
    width: '65%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

const TextField = ({ field }) => {
  return (
    <SummaText textAlign={'right'} isSecure={field.options?.secure}>
      {field.value}
    </SummaText>
  );
};

const EditFieldType = ({ field, handleChangeSwitch, handleEdit, handleScan }) => {
  if (!field.options?.editable) {
    return (
      <View style={styles.ValueField}>
        <TextField field={field} />
      </View>
    );
  }
  if (field.options?.boolean) {
    return (
      <View>
        <Switch value={field.value} onValueChange={handleChangeSwitch}></Switch>
      </View>
    );
  }
  if (field.options?.scan) {
    return (
      <TouchableOpacity style={styles.ValueField} onPress={handleScan}>
        <TextField field={field} />
        <View style={{ marginLeft: 5 }}>
          <Barcode size={20} color={COLORS.summaOrange} />
        </View>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity style={styles.ValueField} onPress={handleEdit}>
      <TextField field={field} />
      <CaretRight size={20} color="#fff" />
    </TouchableOpacity>
  );
};

export default EditFieldType;
