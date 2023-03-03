import { connect } from 'react-redux';
import BottomTabNavigator from './BottomTabNavigator';

import { getUnsavedFixtures } from '../../store/features/fixture/selector';
import { hasInternet } from '../../store/features/general/selector';
import { logoutAction } from '../../store/features/installer/action';
import { getApikey, getProjectKey } from '../../store/features/installer/selector';
import { setUnsaveProjectInfo } from '../../store/features/project/action';
import { getProjectIds } from '../../store/features/project/selector';

import {
  cleanupAndLoadUnsavedFixtures,
  submitFixturesAction as submitFixtures,
} from '../../store/features/fixture/action';

const mapStateToProps = (state) => ({
  unsavedFixtures: getUnsavedFixtures(state),
  installerKey: getApikey(state),
  projectKey: getProjectKey(state),
  hasInternet: hasInternet(state),
  projectIds: getProjectIds(state),
});

const mapDispatchToProps = {
  cleanupAndLoadUnsavedFixtures,
  submitFixtures,
  logoutAction,
  setUnsaveProjectInfo,
};

export default connect(mapStateToProps, mapDispatchToProps)(BottomTabNavigator);
