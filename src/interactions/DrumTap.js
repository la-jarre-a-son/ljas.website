import {
  Vector3
} from "three"
import { Tween, Easing } from "@tweenjs/tween.js"
import Interaction from "./Interaction"

export default class DrumTap extends Interaction {
  constructor(objectName, trigger, scene) {
    super(objectName, trigger, scene);
    this.originalPosition = this.object.position.clone();
  }

  run({ down: { intersect }}) {
    const delta = intersect.face.normal.clone().multiplyScalar(0.01);
    const newPosition = new Vector3().subVectors(this.originalPosition, delta);

    const tween = new Tween(newPosition);
    tween.easing(Easing.Elastic.Out);
    tween.to(this.originalPosition, 500)
    tween.start();
    tween.onUpdate(p => {
      this.object.position.copy(p);
    });
  }
}