import * as THREE from 'three'
import { createOfficeRoom } from './scene/OfficeRoom'
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js'

const scene = new THREE.Scene()
const colliders: THREE.Object3D[] = []
createOfficeRoom(scene, colliders)

const canvas = document.getElementById('app') as HTMLCanvasElement
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)
camera.position.set(0, 1.7, 3)

const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(canvas.clientWidth, canvas.clientHeight)
document.body.appendChild(renderer.domElement)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

const controls = new PointerLockControls(camera, document.body)

document.addEventListener('click', () => controls.lock())

const instructions = document.createElement('div')
instructions.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:#aaa;font-family:sans-serif;font-size:16px;pointer-events:none;'
instructions.textContent = 'Click to play'
document.body.appendChild(instructions)

const keys = { w: false, a: false, s: false, d: false }

document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase()
  if (key in keys) keys[key as keyof typeof keys] = true
})

document.addEventListener('keyup', (e) => {
  const key = e.key.toLowerCase()
  if (key in keys) keys[key as keyof typeof keys] = false
})

const speed = 3
const velocity = new THREE.Vector3()
const direction = new THREE.Vector3()
let prevTime = performance.now()

const raycaster = new THREE.Raycaster()
const playerRadius = 0.3

function checkCollision(moveVector: THREE.Vector3): boolean {
  if (colliders.length === 0) return false

  const origin = camera.position.clone()
  origin.y -= 0.5

  const directions = [
    moveVector.clone().normalize(),
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, -1)
  ]

  for (const dir of directions) {
    raycaster.set(origin, dir)
    raycaster.far = playerRadius
    const intersects = raycaster.intersectObjects(colliders, true)
    if (intersects.length > 0 && intersects[0].distance < playerRadius) {
      return true
    }
  }
  return false
}

function animate() {
  requestAnimationFrame(animate)

  const time = performance.now()
  const delta = (time - prevTime) / 1000
  prevTime = time

  if (controls.isLocked) {
    direction.z = Number(keys.w) - Number(keys.s)
    direction.x = Number(keys.d) - Number(keys.a)
    direction.normalize()

    const forward = new THREE.Vector3()
    const right = new THREE.Vector3()
    camera.getWorldDirection(forward)
    forward.y = 0
    forward.normalize()
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0))

    const moveVector = new THREE.Vector3()
    if (keys.w || keys.s) moveVector.addScaledVector(forward, direction.z * speed * delta)
    if (keys.a || keys.d) moveVector.addScaledVector(right, direction.x * speed * delta)

    if (moveVector.length() > 0) {
      const forwardDir = moveVector.clone().normalize()
      raycaster.set(camera.position, forwardDir)
      raycaster.far = moveVector.length() + 0.2
      const intersects = raycaster.intersectObjects(colliders, true)
      
      if (intersects.length === 0 || intersects[0].distance > 0.2) {
        camera.position.add(moveVector)
      }
    }
  }

  instructions.style.display = controls.isLocked ? 'none' : 'block'
  renderer.render(scene, camera)
}

animate()