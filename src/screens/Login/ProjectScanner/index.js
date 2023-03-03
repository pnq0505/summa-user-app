import ProjectScanner from './ProjectScanner';

import { connect } from 'react-redux';
import { fetchFloorplans, getFloorplanListAction } from '../../../store/features/floorplan/action';
import { hasInternet } from '../../../store/features/general/selector';
import {
  fetchInstaller,
  logoutAction,
  setApiKey,
  setEnvironment,
} from '../../../store/features/installer/action';
import { getApikey, getProjectKey } from '../../../store/features/installer/selector';
import { fetchProject } from '../../../store/features/project/action';

const mapStateToProps = (state) => ({
  projectKey: getProjectKey(state),
  apiKey: getApikey(state),
  hasInternet: hasInternet(state),
});

const mapDispatchToProps = {
  fetchInstaller,
  getFloorplanListAction,
  setApiKey,
  setEnvironment,
  fetchFloorplans,
  fetchProject,
  logoutAction,
};
export default connect(mapStateToProps, mapDispatchToProps)(ProjectScanner);
