/**
 * entry.js
 * 
 * This is the first file loaded. It sets up the Renderer, 
 * Scene and Camera. It also starts the render loop and 
 * handles window resizes.
 * 
 */

import Renderer from './Renderer.js';
import CSSRenderer from './CSSRenderer.js';
import * as Cameras from './Cameras.js';
import Scene from './Scene.js';
import SceneComposer from './SceneComposer.js';
import { initControls, updateControls } from './Controls';
import Interactive from './Interactive';

import './styles/index.css';

const SCALE_RESOLUTION = 0.66;
const MAX_RESOLUTION = 1920;

const $3dview = document.getElementById('view');

const renderer = new Renderer();
const cssRenderer = new CSSRenderer();
const camera = Cameras.useCamera(Cameras.perspective);
initControls($3dview);
const interactive = new Interactive($3dview);
const scene = new Scene(interactive);

const composer = new SceneComposer(renderer, scene, camera);

const resizeViewport = () => { 
  const { innerHeight: height, innerWidth: width } = window;

  const constrainedWidth = Math.min(MAX_RESOLUTION, Math.floor(width * SCALE_RESOLUTION));
  const constrainedHeight = Math.floor(constrainedWidth * height / width );

  renderer.setSize( constrainedWidth, constrainedHeight );
  composer.setSize( constrainedWidth, constrainedHeight );
  renderer.domElement.style.width = width + 'px';
  renderer.domElement.style.height = height + 'px';
  cssRenderer.setSize(window.innerWidth, window.innerHeight);
  cssRenderer.domElement.style.position = 'absolute';
  cssRenderer.domElement.style.top = 0;
  Cameras.updateSize(constrainedWidth, constrainedHeight);
};

function registerEvents() {
  resizeViewport();

  window.requestAnimationFrame(renderLoop);
  window.addEventListener('resize', resizeViewport);
  window.addEventListener('orientationchange', resizeViewport);
}

const renderLoop = (timeStamp) => {
  try {
    render(timeStamp);
    window.requestAnimationFrame(renderLoop);
  } catch (err) {
    console.error(err);
  }
}

const render = (timestamp) => {
  scene.update(timestamp);
  interactive.update();
  interactive.updateOutline(composer.outlineEffect);
  updateControls();
  composer.render();
  cssRenderer.render( scene, camera );
}

registerEvents();
// dom
$3dview.appendChild( renderer.domElement );
$3dview.appendChild( cssRenderer.domElement );