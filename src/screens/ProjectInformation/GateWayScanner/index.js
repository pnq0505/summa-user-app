import GateWayScanner from './GateWayScanner';

import { connect } from 'react-redux';

import { setField } from '../../../store/features/project/action';

const mapStateToProps = (state) => ({});

const mapDispatchToProps = { setField };

export default connect(mapStateToProps, mapDispatchToProps)(GateWayScanner);
