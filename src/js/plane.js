import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import paperPlaneUrl from "@/assets/paper_plane.glb";
import paperPlaneTexture from "@/assets/paper_texture.avif";

let paperPlaneModel;

// Hover animation parameters
const hoverAmplitude = 1;
const hoverFrequency = 0.05;
let hoverAngle = 0;

// Plane rotation parameters
const maxRotation = 0.4; // Maximum rotation in radians

let targetRotationX = 0;
let targetRotationY = 0.5 * Math.PI;
const lerpFactor = 0.05;

function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

function createPlane(scene) {
  return new Promise((resolve) => {
    const paperPlane = new GLTFLoader();
    paperPlane.load(paperPlaneUrl, function (gltf) {
      const model = gltf.scene;
      model.scale.set(50, 50, 50);
      model.rotation.y = 0.5 * Math.PI;
      model.rotation.z = 0.1 * Math.PI;
      model.position.set(0, 5, 0); // Move the plane 5 units up

      // Load the paper texture
      const textureLoader = new THREE.TextureLoader();
      const paperTexture = textureLoader.load(paperPlaneTexture);

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
      resolve();
    });
  });
}

function animatePaperPlane(mouseX, mouseY) {
  if (paperPlaneModel) {
    hoverAngle += hoverFrequency;

    // Vertical hovering motion (centered around y = 5)
    paperPlaneModel.position.y = 5 + Math.sin(hoverAngle) * hoverAmplitude;
    // Slight horizontal motion
    paperPlaneModel.position.x = Math.sin(hoverAngle * 0.5) * 0.3;

    // Update target rotations based on mouse position
    targetRotationX = mouseY * maxRotation * -1;
    targetRotationY = 0.5 * Math.PI + mouseX * maxRotation;

    // Smoothly interpolate current rotation to target rotation
    paperPlaneModel.rotation.x = lerp(
      paperPlaneModel.rotation.x,
      targetRotationX,
      lerpFactor
    );
    paperPlaneModel.rotation.y = lerp(
      paperPlaneModel.rotation.y,
      targetRotationY,
      lerpFactor
    );

    // Slight tilting motion
    paperPlaneModel.rotation.z = 0.1 * Math.PI + Math.sin(hoverAngle) * 0.05;
  }
}

export { createPlane, animatePaperPlane };
