export const getApiKeyHeader = (apiKey) => ({
  'Content-Type': 'application/json',
  Authorization: `api-key ${apiKey}`,
});
