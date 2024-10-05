import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import helvetikerRegular from "three/examples/fonts/helvetiker_regular.typeface.json";

const letters = [];

// Initialize the font directly from the imported JSON
const fontLoader = new FontLoader();
const font = fontLoader.parse(helvetikerRegular);

function addLetter(scene) {
  const characters = "ACDEFHIJKMNOPRSUVWXYZ0123456789";
  const character = characters.charAt(
    Math.floor(Math.random() * characters.length)
  );

  if (!font) return; // Don't create letters if font hasn't loaded yet

  const textGeometry = new TextGeometry(character, {
    font: font,
    size: 2,
    height: 0.2,
  });

  const material = new THREE.MeshPhongMaterial({ color: "#27cc27" }); // Darker Matrix green
  const textMesh = new THREE.Mesh(textGeometry, material);

  // Random rotation
  // textMesh.rotation.x = Math.random() * Math.PI;
  // textMesh.rotation.y = Math.random() * Math.PI;
  textMesh.rotation.z = Math.random() * Math.PI;

  // Start position above the scene
  textMesh.position.set(
    THREE.MathUtils.randFloatSpread(100),
    100 + Math.random(), // Start above the scene
    THREE.MathUtils.randFloatSpread(100)
  );

  // Add falling speed property
  textMesh.userData.fallSpeed = 0.05 + Math.random() * 0.1;

  scene.add(textMesh);
  letters.push(textMesh);
}

function createFallingLetters(scene, count = 100) {
  Array(count)
    .fill()
    .forEach(() => addLetter(scene));
}

function animateFallingLetters() {
  letters.forEach((letter) => {
    letter.position.y -= letter.userData.fallSpeed;
    // letter.rotation.x += 0.01;
    // letter.rotation.y += 0.01;
    // letter.rotation.z += 0.01;

    // Reset letter position when it falls below the scene
    if (letter.position.y < -60) {
      letter.position.set(
        THREE.MathUtils.randFloatSpread(100),
        100 + Math.random() * 50,
        THREE.MathUtils.randFloatSpread(100)
      );
    }
  });
}

export { createFallingLetters, animateFallingLetters };
