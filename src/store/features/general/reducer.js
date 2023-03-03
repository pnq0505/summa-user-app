import AsyncStorage from '@react-native-async-storage/async-storage';
import { createReducer } from '@reduxjs/toolkit';
import { createMigrate, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { cleanData, storeVersion } from '../migration';
import { setInternetConnectionStatus } from './action';

const defaultState = () => {
  return {
    hasInternetConnection: true,
  };
};

const persistConfig = {
  storage: AsyncStorage,
  key: 'general',
  stateReconciler: autoMergeLevel2,
  blacklist: ['loading', 'hasInternetConnection'],
  version: storeVersion,
  migrate: createMigrate(cleanData(storeVersion, defaultState()), { debug: false }),
};

const general = createReducer(defaultState, (builder) => {
  builder.addCase(setInternetConnectionStatus, (state, { payload }) => {
    const { status } = payload;
    state.hasInternetConnection = status;
  });
});

export default persistReducer(persistConfig, general);
