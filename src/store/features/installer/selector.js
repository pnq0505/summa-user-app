const getInstallerInfo = (state) => state.installer || {};

export const getApikey = (state) => getInstallerInfo(state).apiKey;
export const getHttpEnvironment = (state) => getInstallerInfo(state).httpEnvironment;
export const getWsEnvironment = (state) => getInstallerInfo(state).wsEnvironment;
export const getProjectKey = (state) => getInstallerInfo(state).projectKey;
