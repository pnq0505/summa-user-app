const getGeneralInfo = (state) => state.general || {};

export const hasInternet = (state) => getGeneralInfo(state).hasInternetConnection;
