import {
  MeshStandardMaterial,
  Mesh,
  IcosahedronGeometry,
  Color,
  Vector3,
} from "three";

export const clamp = (value, min = 0.0, max = 1.0) => Math.min(max, Math.max(min, value));

export const loopValue = (value, max = 1.0) => {
  const loop = value % max;
  return loop < 0 ? loop + max : loop
}
export const loopRotateVector = (vector) => {
  vector.x = loopValue(vector.x + Math.PI, Math.PI * 2) - Math.PI;
  vector.y = loopValue(vector.y + Math.PI, Math.PI * 2) - Math.PI;
  vector.z = loopValue(vector.z + Math.PI, Math.PI * 2) - Math.PI;
  return vector;
}

export const linearMap = (value, a, b, c = 0, d = 1) => clamp((value - a)/(b - a) * (d - c) + c, c, d);

export const isEmissiveMaterial = (material) => material && material.emissive && (material.emissive.r || material.emissive.g || material.emissive.b);

export const hasEmissiveMaterial = (object) => object && isEmissiveMaterial(object.material);

export const getFirstInteractiveAncestor = (object) => {
  if (!object) return null;

  let current = object;

  while (current) {
    if (current.userData.interactions
      && current.userData.interactions
        .filter(i => 
          i.trigger !== "init"
          && i.trigger !== "update"
          && i.trigger !== "outline"
          && i.isActive()
        ).length) {
      return current;
    }
    current = current.parent;
  }
}

export const addSphereCursor = (scene, position = new Vector3(0,1,0), color = 0x000000, size = 0.02) => {
    const geometry = new IcosahedronGeometry( size, 3 );
    const sphereMaterial = new MeshStandardMaterial({
      color: new Color().setHex(color),
      roughness: 1,
    });
    const sphereMesh = new Mesh( geometry, sphereMaterial );
    sphereMesh.position.copy(position);

    scene.add( sphereMesh );
    return sphereMesh;
}

export const isVisibleObject = (object) => 
  object
  && object.userData
  && (
    object.userData.visibility === undefined
    || object.userData.visibility === 1
  )