import * as THREE from 'three'
import { DOOR } from './constants/door'
import { Door } from './Door'
import type { Player } from './Player'
import type { TransitionManager } from './TransitionManager'

export class DoorManager {
  private doors: Door[] = []
  private currentDoor: Door | null = null
  private canInteract = false
  private raycaster = new THREE.Raycaster()

  setDoors(doors: Door[]) {
    this.doors = doors
  }

  findDoor(camera: THREE.Camera, player: Player) {
    let foundDoor: Door | null = null

    if (player.isLocked) {
      for (const entry of this.doors) {
        if (!entry.isActive) continue
        this.raycaster.setFromCamera(new THREE.Vector2(0, 0), camera)
        this.raycaster.far = DOOR.interactionDistance
        const hits = this.raycaster.intersectObject(entry.doorObject, true)
        if (hits.length > 0) {
          foundDoor = entry
          break
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

    const door = this.currentDoor
    door.deactivate(player)
    camera.position.copy(door.teleportPos)

    this.currentDoor = null
    await transition.fadeIn()
  }
}
