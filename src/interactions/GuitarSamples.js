import { Vector3 } from "three";
import { addSphereCursor, linearMap } from "../helpers";
import Interaction from "./Interaction";

const VOLUME = 0.5;

const SAMPLES = {
  ElectricGuitar: {
    files: [
      "electric-guitar/E1.ogg",
      "electric-guitar/A.ogg",
      "electric-guitar/D.ogg",
      "electric-guitar/G.ogg",
      "electric-guitar/B.ogg",
      "electric-guitar/E2.ogg",
    ],
    minDistance: -0.1,
    maxDistance: 0.1,
  },
  ElectricBass: {
    files: [
      "electric-bass/E.ogg",
      "electric-bass/A.ogg",
      "electric-bass/D.ogg",
      "electric-bass/G.ogg",
    ],
    minDistance: -0.12,
    maxDistance: 0.08,
  },
  AcousticGuitar: {
    files: [
      "acoustic-guitar/E1.ogg",
      "acoustic-guitar/A.ogg",
      "acoustic-guitar/D.ogg",
      "acoustic-guitar/G.ogg",
      "acoustic-guitar/B.ogg",
      "acoustic-guitar/E2.ogg",
    ],
    minDistance: -0.12,
    maxDistance: 0.08,
  },
  AcousticBass: {
    files: [
      "acoustic-bass/B.ogg",
      "acoustic-bass/E.ogg",
      "acoustic-bass/A.ogg",
      "acoustic-bass/D.ogg",
      "acoustic-bass/G.ogg",
    ],
    minDistance: -0.12,
    maxDistance: 0.08,
  },
  ClassicGuitar: {
    files: [
      "classic-guitar/E1.ogg",
      "classic-guitar/A.ogg",
      "classic-guitar/D.ogg",
      "classic-guitar/G.ogg",
      "classic-guitar/B.ogg",
      "classic-guitar/E2.ogg",
    ],
    minDistance: -0.1,
    maxDistance: 0.1,
  },
};

export default class GuitarSamples extends Interaction {
  constructor(objectName, trigger, scene, samplesName) {
    super(objectName, trigger, scene);

    this.samplesName = samplesName;

    this.minDistance = 0;
    this.maxDistance = 0.1;
    this.lastPlayed = null;

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

    for (let file of samples.files) {
      const audio = new Audio(`./assets/sounds/${file}`);
      this.audios.push(audio);
    }
  }

  run({ state, dragStart, dragMove }) {
    let toPlay = null;

    if (state === 'dragStart') {
      // const offset = dragStart.intersect.point.clone().sub(this.origin);
      const offset = this.object.worldToLocal(dragStart.intersect.point.clone());
      const sampleIndex = linearMap(offset.x, this.minDistance, this.maxDistance, 0, this.audios.length - 1) >> 0;
      
      toPlay = sampleIndex;
    } else if (state === 'dragMove') {
      if (dragMove.intersect && dragMove.intersect.object === this.object) {
        // const offset = dragMove.intersect.point.clone().sub(this.origin);
        const offset = this.object.worldToLocal(dragMove.intersect.point.clone());
        const sampleIndex = linearMap(offset.x, this.minDistance, this.maxDistance, 0, this.audios.length - 1) >> 0;
        if (sampleIndex !== this.lastPlayed) {
          toPlay = sampleIndex
        }
      }
    } else if (state === 'dragEnd') {
      this.lastPlayed = null;
    }

    if (toPlay !== null) {
      this.audios[toPlay].currentTime = 0;
      this.audios[toPlay].volume = VOLUME;
      this.audios[toPlay].play();

      this.lastPlayed = toPlay;
    }
  }

  getLabel() {
    return '.play'+this.samplesName+'()';
  }
}