import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { normalize } from 'normalizr';
import { projectSchema } from '../../normalizr/schema';
import { getApikey, getHttpEnvironment } from '../installer/selector';
import { fetchProjectAPI, patchProjectAPI } from './api';
import { getSelectedProjectKey } from './selector';

export const fetchProject = createAsyncThunk('FETCH_PROJECT', async (projectKey, thunk) => {
  const apiKey = getApikey(thunk.getState());
  const baseUrl = getHttpEnvironment(thunk.getState());
  const response = await fetchProjectAPI(baseUrl, apiKey, projectKey);
  if (!response) {
    return thunk.rejectWithValue('Unknown error');
  }
  const hasError = response?.data?.errors || false;
  if (hasError) {
    return thunk.rejectWithValue(hasError || 'Unknown error');
  } else {
    const project = response?.data?.data?.findProject;
    project.environment = baseUrl;
    project.installerApiKey = apiKey;
    return thunk.fulfillWithValue(normalize(project, projectSchema));
  }
});

export const updateProject = createAsyncThunk('UPDATE_PROJECT', async (project, thunk) => {
  const apiKey = getApikey(thunk.getState());
  const baseUrl = getHttpEnvironment(thunk.getState());
  const key = getSelectedProjectKey(thunk.getState());
  const patchProject = { ...project, key };
  const response = await patchProjectAPI(baseUrl, apiKey, patchProject);
  if (!response) {
    return thunk.rejectWithValue('Unknown error');
  }
  const hasError = response?.data?.errors || false;
  if (hasError) {
    return thunk.rejectWithValue(hasError || 'Unknown error');
  } else {
    const project = response?.data?.data?.patchProject;
    project.environment = baseUrl;
    project.installerApiKey = apiKey;
    return thunk.fulfillWithValue(normalize(project, projectSchema));
  }
});

export const setSelectedProject = createAction('SET_SELECTED_PROJECT', (project) => {
  return { payload: { project } };
});

export const setField = createAsyncThunk('SET_FIELD', ({ fieldName, value }, thunk) => {
  return { fieldName, value };
});

export const removeProject = createAction('REMOVE_PROJECT', (id) => {
  return {
    payload: { id },
  };
});

export const setUnsaveProjectInfo = createAction('SET_UNSAVE_PROJECT_INFO', (project) => {
  return {
    payload: { project },
  };
});
