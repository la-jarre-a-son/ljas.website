import { VideoTexture, sRGBEncoding } from "three";

export default class ScreenVideo {
  constructor(objectName, trigger, scene, webcamName) {
    this.objectName = objectName;
    this.trigger = trigger;
    this.scene = scene;
    this.object = scene.getObjectByName(objectName);
    this.ready = false;
    this.video = null;
    this.videoTexture = null;

    if (this.object) {
      this.attachVideo(webcamName);
    }
  }

  attachVideo(webcamName) {
    this.video = document.createElement('video');

    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        console.log(devices)
        const eligibleDevices = devices.filter(d => d.kind === 'videoinput' && d.label === webcamName);
        
        if (eligibleDevices.length) {
          navigator.mediaDevices
            .getUserMedia({ video: { deviceId: eligibleDevices[0].deviceId } })
              .then(stream => {
                this.video.srcObject = stream;
              })
              .catch(err => {
                console.log(err)
              });
        }
      });
    
    this.video.autoplay = true;
    this.video.oncanplay = () => this.setReady();
  }

  setReady() {
    this.videoTexture = new VideoTexture(this.video);
    this.videoTexture.encoding = sRGBEncoding;
    this.videoTexture.flipY = false;

    this.object.material.map = this.videoTexture;
    this.object.material.emissiveMap = this.videoTexture;
    this.object.material.emissiveIntensity = 2;
    this.object.material.needsUpdate = true;

    if (this.object) {
      this.object.userData.interactions = this.object.userData.interactions || [];
      this.object.userData.interactions.push(this);
    }

    this.ready = true;
  }


  run() {
    if (this.video.paused) {
      this.video.play();
    } else {
      this.video.pause();
    }
  }

}