import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { FONTS, SIZES } from '../../theme';
import SummaText from '../SummaText';
import CustomMarker from './CustomMarker';

let timeoutId = null;

const styles = StyleSheet.create({
  qrContainerStyle: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  markerStyle: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'blue',
    opacity: 0.3,
  },
  cameraStyle: {
    width: '100%',
    display: 'flex',
    position: 'relative',
  },
  text: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: SIZES.large,
    color: '#fff',
    fontWeight: FONTS.extraBold,
  },
});

const SummaQRScan = ({ onScanSuccess }) => {
  const [pointOfInterest, setPointOfInterest] = useState({ x: 0.5, y: 0.5 });
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  const [markerDisplay, setMarkerDisplay] = useState('none');
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  const notPermissionView = (
    <View style={styles.container}>
      <SummaText center large error={true}>
        It looks like camera access permission was denied. Please grant the permission in settings
        and come back.
      </SummaText>
    </View>
  );

  const hideMarker = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      setMarkerDisplay('none');
      timeoutId = null;
    }, 900);
  }, []);

  const handleOnLayout = useCallback(
    (evt) => {
      const { width, height } = evt.nativeEvent.layout;
      setLayout({ width, height });
    },
    [setLayout],
  );

  const handleFocus = useCallback(
    (evt) => {
      const { x, y } = evt;
      setTouchPosition({ x, y });
      setPointOfInterest({ x: y / layout.height, y: 1 - x / layout.width });
      setMarkerDisplay('flex');
      hideMarker();
      console.log({ x: y / layout.height, y: 1 - x / layout.width });
    },
    [layout, hideMarker],
  );

  return (
    <QRCodeScanner
      onLayout={handleOnLayout}
      onRead={onScanSuccess}
      cameraContainerStyle={styles.qrContainerStyle}
      cameraStyle={[styles.cameraStyle]}
      flashMode={RNCamera.Constants.FlashMode.off}
      showMarker={true}
      customMarker={<CustomMarker markerDisplay={markerDisplay} touchPosition={touchPosition} />}
      cameraProps={{
        notAuthorizedView: notPermissionView,
        autoFocusPointOfInterest: { ...pointOfInterest, autoExposure: true },
        onTap: handleFocus,
        useNativeZoom: true,
      }}
      notAuthorizedView={notPermissionView}
    />
  );
};

export default SummaQRScan;
