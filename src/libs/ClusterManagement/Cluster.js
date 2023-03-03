import * as THREE from 'three';
import { createText } from './DrawHelper';

const CLUSTER_CIRCLE_RADIUS = 300;
export default class Cluster {
  constructor(meshName, fixtures = []) {
    this.meshName = meshName;
    this.fixtures = fixtures;
    this.createIcon();
  }

  get position() {
    const avg = this.fixtures.reduce(
      (sum, fixture) => {
        const { length } = this.fixtures;
        return {
          x: sum.x + fixture.position.x / length,
          y: sum.y + fixture.position.y / length,
          z: 0,
        };
      },
      { x: 0, y: 0, z: 0 },
    );
    return avg;
  }

  get totalFixtures() {
    return this.fixtures.length;
  }

  pushFixtures(fixture) {
    if (!this.fixtures.find((f) => f.name === fixture.name)) {
      this.fixtures.push(fixture);
    }
    this.refresh();
  }

  setFixtures(fixtures) {
    this.fixtures = fixtures;
    this.refresh();
  }

  isRemove() {
    return this.fixtures.length < 2;
  }

  createIcon() {
    const CircleGeo = new THREE.CircleGeometry(CLUSTER_CIRCLE_RADIUS, 32);
    const material = new THREE.MeshBasicMaterial({
      side: THREE.FrontSide,
      color: 0xffffff,
      opacity: 0.8,
      visible: true,
      transparent: true,
    });

    this.mesh = new THREE.Mesh(CircleGeo, material);
    const { x, y, z } = this.position;
    this.mesh.position.copy(new THREE.Vector3(x, y, z));
    this.mesh.name = this.meshName;
    this.mesh.renderOrder = 10000;

    this.numberMesh = createText(
      this.totalFixtures.toString(),
      0x000000,
      200,
      `number-${this.mesh.name}`,
    );
    this.numberMesh.position.copy(new THREE.Vector3(x, y, z));
    this.mesh.children.push(this.numberMesh);
    this.hideAllFixtures();
  }

  refresh() {
    if (!this.mesh) {
      this.createIcon();
    } else {
      const { x, y, z } = this.position;
      this.mesh.position.copy(new THREE.Vector3(x, y, z));
      this.mesh.children = [];
      this.numberMesh = createText(
        this.totalFixtures.toString(),
        0x000000,
        200,
        `number-${this.mesh.name}`,
      );
      this.numberMesh.position.copy(new THREE.Vector3(x, y, z));
      this.numberMesh.scale.set(this.mesh.scale.x, this.mesh.scale.y, 1);
      this.mesh.children.push(this.numberMesh);
      this.hideAllFixtures();
    }
  }

  hideAllFixtures() {
    this.fixtures.forEach((fixture) => {
      // eslint-disable-next-line no-param-reassign
      fixture.material.visible = false;
    });
  }

  merge(cluster) {
    this.fixtures = [...new Set([...this.fixtures, ...cluster.fixtures])];
    this.refresh();
  }

  setScale(scale) {
    this.mesh.scale.set(scale, scale, 1);
    this.numberMesh.scale.set(scale, scale, 1);
  }

  cleanUp(force = false) {
    if (this.isRemove() || force) {
      if (this.mesh.parent) {
        const scene = this.mesh.parent;
        // eslint-disable-next-line eqeqeq
        scene.children = scene.children.filter((mesh) => mesh != this.mesh);
      }
      this.fixtures.forEach((fixture) => {
        // eslint-disable-next-line no-param-reassign
        fixture.material.visible = true;
      });
      return true;
    }
    return false;
  }
  cleanUpForFilter(force = false) {
    if (this.isRemove() || force) {
      if (this.mesh.parent) {
        const scene = this.mesh.parent;
        // eslint-disable-next-line eqeqeq
        scene.children = scene.children.filter((mesh) => mesh != this.mesh);
      }
      return true;
    }
    return false;
  }
}

export function is2PointsOverlap(point1, point2) {
  const x = Math.abs(point1.position.x - point2.position.x);
  const y = Math.abs(point1.position.y - point2.position.y);
  const distance = Math.sqrt(x * x + y * y);
  const radiusAfterScale1 = point1.geometry.parameters.radius * point1.scale.x;
  const radiusAfterScale2 = point2.geometry.parameters.radius * point2.scale.x;

  return radiusAfterScale1 + radiusAfterScale2 + 50 >= distance;
}
