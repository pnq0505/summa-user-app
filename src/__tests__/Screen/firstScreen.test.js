import * as React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { store } from '../../store';
import AppNavigator from '../../navigation';
import { logoutAction, setApiKey, setEnvironment } from '../../store/features/installer/action';
import { fetchProject } from '../../store/features/project/action';
import { installer, tempProject } from '../env';
import { server } from '../../mocks/msw/server';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'bypass' });
});

beforeEach(async () => {
  await store.dispatch(setApiKey(installer.apiKey));
  await store.dispatch(setEnvironment(installer.environment));
});

afterAll(() => {
  store.dispatch(logoutAction());
  server.close();
});

afterEach(() => {
  //   clear();
  server.resetHandlers();
});

describe('Checking first screen', () => {
  test('First screen is scan project screen if have no projects', async () => {
    const navigation = { navigate: jest.fn() };
    const component = (
      <Provider store={store}>
        <AppNavigator navigation={navigation} />
      </Provider>
    );
    render(component);

    const state = store.getState().project;
    expect(state.projectIds).toEqual([]);

    const header = await screen.getByText('Camera');
    const content = await screen.getByText('Scan QR');
    expect(header).toBeOnTheScreen();
    expect(content).toBeOnTheScreen();
  });

  test('First screen is projects screen if have scanned projects', async () => {
    const response = await store.dispatch(fetchProject(tempProject.key));
    expect(response.type).toEqual('FETCH_PROJECT/fulfilled');

    const navigation = { navigate: jest.fn() };
    const component = (
      <Provider store={store}>
        <AppNavigator navigation={navigation} />
      </Provider>
    );
    render(component);

    const state = store.getState().project;
    expect(state.projectIds.length).toBeGreaterThan(0);

    const header = await screen.getByLabelText('header-label');
    expect(header).toBeOnTheScreen();
    expect(header._fiber.child.stateNode.text).toMatch(/Projects/);
    const content = await screen.getByText(tempProject.name);
    expect(content).toBeOnTheScreen();
  });
});
