export const patchProjectMutation = (project) => {
  return {
    query: `mutation Mutation($project: ProjectPartialInput!) {
      patchProject(project: $project) {
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
    variables: { project: project },
  };
};
