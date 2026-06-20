import * as THREE from 'three'
import { DOOR } from './constants/door'
import { Door } from './Door'
import type { Player } from './Player'
import type { TransitionManager } from './TransitionManager'
export class DoorManager {
  private doors: Door[] = []
  private currentDoor: Door | null = null
  private canInteract = false
  private isInteracting = false
  private raycaster = new THREE.Raycaster()
  private screenCenter = new THREE.Vector2(0, 0)

  setDoors(doors: Door[]) {
    this.doors = doors
  }

  findDoor(camera: THREE.Camera, player: Player) {
    const foundDoor = player.isMouseCaptured
      ? this.findLookedAtDoor(camera)
      : null
    this.updateDoorInteraction(foundDoor, player)
  }

  private findLookedAtDoor(camera: THREE.Camera): Door | null {
    for (const entry of this.doors) {
      if (!entry.isActive) continue
      this.raycaster.setFromCamera(this.screenCenter, camera)
      this.raycaster.far = DOOR.interactionDistance
      if (this.raycaster.intersectObject(entry.doorObject, true).length > 0) {
        return entry
      }
    }
    return null
  }

  private updateDoorInteraction(door: Door | null, player: Player) {
    if (this.isInteracting) return
    if (door) {
      if (this.currentDoor !== door) {
        this.currentDoor = door
        this.canInteract = true
        player.showInteraction('E: Abrir')
      }
    } else if (this.currentDoor) {
      this.currentDoor = null
      this.canInteract = false
      player.hideInteraction()
    }
  }

  async interact(
    player: Player,
    camera: THREE.Camera,
    transition: TransitionManager,
  ) {
    if (!this.canInteract || !this.currentDoor || this.isInteracting) return
    this.isInteracting = true
    this.canInteract = false
    player.hideInteraction()
    const door = this.currentDoor
    door.deactivate()
    this.currentDoor = null
    await transition.fadeOut()
    camera.position.copy(door.teleportPos)
    await transition.fadeIn()
    this.isInteracting = false
  }
}
