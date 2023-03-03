import AsyncStorage from '@react-native-async-storage/async-storage';
import { createReducer } from '@reduxjs/toolkit';
import { createMigrate, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { logoutAction } from '../installer/action';
import {
  fetchProject,
  removeProject,
  setField,
  setSelectedProject,
  setUnsaveProjectInfo,
  updateProject,
} from './action';
import { migrations } from './migrations';

const defaultState = () => {
  return {
    projectIds: [],
    selectedProjectId: null,
    selectedProjectKey: null,
    dirty: false,
    unsaveProjectInfo: {},
  };
};

const persistConfig = {
  storage: AsyncStorage,
  key: 'project',
  stateReconciler: autoMergeLevel2,
  version: 3,
  migrate: createMigrate(migrations(defaultState), { debug: false }),
};

const project = createReducer(defaultState, (builder) => {
  builder
    .addCase(fetchProject.fulfilled, (state, { payload }) => {
      const { entities, result } = payload;
      state.selectedProjectId = result;
      const project = entities.projects[result];
      state.selectedProjectKey = project.key;

      if (!state.projectIds.includes(result)) {
        state.projectIds.push(result);
      }
      state.unsaveProjectInfo = {};
    })

    .addCase(setField.fulfilled, (state, { payload }) => {
      const { fieldName, value } = payload;
      const [key, subKey] = fieldName.split('.');
      if (subKey) {
        if (state.unsaveProjectInfo[key]) {
          state.unsaveProjectInfo[key][subKey] = value;
        } else {
          state.unsaveProjectInfo[key] = {};
          state.unsaveProjectInfo[key][subKey] = value;
        }
      } else {
        state.unsaveProjectInfo[key] = value;
      }
      state.dirty = true;
    })

    .addCase(setSelectedProject, (state, { payload }) => {
      const { project } = payload;
      state.selectedProjectId = project.id;
      state.selectedProjectKey = project.key;
      state.unsaveProjectInfo = {};
    })

    .addCase(updateProject.fulfilled, (state, { payload }) => {
      const { entities, result } = payload;
      state.selectedProjectId = result;
      const project = entities.projects[result];
      state.selectedProjectKey = project.key;
      state.unsaveProjectInfo = {};
    })

    .addCase(removeProject, (state, { payload }) => {
      const { id } = payload;
      const filterIds = state.projectIds.filter((projectId) => projectId !== id);
      state.projectIds = filterIds;
    })

    .addCase(setUnsaveProjectInfo, (state, { payload }) => {
      const { project } = payload;
      state.unsaveProjectInfo = project;
    })

    .addCase(logoutAction, (state, { payload }) => {
      state.unsaveProjectInfo = {};
    });
});

export default persistReducer(persistConfig, project);
