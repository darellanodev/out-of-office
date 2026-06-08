import * as THREE from 'three'
import { CAMERA } from './constants/camera'
import { SCENE } from './constants/scene'
import { LIGHTS } from './constants/lights'

export function createEngine(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(SCENE.background)

  const camera = new THREE.PerspectiveCamera(
    CAMERA.fov,
    canvas.clientWidth / canvas.clientHeight,
    CAMERA.near,
    CAMERA.far,
  )
  camera.position.set(CAMERA.position.x, CAMERA.position.y, CAMERA.position.z)

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const ambientLight = new THREE.AmbientLight(LIGHTS.ambientColor, LIGHTS.ambientIntensity)
  scene.add(ambientLight)

  document.body.appendChild(renderer.domElement)

  return { scene, camera, renderer }
}
