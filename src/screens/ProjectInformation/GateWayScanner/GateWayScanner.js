import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { StyleSheet } from 'react-native';
import { FONTS, SIZES } from '../../../theme';
import { dWidth } from '../../../utils/Dimentions';

import SummaButton from '../../../components/SummaButton';
import SummaInput from '../../../components/SummaInput';
import SummaQRScan from '../../../components/SummaQRScan';
import SummaScreen from '../../../components/SummaScreen';
import SummaText from '../../../components/SummaText';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
    marginBottom: 50,
    fontSize: SIZES.large,
    color: '#fff',
    fontWeight: FONTS.extraBold,
  },

  inputContainer: {
    marginBottom: 50,
  },
  contentContainer: {
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCustom: {
    marginBottom: 5,
    marginHorizontal: dWidth > 500 ? '10%' : '1%',
  },
});

const GateWayScanner = ({ route, setField, navigation }) => {
  const { field } = route.params;
  const [errors, setErrors] = useState('');
  const [scanProcess, setScanProcess] = useState('');
  const [gatewayKey, setGateWayKey] = useState(null);

  const onScanSuccess = useCallback(
    async (e) => {
      if (e.data) {
        try {
          await setField({ fieldName: field.key, value: e.data });
          setScanProcess('Scan success');
          navigation.goBack();
        } catch (error) {
          setErrors('Invalid barcode');
          setScanProcess('Scan failed');
        }
      }
    },
    [setGateWayKey, setScanProcess, setErrors, navigation],
  );

  const handleScanAgain = useCallback(() => {
    setScanProcess('');
    setGateWayKey(null);
    setErrors(null);
  }, [setGateWayKey]);

  return (
    <SummaScreen>
      <View style={styles.contentContainer}>
        <SummaText large>Camera</SummaText>
      </View>

      {scanProcess === 'start' ||
      scanProcess === 'Scan failed' ||
      scanProcess === 'Scan success' ? (
        <View style={styles.container}>
          {scanProcess === 'Scan failed' || scanProcess === 'Scan success' ? (
            <Text style={styles.text}>{scanProcess}</Text>
          ) : (
            <ActivityIndicator size="large" color="#fff" />
          )}
          <SummaButton onPressHanlder={handleScanAgain} customStyle={{ marginBottom: 5 }}>
            Scan again
          </SummaButton>
        </View>
      ) : (
        <SummaQRScan onScanSuccess={onScanSuccess} />
      )}

      <View style={styles.contentContainer}>
        <SummaText doubleExtra>Scan barcode</SummaText>
        <SummaText medium>Scan to get started</SummaText>
      </View>
      <SummaInput
        label="Barcode"
        placeholder=""
        onFocus={() => setErrors('')}
        error={errors}
        value={gatewayKey ? 'Gateway: ' + gatewayKey : ''}
        customContainer={styles.inputContainer}
        editable={false}
      />
    </SummaScreen>
  );
};

export default GateWayScanner;
