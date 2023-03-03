import { store } from '../../store';
import { logoutAction, setApiKey, setEnvironment } from '../../store/features/installer/action';

import {
  fetchFloorplans,
  setSelectedFlooplanId,
  updateFixtureStatusQuantityFromSocket,
} from '../../store/features/floorplan/action';
import {
  getFloorplanId,
  getFloorplanFixtureStatusQuantity,
} from '../../store/features/floorplan/selector';
import {
  fetchFixturesForPloorlan,
  syncLiveUpdatedFixtures,
} from '../../store/features/fixture/action';
import { inReview, approved, toBeReScanned } from '../../constants';
import { installer, tempProject, floorplan } from '../env';
import { server } from '../../mocks/msw/server';

const defaultFloorplanStatus = () => {
  return {
    toBeConfigured: 0,
    inReview: 0,
    approved: 0,
    toBeReScanned: 0,
  };
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
  server.resetHandlers();
});

describe('Test floorplan store', () => {
  test('Initial floorplan state', () => {
    const state = store.getState().floorplan;

    expect(state.floorplanStatus).toEqual({});
    expect(state.selectedFloorplanId).toEqual('');
  });

  test('Fetch floorplans action', async () => {
    const response = await store.dispatch(fetchFloorplans(tempProject.key));

    const { entities, result } = response.payload;
    const floorplans = entities.floorplans;
    expect(response.type).toEqual('FETCH_FLOORPLANS/fulfilled');
    expect(result).toBeDefined();
    expect(result).not.toBeNull();
    expect(floorplans).toBeDefined();
    expect(floorplans).not.toBeNull();

    expect(getFloorplanFixtureStatusQuantity(store.getState())[result]).toEqual(
      defaultFloorplanStatus(),
    );
  });

  test('Fetch fixtures for floorplan action', async () => {
    const response = await store.dispatch(fetchFixturesForPloorlan({ floorplanKey: floorplan.id }));

    const { entities, result } = response.payload;
    let fixtures = entities.fixtures;
    expect(response.type).toEqual('FETCH_FIXTURES_FOR_FLOORPLAN/fulfilled');
    expect(result).toBeDefined();
    expect(result).not.toBeNull();
    expect(fixtures).toBeDefined();
    expect(fixtures).not.toBeNull();

    fixtures = Object.values(entities?.fixtures || {});
    let statusQuantity = defaultFloorplanStatus();
    fixtures.forEach((fixture) => {
      switch (fixture.status) {
        case inReview:
          statusQuantity.inReview += 1;
          break;
        case approved:
          statusQuantity.approved += 1;
          break;
        case toBeReScanned:
          statusQuantity.toBeReScanned += 1;
          break;
        default:
          statusQuantity.toBeConfigured += 1;
          break;
      }
    });

    expect(getFloorplanFixtureStatusQuantity(store.getState())[floorplan.id]).toEqual(
      statusQuantity,
    );
  });

  test('Set selected floorplan action', () => {
    store.dispatch(setSelectedFlooplanId(floorplan.id));

    expect(getFloorplanId(store.getState())).toEqual(floorplan.id);
  });

  test('Update fixtures quantity from socket action', async () => {
    let response = await store.dispatch(fetchFixturesForPloorlan({ floorplanKey: floorplan.id }));

    const { entities, result } = response.payload;
    let fixtures = entities.fixtures;
    expect(response.type).toEqual('FETCH_FIXTURES_FOR_FLOORPLAN/fulfilled');
    expect(result).toBeDefined();
    expect(result).not.toBeNull();
    expect(fixtures).toBeDefined();
    expect(fixtures).not.toBeNull();

    fixtures = Object.values(entities?.fixtures || {});
    let statusQuantity = defaultFloorplanStatus();
    fixtures.forEach((fixture) => {
      switch (fixture.status) {
        case inReview:
          statusQuantity.inReview += 1;
          break;
        case approved:
          statusQuantity.approved += 1;
          break;
        case toBeReScanned:
          statusQuantity.toBeReScanned += 1;
          break;
        default:
          statusQuantity.toBeConfigured += 1;
          break;
      }
    });

    expect(getFloorplanFixtureStatusQuantity(store.getState())[floorplan.id]).toEqual(
      statusQuantity,
    );

    const fixture = {
      id: '63a12d1ce5075125b4aef383',
      floorplanKey: '63a12d1ce5075125b4aef381',
      location: {
        x: 37235.17333374672,
        y: 1684.89625283108,
        height: 0,
      },
      mainGroup: '',
      type: '',
      status: 'in-review',
      deviceKeys: [],
      iconData: {
        type: 'INSERT',
        handle: '622F',
        ownerHandle: '75',
        layer: 'EL63101-_LICHT-ARM',
        name: 'Dea Carmenta S',
        position: {
          x: 37235.17333374672,
          y: 1684.89625283108,
          z: 0,
        },
      },
    };

    response = await store.dispatch(syncLiveUpdatedFixtures({ fixtures: fixture }));
    expect(response.type).toEqual('SOCKET_SYNC_LIVE_UPDATED_FIXTURE/fulfilled');

    response = await store.dispatch(
      updateFixtureStatusQuantityFromSocket('63a12d1ce5075125b4aef381'),
    );

    expect(response.type).toEqual('UPDATE_FIXTURE_STATUS_QUANTITY_FROM_SOCKET/fulfilled');
    statusQuantity.inReview += 1;
    statusQuantity.toBeConfigured -= 1;

    expect(getFloorplanFixtureStatusQuantity(store.getState())[floorplan.id]).toEqual(
      statusQuantity,
    );
  });
});
