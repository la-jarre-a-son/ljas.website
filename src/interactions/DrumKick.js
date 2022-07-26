import {
  Vector3
} from "three"
import { Tween, Easing } from "@tweenjs/tween.js"
import Interaction from "./Interaction"

const BATTER_ANGLE = -Math.PI/4;

export default class DrumKick extends Interaction {
  constructor(objectName, trigger, scene, batterName) {
    super(objectName, trigger, scene);

    if (batterName) {
      this.batter = scene.getObjectByName(batterName);
      if (this.batter) {
        this.originalRotationX = this.batter.rotation.x;
      }
    }
  }

  run() {
    if (!this.batter) return;

    const newRotationX =  { rotationX: this.originalRotationX + BATTER_ANGLE };

    const tween = new Tween(newRotationX);
    tween.easing(Easing.Elastic.Out);
    tween.to({ rotationX: this.originalRotationX }, 1000)
    tween.start();
    tween.onUpdate(p => {
      this.batter.rotation.x = p.rotationX;
    });
  }
}