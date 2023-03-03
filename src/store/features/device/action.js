const {createAction, createAsyncThunk} = require('@reduxjs/toolkit');

export const initDeviceList = createAction('INIT_DEVICE_LIST', fixture => {
  let devices = [];
  if (fixture?.deviceKeys) {
    devices = fixture?.deviceKeys;
  }
  return {payload: {fixtureId: fixture.id, devices}};
});

export const addDeviceByFixtureIdAction = createAction(
  'ADD_DEVICE_BY_FIXTURE',
  (fixtureId, deviceInfo) => {
    return {payload: {fixtureId, deviceInfo}};
  },
);

// IF DEVICE ALREADY EXIST
export const deleteDeviceByFixtureIdAction = createAsyncThunk(
  'DELETE_DEVICE_BY_ID',
  ({fixtureId, deviceId}, thunk) => {
    return {fixtureId, deviceId};
  },
);

export const replaceDeviceByFixtureIdAction = createAsyncThunk(
  'UPDATE_DEVICE_BY_ID',
  ({fixtureId, deviceId, deviceInfo}, thunk) => {
    return {fixtureId, deviceInfo, deviceId};
  },
);

export const updateDeviceDataFromSocket = createAction(
  'UPDATE_DEVICE_FROM_SOCKET',
  (fixtureId, devices) => {
    return {payload: {fixtureId, devices}};
  },
);
