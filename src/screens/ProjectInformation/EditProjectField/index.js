import { connect } from 'react-redux';
import { setField } from '../../../store/features/project/action';
import EditProjectField from './EditProjectField';

const mapStateToProps = (state) => ({});

const mapDispatchToProps = { setField };

export default connect(mapStateToProps, mapDispatchToProps)(EditProjectField);
