import * as THREE from 'three'; 
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

let enemy;
let enemyBox;
const enemySpeed = 0.02;
const patrolDistance = 5;
let enemyDirection = 1;

// Load the enemy model
export function loadEnemy(scene, playerBox, onPlayerDetected) {
    const loader = new GLTFLoader();
    loader.load('/models/a_girl2.glb', (gltf) => {
        enemy = gltf.scene;
        enemy.scale.set(1, 1, 1);
        enemy.position.set(0, 0, 0); // Set to the center or any valid position

        scene.add(enemy);

        // enemy animation (not done)
        const enemyMixer = new THREE.AnimationMixer(enemy);
        const enemyAction = enemyMixer.clipAction(gltf.animations[0]);
        enemyAction.play();
    }, undefined, (error) => {
        console.error('An error occurred while loading the enemy model', error);
    });
}

// Function to move the enemy back and forth
export function moveEnemy(playerBox, onPlayerDetected) {
    if (enemy) {
        enemy.position.z += enemySpeed * enemyDirection;

        if (enemy.position.z >= patrolDistance / 2 || enemy.position.z <= -patrolDistance / 2) {
            enemyDirection *= -1; // Reverse direction
        }

        enemyBox = new THREE.Box3().setFromObject(enemy);

        if (enemyBox.intersectsBox(playerBox)) {
            onPlayerDetected();
        }
    }
}


