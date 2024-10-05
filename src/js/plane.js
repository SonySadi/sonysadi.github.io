import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import paperPlaneUrl from "@/assets/sentinel.glb";

let paperPlaneModel;

// Hover animation parameters
const hoverAmplitude = 1;
const hoverFrequency = 0.05;
let hoverAngle = 0;

// Plane rotation parameters
const maxRotation = 0.5; // Maximum rotation in radians

let targetRotationX = 0;
let targetRotationY = 0;
const lerpFactor = 0.05;

function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

function createPlane(scene) {
  return new Promise((resolve) => {
    const paperPlane = new GLTFLoader();
    paperPlane.load(paperPlaneUrl, function (gltf) {
      const model = gltf.scene;
      model.scale.set(1, 1, 1);
      model.position.set(0, -5, 0);
      model.rotation.y = -0.5 * Math.PI;

      // Create a new Group to act as a container
      const container = new THREE.Group();

      // Add the model to the container
      container.add(model);

      // Move the model forward within the container
      model.position.z = 2; // Adjust this value as needed

      // Position the container
      container.position.set(0, 25, 0);

      scene.add(container);
      paperPlaneModel = container;
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
    targetRotationX = -mouseY * maxRotation;
    targetRotationY = mouseX * maxRotation; // Invert mouseX effect

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
  }
}

export { createPlane, animatePaperPlane };
