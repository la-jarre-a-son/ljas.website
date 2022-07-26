import {
  PerspectiveCamera,
  OrthographicCamera,
  Euler,
} from 'three';

let activeCamera;

const perspective = new PerspectiveCamera();
perspective.layers.enable(1);
perspective.position.set(5,5,5);

const orthographic = new OrthographicCamera();
orthographic.layers.enable(1);
orthographic.position.set(5,5,5);

function useCamera(camera) {
  activeCamera = camera;
  return camera;
}

function getActiveCamera() {
  return activeCamera;
}

function updateSize(width, height) {
  const aspect = width / height;

  perspective.aspect = width / height;
  perspective.updateProjectionMatrix();

  orthographic.left = -3*aspect
  orthographic.right = 3*aspect
  orthographic.top = 3
  orthographic.bottom = -3
  orthographic.near = -20;
  orthographic.far = 20;
  orthographic.updateProjectionMatrix();
}

function getCameraAngles() {
  const rotation = new Euler().setFromQuaternion( activeCamera.quaternion, "YZX" );

  const ret = {
    azimuth: -rotation.y,
    altitude: -rotation.x - Math.PI/2,
  };

  return ret
}

function isPerspective() {
  return activeCamera === perspective;
}

export {
  getActiveCamera,
  useCamera,
  perspective,
  orthographic,
  updateSize,
  getCameraAngles,
  isPerspective,
};