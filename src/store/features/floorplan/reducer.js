import AsyncStorage from '@react-native-async-storage/async-storage';
import { createReducer } from '@reduxjs/toolkit';
import { createMigrate, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { approved, inReview, toBeReScanned } from '../../../constants';
import { cleanData, storeVersion } from '../migration';
import {
  fetchFloorplans,
  setSelectedFlooplanId,
  updateFixtureStatusQuantityFromSocket,
} from './action';

import { fetchFixturesForPloorlan } from '../fixture/action';

const defaultState = {
  floorplanStatus: {},
  selectedFloorplanId: '',
  loading: false,
};

const persistConfig = {
  storage: AsyncStorage,
  key: 'floorplan',
  stateReconciler: autoMergeLevel2,
  blacklist: ['loading'],
  version: storeVersion,
  migrate: createMigrate(cleanData(storeVersion, defaultState), { debug: false }),
};

const defaultFloorplanStatus = () => {
  return {
    toBeConfigured: 0,
    inReview: 0,
    approved: 0,
    toBeReScanned: 0,
  };
};

const floorplan = createReducer(defaultState, (builder) => {
  builder
    .addCase(fetchFloorplans.fulfilled, (state, { payload }) => {
      const { result } = payload;
      result.forEach((id) => {
        if (!state.floorplanStatus[id]) {
          state.floorplanStatus[id] = defaultFloorplanStatus();
        }
      });
    })

    .addCase(fetchFixturesForPloorlan.fulfilled, (state, { payload, meta }) => {
      const { entities } = payload;
      const fixtures = Object.values(entities?.fixtures || {});
      const floorplanId = meta?.arg?.floorplanKey || null;
      if (floorplanId) {
        let statusQuantity = defaultFloorplanStatus();
        fixtures.forEach((fixture) => {
          switch (fixture.status) {
            case inReview:
              statusQuantity.inReview += 1;
              break;
            case approved:
              statusQuantity.approved += 1;
              break;
            case toBeReScanned:
              statusQuantity.toBeReScanned += 1;
              break;
            default:
              statusQuantity.toBeConfigured += 1;
              break;
          }
        });
        state.floorplanStatus[floorplanId] = statusQuantity;
      }
    })

    .addCase(setSelectedFlooplanId, (state, { payload }) => {
      if (payload.floorplanId) {
        state.selectedFloorplanId = payload.floorplanId;
      }
    })

    .addCase(updateFixtureStatusQuantityFromSocket.fulfilled, (state, { payload }) => {
      console.log('update quantity');
      const { floorplanId, fixtures } = payload;
      let statusQuantity = defaultFloorplanStatus();

      if (floorplanId && fixtures) {
        state.floorplanStatus[floorplanId] = statusQuantity;
        fixtures.forEach((fixture) => {
          switch (fixture.status) {
            case inReview:
              state.floorplanStatus[floorplanId].inReview = 1 + statusQuantity.inReview;
              break;
            case approved:
              state.floorplanStatus[floorplanId].approved = 1 + statusQuantity.approved;
              break;
            case toBeReScanned:
              state.floorplanStatus[floorplanId].toBeReScanned = 1 + statusQuantity.toBeReScanned;
              break;
            default:
              state.floorplanStatus[floorplanId].toBeConfigured = 1 + statusQuantity.toBeConfigured;
              break;
          }
        });
      }
    });
});

export default persistReducer(persistConfig, floorplan);
