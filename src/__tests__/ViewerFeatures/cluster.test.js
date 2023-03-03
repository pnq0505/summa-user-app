import ClusterManagement from '../../libs/ClusterManagement/ClusterManagement';
import { fixturesMesh } from '../DataTest/FixturesMesh';

describe('Test Features on viewer', () => {
  test('Testing cluster management init render', async () => {
    const clusterManagement = new ClusterManagement(null);
    clusterManagement.setFixtures(fixturesMesh);
    expect(clusterManagement.clusters.length).toEqual(2);
  });

  test('Testing cluster management zoom out', async () => {
    const clusterManagement = new ClusterManagement(null);
    const fixtures = fixturesMesh.map((fixture) => {
      return { ...fixture, scale: { x: 2.5 } };
    });
    clusterManagement.setFixtures(fixtures);
    clusterManagement.refresh();
    expect(clusterManagement.clusters.length).toEqual(5);
  });

  test('Testing cluster management zoom in as much as no more cluster', async () => {
    const clusterManagement = new ClusterManagement(null);
    const fixtures = fixturesMesh.map((fixture) => {
      return { ...fixture, scale: { x: 0.1 } };
    });
    clusterManagement.setFixtures(fixtures);
    clusterManagement.refresh();
    expect(clusterManagement.clusters.length).toEqual(0);
  });
});
