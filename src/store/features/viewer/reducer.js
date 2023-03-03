import AsyncStorage from '@react-native-async-storage/async-storage';
import { createReducer } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { MODAL_IDS } from '../../../constants';
import { clearAllModal, hideCurrentModal, selectedFixtureId, showModal } from './action';

const persistConfig = {
  storage: AsyncStorage,
  key: 'viewer',
  stateReconciler: autoMergeLevel2,
  blacklist: ['popupHistory', 'selectedFixtures'],
  version: 2,
};

const defaultState = {
  popupHistory: [],
  selectedFixtureId: undefined,
};

const viewer = createReducer(defaultState, (builder) => {
  builder
    .addCase(selectedFixtureId, (state, { payload }) => {
      const { fixtureId, shouldShowInfo } = payload;
      state.selectedFixtureId = fixtureId;
      if (shouldShowInfo) {
        state.popupHistory.push(MODAL_IDS.FIXTURE_INFO);
      }
    })

    .addCase(showModal, (state, { payload }) => {
      const { modalId } = payload;
      state.popupHistory.push(modalId);
    })

    .addCase(hideCurrentModal, (state) => {
      state.popupHistory.pop();
    })

    .addCase(clearAllModal, (state) => {
      state.popupHistory = [];
    });
});

export default persistReducer(persistConfig, viewer);
