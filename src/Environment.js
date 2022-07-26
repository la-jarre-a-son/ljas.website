import {
  EquirectangularRefractionMapping,
} from "three";

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

const loader = new RGBELoader();

export function loadBackground(onReady) {
  loader.load("./assets/background.hdr", (texture) => {
    texture.mapping = EquirectangularRefractionMapping;

    if (onReady) onReady(texture);
  });
}

export function loadEnvironment(onReady) {
  loader.load("./assets/room.amb.hdr", (texture) => {
    texture.mapping = EquirectangularRefractionMapping;

    if (onReady) onReady(texture);
  });
}