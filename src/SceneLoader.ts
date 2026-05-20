import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { CONFIG } from "./config";

export function loadScene(scene: THREE.Scene): Promise<THREE.Mesh[]> {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "scene1.glb",
      (gltf) => {
        scene.add(gltf.scene);
        const colliders: THREE.Mesh[] = [];

        gltf.scene.traverse((object) => {
          if (object instanceof THREE.Light) {
            object.castShadow = true;
            if (object.shadow) {
              object.shadow.mapSize.width = CONFIG.shadows.mapSize;
              object.shadow.mapSize.height = CONFIG.shadows.mapSize;
              object.shadow.bias = CONFIG.shadows.bias;
              object.shadow.normalBias = CONFIG.shadows.normalBias;
            }
          }

          if (object instanceof THREE.Mesh) {
            object.castShadow = true;
            object.receiveShadow = true;
            colliders.push(object);
          }
        });

        resolve(colliders);
      },
      undefined,
      (error) => reject(error),
    );
  });
}
