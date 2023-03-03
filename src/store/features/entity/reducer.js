import AsyncStorage from '@react-native-async-storage/async-storage';
import { createReducer } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import {
  fetchFixturesForPloorlan,
  loadOfflineFixturesForPloorlan,
  submitFixturesAction,
  syncLiveUpdatedFixtures,
} from '../fixture/action';
import { fetchFloorplans } from '../floorplan/action';
import { fetchProject, updateProject } from '../project/action';

const persistConfig = {
  storage: AsyncStorage,
  key: 'entity',
  stateReconciler: autoMergeLevel2,
};

const defaultState = {
  floorplans: {},
  devices: {},
  fixtures: {},
  projects: {},
};

const actions = new Set([
  loadOfflineFixturesForPloorlan,
  syncLiveUpdatedFixtures.fulfilled.toString(),
  fetchFloorplans.fulfilled.toString(),
  fetchProject.fulfilled.toString(),
  updateProject.fulfilled.toString(),
  submitFixturesAction.fulfilled.toString(),
  fetchFixturesForPloorlan.fulfilled.toString(),
]);

const ENTITY_MAPPING = Object.freeze({});

const renameEntity = ([entityName, entity]) => {
  const newName = ENTITY_MAPPING[entityName] || entityName;
  return [newName, entity];
};

const entity = createReducer(defaultState, (builder) => {
  builder
    .addCase('CLEAR_REDUCER_DATA1', () => defaultState)

    .addCase('CLEAR_REDUCER_ALL_DATA', () => defaultState)

    .addMatcher(
      (action) => actions.has(action.type),
      (state, { payload }) => {
        if (!payload.entities) {
          return;
        }

        Object.entries(payload.entities)
          .map(renameEntity)
          .forEach(([entityName, entity]) => {
            state[entityName] = state[entityName] || {};
            const entityState = state[entityName];

            Object.entries(entity).forEach(([id, model]) => {
              entityState[id] = entityState[id] || {};
              Object.assign(entityState[id], model);
            });
          });
      },
    );
});

export default persistReducer(persistConfig, entity);
