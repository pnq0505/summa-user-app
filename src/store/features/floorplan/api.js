import { client } from '../../api/base';
import { getApiKeyHeader } from '../../utilities';
import { getFloorplanListQuery } from './graphql/floorplan.gql-query';

export const fetchFloorplansAPI = async (baseUrl, apiKey, projectKey) => {
  const request = client(baseUrl);
  return await request({
    method: 'post',
    headers: getApiKeyHeader(apiKey),
    data: getFloorplanListQuery(1, 100, projectKey),
  });
};
