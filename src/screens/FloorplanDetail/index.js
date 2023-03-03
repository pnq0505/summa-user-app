import { connect } from 'react-redux';
import FloorplanDetail from './FloorplanDetail';

import { showModal } from '../../store/features/viewer/action';

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  showModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(FloorplanDetail);
