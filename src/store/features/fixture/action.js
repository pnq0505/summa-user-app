import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { normalize } from 'normalizr';

import { fixtureSchema } from '../../normalizr/schema';
import { getDevicesByFixtureId } from '../device/selector';
import { getFloorplanId } from '../floorplan/selector';
import { getApikey, getHttpEnvironment } from '../installer/selector';
import { fetchFixturesAPI, submitFixturesAPI } from './api';

export const fetchFixturesForPloorlan = createAsyncThunk(
  'FETCH_FIXTURES_FOR_FLOORPLAN',
  async ({ floorplanKey }, thunk) => {
    const apiKey = getApikey(thunk.getState());
    const baseUrl = getHttpEnvironment(thunk.getState());
    const response = await fetchFixturesAPI(baseUrl, apiKey, floorplanKey);
    if (!response) {
      return thunk.rejectWithValue('Unknown error');
    }
    const hasError = response?.data?.errors || false;
    if (hasError) {
      return thunk.rejectWithValue(hasError || 'Unknown error');
    } else {
      const fixtures = response?.data?.data?.findFixtures?.result || [];
      return thunk.fulfillWithValue(normalize(fixtures, [fixtureSchema]));
    }
  },
);

export const loadOfflineFixturesForPloorlan = createAsyncThunk(
  'LOAD_OFFLINE_FIXTURES_FOR_FLOORPLAN',
  ({ floorplanKey, fixtures }, thunk) => {
    return thunk.fulfillWithValue(normalize(fixtures, [fixtureSchema]));
  },
);

export const syncLiveUpdatedFixtures = createAsyncThunk(
  'SOCKET_SYNC_LIVE_UPDATED_FIXTURE',
  ({ fixtures }, thunk) => {
    return thunk.fulfillWithValue(normalize(fixtures, fixtureSchema));
  },
);

// SUBMIT FIXTURE
export const submitFixturesAction = createAsyncThunk('SUBMIT_FIXTURES', async (fixtures, thunk) => {
  const apiKey = getApikey(thunk.getState());
  const baseUrl = getHttpEnvironment(thunk.getState());
  const response = await submitFixturesAPI(baseUrl, apiKey, fixtures);

  if (!response) {
    return thunk.rejectWithValue('Unknown error');
  }
  const hasError = response?.data?.errors || false;
  if (hasError) {
    return thunk.rejectWithValue(hasError || 'Unknown error');
  } else {
    const fixtures = response?.data?.data?.patchFixtures || [];
    return thunk.fulfillWithValue(normalize(fixtures, [fixtureSchema]));
  }
});

export const moveFixture = createAsyncThunk('MOVE_FIXTURE', ({ fixtureId, pos }, thunk) => {
  console.log(fixtureId, pos);
  const floorplanId = getFloorplanId(thunk.getState());
  return { fixtureId, floorplanId, pos };
});

export const writeFixtureFileAction = createAsyncThunk(
  'ADD_DEVICES_TO_FIXTURE',
  (fixtureId, thunk) => {
    const devices = getDevicesByFixtureId(thunk.getState())[fixtureId];
    const floorplanId = getFloorplanId(thunk.getState());
    return { fixtureId, floorplanId, devices };
  },
);

export const getCurrentFixtureIdAction = createAction('GET_FIXTURE_ID_ACTION', (fixtureId) => {
  return { payload: { fixtureId } };
});

export const addTempFixturesForOfflineAction = createAction(
  'ADD_TEMP_FIXTURES_WHEN_OFFLINE',
  (fixtures) => {
    return { payload: { fixtures } };
  },
);

export const clearTempFixturesForOfflineAction = createAction('CLEAR_TEMP_FIXTURES_WHEN_OFFLINE');

// After opening a project, we will check and load all unsaved (offline) fixtures from the save file.
// After that we will need to set them into the store to trigger the check and sync them with the server
export const cleanupAndLoadUnsavedFixtures = createAction('CLEANUP_AND_LOAD_UNSAVED_FIXTURES'); // payload: { fixtures }
