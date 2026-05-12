import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Player } from "./Player";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const colliders: THREE.Object3D[] = [];

const canvas = document.getElementById("app") as HTMLCanvasElement;
const camera = new THREE.PerspectiveCamera(
  75,
  canvas.clientWidth / canvas.clientHeight,
  0.05,
  100,
);
camera.position.set(0, 1.7, 3);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
scene.add(ambientLight);

const loader = new GLTFLoader();
loader.load("scene1.glb", (gltf) => {
  scene.add(gltf.scene);

  gltf.scene.traverse((object) => {
    if ((object as THREE.Light).isLight) {
      const light = object as THREE.PointLight;
      light.castShadow = true;
      light.shadow.mapSize.width = 1024;
      light.shadow.mapSize.height = 1024;
      light.shadow.bias = -0.005;
      light.shadow.normalBias = 0.02;
    }

    if ((object as THREE.Mesh).isMesh) {
      const mesh = object as THREE.Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      colliders.push(mesh);
    }
  });
});

document.body.appendChild(renderer.domElement);

const player = new Player(camera, colliders);

let prevTime = performance.now();

function animate() {
  requestAnimationFrame(animate);
  const time = performance.now();
  const delta = (time - prevTime) / 1000;
  prevTime = time;

  player.update(delta);

  renderer.render(scene, camera);
}

animate();