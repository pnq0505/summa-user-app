export const queryFixtureListByFloorplanKey = (floorplanKey, page = 1, limit = 1000) => {
  return {
    query: `query Query($skip: Int, $take: Int, $filters: [PaginatedFixtureFilterPagination!]) {
        findFixtures(skip: $skip, take: $take, filters: $filters) {
          result {
            id
            floorplanKey
            location {
              x
              y
              height
            }
            mainGroup
            type
            status
            deviceKeys
            iconData
          }
        }
      }`,
    variables: {
      skip: (page - 1) * limit,
      take: limit,
      filters: [
        {
          field: 'floorplanKey',
          value: floorplanKey,
        },
      ],
    },
  };
};
