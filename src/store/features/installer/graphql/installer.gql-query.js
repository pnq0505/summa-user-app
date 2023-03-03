export const getInstallerQuery = (apiKey) => {
  return {
    query: `query Query($apiKey: String!) {
      findInstaller(apiKey: $apiKey) {
        id
        name
        apiKey
        enabled
        projectKey
        modified
        removed
      }
    }`,
    variables: { apiKey: apiKey },
  };
};
