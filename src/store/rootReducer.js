import { combineReducers } from '@reduxjs/toolkit';

import device from './features/device/reducer';
import entity from './features/entity/reducer';
import fixture from './features/fixture/reducer';
import floorplan from './features/floorplan/reducer';
import general from './features/general/reducer';
import installer from './features/installer/reducer';
import project from './features/project/reducer';
import viewer from './features/viewer/reducer';

const rootReducer = combineReducers({
  floorplan,
  installer,
  fixture,
  device,
  viewer,
  entity,
  general,
  project,
});

export default rootReducer;
