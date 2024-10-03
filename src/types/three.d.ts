declare module "three/examples/jsm/loaders/GLTFLoader" {
  import { Loader } from "three";
  export class GLTFLoader extends Loader {
    constructor();
    load(
      url: string,
      onLoad: (gltf: any) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
  }
}
