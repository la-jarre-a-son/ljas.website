import {
  Vector3
} from "three"
import { Tween, Easing } from "@tweenjs/tween.js"
import Interaction from "./Interaction"
import { isFlying, flyTo, resetFly } from "../Controls";
import { loopRotateVector } from '../helpers';

const CHAIR_SEAT_ROTATION = new Vector3(0, 0, 0);
const CHAIR_SEAT_VIEW_OFFSET = new Vector3(0, 1.2, 0.30);
const CHAIR_ANIMATION_DURATION = 1000;

export default class ChairSeat extends Interaction {
  constructor(objectName, trigger, scene, lookAtName) {
    super(objectName, trigger, scene);
    this.onResetFly = this.onResetFly.bind(this);

    this.object.rotation.copy(loopRotateVector(this.object.rotation))

    this.enabled = false;
    
    if (lookAtName) {
      const lookAtObject = scene.getObjectByName(lookAtName);
      if (lookAtObject) {
        this.lookAt = lookAtObject.getWorldPosition(new Vector3()).add(new Vector3(0, -0.3, 0));
      }
    }
  }

  isActive() {
    return this.enabled ? !isFlying() : isFlying();
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

    const tween = new Tween({ rotation: this.object.rotation.clone(), opacity: 1 });
    tween.easing(Easing.Quadratic.Out);
    tween.to({ rotation: CHAIR_SEAT_ROTATION, opacity: 0 }, CHAIR_ANIMATION_DURATION)
    tween.start();
    tween.onUpdate(p => {
      this.object.rotation.copy(p.rotation);
      this.object.renderOrder = 15;
      this.object.children[0].renderOrder = 15;
      this.object.material.opacity = p.opacity;
      this.object.userData.visibility = p.opacity;
      this.object.children[0].material.opacity = p.opacity;
    });

    const seatPosition = this.object.getWorldPosition(new Vector3()).add(CHAIR_SEAT_VIEW_OFFSET);

    flyTo(seatPosition, this.lookAt, this.onResetFly);
    this.enabled = true;
  }

  out() {
    if (!isFlying()) return;

    resetFly();
  }

  onResetFly() {
    const tween = new Tween({ opacity: this.object.material.opacity });
    tween.easing(Easing.Quadratic.Out);
    tween.to({ opacity: 1 }, CHAIR_ANIMATION_DURATION)
    tween.start();
    tween.onUpdate(p => {
      this.object.material.opacity = p.opacity;
      this.object.userData.visibility = p.opacity;
      this.object.children[0].material.opacity = p.opacity;
    });

    this.enabled = false;
  }

  getLabel() {
    return '.sit()';
  }
}