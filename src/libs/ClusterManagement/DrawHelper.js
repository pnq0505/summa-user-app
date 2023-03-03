import * as THREE from 'three';
import { Font } from './FontLoader';

const textFont = require('./Inter_Bold.json');

const fontInter = new Font(textFont);

export const centerOfDevices = (devices, direction) => {
  const x = [];
  const y = [];
  devices.forEach((d) => {
    x.push(parseInt(d.x, 10));
    y.push(parseInt(d.y, 10));
  });

  let min = 0;
  let max = 0;

  if (direction === 'x') {
    min = Math.min.apply(null, x);
    max = Math.max.apply(null, x);
  } else {
    min = Math.min.apply(null, y);
    max = Math.max.apply(null, y);
  }

  return Number((min + max) / 2);
};

export const calculateZoomAndScale = (cameraDistance, centerX, centerY) => {
  let zoomLevel = 1;
  let scaleLevel = 1;
  if (cameraDistance !== 0 && centerX !== 0 && centerY !== 0) {
    let zoomX = 0;
    let zoomY = 0;
    if (cameraDistance > centerX) {
      zoomX = Math.abs(cameraDistance / centerX);
    } else {
      zoomX = Math.abs(centerX / cameraDistance);
    }

    if (cameraDistance > centerY) {
      zoomY = Math.abs(cameraDistance / centerY);
    } else {
      zoomY = Math.abs(centerY / cameraDistance);
    }

    zoomLevel = (zoomX + zoomY) / 2;
    scaleLevel = zoomX + zoomY;

    return { zoomLevel, scaleLevel };
  }
  return { zoomLevel, scaleLevel };
};

export const groupBy = (xs, f) => {
  return xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {});
};

export const setLocation = (x, y, zoom) => {
  const location = {
    target: {
      x: x,
      y: y,
      z: 0,
    },
    position: {
      x: x,
      y: y,
      z: 0.9999999999993942,
    },

    zoom: zoom,
  };
  return location;
};

export const createText = (text = '', color = 0xffffff, size = 100, meshName = '') => {
  const matLite = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 1,
    visible: true,
    side: THREE.FrontSide,
  });

  const shapes = fontInter.generateShapes(text, size);
  const geometry = new THREE.ShapeGeometry(shapes);
  geometry.computeBoundingBox();
  const xMid =
    -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x) - geometry.boundingBox.min.x;
  geometry.translate(xMid, -size / 2, 0);

  const mesh = new THREE.Mesh(geometry, matLite);
  mesh.renderOrder = 10000;
  mesh.name = meshName;

  mesh.onBeforeRender = function (renderer) {
    renderer.clearDepth();
  };
  return mesh;
};
