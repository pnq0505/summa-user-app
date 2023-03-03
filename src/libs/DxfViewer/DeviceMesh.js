import * as THREE from 'three';

import {
  approved,
  FLOORPLAN_QUANTITY_STATUS_COLOR,
  inReview,
  toBeConfigured,
  toBeReScanned,
} from '../../constants';

const HANDLE_CIRCLE_RADIUS = 300;

export const fixtureStatusColor = (status) => {
  switch (status) {
    case toBeConfigured:
      return new THREE.Color(FLOORPLAN_QUANTITY_STATUS_COLOR.toBeConfigured);
    case inReview:
      return new THREE.Color(FLOORPLAN_QUANTITY_STATUS_COLOR.inReview);
    case approved:
      return new THREE.Color(FLOORPLAN_QUANTITY_STATUS_COLOR.approved);
    case toBeReScanned:
      return new THREE.Color(FLOORPLAN_QUANTITY_STATUS_COLOR.toBeReScanned);
    default:
      return new THREE.Color(FLOORPLAN_QUANTITY_STATUS_COLOR.toBeConfigured);
  }
};

export class DeviceMesh extends THREE.Mesh {
  constructor(data, entity, position, block) {
    const matLite = new THREE.MeshBasicMaterial({
      color: fixtureStatusColor(data.status),
      transparent: true,
      opacity: 0.8,
      visible: true,
      side: THREE.FrontSide,
    });
    const geometry = new THREE.CircleGeometry(HANDLE_CIRCLE_RADIUS, 32);
    super(geometry, matLite);
    this.className = 'DeviceMesh';
    this.block = block;
    this.exData = data;
    this.position.copy(position);
    this.entity = entity;

    this.drawBlock();
    this.drawSelectIcon();
    this.select = false;
    this.moveable = false;
    // this.drawHandle();
  }

  set select(select) {
    this.selectIcon.material.visible = select;
  }

  getInsertionTransform() {
    const mInsert = new THREE.Matrix3();
    let yScale = this.entity.yScale || 1;
    const xScale = this.entity.xScale || 1;
    const rotation = (-(this.entity.rotation || 0) * Math.PI) / 180;
    if (this.entity.zScale < 0) {
      yScale = -yScale;
    }
    mInsert.scale(xScale, yScale);
    mInsert.rotate(rotation);

    const mOffset = new THREE.Matrix3().translate(this.block.offset.x, this.block.offset.y);
    const a = mInsert.multiply(mOffset);
    return a;
  }

  verticesAfterTransform(vertices, transform) {
    if (!transform) {
      return vertices;
    }

    const n = vertices.count;
    const newVerticles = vertices.clone();
    for (let i = 0; i < n * vertices.itemSize; i += 2) {
      const v = new THREE.Vector2(vertices.array[i], vertices.array[i + 1]);
      v.applyMatrix3(transform);
      newVerticles.array[i] = v.x;
      newVerticles.array[i + 1] = v.y;
    }
    return newVerticles;
  }

  createGeometry(vertices, indices) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', vertices);
    if (indices) {
      geo.setIndex(indices);
    }
    return geo;
  }

  createObject(vertices, indices) {
    const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const geo = this.createGeometry(vertices, indices);
    const mesh = new THREE.LineSegments(geo, material);
    mesh.frustumCulled = false;
    mesh.matrixAutoUpdate = false;
    mesh.onBeforeRender = (renderer) => {
      renderer.clearDepth();
    };
    return mesh;
  }

  createIcon() {
    const transform = this.getInsertionTransform();
    const matLite = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.5,
      visible: true,
      side: THREE.FrontSide,
    });
    const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    const deviceIcon = new THREE.Mesh(geometry, matLite);

    this.block.batches.forEach((batch) => {
      if (batch.chunks) {
        batch.chunks.forEach((chunk) => {
          const newVertices = this.verticesAfterTransform(chunk.vertices, transform);
          const mesh = this.createObject(newVertices, chunk.indices);
          deviceIcon.add(mesh);
        });
      } else {
        const newVertices = this.verticesAfterTransform(batch.vertices, transform);
        const mesh = this.createObject(newVertices, null);
        deviceIcon.add(mesh);
      }
      deviceIcon.name = batch.key.blockName;
    });
    return deviceIcon;
  }

  drawBlock() {
    if (!this.entity) {
      return;
    }
    this.deviceIcon = this.createIcon();
    // Here we can draw the circle
    this.add(this.deviceIcon);
  }

  drawHandle() {
    const matLite = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
      visible: true,
      side: THREE.FrontSide,
    });
    const geometry = new THREE.CircleGeometry(HANDLE_CIRCLE_RADIUS, 32);
    this.handleIcon = new THREE.Mesh(geometry, matLite);
    // this.handleIcon.position.copy(position);
    // this.add(this.handleIcon)
  }

  drawSelectIcon() {
    const geometry = new THREE.RingGeometry(HANDLE_CIRCLE_RADIUS, HANDLE_CIRCLE_RADIUS + 50, 32);
    const material = new THREE.MeshBasicMaterial({
      side: THREE.FrontSide,
      color: 0x99f5e3,
      opacity: 0.8,
      visible: false,
    });

    this.selectIcon = new THREE.Mesh(geometry, material);
    this.selectIcon.renderOrder = 99999;
    this.add(this.selectIcon);
    return this.selectIcon;
  }

  setScale(scale) {
    if (this.deviceIcon) {
      this.deviceIcon.scale.set(1 / scale, 1 / scale, 1);
    }
    this.scale.set(scale, scale, 1);
    // this.selectIcon.scale.set(scale, scale, 1)
  }
}

export const devicesBoundingBox = (devices) => {
  let minX = Number.MAX_VALUE;
  let maxX = -Number.MAX_VALUE;
  let minY = Number.MAX_VALUE;
  let maxY = -Number.MAX_VALUE;
  devices.forEach((device) => {
    if (device.location.x > maxX) {
      maxX = device.location.x;
    }
    if (device.location.x < minX) {
      minX = device.location.x;
    }
    if (device.location.y > maxY) {
      maxY = device.location.y;
    }
    if (device.location.y < minY) {
      minY = device.location.y;
    }
  });
  return { minX, maxX, minY, maxY };
};
