import * as THREE from 'three'
import { DOOR } from './constants/door'
import type { DoorEntry } from './SceneLoader'
import type { Player } from './Player'
import type { TransitionManager } from './TransitionManager'

export class DoorManager {
  private doorObject: THREE.Object3D | null = null
  private teleportPos: THREE.Vector3 | null = null
  private linkedDoors: DoorEntry[] = []
  private currentDoor: {
    object: THREE.Object3D
    teleport: THREE.Vector3
    isLinked: boolean
  } | null = null
  private canInteract = false
  private raycaster = new THREE.Raycaster()

  setDoors(
    doorObject: THREE.Object3D | null,
    teleportPos: THREE.Vector3 | null,
    linkedDoors: DoorEntry[],
  ) {
    this.doorObject = doorObject
    this.teleportPos = teleportPos
    this.linkedDoors = linkedDoors
  }

  findDoor(camera: THREE.Camera, player: Player) {
    let foundDoor: typeof this.currentDoor = null

    if (player.isLocked) {
      if (this.doorObject && this.teleportPos) {
        this.raycaster.setFromCamera(new THREE.Vector2(0, 0), camera)
        this.raycaster.far = DOOR.interactionDistance
        const hits = this.raycaster.intersectObject(this.doorObject, true)
        if (hits.length > 0) {
          foundDoor = {
            object: this.doorObject,
            teleport: this.teleportPos,
            isLinked: false,
          }
        }
      }

      if (!foundDoor) {
        for (const entry of this.linkedDoors) {
          this.raycaster.setFromCamera(new THREE.Vector2(0, 0), camera)
          this.raycaster.far = DOOR.interactionDistance
          const hits = this.raycaster.intersectObject(entry.doorObject, true)
          if (hits.length > 0) {
            foundDoor = {
              object: entry.doorObject,
              teleport: entry.teleportPos,
              isLinked: true,
            }
            break
          }
        }
      }
    }

    if (foundDoor) {
      if (this.currentDoor !== foundDoor) {
        this.currentDoor = foundDoor
        this.canInteract = true
        player.showInteraction('E: Abrir')
      }
    } else {
      if (this.currentDoor) {
        this.currentDoor = null
        this.canInteract = false
        player.hideInteraction()
      }
    }
  }

  get canInteractWithDoor(): boolean {
    return this.canInteract
  }

  async interact(
    player: Player,
    camera: THREE.Camera,
    transition: TransitionManager,
  ) {
    if (!this.canInteract || !this.currentDoor) return
    this.canInteract = false
    player.hideInteraction()
    await transition.fadeOut()

    if (this.currentDoor.isLinked) {
      for (const entry of this.linkedDoors) {
        entry.doorObject.visible = false
        entry.doorObject.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            player.removeCollider(child)
          }
        })
      }
      this.linkedDoors = []
    } else {
      this.doorObject!.visible = false
      this.doorObject!.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          player.removeCollider(child)
        }
      })
      this.doorObject = null
      this.teleportPos = null
    }

    camera.position.copy(this.currentDoor.teleport)
    this.currentDoor = null
    await transition.fadeIn()
  }
}
