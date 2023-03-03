import AsyncStorage from '@react-native-async-storage/async-storage';
import { createReducer } from '@reduxjs/toolkit';
import { createMigrate, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { cleanData, storeVersion } from '../migration';
import { fetchInstaller, logoutAction, setApiKey, setEnvironment, setProjectKey } from './action';

const defaultState = () => {
  return {
    installerName: '',
    projectKey: null,
    apiKey: null,
    httpEnvironment: '',
    wsEnvironment: '',
  };
};

const persistConfig = {
  storage: AsyncStorage,
  key: 'installer',
  stateReconciler: autoMergeLevel2,
  blacklist: ['loading', 'installerName'],
  version: storeVersion,
  migrate: createMigrate(cleanData(storeVersion, defaultState()), { debug: false }),
};

const installer = createReducer(defaultState, (builder) => {
  builder
    .addCase(fetchInstaller.fulfilled, (state, { payload }) => {
      if (payload.data && payload.data.findInstaller) {
        const { name, projectKey } = payload.data.findInstaller;
        state.installerName = name;
        state.projectKey = projectKey;
      }
    })

    .addCase(setApiKey.fulfilled, (state, { payload }) => {
      const { apiKey } = payload;
      state.apiKey = apiKey;
    })

    .addCase(setProjectKey.fulfilled, (state, { payload }) => {
      const { projectKey } = payload;
      state.projectKey = projectKey;
    })

    .addCase(setEnvironment.fulfilled, (state, { payload }) => {
      const { environment } = payload;
      if (environment.includes('http')) {
        state.httpEnvironment = environment;
        if (environment.includes('https')) {
          state.wsEnvironment = environment.replace('https', 'wss');
        } else {
          state.wsEnvironment = environment.replace('http', 'ws');
        }
      } else {
        state.httpEnvironment = `https://${environment}`;
        state.wsEnvironment = `wss://${environment}`;
      }
    })

    .addCase(logoutAction, (state) => {
      state.projectKey = null;
      state.apiKey = null;
      state.httpEnvironment = null;
      state.wsEnvironment = null;
    });
});

export default persistReducer(persistConfig, installer);
