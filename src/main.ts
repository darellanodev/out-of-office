import * as THREE from "three";
import { Player } from "./Player";
import { CONFIG } from "./config";
import { loadScene } from "./SceneLoader";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const canvas = document.getElementById("app") as HTMLCanvasElement;
const camera = new THREE.PerspectiveCamera(
  CONFIG.camera.fov,
  canvas.clientWidth / canvas.clientHeight,
  CONFIG.camera.near,
  CONFIG.camera.far,
);
camera.position.set(
  CONFIG.camera.position.x,
  CONFIG.camera.position.y,
  CONFIG.camera.position.z,
);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
scene.add(ambientLight);

document.body.appendChild(renderer.domElement);

loadScene(scene).then((colliders) => {
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
});
