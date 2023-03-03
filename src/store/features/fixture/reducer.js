import AsyncStorage from '@react-native-async-storage/async-storage';
import { createReducer } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { inReview } from '../../../constants';
import {
  addTempFixturesForOfflineAction,
  cleanupAndLoadUnsavedFixtures,
  clearTempFixturesForOfflineAction,
  fetchFixturesForPloorlan,
  getCurrentFixtureIdAction,
  loadOfflineFixturesForPloorlan,
  moveFixture,
  submitFixturesAction,
  syncLiveUpdatedFixtures,
  writeFixtureFileAction,
} from './action';

import { logoutAction } from '../installer/action';

const persistConfig = {
  storage: AsyncStorage,
  key: 'fixture',
  stateReconciler: autoMergeLevel2,
  blacklist: ['loading', 'fixtures', 'selectedFixtures', 'filterFixtureList'],
  version: 2,
};

export const defaultFixtureState = {
  currentFloorplanFixureIds: [],
  currentFilterStatus: [],

  fixtures: {},
  currentFixtureId: '',
  selectedFixtures: [],

  tempFixturesOffline: [],
  loading: false,

  fixtureIdsGroupByFloorplan: {},
  floorplanKeyFromSocket: null,
};

const fixture = createReducer(defaultFixtureState, (builder) => {
  builder
    .addCase('SET_SELECTED_FLOORPLAN_ID', (state, { payload }) => {
      const { floorplanId } = payload;
      if (floorplanId) {
        state.currentFloorplanFixureIds = state.fixtureIdsGroupByFloorplan[floorplanId] || [];
      } else {
        state.currentFloorplanFixureIds = [];
      }
    })

    .addCase(cleanupAndLoadUnsavedFixtures, (state, { payload }) => {
      const { fixtures } = payload;
      state.tempFixturesOffline = fixtures.map((fixture) => {
        const { id, devices = null, floorplanKey = null, location = null } = fixture;
        const temp = { id, devices, floorplanKey, location };
        Object.keys(temp).forEach((k) => temp[k] == null && delete temp[k]);
        return temp;
      });
    })

    .addCase(logoutAction, (state, { payload }) => {
      state.tempFixturesOffline = [];
    })

    .addCase(submitFixturesAction.fulfilled, (state, { payload }) => {
      state.tempFixturesOffline = [];
    })

    .addCase(fetchFixturesForPloorlan.fulfilled, (state, { payload, meta }) => {
      const { entities, result } = payload;
      const { floorplanKey } = meta.arg;
      if (!state.fixtureIdsGroupByFloorplan) {
        state.fixtureIdsGroupByFloorplan = {};
      }
      state.fixtureIdsGroupByFloorplan[floorplanKey] = result;
    })

    .addCase(loadOfflineFixturesForPloorlan, (state, { payload, meta }) => {
      if (!payload) {
        return;
      }
      const { entities, result } = payload;
      const { floorplanKey } = meta.arg;
      if (!state.fixtureIdsGroupByFloorplan) {
        state.fixtureIdsGroupByFloorplan = {};
      }
      state.fixtureIdsGroupByFloorplan[floorplanKey] = result;
    })

    .addCase(moveFixture.fulfilled, (state, { payload }) => {
      const { pos, fixtureId, floorplanId } = payload;

      const fixturePosition = state.tempFixturesOffline.findIndex((el) => {
        return el?.id?.toString() === fixtureId?.toString();
      });

      if (fixturePosition === -1) {
        state.tempFixturesOffline.push({
          id: fixtureId,
          floorplanKey: floorplanId,
          location: { ...pos, height: 0 },
          status: inReview,
        });
      } else {
        const unsavedFixture = state.tempFixturesOffline[fixturePosition];
        unsavedFixture.location = { ...unsavedFixture.location, ...pos };
        unsavedFixture.status = inReview;
        state.tempFixturesOffline[fixturePosition] = unsavedFixture;
      }
    })

    .addCase(writeFixtureFileAction.fulfilled, (state, { payload }) => {
      const { devices, fixtureId, floorplanId } = payload;

      const fixturePosition = state.tempFixturesOffline.findIndex((el) => {
        return el?.id?.toString() === fixtureId?.toString();
      });

      if (fixturePosition === -1) {
        state.tempFixturesOffline.push({
          id: fixtureId,
          floorplanKey: floorplanId,
          devices: devices || [],
          deviceKeys: devices || [],
          status: inReview,
        });
      } else {
        const unsavedFixture = state.tempFixturesOffline[fixturePosition];
        unsavedFixture.devices = devices || [];
        unsavedFixture.deviceKeys = devices || [];
        unsavedFixture.status = inReview;
        state.tempFixturesOffline[fixturePosition] = unsavedFixture;
      }
    })

    .addCase(getCurrentFixtureIdAction, (state, { payload }) => {
      if (payload.fixtureId) {
        state.currentFixtureId = payload.fixtureId;
      }
    })

    .addCase(addTempFixturesForOfflineAction, (state, { payload }) => {
      if (payload.fixtures) {
        state.tempFixturesOffline = payload.fixtures;
      }
    })

    .addCase(clearTempFixturesForOfflineAction, (state) => {
      state.tempFixturesOffline = [];
    })

    .addCase(syncLiveUpdatedFixtures.fulfilled.toString(), (state, { payload }) => {
      const { entities } = payload;
      const fixture = entities.fixtures[Object.keys(entities.fixtures)[0]];
      state.floorplanKeyFromSocket = fixture.floorplanKey;
    });
});

export default persistReducer(persistConfig, fixture);
