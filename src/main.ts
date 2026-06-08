import { Player } from './Player'
import { loadScene } from './SceneLoader'
import { TransitionManager } from './TransitionManager'
import { DoorManager } from './DoorManager'
import { createEngine } from './Engine'
import { setupBackgroundMusic } from './audio'

setupBackgroundMusic()

const canvas = document.getElementById('app') as HTMLCanvasElement
const { scene, camera, renderer } = createEngine(canvas)

const transition = new TransitionManager()
const doorManager = new DoorManager()

loadScene(scene).then((sceneData) => {
  const player = new Player(camera, sceneData.colliders)
  doorManager.setDoors(sceneData.doors)

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
