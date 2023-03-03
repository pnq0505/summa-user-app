import { server } from '../../mocks/msw/server';
import { store } from '../../store';
import {
  fetchInstaller,
  logoutAction,
  setApiKey,
  setEnvironment,
  setProjectKey,
} from '../../store/features/installer/action';
import {
  getProjectKey,
  getApikey,
  getHttpEnvironment,
  getWsEnvironment,
} from '../../store/features/installer/selector';
import { installer as tempInstaller } from '../env';

const url = tempInstaller.environment.split('://')[1];

test('Initial installer state', async () => {
  const state = store.getState().installer;
  expect(state.installerName).toEqual('');
  expect(state.projectKey).toEqual(null);
  expect(state.apiKey).toEqual(null);
  expect(state.httpEnvironment).toEqual('');
  expect(state.wsEnvironment).toEqual('');
});

describe('Test installer store', () => {
  beforeAll(async () => {
    await store.dispatch(setApiKey(tempInstaller.apiKey));
    await store.dispatch(setEnvironment(tempInstaller.environment));
    server.listen({ onUnhandledRequest: 'bypass' });
  });

  afterAll(() => {
    store.dispatch(logoutAction());
    server.close();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  test('Fetch installer action', async () => {
    const response = await store.dispatch(fetchInstaller());
    expect(response.type).toEqual('GET_INSTALLER_INFO/fulfilled');

    const installer = response.payload.data.findInstaller;
    expect(installer).toBeDefined();
    expect(installer).not.toBeNull();
    expect(store.getState().installer.installerName).toEqual(tempInstaller.name);
    expect(getProjectKey(store.getState())).toEqual(tempInstaller.projectKey);
  });

  test('Set API key action', () => {
    expect(getApikey(store.getState())).toEqual(tempInstaller.apiKey);
  });

  test('Set project key action', async () => {
    await store.dispatch(setProjectKey(tempInstaller.projectKey));
    expect(getProjectKey(store.getState())).toEqual(tempInstaller.projectKey);
  });

  test('Set environment action', async () => {
    expect(getHttpEnvironment(store.getState())).toEqual(tempInstaller.environment);
    expect(getWsEnvironment(store.getState())).toEqual(`ws://${url}`);

    await store.dispatch(setEnvironment(url));
    expect(getHttpEnvironment(store.getState())).toEqual(`https://${url}`);
    expect(getWsEnvironment(store.getState())).toEqual(`wss://${url}`);
  });

  test('Log out action', () => {
    store.dispatch(logoutAction());
    expect(getApikey(store.getState())).toBeNull();
    expect(getProjectKey(store.getState())).toBeNull();
    expect(getHttpEnvironment(store.getState())).toBeNull();
    expect(getWsEnvironment(store.getState())).toBeNull();
  });
});
