import * as THREE from 'three'
import { createOfficeRoom } from './scene/OfficeRoom'
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js'

const scene = new THREE.Scene()
createOfficeRoom(scene)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 1.7, 3)

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('app') as HTMLCanvasElement })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

const controls = new PointerLockControls(camera, document.body)

document.addEventListener('click', () => controls.lock())

const instructions = document.createElement('div')
instructions.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;font-family:sans-serif;font-size:24px;pointer-events:none;'
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

function animate() {
  requestAnimationFrame(animate)

  const time = performance.now()
  const delta = (time - prevTime) / 1000
  prevTime = time

  if (controls.isLocked) {
    direction.z = Number(keys.w) - Number(keys.s)
    direction.x = Number(keys.d) - Number(keys.a)
    direction.normalize()

    if (keys.w || keys.s) velocity.z = direction.z * speed * delta
    else velocity.z = 0

    if (keys.a || keys.d) velocity.x = direction.x * speed * delta
    else velocity.x = 0

    controls.moveRight(velocity.x)
    controls.moveForward(velocity.z)
  }

  instructions.style.display = controls.isLocked ? 'none' : 'block'
  renderer.render(scene, camera)
}

animate()