import { fetchDriverBySerialNumberAPI } from '../../store/features/driver/api';
import { installer, serialNumber } from '../env';

describe('Test driver API', () => {
  test('Failed fetch installer API', async () => {
    const response = await fetchDriverBySerialNumberAPI(
      installer.environment,
      installer.apiKey,
      serialNumber,
    );
    expect(response.status.toString()).toMatch('200');
    expect(response.data.data).toBeDefined();
    expect(response.data.data).not.toBeNull();
  });
});
