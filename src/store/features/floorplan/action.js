import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { normalize } from 'normalizr';
import { floorplanSchema } from '../../normalizr/schema';
import { getFixturesForFloorplan } from '../fixture/selector';
import { getApikey, getHttpEnvironment } from '../installer/selector';
import { fetchFloorplansAPI } from './api';

export const fetchFloorplans = createAsyncThunk('FETCH_FLOORPLANS', async (projectKey, thunk) => {
  const apiKey = getApikey(thunk.getState());
  const baseUrl = getHttpEnvironment(thunk.getState());
  const response = await fetchFloorplansAPI(baseUrl, apiKey, projectKey);
  if (!response) {
    return thunk.rejectWithValue('Unknown error');
  }
  const hasError = response?.data?.errors || false;
  if (hasError) {
    return thunk.rejectWithValue(hasError || 'Unknown error');
  } else {
    const floorplans = response?.data?.data?.findFloorplans?.result || [];
    return thunk.fulfillWithValue(normalize(floorplans, [floorplanSchema]));
  }
});

export const setSelectedFlooplanId = createAction('SET_SELECTED_FLOORPLAN_ID', (floorplanId) => {
  return {
    payload: { floorplanId },
  };
});

export const setViewingFlooplanId = createAction('SET_VIEWING_FLOORPLAN_ID'); // params { floorplanId }

// UPDATE FIXTURE QUANTITY UP ON FLOORPLAN ID
export const updateFixtureQuantityByFloorplanIdAction = createAction(
  'UPDATE_FIXTURE_STATUS_QUANTITY_BY_FLOORPLAN_ID',
  (floorplanId, fixtures) => {
    return {
      payload: { floorplanId, fixtures },
    };
  },
);

// UPDATE FIXTURE QUANTITY FROM SOCKET
export const updateFixtureStatusQuantityFromSocket = createAsyncThunk(
  'UPDATE_FIXTURE_STATUS_QUANTITY_FROM_SOCKET',
  async (floorplanId, thunk) => {
    const fixtures = await getFixturesForFloorplan(thunk.getState());
    return { floorplanId, fixtures };
  },
);
