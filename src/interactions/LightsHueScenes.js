import { Tween } from "@tweenjs/tween.js"
import { Color } from "three";
import Interaction from "./Interaction"

const LIGHT_TRANSITION_SPEED = 300;
const LIGHT_GROUPS = {
  Batterie: ["SpotLight_1", "SpotBatterie_Orientation"],
  Guitares: ["SpotLight_5", "SpotGuitares_Orientation"],
  Platine: ["SpotLight_7", "SpotPlatine_Orientation"],
  Bureau: ["SpotLight_3", "SpotBureau_Orientation"],
  Tetris: [
    "Tetromino_3",
    "Tetromino_6",
    "Tetromino_9",
    "Tetromino_12",
    "Tetromino_15",
    "Tetromino_18",
    "Tetromino_21",
    "Tetromino_24",
    "Tetromino_27",
    "Tetromino_30",
    "Tetromino_33",
    "Tetromino_36",
    "Tetromino_39",
    "Tetromino_42",
    "Tetromino_45",
    "Tetromino_48",
    "Tetromino_51",
    "Tetromino_54",
    "Tetromino_57",
    "Tetromino_60",
  ],
  Desk: [
    "Desk_4",
    "DeskLamp1_Orientation",
    "DeskLamp2_Orientation",
  ],
}

const LIGHT_SCENES = {
  defaultState: {},
  half: {
    Batterie: {
      intensity: 30,
      emissiveIntensity: 2,
    },
    Guitares: {
      intensity: 30,
      emissiveIntensity: 2,
    },
    Platine: {
      intensity: 30,
      emissiveIntensity: 2,
    },
    Bureau: {
      intensity: 30,
      emissiveIntensity: 2,
    }
  },
  spotOff: {
    Batterie: {
      intensity: 0,
      emissiveIntensity: 0,
    },
    Guitares: {
      intensity: 0,
      emissiveIntensity: 0,
    },
    Platine: {
      intensity: 0,
      emissiveIntensity: 0,
    },
    Bureau: {
      intensity: 0,
      emissiveIntensity: 0,
    }
  },
  allOff: {
    Batterie: {
      intensity: 0,
      emissiveIntensity: 0,
      color: new Color(0, 0, 0),
    },
    Guitares: {
      intensity: 0,
      emissiveIntensity: 0,
      color: new Color(0, 0, 0),
    },
    Platine: {
      intensity: 0,
      emissiveIntensity: 0,
      color: new Color(0, 0, 0),
    },
    Bureau: {
      intensity: 0,
      emissiveIntensity: 0,
      color: new Color(0, 0, 0),
    },
    Tetris: {
      emissiveIntensity: 0,
      intensity: 0,
    },
    Desk: {
      intensity: 0,
      emissiveIntensity: 0,
    },
  },
  RL: {
    Batterie: {
      intensity: 60,
      emissiveIntensity: 3,
      color: new Color(1, 0.1, 0),
    },
    Guitares: {
      intensity: 60,
      emissiveIntensity: 3,
      color: new Color(1, 0.1, 0),
    },
    Platine: {
      intensity: 60,
      emissiveIntensity: 3,
      color: new Color(0.05, 0.05, 1),
    },
    Bureau: {
      intensity: 60,
      emissiveIntensity: 3,
      color: new Color(0.05, 0.05, 1),
    },
    },
  RL2: {
    Batterie: {
      intensity: 60,
      emissiveIntensity: 3,
      color: new Color(0.05, 0.05, 1),
    },
    Guitares: {
      intensity: 60,
      emissiveIntensity: 3,
      color: new Color(0.05, 0.05, 1),
    },
    Platine: {
      intensity: 60,
      emissiveIntensity: 3,
      color: new Color(1, 0.1, 0),
    },
    Bureau: {
      intensity: 60,
      emissiveIntensity: 3,
      color: new Color(1, 0.1, 0),
    },
  }
}

export default class SpotLightsColors extends Interaction {
  constructor(objectName, trigger, scene) {
    super(objectName, trigger, scene);

    this.groups = {};
    this.state = "defaultState";

    this.attachLights();
  }

  attachLights() {
    for (let groupName of Object.keys(LIGHT_GROUPS)) {
      this.groups[groupName] = [];
      for (let lightName of LIGHT_GROUPS[groupName]) {
        const light = this.scene.getObjectByName(lightName);
        if (light) {
          this.groups[groupName].push(light);
          LIGHT_SCENES.defaultState[groupName] = LIGHT_SCENES.defaultState[groupName] || {};
          Object.assign(LIGHT_SCENES.defaultState[groupName], this.getGroupProperties(groupName));
        }
      }
      this.setGroupProperties(groupName, LIGHT_SCENES.defaultState[groupName])
    }
  }

  getNextState() {
    const states = Object.keys(LIGHT_SCENES);
    return states[(states.indexOf(this.state) + 1) % states.length]
  }

  run() {
    this.state = this.getNextState();

    const scene = LIGHT_SCENES[this.state];

    for (let groupName of Object.keys(scene)) {
      this.transitionGroup(groupName, scene[groupName]);
    }

  }

  transitionGroup(groupName, properties) {
    const tween = new Tween(this.getGroupProperties(groupName));

    tween.to(properties, LIGHT_TRANSITION_SPEED)
    tween.start();
    tween.onUpdate(p => this.setGroupProperties(groupName, p));
  }

  setGroupProperties(groupName, properties) {
    const group = this.groups[groupName];
    if (!group) return;

    for (let light of group) {
      if (light.type === "SpotLight" || light.type === "PointLight") {
        if (properties.intensity !== undefined) {
          light.intensity = properties.intensity;
        }
        if (properties.color !== undefined) {
          light.color = properties.color;
        }
      }

      if (light.type === "Mesh") {
        if (properties.emissiveIntensity !== undefined || properties.intensity !== undefined) {
          light.material.emissiveIntensity = properties.emissiveIntensity !== undefined ? properties.emissiveIntensity : properties.intensity;
          light.material.needsUpdate = true;
        }
        if (properties.color !== undefined) {
          light.material.emissive = properties.color;
          light.material.needsUpdate = true;
        }
      }
    }
  }

  getGroupProperties(groupName) {
    const props = {};
    const group = this.groups[groupName];

    if (!group || !group.length) return props;

    for (let light of group) {
      if (light.type === "SpotLight" || light.type === "PointLight") {
        props.intensity = light.intensity;
        props.color = light.color.clone();
      }
  
      if (light.type === "Mesh" && light.material) {
        props.emissiveIntensity = light.material.emissiveIntensity;
        props.color = light.material.emissive.clone();
      }
    }


    return props;
  }
  
  getLabel() {
    return '.setHueScene('+this.getNextState()+')';
  }
}