export const getInstallerQuery = (apiKey) => {
  return {
    query: `query FindDriver($apiKey: String!) {
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

export const getFloorplanListQuery = (page = 1, limit = 1000, projectKey) => {
  return {
    query: `query FindFloorplans($skip: Int, $take: Int, $filters: [PaginatedFloorplanFilterPagination!]) {
      findFloorplans(skip: $skip, take: $take, filters: $filters) {
        meta {
          total
        }
        result {
          id
          name
          description
          fileName
          fileLocation
          projectKey
        }
      }
    }`,
    variables: {
      skip: (page - 1) * limit,
      take: limit,
      filters: [{ field: 'projectKey', value: projectKey }],
    },
  };
};
