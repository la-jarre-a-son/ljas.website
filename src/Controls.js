import { Tween, Easing } from "@tweenjs/tween.js"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { getActiveCamera, perspective } from "./Cameras";

const FLY_DURATION = 2000;

let controls,
  _isFlying = false,
  _exitFlyHandler = null,
  previousCameraPosition,
  previousControlsTarget;
const locks = new Set();

const $flyExit = document.getElementById('controlsFlyExit');
$flyExit.addEventListener('click', resetFly);

export function initControls(domElement) {
  const camera = getActiveCamera();
  controls = new OrbitControls(camera, domElement);

  controls.enablePan = false;
  controls.target.set(0,1,0);

  setOrbitConfig(camera);
}

function setOrbitConfig(camera) {
  if (camera === perspective) {
    controls.minDistance = 2.9;
    controls.maxDistance = 10;
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = 1.6;
    controls.enableDamping = true;
  } else {
    controls.minPolarAngle = Math.PI/3;
    controls.maxPolarAngle = Math.PI/3;
    controls.minZoom = 1;
    controls.maxZoom = 12;
    controls.enableDamping = true;
  }
}

export function disableControls(lock) {
  const camera = getActiveCamera();
  locks.add(lock);
  controls.enableRotate = false;
  controls.enableZoom = (camera !== perspective);
  // controls.enabled = false;
}

export function enableControls(lock) {
  locks.delete(lock);
  if (locks.size === 0) {
    controls.enableRotate = true;
    controls.enableZoom = true;
  }
}

export function updateControls() {
  controls.update();
}

export function flyTo(center, lookAt, onFlyExit = () => {}) {
  if (_isFlying) return;
  _isFlying = true;
  _exitFlyHandler = onFlyExit;
  $flyExit.classList.add('active');

  disableControls('fly');
  const camera = getActiveCamera();
  previousCameraPosition = camera.position.clone();
  previousControlsTarget = controls.target.clone();

  controls.minDistance = 0;
  controls.maxDistance = Infinity;
  controls.minPolarAngle = -Math.PI;
  controls.maxPolarAngle = Math.PI;

  flyCameraTo(camera, center, lookAt);
}

export function resetFly() {
  if (!_isFlying) return;

  if (_exitFlyHandler) _exitFlyHandler();
  $flyExit.classList.remove('active');

  const camera = getActiveCamera();
  flyCameraTo(camera, previousCameraPosition, previousControlsTarget)
    .onComplete(() => {
      setOrbitConfig(camera);
      enableControls('fly');
      _isFlying = false;

    });
}

export function isFlying() {
  return _isFlying;
}

function flyCameraTo(camera, position, target) {
  const tween = new Tween({ position: camera.position.clone(), target: controls.target.clone() });
  tween.easing(Easing.Quadratic.InOut);
  tween.to({ position, target }, FLY_DURATION)
  tween.start();
  tween.onUpdate(p => {
    camera.position.copy(p.position);
    controls.target.copy(p.target);
  });

  return tween;
}


