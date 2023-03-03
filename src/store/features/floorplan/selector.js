import { createSelector } from 'reselect';

import { getFloorplanEntities } from '../entity/selector';
import { getSelectedProjectKey } from '../project/selector';

const getFloorplan = (state) => state.floorplan || {};

export const getFilePath = (state) => getFloorplan(state).filePath;
export const getFloorplanIds = (state) => getFloorplan(state).floorplanIds;
export const getFloorplanId = (state) => getFloorplan(state).selectedFloorplanId;
export const getFloorplanFixtureStatusQuantity = (state) => getFloorplan(state).floorplanStatus;

export const getFloorplanList = createSelector(
  [getFloorplanEntities, getSelectedProjectKey],
  (floorplans, projectKey) => {
    return Object.values(floorplans).filter((floorplan) => floorplan.projectKey === projectKey);
  },
);
