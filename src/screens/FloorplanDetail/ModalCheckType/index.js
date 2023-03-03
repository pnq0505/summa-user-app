import { connect } from 'react-redux';

import { addDeviceByFixtureIdAction } from '../../../store/features/device/action';
import { fetchDriverBySerialNumberAction } from '../../../store/features/driver/action';
import { writeFixtureFileAction } from '../../../store/features/fixture/action';
import { clearAllModal, hideCurrentModal, showModal } from '../../../store/features/viewer/action';
import { getActiveModalId } from '../../../store/features/viewer/selector';
import ModalCheckType from './ModalCheckType';

const mapStateToProps = (state) => ({
  activeModalId: getActiveModalId(state),
});

const mapDispatchToProps = {
  clearAllModal,
  showModal,
  hideCurrentModal,
  addDeviceByFixtureIdAction,
  writeFixtureFileAction,
  fetchDriverBySerialNumberAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalCheckType);
