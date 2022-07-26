import { Tween } from "@tweenjs/tween.js"
import { hasEmissiveMaterial, loopValue, clamp } from "../helpers";
import Interaction from "./Interaction"

const LIGHT_LOOP_SPEED = 20000;

export default class LightColorRotate extends Interaction {
  constructor(objectName, trigger, scene, speed = LIGHT_LOOP_SPEED) {
    super(objectName, trigger, scene);

    this.lights = [];
    this.speed = speed,

    this.attachLight();
  }

  attachLight() {
    this.object.traverse((object) => {
      if (object.type === "PointLight" || object.type === "SpotLight") {
        this.lights.push(object);
        object.userData.originalColor = object.color;

      } else if (object.type === "Mesh" && hasEmissiveMaterial(object)) {
        this.lights.push(object);
        object.userData.originalColor = object.material.emissive.clone();
      }
    });
  }

  run() {
    const hsl = { h: 0 };

    const tween = new Tween(hsl);

    tween.to({ h: 1 }, this.speed)
    tween.repeat(Infinity);
    tween.start();
    tween.onUpdate(p => this.setLightColor(p));
  }

  setLightColor(offset) {
    for(let light of this.lights) {
      const hsl = light.userData.originalColor.getHSL({});
      if (light.type === "Mesh") {
        if (light.material.emissiveIntensity) {
          light.material.emissive.setHSL(loopValue(hsl.h + offset.h), 0.8, clamp(hsl.l));
        } else {
          light.material.emissive.setHSL(0, 0, 0);
        }
      }
      if (light.type === "PointLight" || light.type === "SpotLight") {
        light.color.setHSL(loopValue(hsl.h + offset.h), clamp(hsl.s), clamp(hsl.l));
      }
    }
  }
}