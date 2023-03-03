import { connect } from 'react-redux';
import { fetchFloorplans } from '../../store/features/floorplan/action';
import { setApiKey, setEnvironment, setProjectKey } from '../../store/features/installer/action';
import { fetchProject, setSelectedProject } from '../../store/features/project/action';
import { getProjects } from '../../store/features/project/selector';
import Projects from './Projects';

const mapStateToProps = (state) => ({
  projects: getProjects(state),
});

const mapDispatchToProps = {
  setApiKey,
  setProjectKey,
  setSelectedProject,
  setEnvironment,
  fetchFloorplans,
  fetchProject,
};

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
