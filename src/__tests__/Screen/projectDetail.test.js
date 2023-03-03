import * as React from 'react';
import { render, screen } from '@testing-library/react-native';
import { clear } from 'jest-useragent-mock';
import { Provider } from 'react-redux';
import { store } from '../../store';
import { logoutAction, setApiKey, setEnvironment } from '../../store/features/installer/action';
import { fetchProject } from '../../store/features/project/action';
import { installer, tempProject } from '../env';
import { server } from '../../mocks/msw/server';
import ProjectInformation from '../../screens/ProjectInformation';

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
  test('Information in the screen', async () => {
    const response = await store.dispatch(fetchProject(tempProject.key));
    expect(response.type).toEqual('FETCH_PROJECT/fulfilled');
    const navigation = { navigate: jest.fn() };
    const component = (
      <Provider store={store}>
        <ProjectInformation navigation={navigation} />
      </Provider>
    );
    render(component);

    expect(screen.getByText('Project')).toBeOnTheScreen();
    expect(screen.getByText('Generals')).toBeOnTheScreen();
    expect(screen.getByText('Settings')).toBeOnTheScreen();
    expect(screen.getByText(tempProject.name)).toBeOnTheScreen();
    expect(screen.getByText(tempProject.key)).toBeOnTheScreen();
    expect(screen.getByText(tempProject.apiKey)).toBeOnTheScreen();
    expect(screen.getByText(tempProject.settings.wifiSsid)).toBeOnTheScreen();
    expect(screen.getByText(tempProject.timezone)).toBeOnTheScreen();
    expect(screen.getByText(tempProject.gatewayKey)).toBeOnTheScreen();
  });

  test('Button in the screen', async () => {
    const response = await store.dispatch(fetchProject(tempProject.key));
    expect(response.type).toEqual('FETCH_PROJECT/fulfilled');

    const navigation = { navigate: jest.fn() };
    const component = (
      <Provider store={store}>
        <ProjectInformation navigation={navigation} />
      </Provider>
    );
    render(component);

    expect(screen.getByText('Remove project')).toBeOnTheScreen();

    const backButton = await screen.getByLabelText('header-left');
    expect(backButton).toBeOnTheScreen();
  });
});
