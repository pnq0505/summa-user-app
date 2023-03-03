import * as React from 'react';
import { render, screen } from '@testing-library/react-native';
import { clear } from 'jest-useragent-mock';
import { Provider } from 'react-redux';
import { store } from '../../store';
import { logoutAction, setApiKey, setEnvironment } from '../../store/features/installer/action';
import { installer } from '../env';
import { server } from '../../mocks/msw/server';
import FloorplanDetail from '../../screens/FloorplanDetail';
import FloorplanViewer from '../../screens/FloorplanDetail/FloorplanViewer';

const floorplan = {
  description: '',
  fileLocation:
    'https://summa-floorplan-storage.s3-eu-west-1.amazonaws.com/cocoma-470653/Summa VdV Best Kamer 1 (3rd copy).json',
  fileName: 'Summa VdV Best Kamer 1 (3rd copy).json',
  id: '63a12d1ce5075125b4aef381',
  name: 'summa vdv best kamer 1 (3rd copy)',
  projectKey: 'cocoma-470653',
};

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

describe('Project information screen', () => {
  test('Header of the screen', async () => {
    const navigation = { navigate: jest.fn() };
    const route = {
      params: { floorplan },
    };
    const component = (
      <Provider store={store}>
        <FloorplanDetail navigation={navigation} route={route} />
      </Provider>
    );
    render(component);

    expect(screen.getByText(route.params.floorplan.name)).toBeOnTheScreen();
  });

  //   test('Testing floorplan viewer render', async () => {
  //     const filePath = { url: 'src/__tests__/Screen/dxf-test.json' };
  //     const component = (
  //       <Provider store={store}>
  //         <FloorplanViewer loadingDxf={false} setLoadingDxf={() => {}} filePath={filePath} />
  //       </Provider>
  //     );
  //     render(component);
  //     expect(screen.queryByTestId('floorplan-viewer')).toBeOnTheScreen();
  //   });
});
