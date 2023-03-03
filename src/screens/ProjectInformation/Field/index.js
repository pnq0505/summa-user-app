import { connect } from 'react-redux';
import { setField } from '../../../store/features/project/action';
import Field from './Field';

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  setField,
};

export default connect(mapStateToProps, mapDispatchToProps)(Field);
