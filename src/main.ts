import * as THREE from 'three'
import { Player } from './Player'
import { CAMERA } from './constants/camera'
import { loadScene } from './SceneLoader'
import { MUSIC } from './constants/music'
import { SCENE } from './constants/scene'
import { LIGHTS } from './constants/lights'
import { ASSETS } from './constants/assets'
import { DOOR } from './constants/door'
import { TransitionManager } from './TransitionManager'

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
const doorRaycaster = new THREE.Raycaster()
let canInteract = false

loadScene(scene).then((sceneData) => {
  const player = new Player(camera, sceneData.colliders)
  let { doorObject, teleportPos, linkedDoors } = sceneData

  let currentDoor: { object: THREE.Object3D; teleport: THREE.Vector3; isLinked: boolean } | null = null

  player.onInteract = async () => {
    if (!canInteract || !currentDoor) return
    canInteract = false
    player.hideInteraction()
    await transition.fadeOut()

    if (currentDoor.isLinked) {
      for (const entry of linkedDoors) {
        entry.doorObject.visible = false
        entry.doorObject.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            player.removeCollider(child)
          }
        })
      }
      linkedDoors = []
    } else {
      doorObject!.visible = false
      doorObject!.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          player.removeCollider(child)
        }
      })
      doorObject = null
      teleportPos = null
    }

    camera.position.copy(currentDoor.teleport)
    currentDoor = null
    await transition.fadeIn()
  }

  let prevTime = performance.now()

  function animate() {
    requestAnimationFrame(animate)
    const time = performance.now()
    const delta = (time - prevTime) / 1000
    prevTime = time

    player.update(delta)

    let foundDoor: typeof currentDoor = null

    if (player.isLocked) {
      if (doorObject && teleportPos) {
        doorRaycaster.setFromCamera(new THREE.Vector2(0, 0), camera)
        doorRaycaster.far = DOOR.interactionDistance
        const hits = doorRaycaster.intersectObject(doorObject, true)
        if (hits.length > 0) {
          foundDoor = { object: doorObject, teleport: teleportPos, isLinked: false }
        }
      }

      if (!foundDoor) {
        for (const entry of linkedDoors) {
          doorRaycaster.setFromCamera(new THREE.Vector2(0, 0), camera)
          doorRaycaster.far = DOOR.interactionDistance
          const hits = doorRaycaster.intersectObject(entry.doorObject, true)
          if (hits.length > 0) {
            foundDoor = { object: entry.doorObject, teleport: entry.teleportPos, isLinked: true }
            break
          }
        }
      }
    }

    if (foundDoor) {
      if (currentDoor !== foundDoor) {
        currentDoor = foundDoor
        canInteract = true
        player.showInteraction('E: Abrir')
      }
    } else {
      if (currentDoor) {
        currentDoor = null
        canInteract = false
        player.hideInteraction()
      }
    }

    renderer.render(scene, camera)
  }

  animate()
})
