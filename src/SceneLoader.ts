import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { SHADOWS } from './constants/shadows'
import { ASSETS } from './constants/assets'

export interface DoorEntry {
  doorObject: THREE.Object3D
  teleportPos: THREE.Vector3
}

export interface SceneData {
  colliders: THREE.Mesh[]
  doorObject: THREE.Object3D | null
  teleportPos: THREE.Vector3 | null
  linkedDoors: DoorEntry[]
}

export function loadScene(scene: THREE.Scene): Promise<SceneData> {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader()
    loader.load(
      ASSETS.scene,
      (gltf) => {
        scene.add(gltf.scene)
        const colliders: THREE.Mesh[] = []
        let doorObject: THREE.Object3D | null = null
        let teleportPos: THREE.Vector3 | null = null
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

          if (object.name === 'Door_1') {
            doorObject = object
          } else if (object.name.startsWith('Door_')) {
            doorEntries.push({ name: object.name, object })
          }

          if (object.name === 'Teleport_1') {
            teleportPos = new THREE.Vector3()
            object.getWorldPosition(teleportPos)
          } else if (object.name.startsWith('Teleport_')) {
            const pos = new THREE.Vector3()
            object.getWorldPosition(pos)
            teleportEntries.push({ name: object.name, pos })
          }
        })

        const linkedDoors: DoorEntry[] = doorEntries.map(d => {
          const num = d.name.replace('Door_', '')
          const found = teleportEntries.find(t => t.name.replace('Teleport_', '') === num)
          return {
            doorObject: d.object,
            teleportPos: found ? found.pos : new THREE.Vector3(),
          }
        })

        resolve({ colliders, doorObject, teleportPos, linkedDoors })
      },
      undefined,
      (error) => reject(error),
    )
  })
}
