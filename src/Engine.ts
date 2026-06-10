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
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  function updateSize() {
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
  }
  updateSize()
  window.addEventListener('resize', updateSize)

  const ambientLight = new THREE.AmbientLight(
    LIGHTS.ambientColor,
    LIGHTS.ambientIntensity,
  )
  scene.add(ambientLight)

  return { scene, camera, renderer }
}
