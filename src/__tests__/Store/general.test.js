import { store } from '../../store';

import { setInternetConnectionStatus } from '../../store/features/general/action';
import { hasInternet } from '../../store/features/general/selector';

describe('Test general store', () => {
  test('Initial general state', () => {
    const state = store.getState().general;

    expect(state.hasInternetConnection).toBeTruthy();
  });

  test('Set internet connection status action', () => {
    store.dispatch(setInternetConnectionStatus(false));

    expect(hasInternet(store.getState())).toBeFalsy();
  });
});
