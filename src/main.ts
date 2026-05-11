import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

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
loader.load("/scene1.glb", (gltf) => {
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

const controls = new PointerLockControls(camera, document.body);
document.addEventListener("click", () => controls.lock());

const instructions = document.createElement("div");
instructions.style.cssText =
  "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:#aaa;font-family:sans-serif;font-size:16px;pointer-events:none;";
instructions.textContent = "Click to play";
document.body.appendChild(instructions);

const keys = { w: false, a: false, s: false, d: false };
document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (key in keys) keys[key as keyof typeof keys] = true;
});
document.addEventListener("keyup", (e) => {
  const key = e.key.toLowerCase();
  if (key in keys) keys[key as keyof typeof keys] = false;
});

const speed = 3;
const direction = new THREE.Vector3();
let prevTime = performance.now();
const raycaster = new THREE.Raycaster();

function animate() {
  requestAnimationFrame(animate);
  const time = performance.now();
  const delta = (time - prevTime) / 1000;
  prevTime = time;

  if (controls.isLocked) {
    direction.z = Number(keys.w) - Number(keys.s);
    direction.x = Number(keys.d) - Number(keys.a);
    direction.normalize();

    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0));

    const moveVector = new THREE.Vector3();
    if (keys.w || keys.s)
      moveVector.addScaledVector(forward, direction.z * speed * delta);
    if (keys.a || keys.d)
      moveVector.addScaledVector(right, direction.x * speed * delta);

    if (moveVector.length() > 0) {
      const forwardDir = moveVector.clone().normalize();
      raycaster.set(camera.position, forwardDir);
      raycaster.far = moveVector.length() + 0.2;
      const intersects = raycaster.intersectObjects(colliders, true);
      if (intersects.length === 0 || intersects[0].distance > 0.2) {
        camera.position.add(moveVector);
      }
    }
  }

  instructions.style.display = controls.isLocked ? "none" : "block";
  renderer.render(scene, camera);
}

animate();
