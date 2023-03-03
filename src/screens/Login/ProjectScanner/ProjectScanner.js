import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import SummaButton from '../../../components/SummaButton';
import SummaInput from '../../../components/SummaInput';
import SummaQRScan from '../../../components/SummaQRScan';
import SummaScreen from '../../../components/SummaScreen';
import SummaText from '../../../components/SummaText';
import { SECRET_KEY } from '../../../constants';

import { fetchFloorplans as fetchFloorplansAction } from '../../../store/features/floorplan/action';
import { fetchInstaller as fetchInstallerAction } from '../../../store/features/installer/action';
import { FONTS, SIZES } from '../../../theme';
import { dWidth } from '../../../utils/Dimentions';
import { decryptQRcode } from '../../../utils/QrCodeHelper';

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

const ProjectScanner = ({
  navigation,
  fetchInstaller,
  fetchFloorplans,
  setApiKey,
  setEnvironment,
  projectKey,
  apiKey,
  fetchProject,
  logoutAction,
}) => {
  const [errors, setErrors] = useState('');
  const [scanProcess, setScanProcess] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!apiKey) {
      setScanProcess('');
    }
  }, [apiKey]);

  const prepareDataAfterScanningQr = useCallback(async () => {
    setIsFetching(true);
    const installer = await fetchInstaller();
    if (installer.type === fetchInstallerAction.rejected.toString()) {
      setErrors('Wrong apikey or lost internet connection, please scan again');
      setScanProcess('Scan failed');
      setIsFetching(false);
      return false;
    }
    const projectKey = installer.payload?.data?.findInstaller?.projectKey;
    if (projectKey) {
      const response = await fetchFloorplans(projectKey);
      if (response.type === fetchFloorplansAction.rejected.toString()) {
        setErrors('Fetch floorplans falied. Please check your connection!');
        setScanProcess('Scan failed');
      } else {
        setScanProcess('Scan success');
        setErrors('');
        await fetchProject(projectKey);
        navigation.navigate('BottomTab');
      }
    }
    setIsFetching(false);
  }, [fetchFloorplans, fetchInstaller, navigation]);

  const onClickOpenProject = useCallback(async () => {
    if (apiKey && projectKey) {
      await fetchProject(projectKey);
      navigation.navigate('BottomTab');
    } else {
      setErrors('You not scan yet');
    }
  }, [apiKey, projectKey, navigation]);

  const disableOpenProject = useMemo(() => {
    return !apiKey || !projectKey || isFetching;
  }, [apiKey, projectKey, isFetching]);

  const onScanSuccess = useCallback(
    async (e) => {
      if (e.data) {
        try {
          const data = decryptQRcode(e.data, SECRET_KEY);
          if (!data) {
            throw 'Invalid QR code';
          }
          const obj = JSON.parse(data);
          const { apiKey = null, endpointUrl = null } = obj;

          if (!apiKey || !endpointUrl) {
            throw 'Invalid QR code';
          }
          setScanProcess('Start');
          await setApiKey(apiKey);
          await setEnvironment(endpointUrl);

          prepareDataAfterScanningQr();
        } catch (error) {
          setErrors('Invalid QR code');
          setScanProcess('Scan failed');
        }
      }
    },
    [setApiKey, setEnvironment, prepareDataAfterScanningQr],
  );

  const handleScanAgain = useCallback(() => {
    setScanProcess('');
    setApiKey(null);
    setErrors(null);
  }, [setApiKey]);

  return (
    <SummaScreen>
      <View style={styles.contentContainer}>
        <SummaText large>Camera</SummaText>
      </View>

      {scanProcess === 'Start' ||
      scanProcess === 'Scan failed' ||
      scanProcess === 'Scan success' ? (
        <View style={styles.container}>
          {isFetching ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Text style={styles.text}>{scanProcess}</Text>
          )}
          <SummaButton
            disabled={isFetching}
            onPressHanlder={handleScanAgain}
            customStyle={{ marginBottom: 5 }}>
            Scan again
          </SummaButton>
        </View>
      ) : (
        <SummaQRScan onScanSuccess={onScanSuccess} />
      )}

      <View style={styles.contentContainer}>
        <SummaText doubleExtra>Scan QR</SummaText>
        <SummaText medium>Scan to get started</SummaText>
      </View>
      <SummaInput
        label="QR-Code"
        placeholder=""
        onFocus={() => setErrors('')}
        error={errors}
        value={apiKey ? 'apiKey: ' + apiKey : ''}
        customContainer={styles.inputContainer}
        editable={false}
      />
      <SummaButton
        onPressHanlder={onClickOpenProject}
        customStyle={styles.btnCustom}
        disabled={disableOpenProject}>
        Open project
      </SummaButton>
    </SummaScreen>
  );
};

export default ProjectScanner;
