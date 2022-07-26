import Interaction from "./Interaction"

import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { Vector3 } from "three";

export default class MacBookScreen extends Interaction {
  constructor(objectName, trigger, scene) {
    super(objectName, trigger, scene);

    this.createIframe();
  }

  createIframe() {
    const element = document.createElement( 'iframe' );
    element.src = "./portfolio.html"
    Object.assign(element.style, {
      width: "600px",
      height: "420px",
      border: "0",
      opacity: "0",
      transition: "opacity 0.5s ease",
      webkitBackfaceVisibility: "hidden",
      backfaceVisibility: "hidden",
    });

    this.element = element;
    this.cssObject = new CSS3DObject(element);
    this.cssObject.scale.set(0.0005,0.0005,0.0005);
    this.cssObject.position.set(0, 0.1085, 0);
    this.cssObject.rotation.copy(this.object.rotation);
    this.object.add(this.cssObject)
  }

  run() {
    const isVisible = this.object.parent && this.object.parent.userData.visible;
    if (isVisible) {
      this.cssObject.rotation.copy(this.object.rotation);
      this.element.style.opacity = 1;
    } else {
      this.element.style.opacity = 0;
    }
  }
}