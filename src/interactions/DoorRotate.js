import { Tween, Easing } from "@tweenjs/tween.js"
import Interaction from "./Interaction"

const ROTATE_MAX = Math.PI;
const ROTATE_MIN = Math.PI / 2;
const ROTATE_SPEED = -1.5;
const ROTATE_INERTIA = 30 * 1000;

export default class DoorRotate extends Interaction {
  constructor(objectName, trigger, scene) {
    super(objectName, trigger, scene);

    this.previousPosition = null;
    this.velocity = 0;
    this.tween = null;
  }

  run({
    state,
    dragStart,
    dragMove,
  }) {

    if (state === "dragStart") {
      if (this.tween) { this.tween.stop(); }
      this.previousPosition = dragStart.position;
      this.velocity = 0;
    } else if (state === "dragMove") {
      this.velocity = (this.velocity + (this.previousPosition.x - dragMove.position.x)) /2;
      this.previousPosition = dragMove.position.clone();
      this.updateRotation();
    } else if (state === "dragEnd") {
      const tween = new Tween({ velocity: this.velocity });
      tween.easing(Easing.Quadratic.Out);
      tween.to({ velocity: 0 }, Math.abs(this.velocity * ROTATE_INERTIA))
      tween.start();
      tween.onUpdate(p => {
        this.velocity = p.velocity;
        this.updateRotation();
      });
      this.tween = tween;
    }
  }

  updateRotation() {
    this.object.rotation.x = this.object.rotation.x - (ROTATE_SPEED *  this.velocity);
    if (this.object.rotation.x > ROTATE_MAX) { this.object.rotation.x = ROTATE_MAX; }
    if (this.object.rotation.x < ROTATE_MIN) { this.object.rotation.x = ROTATE_MIN; }
  }
  
  getLabel() {
    return this.object.rotation.x > (ROTATE_MAX + ROTATE_MIN) / 2 ? '.closeDoor()': '.openDoor()';
  }
}