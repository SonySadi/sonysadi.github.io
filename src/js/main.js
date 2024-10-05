import "../css/style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import backgroundTextureUrl from "@/assets/matrix.jpg";
import { createPlane, animatePaperPlane } from "./plane.js";
import { createFeathers, animateFeathers } from "./feathers.js";

const scene = new THREE.Scene();
// Setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.setZ(30);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#app"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

// Lights
const pointLight = new THREE.PointLight(0xffffff, 1000, 100, 2);
pointLight.position.set(10, 5, 10);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

// Mouse tracking
let mouseX = 0;
let mouseY = 0;
document.addEventListener("mousemove", (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Scene setup
createFeathers(scene);
const backgroundTexture = new THREE.TextureLoader().load(backgroundTextureUrl);
scene.background = backgroundTexture;

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  animateFeathers();
  animatePaperPlane(mouseX, mouseY);
  renderer.render(scene, camera);
}

// Initialize
createPlane(scene).then(animate);

// Window resize handler
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
