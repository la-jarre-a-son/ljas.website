import { Vector3 } from "three";
import { addSphereCursor, linearMap } from "../helpers";
import Interaction from "./Interaction";

const MIN_VOLUME = 0.3;
const MAX_VOLUME = 1;

const SAMPLES = {
  DrumKickHead: {
    files: ["drums/drum_kick.ogg"],
    minDistance: 0.15,
    maxDistance: 0.05,
  },
  DrumSnareHead: {
    files: ["drums/drum_snare.ogg", "drums/drum_snare2.ogg", "drums/drum_rim.ogg"],
    minDistance: 0.13,
    maxDistance: 0.05,
  },
  DrumTomHead: {
    files: ["drums/drum_tom.ogg"],
    minDistance: 0.1,
    maxDistance: 0.04,
  },
  DrumFloorTomHead: {
    files: ["drums/drum_floortom.ogg"],
    minDistance: 0.12,
    maxDistance: 0.05,
  },
  DrumCrash: {
    files: ["drums/drum_crash.ogg", "drums/drum_crash2.ogg"],
    minDistance: 0.01,
    maxDistance: 0.12,
  },
  DrumRide: {
    files: ["drums/drum_ride.ogg", "drums/drum_ride2.ogg", "drums/drum_ridebell.ogg"],
    minDistance: 0.05,
    maxDistance: 0.16,
  },
  HiHatTop: {
    files: ["drums/drum_chh.ogg", "drums/drum_ohh.ogg"],
    minDistance: 0.05,
    maxDistance: 0.14,
  },
  EDrumKickHead: {
    files: ["edrums/edrum_kick.ogg"],
    minDistance: 0.08,
    maxDistance: 0.04,
  },
  EDrumSnareHead: {
    files: ["edrums/edrum_snare.ogg", "edrums/edrum_snare.ogg", "edrums/edrum_rim.ogg"],
    minDistance: 0.12,
    maxDistance: 0.05,
  },
  EDrumTomHiTomHead: {
    files: ["edrums/edrum_tom_hi.ogg"],
    minDistance: 0.06,
    maxDistance: 0.03,
  },
  EDrumTomMidTomHead: {
    files: ["edrums/edrum_tom_mid.ogg"],
    minDistance: 0.06,
    maxDistance: 0.03,
  },
  EDrumFloorTomHead: {
    files: ["edrums/edrum_808.ogg"],
    minDistance: 0.12,
    maxDistance: 0.1,
  },
  EDrumCrashL: {
    files: ["edrums/edrum_crash.ogg"],
    minDistance: 0.05,
    maxDistance: 0.10,
  },
  EDrumCrashR: {
    files: ["edrums/edrum_crash2.ogg"],
    minDistance: 0.05,
    maxDistance: 0.10,
  },
  EDrumRide: {
    files: ["edrums/edrum_ride.ogg"],
    minDistance: 0.05,
    maxDistance: 0.12,
  },
  EDrumHiHatTop: {
    files: ["edrums/edrum_chh.ogg", "edrums/edrum_ohh.ogg"],
    minDistance: 0.05,
    maxDistance: 0.13,
  },
  };

export default class PadSample extends Interaction {
  constructor(objectName, trigger, scene) {
    super(objectName, trigger, scene);

    this.minDistance = 0;
    this.maxDistance = 0.1;

    this.audios = [];
    if (this.object) {
      this.origin = this.object.getWorldPosition(new Vector3());

      // addSphereCursor(scene, this.origin, 0xff0000);
  
      this.attachAudio();
    }
  }

  attachAudio() {
    const samples = SAMPLES[this.objectName];

    if (!samples) return;

    this.minDistance = samples.minDistance;
    this.maxDistance = samples.maxDistance;

    for (let file of samples.files) {
      const audio = new Audio(`./assets/sounds/${file}`);
      this.audios.push(audio);
    }
  }

  run({ down: { intersect }}) {
    const distance = this.origin.distanceTo(intersect.point);
    const velocity = linearMap(distance, this.minDistance, this.maxDistance);

    if (this.audios.length === 1) {
      this.audios[0].currentTime = 0;
      this.audios[0].volume = linearMap(velocity, 0, 1, MIN_VOLUME, MAX_VOLUME);
      this.audios[0].play();
    } else if (this.audios.length > 1) {
      this.audios[0].currentTime = 0;
      this.audios[0].volume = linearMap(velocity, 0, 1, MIN_VOLUME, MIN_VOLUME*2);
      this.audios[0].play();

      if (this.audios.length === 3 && velocity === 0) {
        this.audios[2].currentTime = 0;
        this.audios[2].volume = 1;
        this.audios[2].play();
      } else {
        this.audios[1].currentTime = 0;
        this.audios[1].volume = linearMap(velocity, 0.6, 1, 0, MAX_VOLUME);
        this.audios[1].play();
       }
    }
  }

  getLabel() {
    return '.playDrums()';
  }
}