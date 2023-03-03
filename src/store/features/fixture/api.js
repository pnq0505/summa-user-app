import { client } from '../../api/base';
import { getApiKeyHeader } from '../../utilities';
import { patchFixtureMutation } from './graphql/fixture.gql-mutation';

import { queryFixtureListByFloorplanKey } from './graphql/fixture.gql-query';

export const fetchFixturesAPI = async (baseUrl, apiKey, floorplanKey) => {
  const request = client(baseUrl);
  return await request({
    method: 'post',
    headers: getApiKeyHeader(apiKey),
    data: queryFixtureListByFloorplanKey(floorplanKey, 1, 1000),
  });
};

export const submitFixturesAPI = async (baseUrl, apiKey, fixtures) => {
  const request = client(baseUrl);
  return await request({
    method: 'post',
    headers: getApiKeyHeader(apiKey),
    data: patchFixtureMutation(fixtures),
  });
};
