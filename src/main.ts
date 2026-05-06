import * as THREE from 'three'
import { createOfficeRoom } from './scene/OfficeRoom'

const scene = new THREE.Scene()
createOfficeRoom(scene)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(3, 2, 3)
camera.lookAt(0, 0, 0)

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('app') as HTMLCanvasElement })

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

animate()