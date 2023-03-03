import { client } from '../../api/base';
import { getApiKeyHeader } from '../../utilities';
import { getInstallerQuery } from './graphql/installer.gql-query';

export const fetchInstallerAPI = async (baseUrl, apiKey) => {
  const request = client(baseUrl);
  return await request({
    method: 'post',
    headers: getApiKeyHeader(apiKey),
    data: getInstallerQuery(apiKey),
  });
};
