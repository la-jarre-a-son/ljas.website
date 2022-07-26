import {
  Scene,
  Color,
  IcosahedronGeometry,
  MeshStandardMaterial,
  Mesh,
} from 'three';

import * as LoadingScreen from './loading';
import { clamp, linearMap } from './helpers';
import { loadBackground, loadEnvironment } from './Environment';
import Room from './Room';
import { getCameraAngles, isPerspective } from './Cameras';
import { disableControls, enableControls } from './Controls';

const BACKGROUND_COLOR = (new Color(0x241B2F)).convertSRGBToLinear();
const POLAR_VISIBILITY_FACTOR = 1.2;
const VISIBILITY_THRESHOLD = Math.PI/2;
const VISIBILITY_OFFSET = 1;
const DIRECTIONS = {
  NORTH: Math.PI/4 * 1,
  EAST: Math.PI/4 * 3,
  SOUTH: Math.PI/4 * 5,
  WEST: Math.PI/4 * 7,
};

export default class MainScene extends Scene {
  constructor(interactive) {
    super();
    this.onReady = this.onReady.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onError = this.onError.bind(this);

    this.room = new Room();
    this.interactive = interactive;

    this.init();
    // this.addMirrorSphere();
  }

  init() {
    disableControls('load');
    this.background = BACKGROUND_COLOR
    LoadingScreen.start("Loading...", 62);
    loadBackground((texture) => {
      this._backgroundTexture = texture;
    });
    loadEnvironment((texture) => {
      this.environment = texture;
      this.room.load(this.onReady, this.onProgress, this.onError);
    });
  }

  onError(err) {
    LoadingScreen.error(err.message);
    console.error(err);
  }

  onProgress(e) {
    console.log("progress", e);
  }

  onReady() {
    window.setTimeout(() => {
      LoadingScreen.text("Rendering...");
      window.setTimeout(() => {
        LoadingScreen.end();
        this.add(this.room);
        this.updateFloorVisibility();

        this.interactive.setScene(this);
        window.setTimeout(() => {
          this.interactive.ready();
          enableControls('load');
        }, 100);
      }, 100);
    }, 0);
  }

  // addMirrorSphere() {
  //   const geometry = new IcosahedronGeometry( 0.5, 15 );
  //   const sphereMaterial = new MeshStandardMaterial({
  //     roughness: 0.0,
  //     metalness: 1.0,
  //   });
  //   const sphereMesh = new Mesh( geometry, sphereMaterial );
  //   sphereMesh.position.set(0,1,0);

  //   this.add( sphereMesh );
  // }

  update(_timestamp) {
    this.fixBackground()

    const { azimuth, altitude } = getCameraAngles();

    Object
      .keys(DIRECTIONS)
      .forEach((groupName) =>  this.updateWallVisibility(groupName, azimuth, altitude));

      this.updateRoofVisibility(altitude);
  }

  fixBackground() {
    if (isPerspective()) {
      if(this._backgroundTexture && this.background !== this._backgroundTexture) {
        this.background = this._backgroundTexture;
      }
    } else {
      if(this.background !== BACKGROUND_COLOR) {
        this.background = BACKGROUND_COLOR;
      }
    }
  }

  updateWallVisibility(groupName, azimuth, altitude) {
    const direction = azimuth + Math.PI/4;
    const altitudeVisibility = clamp(POLAR_VISIBILITY_FACTOR * (1 + altitude));
    const azimuthVisibility = clamp(-Math.cos(direction - DIRECTIONS[groupName]) * VISIBILITY_THRESHOLD + VISIBILITY_OFFSET)
    const alpha = Math.max(altitudeVisibility, azimuthVisibility);

    const group = this.getObjectByName(groupName);

    if (!group) return;

    group.traverse((obj) => {
      if (obj.material) {
        if (obj.renderOrder < 100) {
          if (azimuthVisibility === 1) {
            obj.renderOrder = 10 + obj.renderOrder % 10;
          } else if (azimuthVisibility < 1 && azimuthVisibility > 0.5) {
            obj.renderOrder = 20 + obj.renderOrder % 10;
          } else if (azimuthVisibility < 0.5 && azimuthVisibility > 0) {
            obj.renderOrder = 30 + obj.renderOrder % 10;
          } else {
            obj.renderOrder = 40 + obj.renderOrder % 10;
          }
        }

        obj.userData.wallVisibility = alpha;
        obj.userData.visibility = alpha;
        obj.material.opacity = alpha;

        if (obj.material.userData.opacity) {
          obj.material.opacity = obj.material.userData.opacity * alpha;
        }
      }
      if (obj.element) {
        obj.element.style.opacity = `${alpha}`;
      }
    })
  }

  updateFloorVisibility() {
    const group = this.getObjectByName('FLOOR');

    if (!group) return;

    group.traverse((obj) => {
      if (obj.material) {
        obj.renderOrder = 5;
        obj.userData.visibility = 1;
        obj.material.opacity = 1;

        if (obj.material.userData.opacity) {
          obj.renderOrder = 6;
          obj.material.opacity = obj.material.userData.opacity;
        }
      }
    });
  }

  updateRoofVisibility(altitude) {
    const group = this.getObjectByName('ROOF');

    if (!group) return;

    const alpha = linearMap(altitude, -1.3, -1.5);
    group.traverse((obj) => {
      if (obj.material) {
        obj.renderOrder = 25;
        obj.userData.visibility = alpha;
        obj.material.opacity = alpha;

        if (obj.material.userData.opacity) {
          obj.material.opacity = obj.material.userData.opacity * alpha;
        }
      }
    });
  }
}
