import { denormalize } from 'normalizr';
import { createSelector } from 'reselect';

import { fixtureSchema } from '../../normalizr/schema';
import { getFixtureEntities } from '../entity/selector';

import { defaultFixtureState } from './reducer';

const getFixtureSelector = (state) => state.fixture || defaultFixtureState;

export const getCurrentFloorplanFixtureIds = (state) =>
  getFixtureSelector(state).currentFloorplanFixureIds || [];

// This selector has all fixtures when user go to a floorplan
export const getCurrentFloorplanFixtures = createSelector(
  [getFixtureEntities, getCurrentFloorplanFixtureIds],
  (fixtures, fixtureIds) => {
    const ftx = denormalize(fixtureIds, [fixtureSchema], {
      fixtures,
    });
    return ftx;
  },
);

export const getFixtureListByFloorplanSelector = (state) => getFixtureSelector(state).fixtures;

export const getSelectedFixtures = (state) => getFixtureSelector(state).selectedFixtures;

export const getSelectedFixtureId = (state) => getFixtureSelector(state).currentFixtureId;

export const getTempFixturesOfflineSelector = (state) =>
  getFixtureSelector(state).tempFixturesOffline;

export const getChanges = (state) => getFixtureSelector(state).tempFixturesOffline;

export const getUnsavedFixtures = (state) =>
  getFixtureSelector(state).tempFixturesOffline.map((fixture) => {
    const { deviceKeys, floorplanKey, status, ...res } = fixture;
    return res;
  });

// This is the final fixtures that we should show in the floorplan.
// It has the original data and the unsaved change when we work offline
export const getMixedFixtures = createSelector(
  [getCurrentFloorplanFixtures, getChanges],
  (originalFixtures, unsavedFixtures) => {
    const patchFixtures = unsavedFixtures.reduce((a, v) => ({ ...a, [v.id]: v }), {});
    return originalFixtures.map((fixture) => {
      return { ...fixture, ...(patchFixtures[fixture.id] || {}) };
    });
  },
);

const getFloorplanKeyFromSocKet = (state) => getFixtureSelector(state).floorplanKeyFromSocket;

export const getFixturesForFloorplan = createSelector(
  [getFixtureEntities, getFloorplanKeyFromSocKet],
  (fixturesEntities, floorplanKey) => {
    const fixtures = Object.values(fixturesEntities);
    return fixtures.filter((fixture) => fixture.floorplanKey === floorplanKey);
  },
);
