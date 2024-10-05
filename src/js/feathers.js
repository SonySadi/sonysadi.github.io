import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import featherUrl from "@/assets/feather_leaf_silver.glb";

const feathers = [];

function addFeather(scene) {
  const assetLoader = new GLTFLoader();
  assetLoader.load(featherUrl, function (gltf) {
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
      100 + Math.random(), // Start above the scene
      THREE.MathUtils.randFloatSpread(100)
    );

    // Add falling speed property
    model.userData.fallSpeed = 0.05 + Math.random() * 0.1;

    scene.add(model);
    feathers.push(model);
  });
}

function createFeathers(scene, count = 100) {
  Array(count)
    .fill()
    .forEach(() => addFeather(scene));
}

function animateFeathers() {
  feathers.forEach((feather) => {
    feather.position.y -= feather.userData.fallSpeed;
    feather.rotation.x += 0.01;
    feather.rotation.y += 0.01;
    feather.rotation.z += 0.01;

    // Reset feather position when it falls below the scene
    if (feather.position.y < -60) {
      feather.position.set(
        THREE.MathUtils.randFloatSpread(100),
        100 + Math.random() * 50,
        THREE.MathUtils.randFloatSpread(100)
      );
    }
  });
}

export { createFeathers, animateFeathers };
