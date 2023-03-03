import { client } from '../../api/base';
import { getApiKeyHeader } from '../../utilities';

import { queryDriverBySerialNumber } from './graphql/driver.gql-query';

export const fetchDriverBySerialNumberAPI = async (baseUrl, apiKey, serialNumber) => {
  const request = client(baseUrl);
  return await request({
    method: 'post',
    headers: getApiKeyHeader(apiKey),
    data: queryDriverBySerialNumber(serialNumber),
  });
};
