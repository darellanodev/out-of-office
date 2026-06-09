import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js'
import { SHADOWS } from './constants/shadows'
import { ASSETS } from './constants/assets'
import { Door } from './Door'

export interface SceneData {
  colliders: THREE.Mesh[]
  doors: Door[]
}

export function loadScene(scene: THREE.Scene): Promise<SceneData> {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader()
    loader.load(ASSETS.scene, onLoad, undefined, onError)

    function onLoad(gltf: GLTF) {
      scene.add(gltf.scene)
      const { colliders, doors } = processGltf(gltf)
      resolve({ colliders, doors })
    }

    function onError(error: unknown) {
      reject(error)
    }
  })
}

function processGltf(gltf: GLTF): SceneData {
  const colliders: THREE.Mesh[] = []
  const doorEntries: { name: string; object: THREE.Object3D }[] = []
  const teleportEntries: { name: string; pos: THREE.Vector3 }[] = []

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

    if (object.name.startsWith('Door_')) {
      doorEntries.push({ name: object.name, object })
    }

    if (object.name.startsWith('Teleport_')) {
      const pos = new THREE.Vector3()
      object.getWorldPosition(pos)
      teleportEntries.push({ name: object.name, pos })
    }
  })

  const doors: Door[] = doorEntries.map(door => {
    const num = door.name.replace('Door_', '')
    const found = teleportEntries.find(teleport => teleport.name.replace('Teleport_', '') === num)
    const teleportPos = found ? found.pos : new THREE.Vector3() 
    return new Door(door.object, teleportPos)
  })

  return { colliders, doors }
}
