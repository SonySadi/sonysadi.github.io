import "../css/style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const featherUrl = new URL(
  "../assets/feather_leaf_silver.glb",
  import.meta.url
);
const paperPlaneUrl = new URL("../assets/paper_plane.glb", import.meta.url);

const scene = new THREE.Scene();

// camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.setZ(30);

// renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#app"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

// controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

// paper plane
let paperPlaneModel;
let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

const paperPlane = new GLTFLoader();
paperPlane.load(paperPlaneUrl.href, function (gltf) {
  const model = gltf.scene;
  model.scale.set(50, 50, 50);
  model.rotation.y = 0.5 * Math.PI;
  model.rotation.z = 0.1 * Math.PI;
  model.position.set(0, 5, 0); // Move the plane 5 units up

  // Load the paper texture
  const textureLoader = new THREE.TextureLoader();
  const paperTexture = textureLoader.load("../assets/paper_texture.avif");

  // Create a paper-like material
  const paperMaterial = new THREE.MeshStandardMaterial({
    map: paperTexture,
    roughness: 0.7,
    metalness: 0.1,
    color: 0xffffff,
    side: THREE.DoubleSide,
  });

  // Apply the material to all meshes in the model
  model.traverse((node) => {
    if (node.isMesh) {
      node.material = paperMaterial;
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });

  scene.add(model);
  paperPlaneModel = model;
});

// Hover animation parameters
const hoverAmplitude = 1;
const hoverFrequency = 0.05;
let hoverAngle = 0;

// Plane rotation parameters
const maxRotation = 0.4; // Maximum rotation in radians

// lights point light
const pointLight = new THREE.PointLight(0xffffff, 1000, 100, 2);
pointLight.position.set(10, 5, 10);
scene.add(pointLight);
const pointLightHelper = new THREE.PointLightHelper(pointLight);
// scene.add(pointLightHelper);

// lights ambient light
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

// helpers
const gridHelper = new THREE.GridHelper(100, 10);
// scene.add(gridHelper);

const feathers = [];

function addFeather() {
  const assetLoader = new GLTFLoader();
  assetLoader.load(featherUrl.href, function (gltf) {
    const model = gltf.scene;
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z);
    const scale = 5 / maxDimension; // Smaller scale for more feathers
    model.scale.set(scale, scale, scale);

    // Random rotation
    model.rotation.x = Math.random() * Math.PI;
    model.rotation.y = Math.random() * Math.PI;
    model.rotation.z = Math.random() * Math.PI;

    // Start position above the scene
    model.position.set(
      THREE.MathUtils.randFloatSpread(100),
      100 + Math.random() * 50, // Start above the scene
      THREE.MathUtils.randFloatSpread(100)
    );

    // Add falling speed property
    model.userData.fallSpeed = 0.05 + Math.random() * 0.1;

    scene.add(model);
    feathers.push(model);
  });
}

// Create fewer feathers for better performance
Array(50).fill().forEach(addFeather);

// background
const backgroundTexture = new THREE.TextureLoader().load("../assets/space.jpg");
scene.background = backgroundTexture;

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  // Animate feathers
  feathers.forEach((feather) => {
    feather.position.y -= feather.userData.fallSpeed;
    feather.rotation.x += 0.01;
    feather.rotation.y += 0.01;
    feather.rotation.z += 0.01;

    // Reset feather position when it falls below the scene
    if (feather.position.y < -50) {
      feather.position.set(
        THREE.MathUtils.randFloatSpread(100),
        100 + Math.random() * 50,
        THREE.MathUtils.randFloatSpread(100)
      );
    }
  });

  // Animate paper plane hovering and mouse-based rotation
  if (paperPlaneModel) {
    hoverAngle += hoverFrequency;

    // Vertical hovering motion (centered around y = 5)
    paperPlaneModel.position.y = 5 + Math.sin(hoverAngle) * hoverAmplitude;

    // Slight tilting motion
    paperPlaneModel.rotation.z = 0.1 * Math.PI + Math.sin(hoverAngle) * 0.05;

    // Slight horizontal motion
    paperPlaneModel.position.x = Math.sin(hoverAngle * 0.5) * 0.3;

    // Rotate plane based on mouse position, accounting for initial rotation
    paperPlaneModel.rotation.x = mouseY * maxRotation * -1;
    paperPlaneModel.rotation.y = 0.5 * Math.PI + mouseX * maxRotation;
  }

  renderer.render(scene, camera);
}

animate();

// Add this to handle window resizing
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
