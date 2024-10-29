import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js';
import { loadEnemy, moveEnemy } from './enemy.js';


// Create Scene and Renderer
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Initialize OutlineEffect
const effect = new OutlineEffect(renderer, {
    defaultThickness: 0.003, // Adjust thickness as needed
    defaultColor: new THREE.Color(0x00ff00), // Outline color
});

// Set up Isometric Camera
const aspectRatio = window.innerWidth / window.innerHeight;
const zoomFactor = 7; // Adjust this value to control the zoom level

const camera = new THREE.OrthographicCamera(
    -zoomFactor * aspectRatio,  // left
    zoomFactor * aspectRatio,   // right
    zoomFactor,                 // top
    -zoomFactor,                // bottom
    0.1,                        // near
    1000                        // far
);

camera.position.set(5, 5, 5);  // Isometric-like position
camera.lookAt(0, 0, 0);        // Look at the center of the scene

// Controls (optional, can be disabled for isometric view)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = false; // Disable rotation to keep the isometric view fixed
controls.enableZoom = false; // Disable zoom if you want a fixed isometric view

// Load the floor model (a_floor.glb)
const floorLoader = new GLTFLoader();
let environmentModel; // Reference to the environment model
let environmentBox; // Bounding box for environment

floorLoader.load('./models/Room3.glb', (gltf) => {
    environmentModel = gltf.scene;
    environmentModel.scale.set(1, 1, 1); // Adjust scale if necessary
    environmentModel.position.set(0, 0, 0); // Adjust position if necessary
    scene.add(environmentModel);

    // Create bounding box for environment
    environmentBox = new THREE.Box3().setFromObject(environmentModel);
    loadEnemy(scene, playerBox, onPlayerDetected);
}, undefined, (error) => {
    console.error('An error occurred while loading the floor model', error);
});



// Load Blender player model with animations using GLTFLoader
const loader = new GLTFLoader();
let mixer; // Animation mixer
let player; // Reference to the player model
let actions = {}; // Store actions for animation
let activeAction; // Store current active animation
let playerBox; // Bounding box for player
let previousPlayerPosition = new THREE.Vector3(); // To store the previous position

loader.load('./models/girl_center.glb', (gltf) => {
    const model = gltf.scene;
    model.scale.set(1, 1, 1); 
    model.position.set(0, 0, 3); 
    scene.add(model);

    player = model;

    // Set up the animation mixer
    mixer = new THREE.AnimationMixer(model);

    // Load animations
    gltf.animations.forEach((clip) => {
        actions[clip.name] = mixer.clipAction(clip); // Store animations by name
    });

    // Set an initial animation
    activeAction = actions['Sneaky']; // Start with the "sneaky" animation
    if (activeAction) activeAction.play();
}, undefined, (error) => {
    console.error('An error occurred while loading the model', error);
});


// Load Collectible Model (a_collect.glb)
const collectibleLoader = new GLTFLoader();
const collectibles = []; // Array to hold collectibles
const collectibleCount = 5; // Number of collectibles
let booksCollected = 0; // Track number of collected books

collectibleLoader.load('./models/a_book.glb', (gltf) => {
    const collectibleModel = gltf.scene;
    collectibleModel.scale.set(4, 4, 4); // Adjust the scale if necessary
    collectibleModel.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true; // Optional: enable shadows
        }
    });

    // Add collectibles to the scene
    for (let i = 0; i < collectibleCount; i++) {
        const collectible = collectibleModel.clone(); // Clone the model for each collectible

        // Generate random positions within the room boundaries
        const randomX = Math.random() * (roomSize - 2) - (roomSize / 2 - 1); // Ensuring it stays within the walls
        const randomZ = Math.random() * (roomSize - 2) - (roomSize / 2 - 1); // Ensuring it stays within the walls
        
        collectible.position.set(randomX, 0.5, randomZ); // Random positions
        scene.add(collectible);
        collectibles.push(collectible);
    }
}, undefined, (error) => {
    console.error('An error occurred while loading the collectible model', error);
});


// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5).normalize();
scene.add(light);

// Player movement controls
const keys = {};
let moving = false; // Track if player is moving

window.addEventListener('keydown', (event) => {
    keys[event.key] = true;
    moving = true; // Set moving to true when a key is pressed
    playAnimation('Sneaky'); // Play the sneaky animation
});

window.addEventListener('keyup', (event) => {
    keys[event.key] = false;
    moving; // Set moving to false when keys are released
    playAnimation('Sneaky'); // Switch back to idle animation
});

function movePlayer() {
    if (player) {
        // Save previous position
        previousPlayerPosition.copy(player.position);

        const rotationSpeed = 0.1; // Adjust rotation speed for smoother turning
        const moveSpeed = 0.01; // Adjust movement speed

        let isMoving = false; // Track if the player is moving
        let targetRotationY = player.rotation.y; // Target rotation variable

        // Determine target rotation
        if (keys['a']) {
            targetRotationY += rotationSpeed; // Rotate left (counterclockwise)
            isMoving = true;
        }
        if (keys['d']) {
            targetRotationY -= rotationSpeed; // Rotate right (clockwise)
            isMoving = true;
        }

        // Smoothly interpolate the player's rotation
        player.rotation.y = THREE.MathUtils.lerp(player.rotation.y, targetRotationY, 0.1);

        // Movement logic
        if (keys['s']) {
            player.position.z -= moveSpeed * Math.cos(player.rotation.y); // Move forward
            player.position.x -= moveSpeed * Math.sin(player.rotation.y); // Move forward
            isMoving = true;
        }
        if (keys['w']) {
            player.position.z += moveSpeed * Math.cos(player.rotation.y); // Move backward
            player.position.x += moveSpeed * Math.sin(player.rotation.y); // Move backward
            isMoving = true;
        }

        // Play the walking animation if the player is moving
        if (isMoving) {
            playAnimation('Sneaky'); // Play the walking animation
        } else {
            playAnimation('Idle'); // Play the idle animation when not moving
        }

        // Update player bounding box
        playerBox = new THREE.Box3().setFromObject(player);

        // Handle collision with invisible walls
        handleWallCollisions();

        // Check for collisions with collectibles
        checkCollectibles();
    }
}

function handleWallCollisions() {
    walls.forEach((wall) => {
        const wallBox = new THREE.Box3().setFromObject(wall);
        if (playerBox.intersectsBox(wallBox)) {
            // Optionally, add logic to handle specific collisions with walls
            // Example: Adjust position based on collision (e.g., stop movement)
            player.position.copy(previousPlayerPosition); // Revert to previous position
        }
    });
}

// Define room dimensions
const roomSize = 10; // Room width and depth
const wallHeight = 5; // Height of the walls

// Create a function to create an invisible wall
function createWall(x, y, z, width, height, depth) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshBasicMaterial({ visible: false }); // Invisible material
    const wall = new THREE.Mesh(geometry, material);
    wall.position.set(x, y, z);
    return wall;
}

// Create walls
const walls = [];

// Floor
const floorGeometry = new THREE.BoxGeometry(roomSize, 0.1, roomSize);
const floorMaterial = new THREE.MeshBasicMaterial({ visible: false }); // Invisible material for the floor
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.set(0, -0.05, 0); // Position slightly below the room to act as floor
scene.add(floor);

// Create walls for each side of the room
// Front wall
const frontWall = createWall(0, wallHeight / 2, -roomSize / 2.2, roomSize, wallHeight, 0.1);
scene.add(frontWall);
walls.push(frontWall);

// Back wall
const backWall = createWall(0, wallHeight / 2, roomSize / 2.2, roomSize, wallHeight, 0.1);
scene.add(backWall);
walls.push(backWall);

// Left wall
const leftWall = createWall(-roomSize / 1.8, wallHeight / 2, 0, 0.1, wallHeight, roomSize);
scene.add(leftWall);
walls.push(leftWall);

// Right wall
const rightWall = createWall(roomSize / 2.4, wallHeight / 2, 0, 0.1, wallHeight, roomSize);
scene.add(rightWall);
walls.push(rightWall);


// Check for collisions with collectibles
// replace with press "e" later
function checkCollectibles() {
    collectibles.forEach((collectible, index) => {
        const collectibleBox = new THREE.Box3().setFromObject(collectible);
        if (playerBox.intersectsBox(collectibleBox)) {
            // Remove collectible from the scene
            scene.remove(collectible);
            collectibles.splice(index, 1); // Remove from the array
            booksCollected++; // Increment the count
            updateUI(); // Update the UI
            console.log('Collectible collected!');
            // Update game state, score, or other logic here
        }
    });
}

// Update UI with the number of collected books
function updateUI() {
    const uiElement = document.getElementById('ui');
    if (uiElement) {
        uiElement.textContent = `Books Collected: ${booksCollected} / ${collectibleCount}`;
    } else {
        console.error('UI element not found.');
    }
}

function onPlayerDetected() {
    console.log('Player detected by enemy!');
    showMessage('You were caught!', 3000); // Show a message
    // Optionally, add logic to restart the game or reset the player's position
}


// Play the appropriate animation
function playAnimation(name) {
    if (activeAction && activeAction !== actions[name]) {
        activeAction.fadeOut(0.5); // Smoothly fade out the current animation
    }
    activeAction = actions[name];
    if (activeAction) {
        activeAction.reset().fadeIn(0.5).play(); // Smoothly fade in the new animation
    }
}

// Animate and render
function animate() {
    requestAnimationFrame(animate);

    movePlayer();
    moveEnemy(playerBox, onPlayerDetected); // Pass the onPlayerDetected function

    // Update bounding boxes
    if (environmentModel) {
        environmentBox.setFromObject(environmentModel);
    }

    if (player) {
        playerBox = new THREE.Box3().setFromObject(player);
    }

    // Update the animation mixer on each frame
    if (mixer) {
        mixer.update(0.01); // Adjust time multiplier if needed for speed
    }

    controls.update(); // Update controls (if enabled)
    renderer.render(scene, camera);
}


animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Test message display
function showMessage(text, duration = 2000) {
    const messageElement = document.getElementById('message');
    if (messageElement) {
        messageElement.textContent = text;
        messageElement.classList.add('show-message');
        setTimeout(() => {
            messageElement.classList.remove('show-message');
        }, duration);
    }
}

// Example test call
showMessage('Sfumato is a hazy effect created through blending tones', 2000);
