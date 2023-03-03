import { connect } from 'react-redux';

import { getActiveModalId } from '../../../store/features/viewer/selector';
import { showModal, clearAllModal, hideCurrentModal } from '../../../store/features/viewer/action';
import ModalDeviceScanner from './ModalDeviceScanner';

const mapStateToProps = (state) => ({
  activeModalId: getActiveModalId(state),
});

const mapDispatchToProps = {
  clearAllModal,
  showModal,
  hideCurrentModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalDeviceScanner);
