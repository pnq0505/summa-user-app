import { createClient } from 'graphql-ws';

export const SocketClient = (baseUrl) => {
  return createClient({
    url: baseUrl,
    shouldRetry: () => true,
    retryAttempts: 10000,
    retryWait: async function waitForServerHealthyBeforeRetry() {
      // after the server becomes ready, wait for a second + 3s
      // (avoid DDoSing yourself) and try connecting again
      await new Promise((resolve) => setTimeout(resolve, 3000));
    },
  });
};

export const graphql_query_fixtures = {
  query: `subscription ObserveFixtureChange {
      observeFixtureChange {
        id
        floorplanKey
        location {
          x
          y
          height
        }
        mainGroup
        type
        deviceKeys
        status
        iconData

      }
    }`,
  operationName: 'ObserveFixtureChange',
};
