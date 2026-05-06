import * as THREE from 'three'

export function createOfficeRoom(scene: THREE.Scene) {
  const material = new THREE.MeshStandardMaterial({ color: 0xcccccc })

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), material)
  floor.rotation.x = -Math.PI / 2
  scene.add(floor)

  const wallNorth = new THREE.Mesh(new THREE.PlaneGeometry(10, 3), material)
  wallNorth.position.z = -5
  wallNorth.position.y = 1.5
  scene.add(wallNorth)

  const wallSouth = new THREE.Mesh(new THREE.PlaneGeometry(10, 3), material)
  wallSouth.position.z = 5
  wallSouth.position.y = 1.5
  wallSouth.rotation.y = Math.PI
  scene.add(wallSouth)

  const wallEast = new THREE.Mesh(new THREE.PlaneGeometry(10, 3), material)
  wallEast.position.x = 5
  wallEast.position.y = 1.5
  wallEast.rotation.y = -Math.PI / 2
  scene.add(wallEast)

  const wallWest = new THREE.Mesh(new THREE.PlaneGeometry(10, 3), material)
  wallWest.position.x = -5
  wallWest.position.y = 1.5
  wallWest.rotation.y = Math.PI / 2
  scene.add(wallWest)
}