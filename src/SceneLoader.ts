import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { SHADOWS } from './constants/shadows'
import { ASSETS } from './constants/assets'

export function loadScene(scene: THREE.Scene): Promise<THREE.Mesh[]> {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader()
    loader.load(
      ASSETS.scene,
      (gltf) => {
        scene.add(gltf.scene)
        const colliders: THREE.Mesh[] = []

        gltf.scene.traverse((object) => {
          if (object instanceof THREE.Light) {
            object.castShadow = true
            if (object.shadow) {
              object.shadow.mapSize.width = SHADOWS.mapSize
              object.shadow.mapSize.height = SHADOWS.mapSize
              object.shadow.bias = SHADOWS.bias
              object.shadow.normalBias = SHADOWS.normalBias
            }
          }

          if (object instanceof THREE.Mesh) {
            object.castShadow = true
            object.receiveShadow = true
            colliders.push(object)
          }
        })

        resolve(colliders)
      },
      undefined,
      (error) => reject(error),
    )
  })
}
