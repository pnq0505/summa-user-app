export const patchFixtureMutation = (fixtures) => {
  return {
    query: `mutation PatchFixtures($fixtures: [FixturePatchInput!]!) {
        patchFixtures(fixtures: $fixtures) {
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
          devices {
            key
          }
        }
      }`,
    variables: {
      fixtures: fixtures,
    },
  };
};
