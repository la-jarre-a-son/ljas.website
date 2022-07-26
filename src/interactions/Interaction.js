

export default class Interaction {
  constructor(objectName, trigger, scene) {
    this.objectName = objectName;
    this.trigger = trigger;
    this.scene = scene;
    this.object = scene.getObjectByName(objectName);
    
    if (this.object) {
      this.object.userData.interactions = this.object.userData.interactions || [];
      this.object.userData.interactions.push(this);
    }
  }

  run(event) {
    console.log(this, event);
  }

  isActive() {
    return true;
  }

  getLabel() {
    return '';
  }
}