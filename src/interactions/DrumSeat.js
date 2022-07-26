import {
  Vector3
} from "three"
import { Tween, Easing } from "@tweenjs/tween.js"
import Interaction from "./Interaction"
import { isFlying, flyTo, resetFly } from "../Controls";

export default class DrumSeat extends Interaction {
  constructor(objectName, trigger, scene, lookAtName) {
    super(objectName, trigger, scene);
    this.onResetFly = this.onResetFly.bind(this);

    this.originalPosition = this.object.position.clone();

    this.enabled = false;
    
    if (lookAtName) {
      const lookAtObject = scene.getObjectByName(lookAtName);
      if (lookAtObject) {
        this.lookAt = lookAtObject.getWorldPosition(new Vector3()).add(new Vector3(0, 0.2, 0));
      }
    }
  }

  isActive() {
    return this.enabled ? isFlying() : !isFlying();
  }

  run() {
    if (this.enabled) {
      this.out();
    } else {
      this.in();
    }
  }

  in() {
    if (isFlying()) return;
    const newPosition = new Vector3().subVectors(this.originalPosition, new Vector3(0.3, 0, 0));

    const tween = new Tween(this.object.position.clone());
    tween.easing(Easing.Linear.None);
    tween.to(newPosition, 300)
    tween.start();
    tween.onUpdate(p => {
      this.object.position.copy(p);
    });

    const seatPosition = this.object.getWorldPosition(new Vector3()).add(new Vector3(-0.8, 1.5, 0));


    flyTo(seatPosition, this.lookAt, this.onResetFly);
    this.enabled = true;
  }

  out() {
    if (!isFlying()) return;

    resetFly();
  }

  onResetFly() {
    const tween = new Tween(this.object.position.clone());
    tween.easing(Easing.Linear.None);
    tween.to(this.originalPosition, 300)
    tween.onUpdate(p => {
      this.object.position.copy(p);
    });
    tween.start();
    this.enabled = false;
  }

  getLabel() {
    return '.sit()';
  }
}