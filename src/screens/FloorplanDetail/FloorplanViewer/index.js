import { connect } from 'react-redux';

import FloorplanViewer from './FloorplanViewer';

import {
  deleteDeviceByFixtureIdAction,
  initDeviceList,
  replaceDeviceByFixtureIdAction,
} from '../../../store/features/device/action';

import {
  getCurrentFixtureIdAction,
  moveFixture,
  writeFixtureFileAction,
} from '../../../store/features/fixture/action';

import {
  clearAllModal,
  selectedFixtureId as setSelectedFixture,
} from '../../../store/features/viewer/action';

import { getDevicesByFixtureId } from '../../../store/features/device/selector';
import {
  getMixedFixtures,
  getTempFixturesOfflineSelector,
} from '../../../store/features/fixture/selector';
import { getSelectedFixture } from '../../../store/features/viewer/selector';

const mapStateToProps = (state) => ({
  deviceByFixtureId: getDevicesByFixtureId(state),
  fixtureList: getMixedFixtures(state),
  fixtureForSubmit: getTempFixturesOfflineSelector(state),
  selectedFixture: getSelectedFixture(state),
});

const mapDispatchToProps = {
  deleteDeviceByFixtureIdAction,
  replaceDeviceByFixtureIdAction,
  writeFixtureFileAction,
  getCurrentFixtureIdAction,
  initDeviceList,
  clearAllModal,
  setSelectedFixture,
  moveFixture,
};

export default connect(mapStateToProps, mapDispatchToProps)(FloorplanViewer);
