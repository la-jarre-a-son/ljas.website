import {
  Vector3
} from "three"
import { Tween, Easing } from "@tweenjs/tween.js"
import Interaction from "./Interaction"
import { loopRotateVector } from "../helpers";
import { isFlying } from "../Controls";

const DRAWER_OFFSET = new Vector3(0, 0, -0.45);
const DRAWER_ANIMATION_DURATION = 1500;
const CHAIR_OFFSET = new Vector3(0, 0, -0.30);
const CHAIR_SEAT_OFFSET = new Vector3(0, 0.1, 0);
const CHAIR_SEAT_ROTATION = new Vector3(0, 0, 0);
const CHAIR_ANIMATION_DURATION = 1000;

export default class DeskDrawer extends Interaction {
  constructor(objectName, trigger, scene) {
    super(objectName, trigger, scene);
    this.originalPosition = this.object.position.clone();
    this.chairObject = this.scene.getObjectByName("Chair");
    this.chairSeatObject = this.scene.getObjectByName("ChairSquab");
    
    if (this.chairObject && this.chairSeatObject) {
      this.chairOriginalPosition = this.chairObject.position.clone();
      this.chairSeatObject.rotation.copy(loopRotateVector(this.chairSeatObject.rotation));
      this.chairSeatOriginalPosition = this.chairSeatObject.position.clone();
    }


    this.enabled = false;
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

    const newDrawerPosition = new Vector3().subVectors(this.originalPosition, DRAWER_OFFSET);
    
    const tweenDrawer = new Tween(this.object.position.clone());
    tweenDrawer.easing(Easing.Cubic.Out);
    tweenDrawer.to(newDrawerPosition, DRAWER_ANIMATION_DURATION)
    tweenDrawer.onUpdate(p => {
      this.object.position.copy(p);
    });

    if (this.chairObject && this.chairSeatObject) {
      const newChairPosition = new Vector3().subVectors(this.chairOriginalPosition, CHAIR_OFFSET);
      const newChairSeatPosition = new Vector3().subVectors(this.chairSeatOriginalPosition, CHAIR_SEAT_OFFSET);
      const tweenChair = new Tween({
        position: this.chairObject.position.clone(),
        seatPosition: this.chairSeatObject.position.clone(),
        rotation: loopRotateVector(this.chairSeatObject.rotation.clone()),
      });
      tweenChair.easing(Easing.Quadratic.Out);
      tweenChair.to({
        position: newChairPosition,
        seatPosition: newChairSeatPosition,
        rotation: CHAIR_SEAT_ROTATION,
      }, CHAIR_ANIMATION_DURATION)
      tweenChair.onUpdate(p => {
        this.chairObject.position.copy(p.position);
        this.chairSeatObject.position.copy(p.seatPosition);
        this.chairSeatObject.rotation.copy(p.rotation);
      });
      tweenChair.chain(tweenDrawer);
      tweenChair.start();
    }
    tweenDrawer.start();

    this.enabled = true;
  }

  out() {
    if (isFlying()) return;
    
    const tweenDrawer = new Tween(this.object.position.clone());
    tweenDrawer.easing(Easing.Cubic.Out);
    tweenDrawer.to(this.originalPosition, DRAWER_ANIMATION_DURATION)
    tweenDrawer.onUpdate(p => {
      this.object.position.copy(p);
    });

    if (this.chairObject && this.chairSeatObject) {
      const tweenChair = new Tween({
        position: this.chairObject.position.clone(),
        seatPosition: this.chairSeatObject.position.clone(),
      });
      tweenChair.easing(Easing.Quadratic.Out);
      tweenChair.to({
        position: this.chairOriginalPosition,
        seatPosition: this.chairSeatOriginalPosition,
      }, CHAIR_ANIMATION_DURATION)
      tweenChair.onUpdate(p => {
        this.chairObject.position.copy(p.position);
        this.chairSeatObject.position.copy(p.seatPosition);
      });
      tweenChair.start();
    }

    tweenDrawer.start();
    
    this.enabled = false;
  }

  getLabel() {
    return this.enabled ? '.closeDrawer()' : '.openDrawer()';
  }
}