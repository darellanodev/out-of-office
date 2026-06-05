import * as THREE from 'three'
import { Player } from './Player'
import { CAMERA } from './constants/camera'
import { loadScene } from './SceneLoader'
import { MUSIC } from './constants/music'
import { SCENE } from './constants/scene'
import { LIGHTS } from './constants/lights'
import { ASSETS } from './constants/assets'
import { TransitionManager } from './TransitionManager'
import { DoorManager } from './DoorManager'

const bgMusic = new Audio(`${import.meta.env.BASE_URL}${ASSETS.music}`)
bgMusic.loop = MUSIC.loop
bgMusic.volume = MUSIC.volume

function playMusicOnInteraction() {
  bgMusic.play()
  document.removeEventListener('click', playMusicOnInteraction)
  document.removeEventListener('keydown', playMusicOnInteraction)
}
document.addEventListener('click', playMusicOnInteraction)
document.addEventListener('keydown', playMusicOnInteraction)

const scene = new THREE.Scene()
scene.background = new THREE.Color(SCENE.background)

const canvas = document.getElementById('app') as HTMLCanvasElement
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

const transition = new TransitionManager()
const doorManager = new DoorManager()

loadScene(scene).then((sceneData) => {
  const player = new Player(camera, sceneData.colliders)
  doorManager.setDoors(sceneData.doorObject, sceneData.teleportPos, sceneData.linkedDoors)

  player.onInteract = () => doorManager.interact(player, camera, transition)

  let prevTime = performance.now()

  function animate() {
    requestAnimationFrame(animate)
    const time = performance.now()
    const delta = (time - prevTime) / 1000
    prevTime = time

    player.update(delta)
    doorManager.findDoor(camera, player)
    renderer.render(scene, camera)
  }

  animate()
})
