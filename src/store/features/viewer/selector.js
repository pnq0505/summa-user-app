import { createSelector } from 'reselect';
import { MODAL_IDS } from '../../../constants';
import { getMixedFixtures } from '../fixture/selector';

const defautState = () => {
  return {
    popupHistory: [],
    selectedFixtureId: undefined,
  };
};
const getStateData = (state) => state.viewer || defautState();

export const getPopupHistory = (state) => getStateData(state).popupHistory;
export const getSelectedFixtureId = (state) => getStateData(state).selectedFixtureId;

export const getSelectedFixture = createSelector(
  [getMixedFixtures, getSelectedFixtureId],
  (fixtures, id) => {
    return (fixtures || []).find((fixture) => fixture.id == id) || null;
  },
);

export const getActiveModalId = createSelector([getPopupHistory], (popupHistory) => {
  if (popupHistory.length) {
    return popupHistory[popupHistory.length - 1];
  }
  return MODAL_IDS.UNKNOWN;
});
