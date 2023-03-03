import Cluster, { is2PointsOverlap } from './Cluster';

let clusterId = 0;
export default class ClusterManagement {
  constructor(scene) {
    this.clusters = [];
    this.scale = 1;
    this.fixtures = [];
    this.scene = scene;
  }

  setScale(scale) {
    this.scale = scale;
    this.clusters.forEach((cluster) => {
      cluster.setScale(scale);
    });
  }

  setFixtures(fixtures) {
    this.fixtures = fixtures;
    this.refresh();
  }

  pushCluster(cluster) {
    this.clusters.push(cluster);
  }

  clear() {
    this.clusters.forEach((cluster) => {
      cluster.cleanUp(true);
    });
    this.clusters = [];
  }

  clearForFilter() {
    this.clusters.forEach((cluster) => {
      cluster.cleanUpForFilter(true);
    });
    this.clusters = [];
  }

  refresh() {
    this.clear();
    this.fixtureVsFixture();
    this.clusterVsCluster();
    try {
      this.clusters.forEach((cluster) => {
        this.scene.add(cluster.mesh);
      });
    } catch (error) {}
  }

  clusterVsCluster() {
    // Compare each cluster to each cluster
    // if 2 cluster overlap => keep a cluster and remove other cluster.
    // have to run 2 times to make sure have no overlap clusters.
    let n = 0;
    while (n < 2) {
      n += 1;
      const newClusters = [];
      for (let i = 0; i < this.clusters.length; i += 1) {
        const cluster = this.clusters[i];
        if (cluster.totalFixtures > 0) {
          for (let j = i + 1; j < this.clusters.length; j += 1) {
            const nCluster = this.clusters[j];
            if (cluster.meshName !== nCluster.meshName) {
              if (is2PointsOverlap(cluster.mesh, nCluster.mesh)) {
                cluster.merge(nCluster);
                nCluster.setFixtures([]);
              }
            }
          }
          newClusters.push(cluster);
        }
      }
      this.clusters = newClusters;
    }
  }

  fixtureVsFixture() {
    let fixturesOutsideClusters = this.fixtures; // mesh
    const fixturesInClusters = [];

    // Compare the fixtures don't in the clusters yet.
    // if 2 fixtures overlap => create new cluster.
    for (let i = 0; i < fixturesOutsideClusters.length; i += 1) {
      const mesh = fixturesOutsideClusters[i];
      for (let j = i + 1; j < fixturesOutsideClusters.length; j += 1) {
        const m = fixturesOutsideClusters[j];

        if (
          fixturesInClusters.find((name) => name === mesh.name) ||
          fixturesInClusters.find((name) => name === m.name)
        )
          continue;

        if (is2PointsOverlap(mesh, m)) {
          const cluster = new Cluster(`box-cluster-${clusterId}`, [mesh, m]);
          cluster.setScale(this.scale);
          this.clusters.push(cluster);
          fixturesInClusters.push(mesh.name, m.name);
          clusterId += 1;
        }
      }
    }

    // Compare each cluster with each fixture.
    // if cluster and fixture overlap => add fixture into cluster.
    fixturesOutsideClusters = fixturesOutsideClusters.filter(
      (fixture) => !fixturesInClusters.includes(fixture.name),
    );

    this.clusters.forEach((cluster) => {
      fixturesOutsideClusters.forEach((mesh) => {
        if (is2PointsOverlap(cluster.mesh, mesh)) {
          cluster.pushFixtures(mesh);
        }
      });
    });
  }
}
