import { connect } from 'react-redux';
import Floorplans from './Floorplans';

import { fetchFixturesForPloorlan } from '../../store/features/fixture/action';
import {
  fetchFloorplans,
  updateFixtureQuantityByFloorplanIdAction,
} from '../../store/features/floorplan/action';
import { logoutAction } from '../../store/features/installer/action';

import { getTempFixturesOfflineSelector } from '../../store/features/fixture/selector';
import { getFloorplanList } from '../../store/features/floorplan/selector';
import { getSelectedProjectKey } from '../../store/features/project/selector';

import { hasInternet } from '../../store/features/general/selector';

const mapStateToProps = (state) => ({
  floorplanList: getFloorplanList(state),
  projectKey: getSelectedProjectKey(state),
  unsavedFixtures: getTempFixturesOfflineSelector(state),
  hasInternet: hasInternet(state),
});

const mapDispatchToProps = {
  updateFixtureQuantityByFloorplanIdAction,
  logoutAction,
  fetchFloorplans,
  fetchFixturesForPloorlan,
};

export default connect(mapStateToProps, mapDispatchToProps)(Floorplans);
