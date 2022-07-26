import Interaction from "./Interaction";

const SAMPLES = {
  Cajon: {
    files: [
      "cajon/A.ogg",
      "cajon/B.ogg",
      "cajon/C.ogg",
      "cajon/D.ogg",
      "cajon/E.ogg",
      "cajon/F.ogg",
      "cajon/G.ogg",
      "cajon/H.ogg",
    ],
  },
};

export default class RandomSamples extends Interaction {
  constructor(objectName, trigger, scene, samplesName) {
    super(objectName, trigger, scene);
    this.samplesName = samplesName;
    this.audios = [];

    this.attachAudio(samplesName);
  }

  attachAudio(samplesName) {
    const samples = SAMPLES[samplesName];

    if (!samples) return;

    for (let file of samples.files) {
      const audio = new Audio(`./assets/sounds/${file}`);
      this.audios.push(audio);
    }
  }

  run() {
    const toPlay = (Math.random() * this.audios.length) >> 0;
    this.audios[toPlay].currentTime = 0;
    this.audios[toPlay].play();
  }
  
  getLabel() {
    return '.play'+this.samplesName+'()';
  }
}