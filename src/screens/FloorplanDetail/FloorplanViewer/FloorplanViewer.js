import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';

import {
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Raycaster,
  Vector2,
  Vector3,
} from 'three';

import ClusterManagement from '../../../libs/ClusterManagement/ClusterManagement.js';
import { DxfViewer } from '../../../libs/DxfViewer';
import {
  DeviceMesh,
  devicesBoundingBox,
  fixtureStatusColor,
} from '../../../libs/DxfViewer/DeviceMesh';
import OrbitControlsView from '../../../libs/OrbitControlsView/OrbitControlsView.js';

import ModalCheckType from '../ModalCheckType';
import ModalConfirmDelete from '../ModalConfirmDelete';
import ModalDeviceFunction from '../ModalDeviceFunction';
import ModalDeviceScanner from '../ModalDeviceScanner';
import ModalFilterFixtures from '../ModalFilterFixtures';
const _ = require('lodash');

const clusterManagement = new ClusterManagement(null);

const wworld = 100000;
const planeshow = false;

//FIX SCALE ICON
let cameraDistance = 0;
let currentScale = 1;
let scaleCluster = 0;

//EVENT NAME OF ORBIT CONTROL
const eventNames = [
  'loaded',
  'cleared',
  'destroyed',
  'resized',
  'pointerdown',
  'pointerup',
  'viewChanged',
  'cameraZoom',
];

const plane = new Mesh(
  new PlaneGeometry(wworld, wworld),
  new MeshBasicMaterial({ color: '#e6ecf7', visible: planeshow }),
);

plane.position.z = -1;
plane.name = 'plane';

let selectedFixtures = [];
let enableMovingDevice = false;
let movingMess = null;
let fixtureTargets = {};
let movingOffset = { x: 0, y: 0 };
let movingStartPoint = null;

const canvasObjects = {
  objects: [],
  raycaster: new Raycaster(),
  plane,
};

const distanceBetweenTwoPoints = (p1, p2) => {
  if (!p1 || !p2) {
    return 0;
  }
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

const getMouseActionPos = (e, canvas, api, width, height) => {
  if (!canvas || !api) {
    return null;
  }
  // Update 2d vector with the mouse coordinate
  const x = (e.locationX / width) * 2 - 1;
  const y = -(e.locationY / height) * 2 + 1;

  // Keep track of the mouse
  const v2 = new THREE.Vector2(x, y);
  const cam = canvas.GetCamera();
  // Setup raycaster with pointer information and the camera
  api.raycaster.setFromCamera(v2, cam);
  const intersects = api.raycaster.intersectObjects([api.plane]);
  if (intersects.length == 0) {
    return null;
  }
  const v3 = intersects[0].point;
  return { ...v3, z: 0 };
};

const getCanvasObjectAtPosition = (
  originX,
  originY,
  canvasWidth,
  canvasHeight,
  canvas,
  _canvasObjects,
) => {
  if (!canvas) {
    return null;
  }
  const cam = canvas.GetCamera();
  const x = (originX / canvasWidth) * 2 - 1;
  const y = -(originY / canvasHeight) * 2 + 1;

  const pos = new Vector2(x, y);
  _canvasObjects.raycaster.setFromCamera(pos, cam);
  const intersects = _canvasObjects.raycaster
    .intersectObjects(_canvasObjects.objects)
    .filter((e) => {
      if (e.object.className != 'DeviceMesh') {
        return false;
      }
      return e.object?.material?.visible || false;
    });

  return intersects.shift();
};

const styles = StyleSheet.create({
  Center: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
});

const FloorplanViewer = ({
  filePath,
  loadingDxf,
  setLoadingDxf,
  deleteDeviceByFixtureIdAction,
  replaceDeviceByFixtureIdAction,
  writeFixtureFileAction,
  initDeviceList,
  deviceByFixtureId,
  getCurrentFixtureIdAction,
  fixtureList,
  fixtureForSubmit,
  setSelectedFixture,
  selectedFixture,
  clearAllModal,
  moveFixture,
}) => {
  const style = loadingDxf
    ? { width: '100%', height: '100%', opacity: 1 }
    : { width: '100%', height: '100%' };
  // Refs
  const canvasContainer = useRef();
  const controlRef = useRef();

  // STATE FOR THREEJS
  const [canvas, setCanvas] = useState(null);
  const [camera, setCamera] = useState(null);
  const [gl, setGl] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [selectedMesh, setSelectedMesh] = useState([{}]);

  // STATE FOR DEVICE, FIXTURE
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [driverScanned, setDriverScanned] = useState(null);
  const [filterValues, setFilterValues] = useState([]);

  // DEVICE LIST UPON SELECTED FIXTURE ID
  const devices = useMemo(() => {
    const lstDevices = selectedFixture?.id ? deviceByFixtureId[selectedFixture?.id] || [] : [];
    return [...new Set(lstDevices)];
  }, [selectedFixture, deviceByFixtureId]);

  // STATE FOR HANDLE FUNCTION
  const [isRescanMode, setIsRescanMode] = useState(false);
  const [checkScannedDevices, setCheckScannedDevices] = useState(false);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const handleDeleteAndReplaceDevice = useCallback(
    async (type, deviceId, deviceInfo) => {
      setCheckScannedDevices(true);
      switch (type) {
        case 'delete':
          await deleteDeviceByFixtureIdAction({
            fixtureId: selectedFixture.id,
            deviceId,
          });
          await writeFixtureFileAction(selectedFixture.id);
          break;
        case 'replace':
          await replaceDeviceByFixtureIdAction({
            fixtureId: selectedFixture.id,
            deviceId,
            deviceInfo,
          });
          await writeFixtureFileAction(selectedFixture.id);
          break;
        default:
          break;
      }
    },
    [
      deleteDeviceByFixtureIdAction,
      writeFixtureFileAction,
      replaceDeviceByFixtureIdAction,
      selectedFixture,
    ],
  );

  const hanldeReSizeCanvas = (e) => {
    const layout = e.nativeEvent.layout;
    setWidth(layout.width);
    setHeight(layout.height);
    if (!canvas || loadingDxf) {
      return;
    }
    canvas.SetSize(layout.width, layout.height);
    canvas.Render();
  };

  // GET FIXTURE LIST FROM DATA STORAGE
  useEffect(() => {
    setLoadingDxf(true);
    setFilterValues([]);
    clearAllModal();
  }, []);

  // RERENDER IF CANVAS IS AVAILABLE
  useEffect(() => {
    if (!canvas || loadingDxf || !fixtureList) {
      return;
    }
    drawFromArray(canvas, fixtureList, filterValues);
  }, [canvas, drawFromArray, loadingDxf, fixtureList, filterValues]);

  // UPDATE FIXTURE UI WHEN SCANNED / DELETE / REPLACE
  // SUBMIT FIXTURE FUCTION ALREADY CALL GLOBALLY ON APPNAVIGATOR. SO WE NOT CALL IT HERE.
  useEffect(() => {
    if (!canvas || !checkScannedDevices || !fixtureList || !fixtureForSubmit) {
      return;
    }
    drawFromArray(canvas, fixtureList, filterValues);
  }, [checkScannedDevices, canvas, fixtureList, filterValues]);

  const getMeshName = (object) => {
    return `box-${object.id}`;
  };

  const updateMetaAndPos = (origin, data, meshes, type) => {
    // draw device
    // LOCATION POSITION
    const v1 = convertPositionInScene({ x: data.location.x, y: data.location.y, z: 0 }, origin);
    const name = getMeshName(data);
    const mesh = meshes[name];
    if (mesh) {
      mesh.exData = data;
      mesh.position.copy(v1);
      mesh.material.color.setHex(fixtureStatusColor(mesh.exData.status).getHex());
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const drawFromArray = (dxfViewer, items, filterValues) => {
    if (!dxfViewer || !dxfViewer.origin || !Array.isArray(items)) {
      return;
    }
    const scene = dxfViewer.GetScene();
    const origin = dxfViewer.origin;
    const { children } = scene;
    const names = canvasObjects.objects.map((e) => e.name);
    let temp = {};
    const itemObjs = items.reduce((a, v) => ({ ...a, [`box-${v.id}`]: v }), {});
    // FILTER AFTER FRIST FILTER VALUE SELECTED
    let filterFixturesMesh = [];
    children.forEach((e) => {
      if (itemObjs[e.name]) {
        e.exData = itemObjs[e.name];
      }
      temp[e.name] = e;
    });

    const results = items.filter((e) => !names.includes(getMeshName(e)));
    const updateMeta = items.filter((e) => names.includes(getMeshName(e)));
    updateMeta?.forEach((d) => {
      updateMetaAndPos(origin, d, temp, '');
    });

    results?.forEach(async (d) => {
      // LOCATION POSITION
      const v1 = convertPositionInScene({ x: d.location.x, y: d.location.y, z: 0 }, origin);
      await drawAt(v1, 400, d, dxfViewer);
    });
    // Filter fixture list after drawAt
    if (filterValues.length > 0) {
      children.forEach((e) => {
        if (filterValues.includes(e?.exData?.status) && itemObjs[e.name]) {
          e.material.visible = true;
          filterFixturesMesh.push(e);
        } else {
          if (itemObjs[e.name]) {
            e.material.visible = false;
          }
        }
      });
    } else {
      children.forEach((e) => {
        if (itemObjs[e.name]) {
          e.material.visible = true;
          filterFixturesMesh.push(e);
        }
      });
    }

    clusterManagement.clearForFilter();
    clusterManagement.setFixtures(filterFixturesMesh);

    setCheckScannedDevices(false);
    dxfViewer.Render();

    if (Platform.OS === 'ios') {
      // rerender on ios platform - bug flask ios
      setTimeout(() => {
        dxfViewer.Render();
      }, 50);
    } else {
      dxfViewer.Render();
    }
  };

  // function
  const convertPositionInScene = (pos, originScene) => {
    const x = parseFloat(pos.x);
    const y = parseFloat(pos.y);
    return new Vector3(x - originScene.x, y - originScene.y, pos.z);
  };

  const scenePosToDxfPos = (pos, origin) => {
    const x = parseFloat(pos.x);
    const y = parseFloat(pos.y);
    return { x: x + origin.x, y: y + origin.y };
  };

  // draw Single Device
  const drawAt = async (vector, wbox2, data, dxfViewer) => {
    if (!dxfViewer) {
      return;
    }
    // draw Device
    const scene = dxfViewer.GetScene();
    const meshName = getMeshName(data);

    const block = data.iconData ? dxfViewer.blocks.get(data.iconData.name) : null;
    const mesh = new DeviceMesh(data, data.iconData || null, vector, block);
    mesh.name = meshName;
    mesh.exData = data;
    mesh.setScale(currentScale, currentScale, 1);
    scene.add(mesh);
    canvasObjects.objects.push(mesh);
  };

  const handleDrawClusters = _.debounce((dxfViewer) => {
    clusterManagement.refresh();
    dxfViewer.Render();
  }, 80);

  const handleScaleFixture = (dxfViewer, force = false) => {
    const api = canvasObjects;
    const camera = dxfViewer.GetCamera();
    if (camera) {
      // Scale fixtures
      const aa = (cameraDistance * 4) / 14000;
      const newScale = aa / camera.zoom;
      if (newScale != currentScale || force) {
        currentScale = newScale;
        if (newScale) {
          api.objects.forEach((o) => {
            o.setScale(newScale, newScale, 1);
          });
        }
      }

      // Scale clusters
      const bb = (cameraDistance * 4) / 14000;
      const newScale2 = bb / camera.zoom;
      if (newScale2 != scaleCluster || force) {
        scaleCluster = newScale2;
        clusterManagement.setScale(scaleCluster);
      }
    }
  };
  const onContextCreate = async (gl) => {
    setGl(gl);
    setLoadingDxf(true);

    const camera = new PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000,
    );
    canvasObjects.objects = [];
    camera.position.set(0, 0, 2);

    gl.canvas = {
      width: gl.drawingBufferWidth,
      height: gl.drawingBufferHeight,
    };
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    setRenderer(renderer);

    const dxfViewer = new DxfViewer(
      renderer,
      (newScene, newCamera) => {
        renderer.render(newScene, newCamera);
        gl.endFrameEXP();
      },
      (cam) => {
        controlRef.current.getControls().addEventListener('change', (event) => {
          if (event.target.zoomChanged) {
            handleScaleFixture(dxfViewer);
            handleDrawClusters(dxfViewer);
          }
        });

        // For now, the floorplan only contain the background so it has no way to create a correct viewport
        // From here we will calculate a box that contains all fixtures to make the camera view that area.
        const { minX, maxX, minY, maxY } = devicesBoundingBox(fixtureList);

        dxfViewer.FitView(
          minX - dxfViewer.origin.x,
          maxX - dxfViewer.origin.x,
          minY - dxfViewer.origin.y,
          maxY - dxfViewer.origin.y,
          0.25,
        );

        cameraDistance = cam.top;

        controlRef.current.getControls().target = new Vector3(cam.position.x, cam.position.y, 0);

        controlRef.current.getControls().update();
      },
      { canvasWidth: width, canvasHeight: height },
    );

    setCamera(dxfViewer.GetCamera());
    setCanvas(dxfViewer);

    await dxfViewer.Load(filePath, [], () => {}, null);

    clusterManagement.scene = dxfViewer.GetScene();
    handleScaleFixture(dxfViewer);
    setLoadingDxf(false);
    dxfViewer.Render();
  };

  const touchStart = useCallback(
    (locationX, locationY) => {
      const foundObject = getCanvasObjectAtPosition(
        locationX,
        locationY,
        width,
        height,
        canvas,
        canvasObjects,
      );

      if (foundObject) {
        const { exData } = foundObject.object;

        if (foundObject.object.moveable) {
          if (selectedFixtures.length) {
            if (exData.id == selectedFixtures[0].exData.id) {
              movingMess = selectedFixtures[0];
              movingStartPoint = movingMess.position.clone();
              const { point, object } = foundObject;
              movingOffset = {
                x: point.x - object.position.x,
                y: point.y - object.position.y,
              };
              controlRef.current.getControls().enabled = false;
              return;
            }
          }
        }

        movingMess = null;
        movingStartPoint = null;
        movingOffset = { x: 0, y: 0 };
        setSelectedMesh([foundObject.object]);

        selectedFixtures.forEach((device) => {
          device.select = false;
        });
        selectedFixtures = [foundObject.object];
        selectedFixtures.forEach((device) => {
          device.select = true;
        });
        setSelectedFixture({ fixtureId: exData.id, shouldShowInfo: true });
        getCurrentFixtureIdAction(exData?.id);
        initDeviceList(exData);
        controlRef.current.getControls().enabled = true;
      } else {
        selectedFixtures.forEach((device) => {
          device.select = false;
        });
        setSelectedMesh([{}]);
        movingMess = null;
        movingOffset = { x: 0, y: 0 };
        movingStartPoint = null;
        selectedFixtures = [];
        setSelectedFixture({ fixtureId: null, shouldShowInfo: false });
      }
      canvas.Render();
    },
    [canvas, width, height],
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (selectedFixtures.length) {
        const currentPos = getMouseActionPos(e, canvas, canvasObjects, width, height);

        if (movingMess && currentPos) {
          const newPos = new THREE.Vector3(
            currentPos.x - movingOffset.x,
            currentPos.y - movingOffset.y,
            0,
          );
          movingMess.position.copy(newPos);
        }
        canvas.Render();
      } else {
        renderer.render(canvas.GetScene(), camera);
        gl.endFrameEXP();
      }
    },
    [renderer, canvas, camera, gl, width, height],
  );

  const handleTouchEnd = useCallback(
    (e) => {
      if (selectedFixtures.length) {
        if (movingMess) {
          controlRef.current.getControls().enabled = true;
          const cam = canvas.GetCamera();
          controlRef.current.getControls().target = new Vector3(cam.position.x, cam.position.y, 0);

          const distance = distanceBetweenTwoPoints(movingMess.position, movingStartPoint);
          if (distance > 0) {
            const dxfPos = scenePosToDxfPos(movingMess.position, canvas.origin);
            moveFixture({ fixtureId: movingMess.exData.id, pos: dxfPos });
          }

          controlRef.current.getControls().update();
          movingMess = null;
          movingOffset = { x: 0, y: 0 };
          movingStartPoint = null;
        }
      } else {
      }
    },
    [renderer, canvas, camera, gl, width, height, moveFixture],
  );

  const handleTouchBegin = useCallback(
    (e) => {
      touchStart(e.locationX, e.locationY - 15);
    },
    [touchStart],
  );

  const onToggleMove = useCallback((v, mesh) => {
    console.log('dsfds', v, mesh.moveable);
    mesh.moveable = v;
    setSelectedMesh([mesh]);
  }, []);
  const handleMove = useCallback((e) => {}, []);
  return filePath && filePath.url ? (
    <>
      {loadingDxf ? (
        <View style={styles.Center}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      ) : null}
      <OrbitControlsView
        ref={controlRef}
        style={{ flex: 1 }}
        camera={camera}
        onTouchMove={handleMove}
        onMove={handleTouchMove}
        onEnd={handleTouchEnd}
        onTouchBegin={handleTouchBegin}>
        <GLView
          style={style}
          onContextCreate={onContextCreate}
          ref={canvasContainer}
          onLayout={hanldeReSizeCanvas}
        />
      </OrbitControlsView>

      {/* MODAL CONFIRM DELETE DEVICE */}
      <ModalConfirmDelete
        selectedDevice={selectedDevice}
        handleDeleteAndReplaceDevice={handleDeleteAndReplaceDevice}
      />

      {/* MODAL DEVICE FUNCTION */}
      <ModalDeviceFunction
        devices={devices}
        selectedFixture={selectedFixture}
        selectedMesh={selectedMesh}
        onToggleMove={onToggleMove}
        setSelectedDevice={setSelectedDevice}
        setIsRescanMode={setIsRescanMode}
        setDriverScanned={setDriverScanned}
      />

      {/*  MODAL SCAN QR FOR ADD, REPLACE */}
      <ModalDeviceScanner setIsRescanMode={setIsRescanMode} setDriverScanned={setDriverScanned} />

      {/* MODAL SELECT DEVICE TYPE */}
      <ModalCheckType
        driverScanned={driverScanned}
        selectedFixture={selectedFixture}
        isRescanMode={isRescanMode}
        setIsRescanMode={setIsRescanMode}
        handleDeleteAndReplaceDevice={handleDeleteAndReplaceDevice}
        selectedDevice={selectedDevice}
        setCheckScannedDevices={setCheckScannedDevices}
      />

      {/* MODAL FILTER FIXTURES */}
      <ModalFilterFixtures setFilterValues={setFilterValues} filterValues={filterValues} />
    </>
  ) : null;
};

export default FloorplanViewer;
