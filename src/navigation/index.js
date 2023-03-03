import { connect } from 'react-redux';

import AppNavigator from './AppNavigator';

import { updateDeviceDataFromSocket } from '../store/features/device/action';
import {
  loadOfflineFixturesForPloorlan,
  syncLiveUpdatedFixtures,
} from '../store/features/fixture/action';
import { updateFixtureStatusQuantityFromSocket } from '../store/features/floorplan/action';
import { setInternetConnectionStatus } from '../store/features/general/action';
import { logoutAction } from '../store/features/installer/action';

import { getWsEnvironment } from '../store/features/installer/selector';

const mapStateToProps = (state) => ({
  wsUrl: getWsEnvironment(state),
});

const mapDispatchToProps = {
  updateDeviceDataFromSocket,
  updateFixtureStatusQuantityFromSocket,
  logoutAction,
  setInternetConnectionStatus,
  loadOfflineFixturesForPloorlan,
  syncLiveUpdatedFixtures,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppNavigator);
