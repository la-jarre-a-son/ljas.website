import {
  Vector3
} from "three"
import Interaction from "./Interaction"
import { isFlying, flyTo, resetFly } from "../Controls";

const CENTER_OFFSET = new Vector3(0, 0.25, 0.25);
const VIEW_OFFSET = new Vector3(0.4, 0.5, 0.75).add(CENTER_OFFSET);

export default class VinylZoom extends Interaction {
  constructor(objectName, trigger, scene) {
    super(objectName, trigger, scene);
    this.onResetFly = this.onResetFly.bind(this);

    this.object.updateWorldMatrix(true, false);
    this.lookAt = this.object.localToWorld(CENTER_OFFSET.clone())
    this.viewPosition = this.object.localToWorld(VIEW_OFFSET.clone());
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

    flyTo(this.viewPosition, this.lookAt, this.onResetFly);
    this.enabled = true;
  }

  out() {
    if (!isFlying()) return;

    resetFly();
  }

  onResetFly() {
    this.enabled = false;
  }

  getLabel() {
    return '.exploreVinyls()';
  }
}