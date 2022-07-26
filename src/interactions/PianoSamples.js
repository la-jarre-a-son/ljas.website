import { Vector3 } from "three";
import { addSphereCursor, linearMap } from "../helpers";
import Interaction from "./Interaction";

const MIN_VOLUME = 0.3;
const MAX_VOLUME = 1;

const SAMPLES = {
  Piano: {
    file: "piano.Fmin.15.ogg",
    keys: 15,
    minDistance: 0.1,
    maxDistance: 1.2,
  },
  Rhodes: {
    file: "rhodes.Fmin.15.ogg",
    keys: 15,
    minDistance: 0.1,
    maxDistance: 1.2,
  },
};

export default class PianoSamples extends Interaction {
  constructor(objectName, trigger, scene, samplesName) {
    super(objectName, trigger, scene);

    this.samplesName = samplesName;
    this.minDistance = 0;
    this.maxDistance = 0.1;
    this.keys = 0;
    this.lastPlayed = null;
    this.previousTimeout = null;

    this.audios = [];
    if (this.object) {
      this.origin = this.object.getWorldPosition(new Vector3());

      // addSphereCursor(scene, this.origin, 0xff0000);
  
      this.attachAudio(samplesName);
    }
  }

  attachAudio(samplesName) {
    const samples = SAMPLES[samplesName];

    if (!samples) return;

    this.minDistance = samples.minDistance;
    this.maxDistance = samples.maxDistance;
    this.keys = samples.keys;


    this.audio = new Audio(`./assets/sounds/${samples.file}`);
  }

  run({ state, dragStart, dragMove }) {
    let toPlay = null;

    if (state === 'dragStart') {
      const offset = this.object.worldToLocal(dragStart.intersect.point.clone());
      const sampleIndex = linearMap(offset.x, this.minDistance, this.maxDistance, 0, this.keys - 1) >> 0;
      
      toPlay = sampleIndex;
    } else if (state === 'dragMove') {
      if (dragMove.intersect && dragMove.intersect.object === this.object) {
        const offset = this.object.worldToLocal(dragMove.intersect.point.clone());
        const sampleIndex = linearMap(offset.x, this.minDistance, this.maxDistance, 0, this.keys - 1) >> 0;
        if (sampleIndex !== this.lastPlayed) {
          toPlay = sampleIndex
        }
      }
    } else if (state === 'dragEnd') {
      this.lastPlayed = null;
      this.audio.pause();
    }

    if (toPlay !== null) {
      this.audio.currentTime = toPlay;
      if (this.previousTimeout) window.clearTimeout(this.previousTimeout);
      
      this.previousTimeout = window.setTimeout(() => {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.previousTimeout = null;
      }, 960);
      this.audio.play();
      

      this.lastPlayed = toPlay;
    }
  }

  getLabel() {
    return '.play'+this.samplesName+'()';
  }
}