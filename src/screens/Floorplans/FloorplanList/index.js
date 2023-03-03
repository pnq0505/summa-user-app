import { connect } from 'react-redux';
import FloorplanList from './FloorplanList';

import { setSelectedFlooplanId } from '../../../store/features/floorplan/action';
import { getFloorplanFixtureStatusQuantity } from '../../../store/features/floorplan/selector';

const mapStateToProps = (state) => ({
  fixturesStatusQuantity: getFloorplanFixtureStatusQuantity(state),
});
const mapDispatchToProps = {
  setSelectedFlooplanId,
};

export default connect(mapStateToProps, mapDispatchToProps)(FloorplanList);
