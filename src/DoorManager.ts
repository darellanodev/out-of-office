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
  private screenCenter = new THREE.Vector2(0, 0)

  setDoors(doors: Door[]) {
    this.doors = doors
  }

  findDoor(camera: THREE.Camera, player: Player) {
    const foundDoor = player.isLocked ? this.getDoorInSight(camera) : null
    this.updateDoorInteraction(foundDoor, player)
  }

  private getDoorInSight(camera: THREE.Camera): Door | null {
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
    door.deactivate()
    camera.position.copy(door.teleportPos)

    this.currentDoor = null
    await transition.fadeIn()
  }
}
