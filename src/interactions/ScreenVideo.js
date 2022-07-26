import { VideoTexture, sRGBEncoding } from "three";
import Interaction from "./Interaction"

export default class ScreenVideo extends Interaction {
  constructor(objectName, trigger, scene, videoUrl) {
    super(objectName, trigger, scene);
    this.ready = false;
    this.video = null;
    this.videoTexture = null;

    if (this.object) {
      this.attachVideo(videoUrl);
    }
  }

  attachVideo(videoUrl) {
    this.video = document.createElement('video');

    this.video.crossOrigin = "anonymous";
    this.video.src = videoUrl;
    this.video.autoplay = false;
    this.video.oncanplay = () => this.setReady();
  }

  setReady() {
    this.videoTexture = new VideoTexture(this.video);
    this.videoTexture.flipY = false;
    this.videoTexture.encoding = sRGBEncoding;

    this.object.material.color.setHex(0x000000);
    this.object.material.map = this.object.material.map.dispose();
    this.object.material.emissiveMap = this.videoTexture;

    this.ready = true;
  }

  isActive() {
    return this.ready;
  }
  
  run() {
    if (this.video.paused) {
      this.video.play();
    } else {
      this.video.pause();
    }
  }
  getLabel() {

    return '.playVideo()';
  }
}