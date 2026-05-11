import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

export class Player {
  private controls: PointerLockControls;
  private keys = { w: false, a: false, s: false, d: false };
  private direction = new THREE.Vector3();
  private speed = 3;
  private raycaster = new THREE.Raycaster();
  private colliders: THREE.Object3D[];
  private camera: THREE.Camera;
  private instructions: HTMLElement;

  constructor(camera: THREE.Camera, colliders: THREE.Object3D[]) {
    this.camera = camera;
    this.colliders = colliders;
    this.controls = new PointerLockControls(camera, document.body);
    this.instructions = this.createInstructions();

    document.addEventListener("click", () => this.controls.lock());
    document.addEventListener("keydown", (e) => this.onKeyDown(e));
    document.addEventListener("keyup", (e) => this.onKeyUp(e));
  }

  private createInstructions(): HTMLElement {
    const el = document.createElement("div");
    el.style.cssText =
      "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:#aaa;font-family:sans-serif;font-size:16px;pointer-events:none;";
    el.textContent = "Click to play";
    document.body.appendChild(el);
    return el;
  }

  private onKeyDown(e: KeyboardEvent) {
    const key = e.key.toLowerCase();
    if (key in this.keys) this.keys[key as keyof typeof this.keys] = true;
  }

  private onKeyUp(e: KeyboardEvent) {
    const key = e.key.toLowerCase();
    if (key in this.keys) this.keys[key as keyof typeof this.keys] = false;
  }

  update(delta: number) {
    this.direction.z = Number(this.keys.w) - Number(this.keys.s);
    this.direction.x = Number(this.keys.d) - Number(this.keys.a);
    this.direction.normalize();

    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();
    this.camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0));

    const moveVector = new THREE.Vector3();
    if (this.keys.w || this.keys.s)
      moveVector.addScaledVector(forward, this.direction.z * this.speed * delta);
    if (this.keys.a || this.keys.d)
      moveVector.addScaledVector(right, this.direction.x * this.speed * delta);

    if (moveVector.length() > 0) {
      const forwardDir = moveVector.clone().normalize();
      this.raycaster.set(this.camera.position, forwardDir);
      this.raycaster.far = moveVector.length() + 0.2;
      const intersects = this.raycaster.intersectObjects(this.colliders, true);
      if (intersects.length === 0 || intersects[0].distance > 0.2) {
        this.camera.position.add(moveVector);
      }
    }

    this.instructions.style.display = this.controls.isLocked ? "none" : "block";
  }

  get isLocked(): boolean {
    return this.controls.isLocked;
  }
}
