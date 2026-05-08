import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export function createOfficeRoom(scene: THREE.Scene) {
  const loader = new GLTFLoader()
  loader.load('./scene1.glb', (gltf) => {
    scene.add(gltf.scene)
  })
}