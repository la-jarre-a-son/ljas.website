import {
  Quaternion,
  Vector3
} from "three"
import { Tween, Easing } from "@tweenjs/tween.js"
import Interaction from "./Interaction"

export default class CymbalTap extends Interaction {
  constructor(objectName, trigger, scene) {
    super(objectName, trigger, scene);

    this.originalRotation = this.object.quaternion.clone();
    this.origin = this.object.getWorldPosition(new Vector3());
  }

  run({ down: { intersect } }) {
    const a = new Vector3(
      intersect.point.z - this.origin.z,
      intersect.point.y - this.origin.y,
      - (intersect.point.x - this.origin.x)
    );
    const b = new Vector3(
      intersect.point.z - this.origin.z,
      intersect.point.y - 0.5 - this.origin.y,
      - (intersect.point.x - this.origin.x)
    );

    const rot = new Quaternion().setFromUnitVectors(a, b);
    const newQuaternion = this.object.quaternion.clone().multiply(rot);

    const tween = new Tween(newQuaternion.toArray());
    tween.easing(Easing.Elastic.Out);
    tween.to(this.originalRotation.toArray(), 1000)
    tween.start();
    tween.onUpdate(p => {
      this.object.quaternion.fromArray(p);
    });
  }
}