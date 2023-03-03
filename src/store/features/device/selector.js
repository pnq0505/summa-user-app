import { defaultDeviceState } from './reducer';

const getDevicestate = (state) => state.device || defaultDeviceState;
export const getDevicesByFixtureId = (state) => getDevicestate(state).devices;
