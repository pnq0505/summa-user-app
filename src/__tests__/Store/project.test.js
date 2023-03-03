import { server } from '../../mocks/msw/server';
import { store } from '../../store';
import { logoutAction, setApiKey, setEnvironment } from '../../store/features/installer/action';

import {
  fetchProject,
  removeProject,
  setField,
  setSelectedProject,
  updateProject,
} from '../../store/features/project/action';
import {
  getSelectedProjectId,
  getSelectedProjectKey,
  getProjectIds,
  getUnSaveProjectInfo,
} from '../../store/features/project/selector';
import { installer, tempProject } from '../env';

beforeAll(async () => {
  await store.dispatch(setApiKey(installer.apiKey));
  await store.dispatch(setEnvironment(installer.environment));
  server.listen({ onUnhandledRequest: 'bypass' });
});

afterAll(() => {
  store.dispatch(logoutAction());
  server.close();
});

afterEach(() => {
  server.resetHandlers();
});

describe('Test project store', () => {
  test('Initial project state', () => {
    const state = store.getState().project;

    expect(state.projectIds).toEqual([]);
    expect(state.selectedProjectId).toEqual(null);
    expect(state.selectedProjectKey).toEqual(null);
    expect(state.unsaveProjectInfo).toEqual({});
  });

  test('Fetch project action', async () => {
    const response = await store.dispatch(fetchProject(tempProject.key));
    expect(response.type).toEqual('FETCH_PROJECT/fulfilled');

    const { entities, result } = response.payload;
    const project = entities.projects[result];
    expect(getSelectedProjectId(store.getState())).toEqual(result);
    expect(getSelectedProjectKey(store.getState())).toEqual(project.key);

    const projectIds = getProjectIds(store.getState());
    expect(projectIds).toContain(result);
  });

  test('Set field action', async () => {
    await store.dispatch(setField({ fieldName: 'name', value: 'project name' }));
    expect(getUnSaveProjectInfo(store.getState()).name).toEqual('project name');

    await store.dispatch(setField({ fieldName: 'settings.wifiSsid', value: 'wifi name' }));
    expect(getUnSaveProjectInfo(store.getState()).settings.wifiSsid).toEqual('wifi name');
  });

  test('Patch project action', async () => {
    await store.dispatch(setSelectedProject(tempProject));

    const response = await store.dispatch(updateProject(tempProject));
    expect(response.type).toEqual('UPDATE_PROJECT/fulfilled');

    const { entities, result } = response.payload;
    const project = entities.projects[result];
    expect(getSelectedProjectId(store.getState())).toEqual(result);
    expect(getSelectedProjectKey(store.getState())).toEqual(project.key);

    const projectIds = getProjectIds(store.getState());
    expect(projectIds).toContain(result);
  });

  test('Remove project action', async () => {
    await store.dispatch(removeProject(tempProject.id));
    expect(getProjectIds(store.getState())).not.toContain(tempProject.id);
  });

  test('Logout action', () => {
    store.dispatch(logoutAction);
    expect(getUnSaveProjectInfo(store.getState())).toEqual({});
  });
});
