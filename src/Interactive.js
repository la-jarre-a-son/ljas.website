
import {
  Raycaster,
  Vector2
} from 'three';
import { update as TweenUpdate } from "@tweenjs/tween.js";

import { getActiveCamera } from "./Cameras";
import { setObjectName } from "./debug";
import { registerInteractions, runInteractions } from "./interactions";

import { getFirstInteractiveAncestor, isVisibleObject } from "./helpers";
import { disableControls, enableControls } from './Controls';

import './styles/interactive.css'

export default class Interactive {
  constructor(domElement) {
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.domElement = domElement;

    this.raycaster = new Raycaster();
    this.raycaster.layers.set(0);

    this.mouse = new Vector2();
    this.mouseDown = new Vector2();

    this.mouseDownIntersect = null;
    this.hoverIntersect = null;

    this.timestamp = 0;
    
    this.interactions = [];
    this.events = {
      over: { timestamp: 0, position: new Vector2(), intersect: null },
      down: { timestamp: 0, position: new Vector2(), intersect: null, dragged: false, },
      up: { timestamp: 0, position: new Vector2(), intersect: null },
    }
    
    this.register();
  }

  register() {
    this.domElement.addEventListener('pointerdown', this.onMouseDown, true);
    this.domElement.addEventListener('pointerup', this.onMouseUp);
    this.domElement.addEventListener('pointermove', this.onMouseMove);
  }
  
  setScene(scene) {
    this.scene = scene;
    this.interactions = registerInteractions(scene);
  }

  ready() {
    this.runInitInteractions();
  }

  runInitInteractions() {
    for (let interaction of this.interactions) {
      if (interaction.trigger === 'init') {
        interaction.run();
      }
    }
  }

  onMouseMove(event) {
    const previousEvent = Object.assign({}, this.events.over);

    this.events.over.timestamp = this.timestamp;
    this.events.over.position.x = ( event.clientX / this.domElement.offsetWidth ) * 2 - 1;
    this.events.over.position.y = - ( event.clientY / this.domElement.offsetHeight ) * 2 + 1;
    this.events.over.intersect = this.intersect(this.events.over.position);

    if (this.events.over.intersect) {
      if (!previousEvent.intersect
        ||previousEvent.intersect.object !== this.events.over.intersect.object) {
        runInteractions(
          this.events.over.intersect.object.userData.interactions,
          "hover",
          {
            state: "enter",
            over: this.events.over,
          }
        );
      } else {
        runInteractions(
          this.events.over.intersect.object.userData.interactions,
          "hover",
          {
            state: "move",
            over: this.events.over,
          }
        );
      }
    }
    
    if (previousEvent.intersect
      && (!this.events.over.intersect
        || this.events.over.intersect.object !== previousEvent.intersect.object
      )
    ) {
      runInteractions(
        previousEvent.intersect.object.userData.interactions,
        "hover",
        {
          state: "out",
          over: previousEvent,
          out: this.events.over,
        }
      );
    }

    if (this.events.down.intersect) {
      if (
        !this.events.over.intersect
        || this.events.over.intersect.object !== this.events.down.intersect.object
      ) {
        this.events.down.hasLeft = true;
      }

      this.events.down.hasDragged = true;

      runInteractions(
        this.events.down.intersect.object.userData.interactions,
        "drag",
        {
          state: "dragMove",
          dragStart: this.events.down,
          dragMove: this.events.over,
        }
      );
    }
  }

  onMouseDown(event) {
    this.events.down.timestamp = this.timestamp;
    this.events.down.pointerId = event.pointerId;
    this.events.down.position.x = ( event.clientX / this.domElement.offsetWidth ) * 2 - 1;
    this.events.down.position.y = - ( event.clientY / this.domElement.offsetHeight ) * 2 + 1;
    this.events.down.intersect = this.intersect(this.events.down.position);
    this.events.down.hasDragged = false;
    this.events.down.hasLeft = false;

    if (this.events.down.intersect) {
      this.domElement.setPointerCapture(this.events.down.pointerId);

      event.stopImmediatePropagation();
      event.stopPropagation();

      disableControls('hover');

      runInteractions(
        this.events.down.intersect.object.userData.interactions,
        "down",
        {
          down: this.events.down
        }
      );

      runInteractions(
        this.events.down.intersect.object.userData.interactions,
        "drag",
        {
          state: "dragStart",
          dragStart: this.events.down
        }
      );
    }
  }

  onMouseUp(event) {
    this.events.up.timestamp = this.timestamp;
    this.events.up.position.x = ( event.clientX / this.domElement.offsetWidth ) * 2 - 1;
    this.events.up.position.y = - ( event.clientY / this.domElement.offsetHeight ) * 2 + 1;
    this.events.up.intersect = this.intersect(this.events.up.position);

    if (this.events.up.intersect) {
      runInteractions(
        this.events.up.intersect.object.userData.interactions,
        "up",
        { 
          up: this.events.up,
        }
      );
    }

    if (this.events.down.intersect) {

      if (!this.events.down.hasLeft) {
        runInteractions(
          this.events.down.intersect.object.userData.interactions,
          "click",
          { 
            down: this.events.down,
            up: this.events.up,
          }
        );
      }

      runInteractions(
        this.events.down.intersect.object.userData.interactions,
        "drag",
        {
          state: "dragEnd",
          dragStart: this.events.down,
          dragEnd: this.events.up,
        }
      );

      this.domElement.releasePointerCapture(this.events.down.pointerId);

      this.events.down.intersect = null;
    }
    enableControls('hover');
  }

  intersect(position) {
    if (!this.scene) return;

    const camera = getActiveCamera();
    this.raycaster.setFromCamera(position, camera);

    const intersects = this.raycaster
      .intersectObjects(this.scene.children)
      .filter(intersect => isVisibleObject(intersect.object));

    setObjectName(intersects[0] && intersects[0].object.name || "");

    if (intersects[0]) {
      const interactiveObject = getFirstInteractiveAncestor(intersects[0].object);
      
      if (interactiveObject) {
        return {
          ...intersects[0],
          object: interactiveObject,
        };
      }
    }

    return null
  }

  update(timestamp) {
    this.timestamp = timestamp;

    if (!this.scene) return;
    TweenUpdate(timestamp);

    for (let interaction of this.interactions) {
      if (interaction.trigger === 'update') {
        interaction.run(timestamp);
      }
    }
  }

  updateOutline(outlineEffect) {
    if (this.events.over.intersect) {
      document.body.style.cursor = "pointer";
      let outlineSelection = [];

      this.events.over.intersect.object.traverse((object) => {
        if (object.type === "Mesh") {
          outlineSelection.push(object)
        }
      });
      outlineEffect.selection.set(outlineSelection);
    } else {
      document.body.style.cursor = "default";
      outlineEffect.selection.clear();
    }

    for (let interaction of this.interactions) {
      if (interaction.trigger === 'outline') {
        interaction.run({ over: this.events.over });
      }
    }
  }
}