import { Platform } from 'react-native';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

const PLATFORM_CAMERA_PERMISSIONS = {
  ios: PERMISSIONS.IOS.CAMERA,
  android: PERMISSIONS.ANDROID.CAMERA,
};

export const checkCameraPermission = async () => {
  const permissions = PLATFORM_CAMERA_PERMISSIONS[Platform.OS];
  if (!permissions) {
    return true;
  }
  try {
    const result = await check(permissions);
    if (result === RESULTS.GRANTED) {
      console.log('Permission granted');
      return true;
    }
    return requestPermission(permissions);
    //Since the permission was not granted we will request now
  } catch (error) {
    console.log('Failed to grant permision');
    return false;
  }
};

export const requestPermission = async (permission) => {
  try {
    const result = await request(permission);
    console.log('request ', result);
    return result === RESULTS.GRANTED;
  } catch (e) {
    return false;
  }
};
