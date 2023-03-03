export const fetchProjectQuery = (projectKey) => {
  return {
    query: `query Query($findProjectId: String!) {
      findProject(id: $findProjectId) {
        id
        name
        key
        apiKey
        settings {
          wifiSsid
          wifiPassword
        }
        gatewayKey
        timezone
      }
    }`,
    variables: { findProjectId: projectKey },
  };
};
