import { connect } from 'react-redux';

import { clearAllModal, hideCurrentModal, showModal } from '../../../store/features/viewer/action';
import { getActiveModalId } from '../../../store/features/viewer/selector';
import ModalConfirmDelete from './ModalConfirmDelete';

const mapStateToProps = (state) => ({
  activeModalId: getActiveModalId(state),
});

const mapDispatchToProps = {
  clearAllModal,
  showModal,
  hideCurrentModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalConfirmDelete);
