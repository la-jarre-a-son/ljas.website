import { Tween, Easing } from "@tweenjs/tween.js"
import Interaction from "./Interaction"

const INITAL_APPEAR_DELAY = 1000;
const WALL_APPEAR_DELAY = 1000;
const WALL_APPEAR_DELAY_OFFSET = 200;
const ROOM_APPEAR_DURATION = 1500;
const WALL_INITIAL_POSITION_Y = -2.6;
const FLOOR_INITIAL_POSITION_Y = 2;

export default class RoomAppear extends Interaction {
  constructor(objectName, trigger, scene) {
    super(objectName, trigger, scene);
    
    this.groups = {
      FLOOR: scene.getObjectByName("FLOOR"),
      EAST: scene.getObjectByName("EAST"),
      SOUTH: scene.getObjectByName("SOUTH"),
      WEST: scene.getObjectByName("WEST"),
      NORTH: scene.getObjectByName("NORTH"),
    }

    this.setInitialPosition();
  }

  setInitialPosition() {
    const groupNames = Object.keys(this.groups)
    for (let groupIndex in groupNames) {
      const group = this.groups[groupNames[groupIndex]];
      group.position.y = groupNames[groupIndex] === 'FLOOR' ? FLOOR_INITIAL_POSITION_Y : WALL_INITIAL_POSITION_Y;

      group.traverse((obj) => {
        if (obj.material) {
          obj.userData.visibility = 0;
          obj.material.opacity = 0;
        }
      })
    }
  }


  run() {
    const groupNames = Object.keys(this.groups)
    for (let groupIndex in groupNames) {
      const group = this.groups[groupNames[groupIndex]];
      const tween = new Tween({ positionY: group.position.y, opacity: 0 });
      tween.easing(Easing.Quadratic.Out);
      tween.to({ positionY: 0, opacity: 1 }, ROOM_APPEAR_DURATION)

      const delay = groupNames[groupIndex] === 'FLOOR' ? 0 : WALL_APPEAR_DELAY + WALL_APPEAR_DELAY_OFFSET * groupIndex;

      tween.delay(delay + INITAL_APPEAR_DELAY);
      tween.start();
      tween.onUpdate(p => {
        group.position.y = p.positionY;

        group.traverse((obj) => {
          if (obj.material) {
            if (obj.userData.wallVisibility !== undefined) {
              obj.userData.visibility = obj.userData.wallVisibility * p.opacity;
              obj.material.opacity = obj.userData.wallVisibility * p.opacity;
              
              if (obj.material.userData.opacity) {
                obj.material.opacity = obj.material.userData.opacity * obj.userData.wallVisibility * p.opacity;
              }
            } else {
              obj.userData.visibility = p.opacity;
              obj.material.opacity = p.opacity;
              
              if (obj.material.userData.opacity) {
                obj.material.opacity = obj.material.userData.opacity * p.opacity;
              }
            }
          }
          if (obj.element) {
            obj.element.style.opacity = `${p.opacity}`;
          }
        });
      });
    }

  }
}