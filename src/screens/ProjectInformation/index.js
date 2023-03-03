import { connect } from 'react-redux';
import { hasInternet } from '../../store/features/general/selector';
import { logoutAction } from '../../store/features/installer/action';
import { removeProject, updateProject } from '../../store/features/project/action';
import {
  getProjectInformation,
  getSelectedProjectId,
  getUnSaveProjectInfo,
} from '../../store/features/project/selector';
import ProjectInformation from './ProjectInformation';

const mapStateToProps = (state) => ({
  projectInformation: getProjectInformation(state),
  hasInternet: hasInternet(state),
  unsaveProject: getUnSaveProjectInfo(state),
  selectedProjectId: getSelectedProjectId(state),
});

const mapDispatchToProps = {
  updateProject,
  logoutAction,
  removeProject,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectInformation);
