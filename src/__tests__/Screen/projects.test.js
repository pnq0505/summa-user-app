import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { clear } from 'jest-useragent-mock';
import { Provider } from 'react-redux';
import { store } from '../../store';
import Projects from '../../screens/Projects';
import { logoutAction, setApiKey, setEnvironment } from '../../store/features/installer/action';
import { fetchProject } from '../../store/features/project/action';
import { installer, tempProject } from '../env';
import { server } from '../../mocks/msw/server';
import Route from '../../navigation/Route';
import { act } from 'react-test-renderer';

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
  clear();
  server.resetHandlers();
});

describe('Projects screen', () => {
  test('Projects screen When have no projects', async () => {
    const navigation = { navigate: jest.fn() };
    const component = (
      <Provider store={store}>
        <Projects navigation={navigation} />
      </Provider>
    );
    render(component);

    const header = await screen.getByText('Projects');
    const content = await screen.getByText('No projects have been scanned yet.');
    const scanProjectButton = await screen.getByLabelText('scan-project');
    expect(header).toBeOnTheScreen();
    expect(content).toBeOnTheScreen();
    expect(scanProjectButton).toBeOnTheScreen();
  });

  test('Projects screen When have scanned projects', async () => {
    const response = await store.dispatch(fetchProject(tempProject.key));
    expect(response.type).toEqual('FETCH_PROJECT/fulfilled');

    const navigation = { navigate: jest.fn() };
    const component = (
      <Provider store={store}>
        <Projects navigation={navigation} />
      </Provider>
    );
    render(component);

    const header = await screen.getByText('Projects');
    const projectName = await screen.getByText(tempProject.name);
    expect(header).toBeOnTheScreen();
    expect(projectName).toBeOnTheScreen();
  });
});

describe('Navigation in projects screen', () => {
  test('Navigate to scan project screen', async () => {
    const navigation = { navigate: jest.fn() };
    const component = (
      <Provider store={store}>
        <Route navigation={navigation} />
      </Provider>
    );
    render(component);

    const header = await screen.getByLabelText('header-label');
    expect(header).toBeOnTheScreen();
    expect(header._fiber.child.stateNode.text).toMatch(/Projects/);

    const scanProjectButton2 = await screen.getByLabelText('header-right');
    expect(scanProjectButton2).toBeOnTheScreen();

    await act(() => {
      fireEvent.press(scanProjectButton2);
    });
    const scanProjectScreen = await screen.getByText('Scan QR');

    expect(scanProjectScreen).toBeOnTheScreen();
  });

  test('Navigate to floorplan screen', async () => {
    const response = await store.dispatch(fetchProject(tempProject.key));
    expect(response.type).toEqual('FETCH_PROJECT/fulfilled');

    const navigation = { navigate: jest.fn() };
    const component = (
      <Provider store={store}>
        <Route navigation={navigation} />
      </Provider>
    );
    render(component);

    const state = store.getState().project;
    expect(state.projectIds.length).toBeGreaterThan(0);

    const header1 = await screen.getByLabelText('header-label');
    expect(header1).toBeOnTheScreen();
    expect(header1._fiber.child.stateNode.text).toMatch(/Projects/);
    const project = await screen.getByLabelText(`project-${tempProject.id}`);
    expect(project).toBeOnTheScreen();

    await act(() => {
      fireEvent.press(project);
    });

    const header2 = await screen.getAllByLabelText('header-label')[1];
    expect(header2).toBeOnTheScreen();
    expect(header2._fiber.child.stateNode.text).toMatch(/Floorplans/);
  });
});
