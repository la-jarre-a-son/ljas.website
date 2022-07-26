import {
  Euler,
  Vector3
} from "three"
import { Tween, Easing } from "@tweenjs/tween.js"
import Interaction from "./Interaction"
import { isFlying, flyTo, resetFly } from "../Controls";

const SOFA_VIEW_OFFSET = new Vector3(0, 1.0, -0.4);
const LOOKAT_OFFSET = new Vector3(0, 0.2, 0);
const TABLE_TOP_OFFSET = new Vector3(0, 0.1, 0.2);
const MACBOOK_OPEN_ROTATION_X = -Math.PI/6;

export default class TableTop extends Interaction {
  constructor(objectName, trigger, scene) {
    super(objectName, trigger, scene);
    this.onResetFly = this.onResetFly.bind(this);

    this.sofaObject = this.scene.getObjectByName('Sofa');
    this.macbookLidObject = this.scene.getObjectByName('MacbookLid');
    if (this.macbookLidObject) {
      this.macbookLidOriginalRotation = this.macbookLidObject.rotation.clone();
    }

    this.origin = this.object.parent.position.clone();
    this.opened = false;
  }

  run() {
    if (this.opened) {
      resetFly();
    } else {
      if (isFlying()) return;
      this.animateTop(this.origin.clone().add(TABLE_TOP_OFFSET));
      this.openMacBook();
      this.flyToSofa();
      this.opened = true;
    };
  }

  animateTop(to) {
    const tween = new Tween(this.object.parent.position.clone());
    tween.easing(Easing.Cubic.In);
    tween.to(to, 1000)
    tween.start();
    tween.onUpdate(p => {
      this.object.parent.position.copy(p);
    });
  }

  openMacBook() {
    if (!this.macbookLidObject) return;

    const tween = new Tween({ rotationX: this.macbookLidOriginalRotation.x });
    tween.easing(Easing.Linear.None);
    tween.to({ rotationX: MACBOOK_OPEN_ROTATION_X }, 2000)
    tween.onUpdate(p => {
      this.macbookLidObject.rotation.x = p.rotationX;
    });
    tween.onComplete(() => {
      this.macbookLidObject.userData.visible = 1;
    })
    tween.start();
    this.macbookTween = tween;
  }

  closeMacBook() {
    if (!this.macbookLidObject) return;
    if (this.macbookTween) this.macbookTween.stop();
    this.macbookLidObject.userData.visible = 0;

    const tween = new Tween({ rotationX: this.macbookLidObject.rotation.x });
    tween.easing(Easing.Linear.None);
    tween.to({ rotationX: this.macbookLidOriginalRotation.x }, 2000)
    tween.onUpdate(p => {
      this.macbookLidObject.rotation.x = p.rotationX;
    });
    tween.start();
  }
  
  flyToSofa() {
    if (!this.sofaObject) return;

    const seatPosition = this.sofaObject.getWorldPosition(new Vector3()).add(SOFA_VIEW_OFFSET);
    const lookAt = this.object.getWorldPosition(new Vector3()).add(LOOKAT_OFFSET);

    flyTo(seatPosition, lookAt, this.onResetFly);
  }

  onResetFly() {
    this.animateTop(this.origin);
    this.closeMacBook();
    this.opened = false;
  }

  getLabel() {
    return '.code()';
  }
}