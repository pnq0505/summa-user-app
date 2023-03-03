import { store } from '../../store';
import { clearAllModal, hideCurrentModal, showModal } from '../../store/features/viewer/action';
import { getPopupHistory } from '../../store/features/viewer/selector';

describe('Test viewer store', () => {
  test('Initial viewer state', () => {
    const state = store.getState().viewer;

    expect(state.popupHistory).toEqual([]);
    expect(state.selectedFixtureId).toBeUndefined();
  });

  test('Show modal action', () => {
    store.dispatch(showModal({ modalId: 1 }));
    expect(getPopupHistory(store.getState())).toContain(1);
  });

  test('Hide current modal action', () => {
    store.dispatch(showModal({ modalId: 1 }));
    store.dispatch(showModal({ modalId: 2 }));
    store.dispatch(hideCurrentModal());

    expect(getPopupHistory(store.getState())).toContain(1);
    expect(getPopupHistory(store.getState())).not.toContain(2);
  });

  test('Clear all modal action', () => {
    store.dispatch(clearAllModal());
    expect(getPopupHistory(store.getState())).toEqual([]);
  });
});
