import { Group, LineBasicMaterial, EdgesGeometry, LineSegments, LinearFilter, RGBAFormat, FrontSide } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { isEmissiveMaterial } from './helpers';

const IGNORE_EDGES_OBJECTS = ['Ground', 'Roof'];
const IGNORE_EDGES_MATERIALS = ['Strings', 'Vinyl.Cover.A', 'Vinyl.Cover.B', 'Vinyl.Cover.C', 'Vinyl.Cover.D'];
const PENCIL_RANDOM_COLORS = ['0xaaaaaa', '0x040404', '0xff0000', '0x00ff00', '0x0000ff', '0xff7700', '0xffff00'];

const loader = new GLTFLoader();

export default class Room extends Group {
  constructor() {

    super();

    this.name = 'room';
  }

  load(onReady, onProgress, onError) {
    loader.load("./assets/room/home.gltf", (gltf) => {
      console.log(gltf.scene);
      try {
        this.makeSingleUseMaterials(gltf.scene);
        this.disableBackgroundMip(gltf.scene);
        this.enableShadows(gltf.scene);
        this.setWallsSingleSided(gltf.scene);
        this.addEdges(gltf.scene);
        this.setVinylCoverTiles(gltf.scene);
        this.setPencilRandomColors(gltf.scene);
  
        this.add(gltf.scene);
  
        onReady();
      } catch(err) {
        onError(err);
      }

    }, onProgress, onError);
  }

  makeSingleUseMaterials(scene) {
    const toDispose = [];
    scene.traverse((obj) => {
      if (obj.material) {
        toDispose.push(obj.material);
        obj.material = obj.material.clone();
      }
    });

    toDispose.forEach((material) => {
      material.dispose();
    })
  }


  disableBackgroundMip(scene) {
    this.disableTextureMip(scene.getObjectByName("Ground"));
    this.disableTextureMip(scene.getObjectByName("Sidewalk"));
    this.disableTextureMip(scene.getObjectByName("LJASNorth"));
  }

  disableTextureMip(obj) {
    if (obj) {
      obj.material.map.minFilter = LinearFilter;
    }
  }

  enableShadows(scene) {
    scene.traverse((obj) => {
      if (obj.type === 'PointLight') {
        obj.castShadow = false;
        obj.dispose()
      }

      if (obj.type === 'SpotLight') {
        obj.castShadow = true;

        obj.children[0].rotation.set(1,0,1)
        obj.shadow.mapSize.width = 1024;
        obj.shadow.mapSize.height = 1024;
        obj.shadow.camera.near = 0.1;
        obj.shadow.camera.far = 5;
        obj.shadow.focus = 0.9;
        obj.shadow.radius = 1;
        obj.shadow.bias = 0;
        obj.shadow.normalBias = 0.01;

      } else if (obj.type === 'Mesh') {
        obj.castShadow = true;
        obj.receiveShadow = true;
      } else if (obj.type === 'Object3D') {
        obj.castShadow = true;
      }

      if (obj.material) {
        if (obj.material.map) {
          obj.material.map.anisotropy = 2;
        }

        if (obj.material.transparent) {
          obj.renderOrder = 2;
        }
        obj.material.format = RGBAFormat;
        obj.material.transparent = true;
        obj.material.depthTest = true;
        obj.material.depthWrite = true;

        if (obj.material.transmission) {
          obj.renderOrder = 2;
          obj.material.userData.opacity = 1 - obj.material.transmission;
          obj.material.transmission = 0;
        }

        if (isEmissiveMaterial(obj.material)) {
          obj.material.emissiveIntensity = 3;
        }

        obj.material.aoMapIntensity = 2;
      }
    });
  }

  setWallsSingleSided(scene) {
    this.setGroupSingleSided(scene.getObjectByName("NORTH"));
    this.setGroupSingleSided(scene.getObjectByName("SOUTH"));
    this.setGroupSingleSided(scene.getObjectByName("EAST"));
    this.setGroupSingleSided(scene.getObjectByName("WEST"));
  }

  setGroupSingleSided(group) {
    group.traverse((obj) => {
      if (obj.material) {
        obj.material.side = FrontSide;
      }
    });
  }

  addEdges(scene) {
    scene.traverse((obj) => {
      if (obj.type === 'Mesh') {
        if (
          !IGNORE_EDGES_OBJECTS.includes(obj.name)
          && !IGNORE_EDGES_MATERIALS.includes(obj.material.name)
          && !isEmissiveMaterial(obj.material)
        ) {
          const material = new LineBasicMaterial( { color: 0x000000, linewidth: 0.5, transparent: true, opacity: 1 } );
          const edges = new EdgesGeometry( obj.geometry, 30 );
          const line = new LineSegments( edges, material );

          line.layers.set(1);
          
          obj.add(line);
        }
      }
    });
  }

  setVinylCoverTiles(scene) {
    const toDispose = [];
    scene.traverse((obj) => {
      if (obj.name.startsWith('VinylCover')) {
        const tileIndex = obj.userData.tileIndex +2;
  
        toDispose.push(obj.material.map);
        const newTexture = obj.material.map.clone();
        newTexture.needsUpdate = true;
        obj.material.map = newTexture;
  
        const x = tileIndex % 4 * 0.25;
        const y = (tileIndex / 4 | 0) * 0.25;
  
        obj.material.map.offset.set(x, y);
      }
    });
  
    toDispose.forEach((texture) => {
      texture.dispose();
    })
  }

  setPencilRandomColors(scene) {
    scene.traverse((obj) => {
      if (obj.type === 'Group' && obj.name.startsWith('Pencil')) {
        const colorIndex = parseInt(obj.name.substr('Pencil'.length, 3) || '000', 10) % PENCIL_RANDOM_COLORS.length;
        obj.children[0].material.color.setHex(PENCIL_RANDOM_COLORS[colorIndex]);
      }
    });
  }
}
