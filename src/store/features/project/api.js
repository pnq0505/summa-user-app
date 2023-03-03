import { client } from '../../api/base';
import { getApiKeyHeader } from '../../utilities';
import { patchProjectMutation } from './graphql/project.gql-mutation';
import { fetchProjectQuery } from './graphql/project.gql-query';

export const fetchProjectAPI = async (baseUrl, apiKey, projectKey) => {
  const request = client(baseUrl);
  return await request({
    method: 'post',
    headers: getApiKeyHeader(apiKey),
    data: fetchProjectQuery(projectKey),
  });
};

export const patchProjectAPI = async (baseUrl, apiKey, project) => {
  const request = client(baseUrl);
  return await request({
    method: 'post',
    headers: getApiKeyHeader(apiKey),
    data: patchProjectMutation(project),
  });
};
