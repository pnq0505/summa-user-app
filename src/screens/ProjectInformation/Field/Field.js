import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import SummaText from '../../../components/SummaText';
import { COLORS } from '../../../theme';
import EditFieldType from './EditFieldType';

const styles = StyleSheet.create({
  Row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomColor: COLORS.medium,
    borderBottomWidth: 0.3,
  },
  PropField: {
    flexDirection: 'row',
    width: '30%',
    alignItems: 'center',
  },
});

const Field = ({ field, navigation, setField }) => {
  const handleEdit = useCallback(() => {
    navigation.navigate('EditProjectField', { field });
  }, [field, navigation]);

  const handleScan = useCallback(() => {
    navigation.navigate('GateWayScanner', { field });
  }, [field, navigation]);

  const handleChangeSwitch = useCallback(
    async (value) => {
      await setField({ fieldName: field.key, value });
    },
    [field, setField],
  );

  return (
    <View style={styles.Row}>
      <View style={styles.PropField}>
        <SummaText textAlign={'left'} color={COLORS.medium}>
          {field.title}
        </SummaText>
      </View>
      <EditFieldType
        field={field}
        handleChangeSwitch={handleChangeSwitch}
        handleEdit={handleEdit}
        handleScan={handleScan}
      />
    </View>
  );
};

export default Field;
