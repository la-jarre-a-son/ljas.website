import { Tween, Easing } from "@tweenjs/tween.js"
import { Vector3, Euler } from "three";
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import Interaction from "./Interaction"

const LABEL_POSITION = new Vector3(-2.65, -0.05, -2.1);
const LABEL_ROTATION = new Euler(Math.PI/2, 0, Math.PI/2);

export default class InteractionLabel extends Interaction {
  constructor(objectName, trigger, scene) {
    super(objectName, trigger, scene);

    this.tween = null;
    this.currentLabel = '';

    this.createLabel()
  }

  createLabel() {
    const element = document.createElement('div');
    Object.assign(element.style, {
      width: "0",
      overflow: "visible",
      fontSize: "200px",
      color: "white",
      backfaceVisibility: "visible",
    });

    this.element = element;
    this.cssObject = new CSS3DObject(element);
    this.cssObject.scale.set(0.001,0.001,0.001);
    this.cssObject.position.copy(LABEL_POSITION);
    this.cssObject.rotation.copy(LABEL_ROTATION);
    this.object.add(this.cssObject)
  }

  run({ over }) {
    let label = '';

    if (over && over.intersect && over.intersect.object) {
      label = over.intersect.object.userData.interactions.reduce((label, i) => label || i.getLabel(), '');
    }

    if (label !== this.currentLabel) {
      let tween;

      if (label && this.currentLabel) {
        tween = this.out().chain(this.in(label));
      } else if (label) {
        tween = this.in(label);
      } else {
        tween = this.out();
      }

      if (this.tween && this.tween.isPlaying()) {
        this.tween.chain(tween);
      } else {
        this.tween = tween;
        tween.start();
      }

      this.currentLabel = label;
    }
  
  }

  in(label) {
    const tween = new Tween({ length: 0 });
    tween.easing(Easing.Linear.None);
    tween.to({ length: label.length }, 20 * label.length);
    tween.onUpdate(p => {
      this.element.innerText = label.substr(0, p.length);
    });

    return tween;
  }

  out() {
    const tween = new Tween({ length: this.element.innerText.length });
    tween.easing(Easing.Linear.None);
    tween.to({ length: 0 }, 20 * this.element.innerText.length);
    tween.onUpdate(p => {
      this.element.innerText = this.element.innerText.substr(0, p.length);
    });

    return tween;
  }
}