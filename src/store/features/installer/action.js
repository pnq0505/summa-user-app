import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchInstallerAPI } from './api';
import { getApikey, getHttpEnvironment } from './selector';

export const fetchInstaller = createAsyncThunk('GET_INSTALLER_INFO', async (_, thunk) => {
  const apiKey = getApikey(thunk.getState());
  const baseUrl = getHttpEnvironment(thunk.getState());
  const response = await fetchInstallerAPI(baseUrl, apiKey);
  return response.data;
});

export const setApiKey = createAsyncThunk('SET_APIKEY', async (apiKey, thunk) => {
  return { apiKey };
});

export const setProjectKey = createAsyncThunk('SET_PROJECTKEY', async (projectKey, thunk) => {
  return { projectKey };
});

export const setEnvironment = createAsyncThunk('SET_ENVIRONMENT', async (environment, thunk) => {
  return { environment };
});

export const logoutAction = createAction('LOG_OUT');
