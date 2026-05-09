import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export function createOfficeRoom(scene: THREE.Scene, colliders: THREE.Object3D[]) {
  const loader = new GLTFLoader()
  loader.load('./scene1.glb', (gltf) => {
    scene.add(gltf.scene)
    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        colliders.push(child)
      }
    })
  })
}