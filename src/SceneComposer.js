import { HalfFloatType } from "three";
import {
  BloomEffect,
  NoiseEffect,
  OutlineEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
  BlendFunction,
  KernelSize,
} from "postprocessing";

export default class SceneComposer extends EffectComposer {
  constructor(renderer, scene, camera) {
    super(renderer, {
      frameBufferType: HalfFloatType,
      multisampling: 16
    });

    this.initEffects();
    this.initInteractionEffects(scene, camera);
    this.createChain(scene, camera);
  }

  initEffects() {
    this.bloomEffect = new BloomEffect({
      blendFunction: BlendFunction.SCREEN,
      kernelSize: KernelSize.VERY_LARGE,
      luminanceThreshold: 0.3,
      luminanceSmoothing: 0.1,
      intensity: 0.5,
      height: 480,
    });

    this.noiseEffect = new NoiseEffect({
      blendFunction: BlendFunction.COLOR_DODGE
    });

    this.noiseEffect.blendMode.opacity.value = 3/256;
  }

  initInteractionEffects(scene, camera) {
    this.outlineEffect = new OutlineEffect(scene, camera, {
      blendFunction: BlendFunction.SCREEN,
      edgeStrength: 2.5,
      pulseSpeed: 0.0,
      visibleEdgeColor: 0xffffff,
      hiddenEdgeColor: 0xffffff,
      height: 1280,
      blur: true,
      xRay: true,
      dithering: true,
    });

    this.outlineEffect.blurPass.kernelSize = 2;
  }

  createChain(scene, camera) {
    const renderPass = new RenderPass(scene, camera);
    const noisePass =  new EffectPass(camera, this.noiseEffect);
    const bloomPass =  new EffectPass(camera, this.bloomEffect);
    const outlinePass =  new EffectPass(camera, this.outlineEffect);

    this.addPass(renderPass);
    this.addPass(bloomPass);
    this.addPass(noisePass);
    this.addPass(outlinePass);
  }
}
