export const queryDriverBySerialNumber = (serialNumber) => {
  return {
    query: `query FindDriver($serialNumber: String!) {
        findDriver(key: $serialNumber) {
          key
          type
          address
          batch
          fabCode
          dateCode
          devices {
            key
            address
            type
            category
            settings
            location
            created
            modified
            removed
          }
          settings
          projectKey
          state
        }
      }
      `,
    variables: {
      serialNumber: serialNumber,
    },
  };
};
