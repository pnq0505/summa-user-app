import { createAsyncThunk } from '@reduxjs/toolkit';
import { getApikey, getHttpEnvironment } from '../installer/selector';
import { fetchDriverBySerialNumberAPI } from './api';

export const fetchDriverBySerialNumberAction = createAsyncThunk(
  'GET_DRIVER_BY_KEY',
  async (serialNumber, thunk) => {
    const apiKey = getApikey(thunk.getState());
    const baseUrl = getHttpEnvironment(thunk.getState());
    const response = await fetchDriverBySerialNumberAPI(baseUrl, apiKey, serialNumber);
    return response.data;
  },
);
