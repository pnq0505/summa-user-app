import AsyncStorage from '@react-native-async-storage/async-storage';
import { createReducer } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import {
  addDeviceByFixtureIdAction,
  deleteDeviceByFixtureIdAction,
  initDeviceList,
  replaceDeviceByFixtureIdAction,
  updateDeviceDataFromSocket,
} from './action';

const persistConfig = {
  key: 'device',
  storage: AsyncStorage,
  stateReconsiler: autoMergeLevel2,
  blacklist: ['loading'],
  version: 2,
};

export const defaultDeviceState = {
  devices: {},
  deviceHanldeStatus: '',
  loading: false,
};

const device = createReducer(defaultDeviceState, (builder) => {
  builder
    .addCase(initDeviceList, (state, { payload }) => {
      state.devices[payload.fixtureId] = payload.devices;
    })

    .addCase(addDeviceByFixtureIdAction, (state, { payload }) => {
      if (payload.deviceInfo && payload.fixtureId) {
        state.devices[payload.fixtureId].push(payload.deviceInfo);
      }
    })

    .addCase(deleteDeviceByFixtureIdAction.fulfilled, (state, { payload }) => {
      if (payload.deviceId && payload.fixtureId) {
        state.devices[payload.fixtureId] = state.devices[payload.fixtureId].filter(
          (device) => device !== payload.deviceId,
        );
      }
    })

    .addCase(replaceDeviceByFixtureIdAction.fulfilled, (state, { payload }) => {
      if (payload.deviceId && payload.fixtureId && payload.deviceInfo) {
        state.devices[payload.fixtureId] = state.devices[payload.fixtureId].map((device) => {
          if (device !== payload.deviceId) return device;
          return payload.deviceInfo;
        });
      }
    })

    .addCase(updateDeviceDataFromSocket, (state, { payload }) => {
      if (payload.fixtureId && payload.devices) {
        state.devices[payload.fixtureId] = payload.devices;
      }
    });
});

export default persistReducer(persistConfig, device);
