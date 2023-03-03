import * as React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { clear } from 'jest-useragent-mock';
import { Provider } from 'react-redux';
import { store } from '../../store';
import Route from '../../navigation/Route';
import { logoutAction, setApiKey, setEnvironment } from '../../store/features/installer/action';
import { fetchProject } from '../../store/features/project/action';
import { installer, tempProject } from '../env';
import Floorplans from '../../screens/Floorplans';
import { fetchFloorplans } from '../../store/features/floorplan/action';
import { server } from '../../mocks/msw/server';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'bypass' });
});

beforeEach(async () => {
  await store.dispatch(setApiKey(installer.apiKey));
  await store.dispatch(setEnvironment(installer.environment));
  await store.dispatch(fetchFloorplans(tempProject.key));
});

afterAll(() => {
  store.dispatch(logoutAction());
  server.close();
});

afterEach(() => {
  clear();
  server.resetHandlers();
});

describe('Floorplans screen', () => {
  test('Header label', async () => {
    const navigation = { navigate: jest.fn() };
    const component = (
      <Provider store={store}>
        <Floorplans navigation={navigation} />
      </Provider>
    );
    render(component);
    const header = await screen.getByText('Floorplans');
    expect(header).toBeOnTheScreen();
  });

  test('Back to projects screen button', async () => {
    const navigation = { navigate: jest.fn() };
    const component = (
      <Provider store={store}>
        <Floorplans navigation={navigation} />
      </Provider>
    );
    render(component);
    const backButton = await screen.getByLabelText('header-left');
    expect(backButton).toBeOnTheScreen();
  });
});

describe('Navigation in floorplans screen', () => {
  // test('Navigate to floorplan detail screen', async () => {
  //   const response = await store.dispatch(fetchProject(tempProject.key));
  //   expect(response.type).toEqual('FETCH_PROJECT/fulfilled');
  //   const navigation = { navigate: jest.fn() };
  //   const component = (
  //     <Provider store={store}>
  //       <Floorplans navigation={navigation} />
  //     </Provider>
  //   );
  //   render(component);
  //   const projectsScreen = await screen.getByLabelText('header-label');
  //   expect(projectsScreen).toBeOnTheScreen();
  //   expect(projectsScreen._fiber.child.stateNode.text).toMatch(/Floorplans/);

  //   const floor = await screen.getByLabelText(`floorplan-${floorplan.id}`);
  //   expect(floor).toBeOnTheScreen();
  //   await act(() => {
  //     fireEvent.press(floor);
  //   });
  //   const floorplanName = await screen.getByLabelText('header-label');
  //   expect(floorplanName._fiber.child.stateNode.text).toMatch(/${floorplan.name}/);
  // });

  test('Navigate to project detail screen', async () => {
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
    /* navigate from projects screen to floorplans screen */
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

    const bottomTabProject = await screen.getAllByLabelText('bottom-tab-Project')[0];
    expect(bottomTabProject).toBeOnTheScreen();
    await act(() => {
      fireEvent.press(bottomTabProject);
    });
    const floorplanName = await screen.getAllByLabelText('header-label')[0];
    expect(floorplanName._fiber.child.stateNode.text).toMatch(/Project/);
  });
});
