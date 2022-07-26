import {
    WebGLRenderer,
    ReinhardToneMapping,
    sRGBEncoding,
    PCFSoftShadowMap,
} from "three";

export default class Renderer extends WebGLRenderer {
    constructor() {
        super({ antialias: false });
        this.setPixelRatio(window.devicePixelRatio);
        this.setClearColor(0x000000, 1);
        this.physicallyCorrectLights = true;
        this.toneMapping = ReinhardToneMapping;
        this.toneMappingExposure = 0.75;
        this.outputEncoding = sRGBEncoding;
        this.shadowMap.enabled = true;
        this.shadowMap.type = PCFSoftShadowMap; // default THREE.PCFShadowMap
    }
}
