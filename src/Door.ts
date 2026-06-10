import * as THREE from 'three'

export class Door {
  readonly doorObject: THREE.Object3D
  readonly teleportPos: THREE.Vector3
  private active = true

  constructor(doorObject: THREE.Object3D, teleportPos: THREE.Vector3) {
    this.doorObject = doorObject
    this.teleportPos = teleportPos
  }

  get isActive(): boolean {
    return this.active
  }

  deactivate() {
    this.active = false
    this.doorObject.visible = false
    this.doorObject.traverse((child) => {
      child.layers.disableAll()
    })
  }
}
