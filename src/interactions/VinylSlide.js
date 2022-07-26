import {
  Vector3,
} from "three"
import { Tween, Easing } from "@tweenjs/tween.js"
import Interaction from "./Interaction"
import { isFlying } from "../Controls";

const SLIDE_OFFSET = new Vector3(0, 0, 0.4);
const SLIDE_ROTATION = new Vector3(1.21, 0.18, -0.5);

export default class VinylSlide extends Interaction {
  constructor(objectName, trigger, scene) {
    super(objectName, trigger, scene);

    this.origin = this.object.position.clone();
    this.rotation = this.object.rotation.clone();
  }

  run({ state }) {
    if (state === "enter") {
      this.enter();
    }

    if (state === "out") {
      this.out();
    }
  }

  isActive() {
    return isFlying();
  }

  enter() {
    if (!isFlying()) return;

    if (this.tween1) this.tween1.stop();
    if (this.tween2) this.tween2.stop();

    const newPosition = this.origin.clone().add(SLIDE_OFFSET);
    const newRotation = SLIDE_ROTATION.clone();

    const tween1 = new Tween(this.object.position.clone());
    tween1.easing(Easing.Quadratic.In);
    tween1.to(newPosition, 250)
    tween1.onUpdate(p => {
      this.object.position.copy(p);
    });

    const tween2 = new Tween(this.object.rotation.clone());
    tween2.easing(Easing.Quadratic.Out);
    tween2.to(newRotation, 250)
    tween2.onUpdate(p => {
      this.object.rotation.x = p.x;
      this.object.rotation.y = p.y;
      this.object.rotation.z = p.z;
    });
    
    tween1.chain(tween2);
    tween1.start();

    this.tween1 = tween1;
    this.tween2 = tween2;
  }

  out() {
    if (this.tween1) this.tween1.stop();
    if (this.tween2) this.tween2.stop();

    const tween1 = new Tween(this.object.rotation.clone());
    tween1.easing(Easing.Quadratic.In);
    tween1.to(this.rotation, 200)
    tween1.onUpdate(p => {
      this.object.rotation.x = p.x;
      this.object.rotation.y = p.y;
      this.object.rotation.z = p.z;
    });
    
    const tween2 = new Tween(this.object.position.clone());
    tween2.easing(Easing.Quadratic.Out);
    tween2.to(this.origin, 300)
    tween2.onUpdate(p => {
      this.object.position.copy(p);
    });

    tween1.chain(tween2);
    tween1.start();
    this.tween1 = tween1;
    this.tween2 = tween2;
  
  }
}