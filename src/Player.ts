import * as THREE from 'three'
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js'
import { PLAYER } from './constants'
import { Hud } from './Hud'

export class Player {
  private controls: PointerLockControls
  private keys = { w: false, a: false, s: false, d: false, e: false }
  private direction = new THREE.Vector3()
  private speed = PLAYER.speed
  private raycaster = new THREE.Raycaster()
  private obstacles: THREE.Object3D[]
  camera: THREE.Camera
  private hud: Hud
  private distanceTraveled = 0
  onInteract?: () => void

  constructor(camera: THREE.Camera, obstacles: THREE.Object3D[]) {
    this.camera = camera
    this.obstacles = obstacles
    this.controls = new PointerLockControls(camera, document.body)
    this.hud = new Hud()

    document.addEventListener('click', () => this.controls.lock())
    document.addEventListener('keydown', (e) => this.onKeyDown(e))
    document.addEventListener('keyup', (e) => this.onKeyUp(e))
  }

  showInteraction(text: string) {
    this.hud.showInteraction(text)
  }

  hideInteraction() {
    this.hud.hideInteraction()
  }

  private onKeyDown(e: KeyboardEvent) {
    this.handleKey(e, true)
  }

  private onKeyUp(e: KeyboardEvent) {
    this.handleKey(e, false)
  }

  private handleKey(e: KeyboardEvent, pressed: boolean) {
    const key = e.key.toLowerCase()
    if (key in this.keys) {
      this.keys[key as keyof typeof this.keys] = pressed
      if (pressed && key === 'e' && this.controls.isLocked) {
        this.onInteract?.()
      }
    }
  }

  update(delta: number) {
    const moveVector = this.computeMoveVector(delta)
    if (moveVector.length() > 0) {
      this.distanceTraveled += moveVector.length()
      this.tryMove(moveVector)
    }
    this.hud.update(
      this.isMouseCaptured,
      this.distanceTraveled,
      PLAYER.distanceThreshold,
    )
  }

  private computeMoveVector(delta: number): THREE.Vector3 {
    this.direction.z = Number(this.keys.w) - Number(this.keys.s)
    this.direction.x = Number(this.keys.d) - Number(this.keys.a)
    this.direction.normalize()

    const forward = new THREE.Vector3()
    const right = new THREE.Vector3()
    this.camera.getWorldDirection(forward)
    forward.y = 0
    forward.normalize()
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0))

    const moveVector = new THREE.Vector3()
    if (this.keys.w || this.keys.s)
      moveVector.addScaledVector(forward, this.direction.z * this.speed * delta)
    if (this.keys.a || this.keys.d)
      moveVector.addScaledVector(right, this.direction.x * this.speed * delta)
    return moveVector
  }

  private tryMove(moveVector: THREE.Vector3) {
    const moveDirection = moveVector.clone().normalize()
    this.raycaster.set(this.camera.position, moveDirection)
    this.raycaster.far = moveVector.length() + PLAYER.collisionMargin
    const intersects = this.raycaster.intersectObjects(this.obstacles, true)
    if (
      intersects.length === 0 ||
      intersects[0].distance > PLAYER.collisionMargin
    ) {
      this.camera.position.add(moveVector)
    }
  }

  get isMouseCaptured(): boolean {
    return this.controls.isLocked
  }

}
