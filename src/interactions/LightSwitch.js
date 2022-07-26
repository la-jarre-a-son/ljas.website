import { hasEmissiveMaterial } from "../helpers";
import { Color } from "three";
import Interaction from "./Interaction"

const black =  new Color(0, 0, 0);

export default class LightSwitch extends Interaction {
  constructor(objectName, trigger, scene) {
    super(objectName, trigger, scene);

    this.lights = [];
    this.enabled = true;

    this.attachLight();
  }

  attachLight() {
    this.object.traverse((object) => {
      if (object.type === "PointLight" || object.type === "SpotLight") {
        this.lights.push(object);

        object.userData.originalIntensity = object.intensity;
      } else if (object.type === "Mesh" && hasEmissiveMaterial(object)) {
        this.lights.push(object);
        object.userData.originalIntensity = object.material.emissiveIntensity;
      }
    });

  }

  run() {
    this.enabled = !this.enabled;

    for(let light of this.lights) {
      if (light.type === "Mesh") {
        light.material.emissiveIntensity = this.enabled ? light.userData.originalIntensity : 0;
        light.material.needsUpdate = true;
      }
      if (light.type === "PointLight" || light.type === "SpotLight") {
        light.intensity = this.enabled ? light.userData.originalIntensity : 0;
      }
    }
  }

  getLabel() {
    return this.enabled ? '.turnLightOff()' : '.turnLightOn()';
  }
}